import { useFormik } from "formik";
import { createInterviewRound } from "@/api/interviews/InterviewRounds";
import { toast } from "react-toastify";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";
import { Calendar, ChevronDown, X } from "lucide-react";
import { interviewRoundSchema } from "@/lib/models/candidate";

export default function AddRound({
  className,
  interviewId,
  onclose,
  roundNumber,
  masterTechnologies,
}: {
  className?: string;
  interviewId?: number | string | string[] | undefined | null;
  onclose: () => void;
  roundNumber?: number;
  masterTechnologies?: any[] | undefined | null;
}) {
  const [selectedTechRating, setSelectedTechRating] = useState<number | null>(
    null
  );
  const [selectedSoftRating, setSelectedSoftRating] = useState<number | null>(
    null
  );
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);
  const [techInputValue, setTechInputValue] = useState("");

  const formik = useFormik({
    initialValues: {
      roundDate: "",
      interviewTime: "",
      interviewerName: "",
      interviewStatus: "Scheduled",
      techRating: undefined,
      softskillsRating: undefined,
      remarks: "",
      interview: {
        interviewId: interviewId,
      },
    },
    validationSchema: interviewRoundSchema,
    onSubmit: async (values) => {
      try {
        await createInterviewRound(values).then((data) => {
          console.log(data);
          if (data.status === 200) {
            toast.success("Round added successfully", { position: "top-right" });
          } else {
            toast.error(data.message, { position: "top-right" });
          }
          if (onclose) onclose();
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to add round", { position: "top-right" });
      }
    },
  });

  const handleTechRatingClick = (rating: number) => {
    setSelectedTechRating(rating);
    formik.setFieldValue("techRating", rating);
  };

  const handleSoftRatingClick = (rating: number) => {
    setSelectedSoftRating(rating);
    formik.setFieldValue("softskillsRating", rating);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    formik.handleChange(e);

    // Reset ratings when status changes to "Scheduled"
    if (status === "Scheduled") {
      setSelectedTechRating(null);
      setSelectedSoftRating(null);
      formik.setFieldValue("techRating", undefined);
      formik.setFieldValue("softskillsRating", undefined);
    }
  };

  const isScheduled = formik.values.interviewStatus === "Scheduled";

  return (
    <div className={`min-h-screen my-8`}>
      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="px-8 pt-6 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">
            Add Interview Round
          </h1>
        </div>
        <form className="p-8 space-y-8" onSubmit={formik.handleSubmit}>
          {/* Basic Details Section */}
          <div>
            <h2 className="text-lg font-medium text-cyan-500 mb-6">
              Basic Details
            </h2>
            <div className="space-y-6">
              {/* Interviewer Name */}
              <div>
                <label
                  className="block font-semibold mb-2"
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
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none appearance-none"
                  />
                </div>
                {formik.touched.interviewerName &&
                  formik.errors.interviewerName && (
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
                      <span>{formik.errors.interviewerName}</span>
                    </div>
                  )}
              </div>
              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block font-semibold mb-2">
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
                      className="w-full flex items-center gap-2 py-2 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none appearance-none"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                  {formik.touched.roundDate && formik.errors.roundDate && (
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
                      <span>{formik.errors.roundDate.toString()}</span>
                    </div>
                  )}
                </div>
                {/* Time */}
                <div>
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="interviewTime"
                  >
                    Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="interviewTime"
                      name="interviewTime"
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
                      className="w-full flex items-center gap-2 py-2 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none appearance-none"
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
              {/* Technology and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Technology */}

                {/* Status */}
                <div>
                  <label
                    className="block font-semibold mb-2"
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
                        <span>{formik.errors.interviewStatus}</span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Section - Only show if not scheduled */}
          {!isScheduled && (
            <div>
              <h2 className="text-lg font-medium text-cyan-500 mb-6">
                Assessment
              </h2>
              <div className="space-y-8">
                {/* Soft Skill Rating */}
                <div>
                  <label className="block font-semibold mb-4">
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
                        <span>{formik.errors.softskillsRating}</span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label
              htmlFor="remarks"
              className="block font-semibold mb-2"
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
                <span>{formik.errors.remarks}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                onclose();
                formik.resetForm();
              }}
              className="px-6 py-2.5 border border-cyan-500 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
            >
              Add New Round
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
