import { useState, useEffect } from "react";
import { Edit, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { updateInterviewRound } from "@/api/interviews/InterviewRounds";
import { useFormik } from "formik";
import { interviewFormSchema } from "@/lib/models/candidate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isValid } from "date-fns";
import SubmitButton from "@/components/Elements/utils/SubmitButton";
import CancelButton from "@/components/Elements/utils/CancelButton";
import { Calendar, ChevronDown, Code } from "lucide-react";
import {
  createInterviewTech,
  deleteInterviewTech,
  updateInterviewTech,
} from "@/api/interviews/Interview-Tech";

export default function InterviewForm({
  className,
  masterTechnologies = [],
  initialValues,
  id,
  autoClose,
  technologiesData = [],
}: {
  className?: string;
  initialValues: any;
  id: number;
  masterTechnologies: any;
  autoClose: () => void;
  technologiesData?: any[];
}) {
  const [selectedSoftRating, setSelectedSoftRating] = useState<number | null>(
    null
  );
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [showAddTech, setShowAddTech] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMasterTechs, setFilteredMasterTechs] = useState<any[]>([]);
  const [editingTech, setEditingTech] = useState<number | null>(null);

  useEffect(() => {
    if (initialValues.softskillsRating) {
      setSelectedSoftRating(initialValues.softskillsRating);
    }
  }, [initialValues]);

  // Process technologies data from API response
  useEffect(() => {
    if (technologiesData && technologiesData.length > 0) {
      const processedTechs = technologiesData.map((item) => ({
        interviewTechId: item.interviewTechId,
        technology: {
          techId: item.technology.techId,
          technology: item.technology.technology,
          insertedOn: item.technology.insertedOn,
        },
        techRating: item.techRating || item.interviewRound?.techRating || null,
      }));
      setTechnologies(processedTechs);
    }
  }, [technologiesData]);

  // Filter master technologies based on search term and exclude already added ones
  useEffect(() => {
    const existingTechIds = technologies.map((tech) => tech.technology.techId);
    const filtered = masterTechnologies.filter(
      (tech: any) =>
        !existingTechIds.includes(tech.techId) &&
        tech.technology.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMasterTechs(filtered);
  }, [masterTechnologies, technologies, searchTerm]);

  const getUpdatedFields = (initialValues: any, values: any) => {
    return Object.keys(values).reduce((acc: Record<string, any>, key) => {
      if (values[key] !== initialValues[key]) {
        acc[key] = values[key];
      }
      return acc;
    }, {});
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: interviewFormSchema,
    onSubmit: (values) => {
      const updatedFields = getUpdatedFields(initialValues, values);
      delete updatedFields.interview;
      // If status is "Scheduled", remove rating field from submission
      if (values.interviewStatus === "Scheduled") {
        delete updatedFields.softskillsRating;
      }
      console.log(updatedFields);
      try {
        if(!updatedFields){
          autoClose();
        }
        updateInterviewRound(id, updatedFields).then((data) => {
          console.log(data);
          if (data.status === 200) {
            toast.success("Interview updated successfully", {
              position: "top-right",
            });
            autoClose();
          } else {
            toast.error(data.message, {
              position: "top-right",
            });
          }
        });
      } catch (error) {
        console.error("Form submission error", error);
      }
    },
  });

  const handleSoftRatingClick = (rating: number) => {
    setSelectedSoftRating(rating);
    formik.setFieldValue("softskillsRating", rating);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    formik.handleChange(e);
    // Reset rating when status changes to "Scheduled"
    if (status === "Scheduled") {
      setSelectedSoftRating(null);
      formik.setFieldValue("softskillsRating", undefined);
    }
  };

  const handleTechRatingUpdate = async (
    interviewTechId: number,
    rating: number
  ) => {
    try {
      const response = await updateInterviewTech(interviewTechId, {
        techRating: rating,
      });
      if (response){
        setTechnologies((prev) =>
          prev.map((tech) =>
            tech.interviewTechId === interviewTechId
              ? { ...tech, techRating: rating }
              : tech
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTechDelete = async (interviewTechId: number) => {
    console.log(interviewTechId);
    try {
      const response = await deleteInterviewTech(interviewTechId);
      if (response) {
        setTechnologies((prev) => prev.filter((tech) => tech.interviewTechId !== interviewTechId))
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTechnology = async (masterTech: any) => {
    if (technologies.some((t) => t.technology.techId === masterTech.techId)) {
      toast.error("Technology already added", { position: "top-center" });
    }
    try {
      const reqData = {
        technology: {
          techId: masterTech.techId,
        },
        interviewRound: {
          roundId: id,
        },
        techRating: 1,
      };
      const response = await createInterviewTech(reqData);
      console.log(response);
      const newTech = {
        technology: {
          techId: masterTech.techId,
          technology: masterTech.technology,
          insertedOn: masterTech.insertedOn,
        },
        techRating: 1,
      };
      setShowAddTech(false);
      setSearchTerm("");
      setTechnologies((prev) => [...prev, newTech]);
    } catch (error) {
      console.error("Error adding technology:", error);
      toast.error("Failed to add technology");
    }
  };

  const isScheduled = formik.values.interviewStatus === "Scheduled";

  return (
    <div className="my-8">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="px-8 pt-6 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">
            Update Interview Round
          </h1>
        </div>

        <form className="p-8 space-y-8" onSubmit={formik.handleSubmit}>
          {/* Basic Details Section */}
          <div>
            <h2 className="text-lg font-medium text-cyan-500 mb-6">
              Basic Details
            </h2>
            <div className="space-y-8">
              {/* Interviewer Name */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  htmlFor="interviewerName"
                >
                  Interviewer Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="interviewerName"
                    name="interviewerName"
                    value={formik.values.interviewerName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter full name"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  />
                </div>
                {formik.touched.interviewerName &&
                  formik.errors.interviewerName && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.interviewerName.toString()}
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <DatePicker
                      selected={
                        formik.values.roundDate
                          ? parseISO(formik.values.roundDate)
                          : null
                      }
                      onChange={(date: Date | null) => {
                        if (date) {
                          formik.setFieldValue(
                            "roundDate",
                            format(date, "yyyy-MM-dd")
                          );
                        } else {
                          formik.setFieldValue("roundDate", null);
                        }
                      }}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="23-06-2025"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none appearance-none"
                      maxDate={new Date()}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                  {formik.touched.roundDate && formik.errors.roundDate && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.roundDate.toString()}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    htmlFor="interviewTime"
                  >
                    Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="interviewTime"
                      name="interviewTime"
                      value={formik.values.interviewTime}
                      onChange={(e) => {
                        const timeValue = e.target.value;
                        if (timeValue) {
                          const [hours, minutes] = timeValue.split(":");
                          formik.setFieldValue(
                            "interviewTime",
                            `${hours}:${minutes}`
                          );
                        } else {
                          formik.setFieldValue("interviewTime", null);
                        }
                      }}
                      className="w-full border-0 py-0.5 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  {formik.touched.interviewTime &&
                    formik.errors.interviewTime && (
                      <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{formik.errors.interviewTime.toString()}</span>
                      </div>
                    )}
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    htmlFor="interviewStatus"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="interviewStatus"
                      id="interviewStatus"
                      value={formik.values.interviewStatus}
                      onChange={handleStatusChange}
                      onBlur={formik.handleBlur}
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none appearance-none"
                    >
                      <option value="Scheduled">🟠 Scheduled</option>
                      <option value="Passed">🟢 Passed</option>
                      <option value="Rejected">🔴 Rejected</option>
                      <option value="On-Hold">🟡 On-Hold</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                  {formik.touched.interviewStatus &&
                    formik.errors.interviewStatus && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.interviewStatus.toString()}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Section */}
          <div>
            <h2 className="text-lg font-medium text-cyan-500 mb-6">
              Assessment
            </h2>

            {/* Technologies Section - Tag/Chip Style - Only show if not scheduled */}
            {!isScheduled && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-700">
                    Technologies Interviewed
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddTech(!showAddTech)}
                    className="px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors font-medium flex items-center gap-1"
                  >
                    Add Technology
                  </button>
                </div>

                {/* Add Technology Input */}
                {showAddTech && (
                  <div className="mb-4 relative">
                    <input
                      type="text"
                      placeholder="Type to search and add technologies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddTech(false);
                        setSearchTerm("");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Search Results Dropdown */}
                    {filteredMasterTechs.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {filteredMasterTechs.map((tech) => (
                          <button
                            key={tech.techId}
                            type="button"
                            onClick={() => handleAddTechnology(tech)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-cyan-50 hover:text-cyan-700 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {tech.technology}
                          </button>
                        ))}
                      </div>
                    )}

                    {filteredMasterTechs.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 text-center text-sm text-gray-500">
                        No technologies found matching "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}

                {/* Technologies as Tags/Chips */}
                {technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <div
                        key={tech.interviewTechId}
                        className="relative group"
                      >
                        {editingTech === tech.interviewTechId ? (
                          // Editing Mode - Rating Selection
                          <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-cyan-500 rounded-md shadow-lg">
                            <span className="text-sm font-medium text-gray-900 mr-1">
                              {tech.technology.technology}
                            </span>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() =>
                                    handleTechRatingUpdate(
                                      tech.interviewTechId,
                                      rating
                                    )
                                  }
                                  className={`w-6 h-6 rounded-md text-xs font-medium transition-colors ${
                                    tech.techRating === rating
                                      ? "bg-cyan-500 text-white"
                                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                  }`}
                                >
                                  {rating}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setEditingTech(null)}
                              className="ml-1 text-red-500 hover:text-red-600 text-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          // Display Mode
                          <div className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-cyan-500 rounded-md hover:bg-cyan-100 transition-colors">
                            <span className="text-sm font-medium text-gray-900">
                              {tech.technology.technology}
                            </span>
                            {tech.techRating && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-cyan-500 text-white rounded-full text-xs font-medium">
                                ★ {tech.techRating}
                              </span>
                            )}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingTech(tech.interviewTechId)
                                }
                                className="text-cyan-600 hover:text-cyan-800 text-xs p-1"
                                title="Edit rating"
                              >
                                <Edit className="w-4 h-4"></Edit>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleTechDelete(tech.interviewTechId)
                                }
                                className="text-white border bg-red-500 border-red-500 rounded-full"
                                title="Delete"
                              >
                                <X className="w-3 h-3"></X>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm">No technologies added yet</p>
                    <p className="text-xs mt-1">
                      Click "Add Technology" to get started
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Soft Skill Rating - Only show if not scheduled */}
            {!isScheduled && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Soft Skill Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex space-x-32">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleSoftRatingClick(rating)}
                        className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                          (selectedSoftRating ||
                            formik.values.softskillsRating) === rating
                            ? "font-semibold border-2 border-cyan-500"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
                {formik.touched.softskillsRating &&
                  formik.errors.softskillsRating && (
                    <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{formik.errors.softskillsRating.toString()}</span>
                    </div>
                  )}
              </div>
            )}

            {/* Remarks */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor="remarks"
              >
                Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                name="remarks"
                id="remarks"
                value={formik.values.remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your observations"
                rows={4}
                className="w-full px-2 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm resize-none"
              />
              {formik.touched.remarks && formik.errors.remarks && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.remarks.toString()}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 border-t border-gray-100 pt-6">
            <CancelButton executable={autoClose} />
            <SubmitButton label="Update Round" />
          </div>
        </form>
      </div>
    </div>
  );
}
