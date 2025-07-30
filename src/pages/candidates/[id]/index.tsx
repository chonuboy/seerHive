// Components
import MainLayout from "@/components/Layouts/layout";
import { Popup } from "@/components/Elements/cards/popup";
import ProfileUpdateForm from "@/components/Forms/candidates/updateProfile";
import PdfViewer from "@/components/Elements/utils/pdfViewer";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Next.js and React Imports
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Award,
  Building2,
  CalendarCheck,
  Edit3,
  Github,
  Globe,
  GraduationCap,
  IndianRupee,
  Lightbulb,
  Link2,
  Mail,
  MapPin,
  Phone,
  Route,
  Twitter,
  User,
  X,
} from "lucide-react";
// External Libraries
import { toast } from "react-toastify";

// Models and Definitions
import { Companies, Company } from "@/lib/models/client";
import {
  Certificates,
  allTechs,
  Domains,
  Interview,
  Technology,
} from "@/lib/models/candidate";
import { Candidate } from "@/lib/definitions";
import { ReqData } from "@/lib/models/candidate";

// API Calls
import { fetchCandidate } from "@/api/candidates/candidates";
import {
  deleteContactDomain,
  fetchAllContactDomains,
} from "@/api/candidates/domains";
import { deleteContactCompany } from "@/api/candidates/companies";
import { fetchAllContactCompanies } from "@/api/candidates/companies";
import { fetchContactCertificationsByContact } from "@/api/candidates/certification";
import {
  fetchAllCertifications,
  createCertification,
} from "@/api/master/certification";
import {
  createContactCertification,
  deleteContactCertification,
} from "@/api/candidates/certification";
import {
  updateContactTechnology,
  createContactTechnology,
  fetchAllContactTechnologies,
} from "@/api/candidates/candidateTech";
import { contactCertificate } from "@/lib/models/candidate";
import {
  fetchAllTechnologies,
  createTechnology,
} from "@/api/master/masterTech";
import { domainDetails } from "@/lib/models/candidate";
import { fetchAllDomains, createDomain } from "@/api/master/domain";
import { createContactDomain } from "@/api/candidates/domains";
import { createContactCompany } from "@/api/candidates/companies";
import { fetchAllCompanies, createCompany } from "@/api/master/masterCompany";
import { fetchAllLocations } from "@/api/master/masterLocation";
import {
  getContactPreferredJobTypeByContact,
  getContactPreferredJobTypes,
} from "@/api/candidates/preferredJob";
import {
  fetchContactInterview,
  fetchInterviewsByContact,
} from "@/api/candidates/interviews";
import {
  fetchAllContactPreferredLocations,
  fetchContactPreferredLocation,
} from "@/api/candidates/preferredLocation";
import { getContactHiringTypeByContactId } from "@/api/candidates/hiringType";
import AddCandidateDomain from "@/components/Forms/candidates/addCandidateDomain";
import AddCandidateCompany from "@/components/Forms/candidates/addCandidateCompany";
import AddCandidateCertificate from "@/components/Forms/candidates/addCandidateCertificate";
import AddSkillsForm from "@/components/Forms/candidates/addSkill";
import ContentHeader from "@/components/Layouts/content-header";
import UpdateCandidateCertificate from "@/components/Forms/candidates/updateCandidateCert";

