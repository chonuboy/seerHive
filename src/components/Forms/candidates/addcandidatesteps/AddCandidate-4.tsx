import type React from "react";

import { useState } from "react";
import { X, Plus, Check, ChevronDown } from "lucide-react";

import { createContactTechnology } from "@/api/candidates/candidateTech";
import { createContactCertification } from "@/api/candidates/certification";
import { createContactCompany } from "@/api/candidates/companies";
import { createContactPreferredLocation } from "@/api/candidates/preferredLocation";
import { createContactPreferredJobType } from "@/api/candidates/preferredJob";
import { createContactHiringType } from "@/api/candidates/hiringType";
import { Technology } from "@/lib/models/candidate";
import { toast } from "react-toastify";
import { createContactDomain } from "@/api/candidates/domains";
import CancelButton from "@/components/Elements/utils/CancelButton";
import SubmitButton from "@/components/Elements/utils/SubmitButton";
import { useSelector } from "react-redux";

// This would be provided by the parent component
type ProfessionalFormProps = {
  masterSkills: Technology[];
  masterCertifications: any;
  masterCompanies: any;
  masterlocations: any;
  masterDomains: any;
};

type FormData = {
  skills: string[];
  certifications: string[];
  previousCompanies: string[];
  preferredLocations: string[];
  preferredJobModes: string[];
  hiringTypes: string[];
  domains: string[];
};