export default function Candidates() {
  // candidate state
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(
    null
  );
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility
  // candidate Interviews
  const [candidateInterviews, setCandidateInterviews] = useState<
    Interview[] | []
  >([]);
  // Candidate Technologies
  const [technologies, setTechnologies] = useState<allTechs[] | null>(null);
  // const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [techExp, setTechExp] = useState("");
  const [expLevel, setExpLevel] = useState("");
  const [isSkillAdded, setIsSkillAdded] = useState(false);
  const [isSkillUpdated, setIsSkillUpdated] = useState(false);
  const [selectedTech, setSelectedTech] = useState<allTechs | null>(null);
  const [originalTech, setoriginalTech] = useState<allTechs | null>(null);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [isResumeUpoladed, setIsResumeUpladed] = useState(false);
  const experienceOptions = []; // Start with "Less than a year"
  // Add options from 1 year to 10 years
  for (let i = 1; i <= 10; i++) {
    experienceOptions.push(`${i}`); // Add "year" or "years" based on the count
  }
  const [masterTech, setMasterTech] = useState<Technology[] | null>(null);
  const [masterDomains, setMasterDomains] = useState<domainDetails[] | null>(
    null
  );
  // Candidate Domains
  const [candidateDomains, setCandidateDomains] = useState<Domains[] | null>(
    null
  );

  const [masterCompanies, setMasterCompanies] = useState<Company[] | null>(
    null
  );
  const [locations, setLocations] = useState<Location[]>([]);
  const [candidateCompanies, setCandidateCompanies] = useState<
    Companies[] | null
  >(null);
  const [masterCertificates, setMasterCertificates] = useState<
    Certificates[] | null
  >(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCertificate, setSelectedCertificate] =
    useState<contactCertificate | null>(null);
  const [candidateCertificates, setCandidateCertificates] = useState<
    contactCertificate[] | null
  >(null);
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [isCompanyVisible, setIsCompanyVisible] = useState(false);
  const [isDomainVisible, setIsDomainVisible] = useState(false);
  const [isCertificateVisible, setIsCertificateVisible] = useState(false);
  const [isSkillVisible, setIsSkillVisible] = useState(false);

  const [initialData, setInitialData] = useState<ReqData | null>(null);
  const [formData, setFormData] = useState<ReqData | null>(null);
  const [preferredJobType, setPreferredJobType] = useState<any[]>([]);
  const [preferredLocation, setPreferredLocation] = useState<any[]>([]);
  const [hiringTypes, setHiringTypes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [isUpdateCertificateVisible, setIsUpdateCertificateVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get Operations
  useEffect(() => {
    if (router.isReady) {
      const id = router.query.id;
      fetchCandidate(Number(id))
        .then((data) => {
          setCurrentCandidate(data);
          setInitialData(data);
          setFormData(data);
          console.log(data);
        })
        .catch((error) => console.log(error));

      fetchAllLocations().then((data) => {
        const allLocatoins = data;
        setLocations(allLocatoins);
      });

      fetchAllContactTechnologies()
        .then((data) => {
          const contactIdToMatch = Number(id);
          // Step 1: Filter objects with the matching contactId
          const filteredData = data.filter(
            (item: any) => item.contactDetails.contactId === contactIdToMatch
          );
          // Step 2: Extract the technology field from the filtered objects
          const technologies = filteredData.map((item: any) => item);
          setTechnologies(technologies);
        })
        .catch((error) => console.log(error));

      fetchAllContactDomains().then((data) => {
        const contactIdToMatch = Number(id);
        // Step 1: Filter objects with the matching contactId
        const filteredData = data.filter(
          (item: any) => item.contactDetails.contactId === contactIdToMatch
        );
        const domains = filteredData.map((item: any) => item);
        setCandidateDomains(domains);
      });

      fetchAllTechnologies()
        .then((data) => {
          setMasterTech(data);
        })
        .catch((error) => {
          console.log(error);
        });

      fetchAllDomains()
        .then((data) => {
          setMasterDomains(data);
        })
        .catch((error) => {
          console.log(error);
        });

      fetchAllContactCompanies().then((data) => {
        const contactIdToMatch = Number(id);
        // Step 1: Filter objects with the matching contactId
        const filteredData = data.filter(
          (item: any) => item.contactDetails.contactId === contactIdToMatch
        );
        const companies = filteredData.map((item: any) => item);
        setCandidateCompanies(companies);
      });

      fetchContactCertificationsByContact(Number(id)).then((data) => {
        if (data.status === 200) {
          setCandidateCertificates(data.data);
        } else {
          setCandidateCertificates([]);
        }
      });

      fetchAllCompanies()
        .then((data) => {
          setMasterCompanies(data);
        })
        .catch((error) => {
          console.log(error);
        });

      fetchAllCertifications().then((data) => {
        setMasterCertificates(data);
      });

      fetchInterviewsByContact(Number(id)).then((data) => {
        if (data.message) {
          setCandidateInterviews([]);
          setIsLoading(false);
        } else {
          setCandidateInterviews(data);
          setIsLoading(false);
        }
      });

      getContactPreferredJobTypeByContact(Number(id)).then((data) => {
        let modes;
        if (data.status == "NOT_FOUND") {
          setPreferredJobType([]);
          return;
        }
        if (data.length > 0) {
          modes = data.map((job: any) => ({
            typeId: job.contactPreferredJobModeId,
            jobType: job.preferredJobMode,
          }));
        }
        setPreferredJobType(modes);
      });

      fetchAllContactPreferredLocations().then((data) => {
        if (data.status == "NOT_FOUND") {
          setPreferredLocation([]);
          return;
        } else {
          const filtered = data.filter(
            (item: any) => item.contactDetails.contactId == id
          );
          setPreferredLocation(filtered);
        }
      });

      getContactHiringTypeByContactId(Number(id)).then((data) => {
        let types;
        if (data.status == "NOT_FOUND") {
          setHiringTypes([]);
          return;
        }
        if (data.length > 0) {
          types = data.map((item: any) => ({
            typeId: item.contactHiringTypeId,
            hiringType: item.hiringType,
          }));
        }
        setHiringTypes(types);
      });
    }

    const { mode } = router.query;
    const isEdit = mode ? true : false;
    setIsEdit(isEdit);
  }, [
    isFormVisible,
    isSkillUpdated,
    isSkillAdded,
    isResumeUpoladed,
    router.isReady,
    isDomainVisible,
    isCompanyVisible,
    isCertificateVisible,
    isSkillVisible,
    isUpdateCertificateVisible,
  ]);

  // Post Operations

  const postSkill = async () => {
    try {
      // Check if a skill is selected
      if (selectedSkill.length === 0) {
        toast.error("Please select a skill", {
          position: "top-center",
        });
        return;
      }
      if (selectedSkill.length > 30) {
        toast.error("Please select a skill with less than 30 characters", {
          position: "top-center",
        });
      }

      // Check if if the selected skill exist in the candidate's technologies array
      if (
        technologies?.some(
          (tech) =>
            tech.technology.technology.toLowerCase() ===
            selectedSkill.toLowerCase()
        )
      ) {
        toast.error("Skill already added", {
          position: "top-center",
        });
        setSelectedSkill("");
        setExpLevel("");
        setTechExp("");
        return;
      }

      // Check if the skill exists in masterTech
      const skillExists = masterTech?.some(
        (tech) => tech.technology.toLowerCase() === selectedSkill.toLowerCase()
      );

      let tempId;
      if (skillExists) {
        // If the skill exists, find its ID
        tempId = masterTech?.find(
          (tech) =>
            tech.technology.toLowerCase() === selectedSkill.toLowerCase()
        );
      } else {
        // If the skill doesn't exist, create it
        const newSkill = {
          technology: selectedSkill,

          //  fields for the createTechnology API
        };

        // Create the new technology
        const createdSkill = await createTechnology(newSkill);

        // Update masterTech with the new skill
        setMasterTech((prev) =>
          prev ? [...prev, createdSkill] : [createdSkill]
        );

        // Use the newly created skill's ID
        tempId = createdSkill;
      }

      // Add the skill to technologies
      const updatedTechnologies = technologies
        ? [
            ...technologies,
            {
              technology: { technology: selectedSkill },
              experience: techExp,
              expertiseLevel: expLevel,
            },
          ]
        : [];
      setTechnologies(updatedTechnologies);

      // Associate the skill with the candidate
      if (tempId && techExp && expLevel) {
        const result = await createContactTechnology({
          contactDetails: currentCandidate,
          technology: tempId,
          experience: techExp,
          expertiseLevel: expLevel,
        });
        console.log("Skill added to candidate:", result.technology.technology);
        setIsSkillAdded(true);
      } else if (tempId) {
        const result = await createContactTechnology({
          contactDetails: currentCandidate,
          technology: tempId,
        });
        setIsSkillAdded(true);
        console.log("Skill added to candidate:", result.technology.technology);
      }

      // Reset form fields
      setSelectedSkill("");
      setExpLevel("");
      setTechExp("");
      setTimeout(() => {
        setIsSkillAdded(true);
      }, 3000);

      // Show success message
      toast.success("Skill added successfully", {
        position: "top-center",
      });
      setIsSkillAdded(true);
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill. Please try again.", {
        position: "top-center",
      });
    }
  };

  // Put Operation
  const handleUpdateSkill = async (id: number) => {
    setIsSkillUpdated(true);
    const tech = technologies?.[id];
    if (tech) {
      console.log(technologies?.[id]);
      setSelectedTech({
        contactTechId: tech.contactTechId,
        technology: tech.technology,
        experience: tech.experience,
        expertiseLevel: tech.expertiseLevel,
      });
      setoriginalTech({
        contactTechId: tech.contactTechId,
        technology: tech.technology,
        experience: tech.experience,
        expertiseLevel: tech.expertiseLevel,
      });
    } else {
      toast.error("Skill not found.", {
        position: "top-center",
      });
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "-";

    const phone = parsePhoneNumberFromString(phoneNumber);
    return phone?.formatInternational() || phoneNumber;
  };

  const handleUpdateContactTechnology = async (event: React.MouseEvent) => {
    event.preventDefault();
    // Check if selectedTech and originalTech are defined
    if (!selectedTech || !originalTech) {
      toast.error("No skill selected for update.", {
        position: "top-center",
      });
      return;
    }

    // Create an object to hold updated fields
    const updatedSkill: any = {};

    // Compare each property with the original value
    if (selectedTech.experience !== originalTech.experience) {
      updatedSkill.experience = selectedTech.experience;
    }
    if (selectedTech.expertiseLevel !== originalTech.expertiseLevel) {
      updatedSkill.expertiseLevel = selectedTech.expertiseLevel;
    }
    updatedSkill.contactDetails = currentCandidate;
    // updatedSkill.technology = selectedTech.technology;
    try {
      // Check if contactTechId is available
      if (selectedTech.contactTechId) {
        // Call the API to update the skill
        const response = await updateContactTechnology(
          selectedTech.contactTechId,
          updatedSkill
        );
        // Update the technologies array in state
        const updatedTechnologies = technologies?.map((tech) =>
          tech.contactTechId === selectedTech.contactTechId
            ? { ...tech, ...updatedSkill } // Merge updated fields
            : tech
        );

        // Update state with the new technologies array
        setTechnologies(updatedTechnologies || []);

        // Reset the update flag and show success message
        setIsSkillUpdated(false);
      } else {
        toast.error("Invalid skill ID. Cannot update.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill. Please try again.", {
        position: "top-center",
      });
    }
  };

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (currentCandidate == null) {
    // Static pre-generated HTML
    return (
      <div>
        <MainLayout>
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="flex flex-col gap-4 items-center">
              <span className="text-xl font-semibold">Loading</span>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          </div>
        </MainLayout>
      </div>
    );
  }

  return (
    <MainLayout>
      <section className="space-y-10 relative md:text-base text-xs">
        <div className="bg-white rounded">
          {/* Header Section */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-start space-x-4">
              {/* Profile Image */}
              <div className="flex justify-center mr-2">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-100">
                  <span className="text-white font-semibold text-xl">
                    {currentCandidate.firstName.charAt(0)}
                    {currentCandidate.lastName.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Name and Basic Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mt-1 mb-2">
                  <h1 className="text-3xl font-semibold text-gray-900 relative">
                    {currentCandidate.firstName} {currentCandidate.lastName}
                    <span
                      className={`w-4 h-4 ${
                        currentCandidate.isActive
                          ? "bg-green-500"
                          : "bg-red-500"
                      } rounded-full absolute -right-6 top-0`}
                    ></span>
                  </h1>
                </div>

                {/* Personal Details Grid */}
                <div className="grid mt-4 grid-cols-2 gap-x-40 gap-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.gender}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.companyName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>
                      {currentCandidate.highestEducation}(
                      {currentCandidate.designation})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Twitter className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.twitter ?? "NA"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>
                      {currentCandidate.currentLocation.locationDetails}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link2 className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span className="text-blue-600">
                      <a href={currentCandidate.linkedin} target="_blank">
                        {currentCandidate.linkedin ?? "NA"}
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.emailId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span className="text-blue-600">
                      {currentCandidate.github ?? "NA"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span>{currentCandidate.primaryNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-cyan-600 font-semibold" />
                    <span className="text-blue-600">
                      {currentCandidate.blog ?? "NA"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}

            {isEdit && (
              <button
                className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center justify-center gap-1"
                onClick={() => {
                  setIsFormVisible(true);
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="truncate">Edit</span>
              </button>
            )}

            {isFormVisible && currentCandidate.contactId && (
              <Popup onClose={() => setIsFormVisible(false)}>
                <div className="my-8">
                  <ProfileUpdateForm
                    autoClose={() => setIsFormVisible(false)}
                    initialValues={currentCandidate}
                    masterLocations={locations}
                    preferredJobModes={preferredJobType}
                    hiringTypes={hiringTypes}
                    preferredLocation={preferredLocation}
                    id={currentCandidate.contactId}
                  ></ProfileUpdateForm>
                </div>
              </Popup>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => onTabChange("basic")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "basic"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Basic Details
              </button>
              <button
                onClick={() => onTabChange("skills")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "skills"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Skills & Others
              </button>
              <button
                onClick={() => onTabChange("resume")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "resume"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Resume
              </button>
              <button
                onClick={() => onTabChange("interviews")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "interviews"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Interviews
              </button>
            </nav>
          </div>

          {activeTab === "basic" && (
            <div className="mb-10">
              {currentCandidate && (
                <div className="bg-gray-100 py-4">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-6">
                      <div className="bg-white p-6 shadow-sm">
                        <div className="border-b-2 border-purple-500 pb-2 mb-4">
                          <h2 className="text-xl font-bold text-gray-900 uppercase">
                            Professional
                          </h2>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Experience
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.totalExperience || "--"} YRS
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Company
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.companyName || "--"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Role
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.techRole || "--"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Notice Period
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.noticePeriod || "0"} Days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 shadow-sm">
                      <div className="border-b-2 border-orange-500 pb-2 mb-4">
                        <h2 className="text-xl font-bold text-gray-900 uppercase">
                          Preferences
                        </h2>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Job Type
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {preferredJobType?.length > 1
                              ? preferredJobType
                                  .map((item) => item["jobType"])
                                  .join(", ")
                              : preferredJobType?.length === 1
                              ? preferredJobType[0].jobType
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Hiring Type
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {hiringTypes?.length > 1
                              ? hiringTypes
                                  .map((item) => item["hiringType"])
                                  .join(", ")
                              : hiringTypes?.length === 1 ? hiringTypes[0].hiringType : "-"}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Location
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {preferredLocation?.length > 0
                              ? preferredLocation
                                  .map(
                                    (item) =>
                                      item["location"]["locationDetails"]
                                  )
                                  .join(", ")
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="bg-gradient-to-br bg-white p-6  shadow-sm">
                        <div className="border-b-2 border-pink-500 border-opacity-30 pb-2 mb-6">
                          <h2 className="text-xl font-bold uppercase">
                            Compensation
                          </h2>
                        </div>
                        <div className="space-y-6">
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Current Salary
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.currentSalary || "--"} LPA
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Expected Salary
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.expectedSalary || "--"} LPA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" space-y-6">
                      {/* Personal Info Block */}
                      <div className="bg-white p-6 shadow-sm">
                        <div className="border-b-2 border-blue-500 pb-2 mb-4">
                          <h2 className="text-xl font-bold text-gray-900 uppercase">
                            Personal
                          </h2>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Marital Status
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.maritalStatus ?? "--"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Date of Birth
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.dob &&
                                new Date(
                                  currentCandidate.dob
                                ).toLocaleDateString()}
                              {!currentCandidate?.dob && "--"} 
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Phone
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {currentCandidate?.secondaryNumber ?? "NA"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Address
                            </span>
                            <span className="text-sm font-semibold text-gray-900 text-right">
                              {currentCandidate?.addressLocality ?? "NA"}
                            </span>
                            
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">
                              Pincode
                            </span>
                            <span className="text-sm font-semibold text-gray-900 text-right">
                              {currentCandidate?.pinCode ?? "NA"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!currentCandidate && (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">Loading</span>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div id="skills" className="p-4 space-y-8">
              {isSkillVisible &&
              masterTech &&
              technologies &&
              masterTech.length > 0 ? (
                <Popup onClose={() => setIsSkillVisible(false)}>
                  <AddSkillsForm
                    technologis={masterTech}
                    candidateTechs={technologies}
                    Id={currentCandidate.contactId}
                    autoClose={() => setIsSkillVisible(false)}
                  ></AddSkillsForm>
                </Popup>
              ) : (
                ""
              )}

              {technologies && technologies.length > 0 ? (
                <div
                  id="Skills_rating"
                  className="bg-white dark:bg-black dark:text-white rounded-md space-y-4"
                >
                  <div className="flex justify-between mx-1 items-center">
                    <h3 className="text-xl text-cyan-500 font-semibold">
                      Skills
                    </h3>
                    {isEdit && (
                      <button
                        className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center justify-center"
                        onClick={() => setIsSkillVisible(true)}
                      >
                        <span className="truncate">Add Skill</span>
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto rounded-md">
                    <table className="min-w-full text-xs md:text-base border border-gray-200">
                      <thead className="bg-gray-100 ">
                        <tr>
                          <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                            Skill
                          </th>
                          <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                            Experience
                          </th>
                          <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                            Expertise Level
                          </th>
                          {isEdit ? (
                            <th className="font-semibold text-left text-cyan-500 px-2 py-1 md:px-4 md:py-2">
                              Actions
                            </th>
                          ) : null}
                        </tr>
                      </thead>
                      <tbody>
                        {technologies?.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:text-black"
                          >
                            <td className="text-left px-2 py-1 md:px-4 md:py-4 border border-gray-200">
                              {item.technology.technology}
                            </td>
                            <td className="text-left px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                              {item.experience ? item.experience : "-"} Yrs
                            </td>
                            <td className="text-left px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                              {item.expertiseLevel ? item.expertiseLevel : "-"}
                            </td>
                            {isEdit ? (
                              <td className="text-left px-2 py-1 md:px-4 md:py-2 border border-gray-200">
                                <button
                                  className="text-cyan-400 hover:text-cyan-600 focus:outline-none"
                                  onClick={() => {
                                    handleUpdateSkill(index);
                                  }}
                                >
                                  Update
                                </button>
                              </td>
                            ) : null}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl text-cyan-500 font-semibold">
                    Skills
                  </h3>
                  <div className="flex flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto">
                    <div className="mb-2">
                      <Lightbulb className="w-20 h-20 text-[#00bcd4]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                      No Skills Added Yet !
                    </h2>
                    <p className="text-base text-[#888888] text-center">
                      Add New skills and they will show up here
                    </p>
                    <button
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 mt-4 py-2 rounded"
                      onClick={() => setIsSkillVisible(true)}
                    >
                      Add New Skill
                    </button>
                  </div>
                </>
              )}

              <section>
                <div
                  id="domain"
                  className="bg-white dark:bg-black dark:text-white space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="md:text-xl text-sm text-cyan-500 font-semibold">
                      Domains
                    </h3>
                    {isEdit &&
                      candidateDomains &&
                      candidateDomains?.length > 0 && (
                        <button
                          onClick={() => setIsDomainVisible(true)}
                          className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center justify-center"
                        >
                          <span className="truncate">Add Domain</span>
                        </button>
                      )}
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-wrap gap-4 w-full">
                      {candidateDomains?.length ? (
                        candidateDomains.map((domain) => (
                          <div
                            key={domain.contactDomainId}
                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium"
                          >
                            <span>{domain.domain.domainDetails}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg w-full">
                          <div className="mb-6">
                            <Globe className="w-20 h-20 text-[#00bcd4]" />
                          </div>
                          <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                            No Domains Added Yet !
                          </h2>
                          <p className="text-base text-[#888888] text-center">
                            Create New domains and they will show up here
                          </p>
                          {isEdit && (
                            <button
                              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 mt-2 rounded"
                              onClick={() => setIsDomainVisible(true)}
                            >
                              Add Domain
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {isDomainVisible && masterDomains && (
                      <Popup onClose={() => setIsDomainVisible(false)}>
                        <AddCandidateDomain
                          masterDomains={masterDomains}
                          contactId={currentCandidate.contactId}
                          onCancel={() => setIsDomainVisible(false)}
                          contactDomains={candidateDomains || []}
                        />
                      </Popup>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="bg-white dark:bg-black dark:text-white space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="md:text-xl text-cyan-500 text-sm font-semibold">
                      Certificates
                    </h3>
                    {isEdit &&
                      candidateCertificates &&
                      candidateCertificates?.length > 0 && (
                        <button
                          className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                          onClick={() => setIsCertificateVisible(true)}
                        >
                          Add Certificate
                        </button>
                      )}
                  </div>
                  <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {candidateCertificates?.length ? (
                        candidateCertificates.map((certificate) => (
                          <div
                            key={certificate.contactCertificationId}
                            className="bg-white rounded-lg p-4 border-2 border-cyan-400"
                          >
                            {/* Header with title and edit button */}
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-xl font-bold text-gray-800 truncate">
                                {certificate.certification?.certificationName}
                              </h2>
                              {isEdit && (
                                <button
                                  className="bg-cyan-500 rounded px-4 py-1 flex items-center text-white justify-between gap-2"
                                  onClick={() => {
                                    setIsUpdateCertificateVisible(true);
                                    setSelectedCertificate(certificate);
                                  }}
                                >
                                  <Edit3 className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                              )}

                              {isUpdateCertificateVisible &&
                                masterCertificates &&
                                selectedCertificate && (
                                  <Popup
                                    onClose={() =>
                                      setIsUpdateCertificateVisible(false)
                                    }
                                  >
                                    <UpdateCandidateCertificate
                                      onClose={() =>
                                        setIsUpdateCertificateVisible(false)
                                      }
                                      masterCertificates={masterCertificates}
                                      contactCertificate={selectedCertificate}
                                    />
                                  </Popup>
                                )}
                            </div>

                            {/* Validity dates - same flex layout as company dates */}
                            <div className="flex flex-col sm:flex-row justify-between">
                              {certificate.validFrom && (
                                <div className="mb-2 sm:mb-0">
                                  <div className="text-gray-600">
                                    Valid from
                                  </div>
                                  <span className="font-semibold">
                                    {new Date(
                                      certificate.validFrom
                                    ).toLocaleDateString()}
                                    <span className="text-red-500">*</span>
                                  </span>
                                </div>
                              )}

                              {certificate.hasExpiry &&
                              certificate.validTill ? (
                                <div>
                                  <div className="text-gray-600">
                                    Valid till
                                  </div>
                                  <span className="font-semibold">
                                    {new Date(
                                      certificate.validTill
                                    ).toLocaleDateString()}
                                    <span className="text-red-500">*</span>
                                  </span>
                                </div>
                              ) : !certificate.hasExpiry ? (
                                <div>
                                  <div className="text-gray-600">Expiry</div>
                                  <span className="font-semibold text-green-600">
                                    No expiry
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-gray-600">Validity</div>
                                  <span className="font-semibold text-gray-500">
                                    No validity dates set
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col col-span-3 items-center justify-center rounded-lg w-full max-w-md mx-auto">
                          <div className="mb-6">
                            <Award className="w-20 h-20 text-[#00bcd4]" />
                          </div>
                          <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                            No Certificates Added Yet !
                          </h2>
                          <p className="text-base text-[#888888] text-center">
                            Add New certificates and they will show up here
                          </p>
                          {isEdit && (
                            <button
                              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                              onClick={() => setIsCertificateVisible(true)}
                            >
                              Add Certificate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {isCertificateVisible && masterCertificates && (
                  <Popup onClose={() => setIsCertificateVisible(false)}>
                    <AddCandidateCertificate
                      masterCertificates={masterCertificates}
                      onCancel={() => setIsCertificateVisible(false)}
                      contactId={currentCandidate.contactId}
                      contactCertificates={candidateCertificates || []}
                    />
                  </Popup>
                )}
              </section>

              <section className="">
                <div className="flex items-center mb-4 justify-between">
                  <h3 className="md:text-xl text-sm text-cyan-500 font-semibold">
                    Companies
                  </h3>
                  {isEdit &&
                    candidateCompanies &&
                    candidateCompanies?.length > 0 && (
                      <button
                        className="w-40 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                        onClick={() => setIsCompanyVisible(true)}
                      >
                        Add Company
                      </button>
                    )}
                  {isCompanyVisible &&
                    candidateCompanies &&
                    masterCompanies && (
                      <Popup onClose={() => setIsCompanyVisible(false)}>
                        <AddCandidateCompany
                          contactId={currentCandidate.contactId}
                          masterCompanies={masterCompanies}
                          onCancel={() => setIsCompanyVisible(false)}
                          contactCompanies={candidateCompanies}
                        ></AddCandidateCompany>
                      </Popup>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {candidateCompanies?.length ? (
                    candidateCompanies?.map((company: any) => (
                      <div className=" bg-white rounded-lg p-4 border-2 border-cyan-400">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold text-gray-800">
                            {company.company.companyName}
                          </h2>
                          {isEdit && (
                            <button
                              className="bg-cyan-500 rounded px-4 py-1 flex items-center text-white justify-between gap-2"
                              onClick={() => {
                                setIsCompanyVisible(true);
                              }}
                            >
                              <Edit3 className="w-4 h-4"></Edit3>
                              Edit
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between">
                          <div className="">
                            <div className="text-gray-600">Joining Date</div>
                            <span className="font-semibold">
                              {company.joiningDate
                                ? new Date(
                                    company.joiningDate
                                  ).toLocaleDateString()
                                : "NA"}
                            </span>
                          </div>

                          <div className="">
                            <div className="text-gray-600">Leaving Date</div>
                            <span className="font-semibold">
                              {company.leavingDate
                                ? new Date(
                                    company.leavingDate
                                  ).toLocaleDateString()
                                : "NA"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 flex flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto">
                      <div className="mb-6">
                        <Building2 className="w-20 h-20 text-[#00bcd4]" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                        No Companies Added Yet !
                      </h2>
                      <p className="text-base text-[#888888] text-center">
                        Add New companies and they will show up here
                      </p>
                      {isEdit && (
                        <button
                          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                          onClick={() => setIsCompanyVisible(true)}
                        >
                          Add Company
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {isSkillUpdated && selectedTech && (
            <Popup onClose={() => setIsSkillUpdated(false)} styleMod="h-full">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mt-16">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">
                  Update Skill
                </h1>

                <div className="space-y-6">
                  <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      Skill <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="skill"
                      disabled
                      type="text"
                      value={selectedTech.technology.technology}
                      className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-md placeholder-gray-400 focus:outline-none"
                      onChange={(e) =>
                        setSelectedTech({
                          ...selectedTech,
                          technology: { technology: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      Experience (In Years){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="experience"
                      type="text"
                      value={selectedTech.experience}
                      className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-md placeholder-gray-400 focus:outline-none"
                      onChange={(e) =>
                        setSelectedTech({
                          ...selectedTech,
                          experience: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      Expertise Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="skill"
                      id="skill"
                      className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-md placeholder-gray-400 focus:outline-none"
                      value={selectedTech.expertiseLevel}
                      onChange={(e) => {
                        setSelectedTech({
                          ...selectedTech,
                          expertiseLevel: e.target.value,
                        });
                      }}
                    >
                      <option className="text-gray-500" disabled value="">
                        Select level
                      </option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setIsSkillUpdated(false)}
                    className="flex-1 sm:flex-none sm:px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleUpdateContactTechnology}
                    className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
                  >
                    Update
                  </button>
                </div>
              </div>
            </Popup>
          )}

          {activeTab === "resume" && (
            <section id="resume" className="p-4 rounded-lg shadow-sm space-y-4">
              <h3 className="font-semibold text-cyan-500 text-sm  md:text-xl">
                Resume
              </h3>
              <PdfViewer
                isEdit={isEdit}
                candidateId={Number(router.query.id)}
                autoClose={() => {
                  setIsFormVisible(false);
                }}
                resume={currentCandidate.resume ? currentCandidate.resume : ""}
              ></PdfViewer>
            </section>
          )}

          {activeTab === "interviews" && (
            <section className="p-4">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center min-h-[200px]">
                  <div className="flex flex-col gap-4 items-center">
                    <span className="text-xl font-semibold">Loading</span>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                  </div>
                </div>
              )}

              {/* Error or No Data State */}
              {candidateInterviews &&
                candidateInterviews.length === 0 &&
                !isLoading && (
                  <div className="col-span-2 pb-20 flex flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto">
                    <div className="mb-6">
                      <CalendarCheck className="w-20 h-20 text-[#00bcd4]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                      No Interviews Scheduled Yet!
                    </h2>
                    <p className="text-base text-[#888888] text-center">
                      Schedule new interviews and they will show up here
                    </p>
                  </div>
                )}

              {/* Success State */}
              {candidateInterviews && candidateInterviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {candidateInterviews.map((item, index) => {
                    // Null checks for nested properties
                    const clientName =
                      item.clientJob?.client?.clientName || "Unknown Client";
                    const jobTitle = item.clientJob?.jobTitle || "No Job Title";
                    const salary =
                      item.clientJob?.salaryInCtc || "Not specified";
                    const jobPostType =
                      item.clientJob?.jobPostType || "Not specified";
                    const jobMode =
                      item.clientJob?.clientJob?.preferredJobMode || "Remote";
                    const experience =
                      item.clientJob?.experience || "Not specified";

                    return (
                      <div
                        key={index}
                        className="transform transition-all max-w-2xl duration-300 hover:shadow-xl"
                      >
                        <div className="border border-gray-300 rounded-lg p-6 relative">
                          {/* Header Section */}
                          <div className="flex justify-between mb-4">
                            <h3 className="text-blue-500 font-medium text-lg">
                              {clientName}
                            </h3>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded-full ${
                                  item.interviewStatus === "DONE"
                                    ? "bg-green-500"
                                    : item.interviewStatus === "PENDING"
                                    ? "bg-yellow-500"
                                    : item.interviewStatus === "REJECTED"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                                }`}
                              ></div>
                              <div
                                className={`text-md w-24 capitalize font-semibold ${
                                  item.interviewStatus === "DONE"
                                    ? "text-green-600"
                                    : item.interviewStatus === "PENDING"
                                    ? "text-yellow-600"
                                    : item.interviewStatus === "REJECTED"
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {item.interviewStatus || "UNKNOWN"}
                              </div>
                            </div>
                          </div>

                          {/* Job Title */}
                          <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {jobTitle}
                          </h2>

                          {/* Salary */}
                          <p className="text-gray-700 mb-4 font-medium flex items-center">
                            <IndianRupee className="w-4 h-4"></IndianRupee>
                            {salary} LPA
                          </p>

                          {/* Job Details and View Rounds Button */}
                          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            {/* Job Details */}
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Route className="w-4 h-4 text-cyan-600 font-semibold"></Route>
                                <span className="text-sm">{jobPostType}</span>
                              </div>

                              <div className="flex items-center space-x-2 text-gray-600">
                                <svg
                                  className="w-4 h-4 text-cyan-600 font-semibold"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm">{jobMode}</span>
                              </div>

                              <div className="flex items-center space-x-2 text-gray-600">
                                <svg
                                  className="w-4 h-4 text-cyan-600 font-semibold"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm">{experience}</span>
                              </div>
                            </div>
                          </div>

                          {/* View Rounds Button - Only show if interviewId exists */}
                          {item.interviewId && (
                            <div className="mt-6 flex justify-end">
                              <Link
                                href={{
                                  pathname: `/candidates/${Number(
                                    router.query.id
                                  )}/interviews/${
                                    item.clientJob?.jobId || "unknown"
                                  }`,
                                  query: {
                                    contactInterViewId: item.interviewId,
                                  },
                                }}
                              >
                                <button className="min-w-[120px] h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2">
                                  View Rounds
                                  <svg
                                    className="w-4 h-4 ml-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