export default function ProfessionalForm({
  masterSkills,
  masterCertifications,
  masterCompanies,
  masterlocations,
  masterDomains,
}: ProfessionalFormProps) {
  const [candidateFormData, setFormData] = useState<FormData>({
    skills: [],
    certifications: [],
    previousCompanies: [],
    preferredLocations: [],
    preferredJobModes: [],
    hiringTypes: [],
    domains: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCertificationDropdownOpen, setIsCertificationDropdownOpen] =
    useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
  const { currentStep, formData } = useSelector(
    (state: any) => state.candidate
  );

  const [candidateId, setCandidateId] = useState<number>(formData.contactId);

  const jobModes = ["Remote", "Onsite", "Hybrid", "Flexible"];
  const hiringTypes = ["Full Time", "Part Time", "Contract", "Flexible"];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   onSubmit(formData);
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const addItem = (field: keyof FormData, value: string) => {
    if (!value.trim()) return;

    if (candidateFormData[field].includes(value)) {
      toast.error(`${value} already added`, { position: "top-center" });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...(prev[field as keyof typeof prev] as string[]),
        value.trim(),
      ],
    }));
  };

  // Remove item from array fields
  const removeItem = (field: keyof FormData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  // Toggle checkbox values
  const toggleCheckbox = (
    field: "preferredJobModes" | "hiringTypes",
    value: string
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      return {
        ...prev,
        [field]: (currentValues as string[]).includes(value)
          ? (currentValues as string[]).filter((item) => item !== value)
          : [...(currentValues as string[]), value],
      };
    });
  };

  return (
    <div>
      <div>
        <div className="flex justify-between items-center p-6">
          <h2 className="text-xl font-medium text-cyan-500">
            Professional Information
          </h2>
          {/* <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button> */}
        </div>

        <div className="p-6 space-y-8">
          {/* Skills - This remains the same as it's the reference */}
          <div className="relative">
            <label className="block font-semibold">Skills</label>
            <div className="flex gap-2 mt-2">
              <input
                name="skills"
                id="skills"
                placeholder="Enter a skill"
                className="w-full mt-4 border-0 border-b border-gray-300 focus:ring-0  placeholder-gray-400 rounded-none"
                onClick={(e) => setIsDropdownOpen(!isDropdownOpen)}
                onChange={(e) => setNewSkill(e.target.value)}
                value={newSkill}
              ></input>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-400 focus:outline-none"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newSkill.trim()) {
                    toast.error("Please enter a skill", {
                      position: "top-center",
                    });
                    return;
                  }
                  addItem("skills", newSkill);
                  try {
                    createContactTechnology({
                      contactDetails: {
                        contactId: candidateId,
                      },
                      technology: {
                        techId: masterSkills?.find(
                          (skill: any) => skill.technology === newSkill
                        )?.techId,
                        technology: newSkill,
                      },
                    }).then((data) => {
                      setNewSkill("");
                      console.log(data);
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="flex-1 sm:flex-none sm:px-4 py-1 border-2 border-cyan-500 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
              >
                <Plus className="w-5 h-5" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-96 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {masterSkills.length > 0 ? (
                    masterSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onClick={() => {
                          setNewSkill(skill.technology);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {skill.technology}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No Skills found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 my-6">
              {candidateFormData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2"
                >
                  <span className="">{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("skills", index)}
                    className="absolute -right-2 -top-2"
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications - Updated */}
          <div className="relative">
            <label className="block font-semibold">Certifications</label>
            <div className="flex gap-2 mt-2">
              <input
                name="certifications"
                id="certifications"
                className="w-full mt-4 border-0 border-b border-gray-300 focus:ring-0  placeholder-gray-400 rounded-none"
                onChange={(e) => setNewCertification(e.target.value)}
                value={newCertification}
                placeholder="Enter certification"
                onClick={() =>
                  setIsCertificationDropdownOpen(!isCertificationDropdownOpen)
                }
              ></input>
              <button
                type="button"
                onClick={() =>
                  setIsCertificationDropdownOpen(!isCertificationDropdownOpen)
                }
                className="text-gray-400 focus:outline-none"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newCertification.trim()) {
                    toast.error("Please enter a certification", {
                      position: "top-center",
                    });
                    return;
                  }
                  addItem("certifications", newCertification);
                  try {
                    createContactCertification({
                      contactDetails: { contactId: candidateId },
                      certification: {
                        certificationId: masterCertifications?.find(
                          (cert: any) =>
                            cert.certificationName === newCertification
                        )?.certificationId,
                        certificationName: newCertification,
                      },
                    }).then((data) => {
                      setNewCertification("");
                    });
                  } catch (err) {
                    console.log(err);
                  }
                }}
                className="flex-1 sm:flex-none sm:px-4 py-1 border-2 border-cyan-500 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
              >
                <Plus className="w-5 h-5" />
              </button>
              {isCertificationDropdownOpen && (
                <div className="absolute z-10 w-96 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {masterCertifications.length > 0 ? (
                    masterCertifications.map((cert: any, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onClick={() => {
                          setNewCertification(cert.certificationName);
                          setIsCertificationDropdownOpen(false);
                        }}
                      >
                        {cert.certificationName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No Certifications found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 my-6">
              {candidateFormData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2"
                >
                  <span className="">{cert}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("certifications", index)}
                    className="absolute -right-2 -top-2"
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Companies - Updated */}
          <div className="relative">
            <label className="block font-semibold">Previous Companies</label>
            <div className="flex gap-2 mt-2">
              <input
                name="previousCompanies"
                id="previousCompanies"
                className="w-full mt-4 border-0 border-b border-gray-300 focus:ring-0  placeholder-gray-400 rounded-none"
                onChange={(e) => setNewCompany(e.target.value)}
                value={newCompany}
                placeholder="Enter company name"
                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              ></input>
              <button
                type="button"
                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                className="text-gray-400 focus:outline-none"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newCompany.trim()) {
                    toast.error("Please enter a company", {
                      position: "top-center",
                    });
                    return;
                  }
                  addItem("previousCompanies", newCompany);
                  createContactCompany({
                    contactDetails: {
                      contactId: candidateId,
                    },
                    company: {
                      companyId: masterCompanies?.find(
                        (company: any) =>
                          company.companyName.toLowerCase() ===
                          newCompany.toLowerCase()
                      )?.companyId,
                    },
                  }).then((data) => {
                    setNewCompany("");
                  });
                }}
                className="flex-1 sm:flex-none sm:px-4 py-1 border-2 border-cyan-500 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
              >
                <Plus className="w-5 h-5" />
              </button>
              {isCompanyDropdownOpen && (
                <div className="absolute z-10 w-96 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {masterCompanies.length > 0 ? (
                    masterCompanies.map((company: any, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onClick={() => {
                          setNewCompany(company.companyName);
                          setIsCompanyDropdownOpen(false);
                        }}
                      >
                        {company.companyName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No Companies found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 my-6">
              {candidateFormData.previousCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2"
                >
                  <span className="">{company}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("previousCompanies", index)}
                    className="absolute -right-2 -top-2"
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Locations - Updated */}
          <div className="relative">
            <label className="block font-semibold">Preferred Locations</label>
            <div className="flex gap-2 mt-2">
              <input
                name="preferredLocations"
                id="preferredLocations"
                className="w-full mt-4 border-0 border-b border-gray-300 focus:ring-0  placeholder-gray-400 rounded-none"
                onChange={(e) => setNewLocation(e.target.value)}
                value={newLocation}
                onClick={() =>
                  setIsLocationDropdownOpen(!isLocationDropdownOpen)
                }
                placeholder="Enter location"
              ></input>
              <button
                type="button"
                onClick={() =>
                  setIsLocationDropdownOpen(!isLocationDropdownOpen)
                }
                className="text-gray-400 focus:outline-none"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newLocation.trim()) {
                    toast.error("Please enter a location", {
                      position: "top-center",
                    });
                    return;
                  }
                  addItem("preferredLocations", newLocation);
                  createContactPreferredLocation({
                    contactDetails: {
                      contactId: candidateId,
                    },
                    location: {
                      locationId: masterlocations?.find(
                        (location: any) =>
                          location.locationDetails === newLocation
                      )?.locationId,
                    },
                  }).then((data) => {
                    setNewLocation("");
                  });
                }}
                className="flex-1 sm:flex-none sm:px-4 py-1 border-2 border-cyan-500 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
              >
                <Plus className="w-5 h-5" />
              </button>
              {isLocationDropdownOpen && (
                <div className="absolute z-10 w-96 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {masterlocations.length > 0 ? (
                    masterlocations.map((location: any, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onClick={() => {
                          setNewLocation(location.locationDetails);
                          setIsLocationDropdownOpen(false);
                        }}
                      >
                        {location.locationDetails}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No Locations found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 my-6">
              {candidateFormData.preferredLocations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2"
                >
                  <span className="">{location}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("preferredLocations", index)}
                    className="absolute -right-2 -top-2"
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Domains - Updated */}
          <div className="relative">
            <label className="block font-semibold">Domains</label>
            <div className="flex gap-2 mt-2">
              <input
                name="domains"
                id="domains"
                className="w-full mt-4 border-0 border-b border-gray-300 focus:ring-0  placeholder-gray-400 rounded-none"
                onChange={(e) => setNewDomain(e.target.value)}
                value={newDomain}
                onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                placeholder="Enter domain"
              ></input>
              <button
                type="button"
                onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                className="text-gray-400 focus:outline-none"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newDomain.trim()) {
                    toast.error("Please enter a domain", {
                      position: "top-center",
                    });
                    return;
                  }
                  addItem("domains", newDomain);
                  createContactDomain({
                    contactDetails: {
                      contactId: candidateId,
                    },
                    domain: {
                      domainId: masterDomains?.find(
                        (domain: any) => domain.domainDetails === newDomain
                      )?.domainId,
                    },
                  }).then((data) => {
                    setNewDomain("");
                  });
                }}
                className="flex-1 sm:flex-none sm:px-4 py-1 border-2 border-cyan-500 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
              >
                <Plus className="w-5 h-5" />
              </button>
              {isDomainDropdownOpen && (
                <div className="absolute z-10 w-96 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {masterDomains.length > 0 ? (
                    masterDomains.map((domain: any, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onClick={() => {
                          setNewDomain(domain.domainDetails);
                          setIsDomainDropdownOpen(false);
                        }}
                      >
                        {domain.domainDetails}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No Domains found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-6 my-6">
              {candidateFormData.domains.map((domain, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2"
                >
                  <span className="">{domain}</span>
                  <button
                    type="button"
                    onClick={() => removeItem("domains", index)}
                    className="absolute -right-2 -top-2"
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Job Mode (Checkboxes) - Updated */}
          <div>
            <label className="block font-semibold mb-6">
              Preferred Job Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {" "}
              {/* Changed gap from 40 to 4 */}
              {jobModes.map((mode) => (
                <label
                  key={mode}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={candidateFormData.preferredJobModes.includes(mode)}
                    onChange={() => {
                      toggleCheckbox("preferredJobModes", mode);
                      createContactPreferredJobType({
                        contactDetails: {
                          contactId: candidateId,
                        },
                        preferredJobMode: mode,
                      }).then((data) => {
                        if (mode === "Flexible") {
                          toggleCheckbox("preferredJobModes", "Remote");
                          toggleCheckbox("preferredJobModes", "Onsite");
                          toggleCheckbox("preferredJobModes", "Hybrid");
                          createContactPreferredJobType({
                            contactDetails: {
                              contactId: candidateId,
                            },
                            preferredJobMode: "Remote",
                          }).then((data) => {
                            createContactPreferredJobType({
                              contactDetails: {
                                contactId: candidateId,
                              },
                              preferredJobMode: "Onsite",
                            }).then((data) => {
                              createContactPreferredJobType({
                                contactDetails: {
                                  contactId: candidateId,
                                },
                                preferredJobMode: "Hybrid",
                              }).then((data) => {});
                            });
                          });
                        }
                      });
                    }}
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      candidateFormData.preferredJobModes.includes(mode)
                        ? "bg-cyan-500 border-cyan-500"
                        : "border-gray-300"
                    }`}
                  >
                    {candidateFormData.preferredJobModes.includes(mode) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hiring Type (Checkboxes) - Updated */}
          <div>
            <label className="block font-semibold mb-6">Hiring Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {" "}
              {/* Changed gap from 40 to 4 */}
              {hiringTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={candidateFormData.hiringTypes.includes(type)}
                    onChange={() => {
                      toggleCheckbox("hiringTypes", type);
                      createContactHiringType({
                        hiringType: type,
                        contactDetails: {
                          contactId: candidateId,
                        },
                      }).then((data) => {
                        if (type == "Flexible") {
                          toggleCheckbox("hiringTypes", "Full Time");
                          toggleCheckbox("hiringTypes", "Part Time");
                          toggleCheckbox("hiringTypes", "Contract");
                          createContactHiringType({
                            hiringType: "Full Time",
                            contactDetails: {
                              contactId: candidateId,
                            },
                          }).then((data) => {
                            createContactHiringType({
                              hiringType: "Part Time",
                              contactDetails: {
                                contactId: candidateId,
                              },
                            }).then((data) => {
                              createContactHiringType({
                                hiringType: "Contract",
                                contactDetails: {
                                  contactId: candidateId,
                                },
                              }).then((data) => {});
                            });
                          });
                        }
                      });
                    }}
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      candidateFormData.hiringTypes.includes(type)
                        ? "bg-cyan-500 border-cyan-500"
                        : "border-gray-300"
                    }`}
                  >
                    {candidateFormData.hiringTypes.includes(type) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {/* Action buttons if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
