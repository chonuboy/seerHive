import MainLayout from "@/components/Layouts/layout";
import { useRouter } from "next/router";
import { fetchJob } from "@/api/client/clientJob";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Popup } from "@/components/Elements/cards/popup";
import JobInfoUpdateForm from "@/components/Forms/jobs/updateJobInfo";
import { BookOpen, Briefcase, ChevronDown, User } from "lucide-react";
import { domainDetails, Interviews, Technology } from "@/lib/models/candidate";
import { fetchAllTechnologies } from "@/api/master/masterTech";
import { fetchAllDomains } from "@/api/master/domain";
import { createJobTech, fetchAllJobTechs } from "@/api/client/clientJobTech";
import { toast } from "react-toastify";
import { fetchContactsByJob } from "@/api/candidates/interviews";
import Link from "next/link";
import PdfViewer from "@/components/Elements/utils/pdfViewer";

export default function Job() {
  const router = useRouter();
  const jobId = Number(router.query.id);
  const [currentJob, setCurrentJob] = useState<any | null>(null);
  const [isJdUpdated, setJdUpdated] = useState(false);
  const [activeTab, setActiveTab] = useState("jobInfo");
  const [isJobUpdated, setIsJobUpdated] = useState(false);
  const [isSkillAdded, setIsSkillAdded] = useState(false);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Technology | null>(null);
  const [allTech, setAllTech] = useState<Technology[] | null>(null);
  const [allDomain, setAllDomain] = useState<domainDetails[] | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<domainDetails | null>(
    null
  );
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);

  const [jobSkills, setJobSkills] = useState<Technology[] | null>(null);
  const [jobDomains, setJobDomains] = useState<domainDetails[] | null>(null);
  const [shortlisted, setShortlisted] = useState<Interviews[] | null>(null);

  const postSkillDomain = () => {
    if (!selectedDomain || !selectedSkill) {
      toast.error("Please select a skill and domain", {
        position: "top-right",
      });
      return;
    }
    if (jobSkills?.some((skill) => skill.techId === selectedSkill?.techId)) {
      toast.error("Skill already Added", {
        position: "top-right",
      });
      return;
    }
    if (
      jobDomains?.some((domain) => domain.domainId === selectedDomain?.domainId)
    ) {
      toast.error("Domain already Added", {
        position: "top-right",
      });
      return;
    }
    createJobTech({
      job: {
        jobId: jobId,
      },
      technology: {
        techId: selectedSkill?.techId,
      },
      domain: {
        domainId: selectedDomain?.domainId,
      },
    })
      .then((data) => {
        if (data.status === 400) {
          toast.error("Skill already Added", {
            position: "top-right",
          });
          return;
        }
        console.log(data);

        if (data.status === 201) {
          toast.success("Skill and Domain added successfully", {
            position: "top-right",
          });
        }

        setSelectedDomain(null);
        setSelectedSkill(null);
        setIsSkillAdded(false);
      })
      .catch((err) => {});
  };

  const renderSanitizedHtml = (htmlString: string) => {
    return { __html: DOMPurify.sanitize(htmlString) };
  };

  useEffect(() => {
    if (router.isReady && jobId) {
      fetchJob(jobId)
        .then((data) => {
          setCurrentJob(data);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
      fetchAllTechnologies().then((data) => {
        setAllTech(data);
      });
      fetchAllDomains().then((data) => {
        setAllDomain(data);
      });
      fetchAllJobTechs().then((data) => {
        setJobSkills(
          data
            .filter((item: any) => item.job.jobId === jobId)
            .map((item: any) => item.technology)
        );
        setJobDomains(
          data
            .filter((item: any) => item.job.jobId === jobId)
            .map((item: any) => item.domain)
        );
      });
      fetchContactsByJob(jobId).then((data) => {
        if (data.length > 0) {
          setShortlisted(data);
        }
      });
    }
  }, [router.isReady, jobId, isSkillAdded, isJobUpdated]);

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const getStatusColor = (status:string)=>{
    if(status === "Active"){
      return "text-green-500 px-3 py-1 font-medium";
    }
    else if(status === "Closed"){
      return "text-red-500 px-3 py-1 font-medium";
    }
    else{
      return "text-yellow-500 px-3 py-1 font-medium";
    }
  }

  if (!currentJob) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="flex flex-col gap-4 items-center">
            <span className="text-xl font-semibold">Loading</span>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="">
        <div className="p-6 bg-white">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-14">
            <div className="flex-1">
              <div className="flex items-center mb-6">
                <div className={`w-6 h-6 rounded-full bg-${currentJob.isJobActive==="Active" ? "green-500" : currentJob.isJobActive==="OnHold" ? "yellow-400" : "red-500"}`}>

                </div>
                <span className={`${getStatusColor(currentJob.isJobActive)}`}>
                  {currentJob.isJobActive}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {currentJob.jobTitle}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue-600 text-2xl font-medium">
                  {currentJob.client.clientName}
                </span>
              </div>

              <div className="">
                Posted by{" "}
                <span className="font-semibold">{currentJob.insertedBy}</span>{" "}
                on
                <span className="font-semibold ml-2">
                  {new Date(currentJob.createdOn).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                className="w-28 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={() => setIsJobUpdated(true)}
              >
                <svg
                  className="w-4 h-4 ml-3"
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
                <span>Edit</span>
              </button>
            </div>
            {isJobUpdated && jobId && (
              <Popup onClose={() => setIsJobUpdated(false)}>
                <JobInfoUpdateForm
                  currentJob={currentJob}
                  id={jobId}
                  autoClose={() => {
                    setIsJobUpdated(false);
                  }}
                />
              </Popup>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => onTabChange("jobInfo")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "jobInfo"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Job Info
              </button>
              <button
                onClick={() => onTabChange("jd")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "jd"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                JD Document
              </button>
              <button
                onClick={() => onTabChange("shortlisted")}
                className={`py-2 px-4 border-b-4 font-medium text-sm ${
                  activeTab === "shortlisted"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Shortlisted Candidates
              </button>
            </nav>
          </div>

          {activeTab === "jobInfo" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Job Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="p-4 border border-gray-300">
                    <div className="text-gray-600 text-sm mb-1">Job Code</div>
                    <div className="font-semibold">
                      # {currentJob.jobCode ?? "NA"}
                    </div>
                  </div>
                  <div className="p-4 border border-gray-300">
                    <div className="text-gray-600 text-sm mb-1">
                      Job Locations
                    </div>
                    <div className="font-semibold">
                      {currentJob.jobLocations.length > 0
                        ? currentJob.jobLocations
                            .map(
                              (location: any) => location.state.locationDetails
                            )
                            .join(" | ")
                        : "No Data"}
                    </div>
                  </div>
                  <div className="p-4 border border-gray-300">
                    <div className="text-gray-600 text-sm mb-1">Salary</div>
                    <div className="font-semibold">
                      {currentJob.salaryInCtc ?? "NA"} LPA
                    </div>
                  </div>
                  <div className="p-4 border border-gray-300">
                    <div className="text-gray-600 text-sm mb-1">
                      Experience Required
                    </div>
                    <div className="font-semibold">
                      {currentJob.experience ?? "NA"} YRS
                    </div>
                  </div>
                  <div className="p-4 border border-gray-300">
                    <div className="text-gray-600 text-sm mb-1">
                      Preferred Job Mode
                    </div>
                    <div className="font-semibold">
                      {currentJob.preferredJobMode ?? "NA"}
                    </div>
                  </div>
                  <div className="p-4 border border-gray-300">
                    <div className="text-gray-600 text-sm mb-1">
                      Hiring Type
                    </div>
                    <div className="font-semibold">
                      {currentJob.hiringType ?? "NA"}
                    </div>
                  </div>
                  <div className="p-4 border border-gray-300">
                    <div className="text-gray-600 text-sm mb-1">
                      Placement Type
                    </div>
                    <div className="font-semibold">
                      {currentJob.jobPostType ?? "NA"}
                    </div>
                  </div>
                  <div className="p-4 border border-gray-300">
                    <div className="text-gray-600 text-sm mb-1">
                      No.of Openings
                    </div>
                    <div className="font-semibold">
                      {currentJob.noOfOpenings ?? "NA"}
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h2 className="text-xl font-bold text-blue-600 mb-4">
                    Job Description
                  </h2>

                  <div className="space-y-4">
                    {currentJob.jobDescription && (
                      <div className="mt-8 text-sm">
                        <div
                          className="prose max-w-none" // Use 'prose' class for basic styling of HTML content
                          dangerouslySetInnerHTML={renderSanitizedHtml(
                            currentJob.jobDescription
                          )}
                        />
                      </div>
                    )}
                    {!currentJob.jobDescription && (
                      <div className="flex flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto">
                        <div className="my-6">
                          <Briefcase className="w-20 h-20 text-[#00bcd4]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                          No Job Description Added Yet !
                        </h2>
                        <p className="text-base text-[#888888] text-center">
                          Update Job Info and it will show up here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Required Skills */}
              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-cyan-600">
                    Skills & Domains
                  </h2>
                  <button
                    className="w-28 h-10 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-0.5 rounded"
                    onClick={() => setIsSkillAdded(true)}
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="">
                      <h3 className="font-semibold text-gray-900">
                        Required Skills
                      </h3>

                      {isSkillAdded && (
                        <Popup
                          onClose={() => {
                            setIsSkillAdded(false);
                          }}
                        >
                          <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200 mt-14">
                            <h1 className="text-2xl font-bold text-gray-900 mb-8">
                              Add Skills & Domains
                            </h1>

                            <div className="space-y-8">
                              {/* Skills Section */}
                              <div className="grid grid-cols-1 gap-6">
                                {/* Skills Dropdown */}
                                <div className="space-y-2">
                                  <label className="block text-md font-semibold text-gray-700">
                                    Skills{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors">
                                      <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                      <input
                                        type="text"
                                        value={selectedSkill?.technology}
                                        onChange={(e) => {
                                          setIsSkillDropdownOpen(true);
                                        }}
                                        onFocus={() =>
                                          setIsSkillDropdownOpen(true)
                                        }
                                        placeholder="Type or select a Skill..."
                                        className="w-full outline-none text-gray-900"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setIsSkillDropdownOpen(
                                            !isSkillDropdownOpen
                                          )
                                        }
                                        className="text-gray-400 focus:outline-none"
                                      >
                                        <ChevronDown className="w-5 h-5" />
                                      </button>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pb-4 mt-6">
                                      {jobSkills &&
                                        jobSkills.map((skill, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-2 px-4 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium"
                                          >
                                            <span>{skill.technology}</span>
                                          </div>
                                        ))}
                                    </div>

                                    {isSkillDropdownOpen && (
                                      <div className="absolute top-12 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                                        {/* Filter options based on input */}
                                        {allTech &&
                                          allTech.map((skill, index) => (
                                            <button
                                              key={index}
                                              type="button"
                                              onClick={() => {
                                                setSelectedSkill(skill);
                                                setIsSkillDropdownOpen(false);
                                              }}
                                              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                            >
                                              {skill.technology}
                                            </button>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-md font-semibold text-gray-700">
                                    Domains{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors">
                                      <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                      <input
                                        type="text"
                                        value={selectedDomain?.domainDetails}
                                        onChange={(e) => {
                                          setIsDomainDropdownOpen(true);
                                        }}
                                        onFocus={() =>
                                          setIsDomainDropdownOpen(true)
                                        }
                                        placeholder="Type or select a Domain..."
                                        className="w-full outline-none text-gray-900"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setIsDomainDropdownOpen(
                                            !isDomainDropdownOpen
                                          )
                                        }
                                        className="text-gray-400 focus:outline-none"
                                      >
                                        <ChevronDown className="w-5 h-5" />
                                      </button>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pb-4 mt-6">
                                      {jobDomains &&
                                        jobDomains.map((domain, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-2 px-4 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium"
                                          >
                                            <span>{domain.domainDetails}</span>
                                          </div>
                                        ))}
                                    </div>

                                    {isDomainDropdownOpen && (
                                      <div className="absolute top-12 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                                        {/* Filter options based on input */}
                                        {allDomain &&
                                          allDomain.map((domain, index) => (
                                            <button
                                              key={index}
                                              type="button"
                                              onClick={() => {
                                                setSelectedDomain(domain);
                                                setIsDomainDropdownOpen(false);
                                              }}
                                              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                            >
                                              {domain.domainDetails}
                                            </button>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-4 pt-4 justify-end">
                                <button
                                  className="flex-1 sm:flex-none sm:px-8 py-2 bg-white border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-100 transition-colors duration-200 font-medium"
                                  onClick={() => {
                                    setIsSkillAdded(false);
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
                                  onClick={postSkillDomain}
                                >
                                  Add
                                </button>
                              </div>
                            </div>

                            <style jsx>{`
                              .slider::-webkit-slider-thumb {
                                appearance: none;
                                width: 24px;
                                height: 24px;
                                background: #06b6d4;
                                border-radius: 50%;
                                cursor: pointer;
                                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                              }

                              .slider::-moz-range-thumb {
                                width: 24px;
                                height: 24px;
                                background: #06b6d4;
                                border-radius: 50%;
                                cursor: pointer;
                                border: none;
                                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                              }
                            `}</style>
                          </div>
                        </Popup>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 border-b border-gray-300 pb-4 mt-6">
                      {jobSkills &&
                        jobSkills.map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium"
                          >
                            <span>{skill.technology}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">
                        Required Domains
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-4 border-b border-gray-300 pb-4 mt-6">
                      {jobDomains &&
                        jobDomains.map((domain, index) => (
                          <div
                            className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium"
                            key={index}
                          >
                            <span>{domain.domainDetails}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "jd" && (
            <section id="jd" className="rounded-lg shadow-sm space-y-4">
              {/* <h3 className="font-semibold text-cyan-500 text-sm  md:text-xl">
                Job Description
              </h3> */}
              <PdfViewer
                isEdit={true}
                isJd
                candidateId={Number(router.query.id)}
                resume={currentJob.jd ? currentJob.jd : ""}
              ></PdfViewer>
            </section>
          )}

          {activeTab === "shortlisted" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {shortlisted &&
                shortlisted.map((candidate, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-black rounded-md border border-gray-300 p-4 shadow-sm shadow-gray-300 hover:shadow-slate-400 hover:shadow-2xl transition-shadow relative"
                    >
                      <div className="flex justify-end">
                        <span
                          className={`px-2 py-1 h-6 rounded text-xs font-medium ${
                            candidate.contactDetails?.isActive
                              ? "bg-green-300 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {candidate.contactDetails?.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <p
                          className={`text-sm font-light   ${
                            candidate.interviewStatus == "Scheduled"
                              ? "text-white py-0.5 px-2 bg-yellow-400 rounded-md"
                              : candidate.interviewStatus == "Rejected"
                              ? "text-white py-0.5 px-2 bg-red-500 rounded-md"
                              : candidate.interviewStatus == "Done"
                              ? "text-white py-0.5 px-2 bg-blue-500 rounded-md"
                              : candidate.interviewStatus == "Passed"
                              ? "text-white py-0.5 px-2 bg-green-500 rounded-md"
                              : "text-white py-0.5 px-2 bg-gray-500 rounded-md"
                          }`}
                        >
                          {candidate.interviewStatus}
                        </p>
                      </div>
                      {/* Status Badge and Menu */}
                      <div className="flex justify-center">
                        <div className="text-center mb-3">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-100">
                            <span className="text-white font-semibold text-xl">
                              {candidate.contactDetails?.firstName.charAt(0)}
                              {candidate.contactDetails?.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Name and Title */}
                      <div className="">
                        <div
                          className="text-center mb-4 border-b border-gray-300 cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/candidates/${candidate.contactDetails?.contactId}`
                            )
                          }
                        >
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {candidate.contactDetails?.firstName}{" "}
                            {candidate.contactDetails?.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {candidate.contactDetails?.designation}
                            <span className="text-blue-500 text-sm font-semibold">
                              {" "}
                              ({candidate.contactDetails?.totalExperience} YRS)
                            </span>
                          </p>
                          <h3 className="text-md text-cyan-500 mb-1">
                            {candidate.contactDetails?.companyName}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Education/Tech Role */}
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">
                            {candidate.contactDetails?.highestEducation}(
                            {candidate.contactDetails?.techRole})
                          </span>
                        </div>

                        {/* Location */}
                        {candidate.contactDetails?.currentLocation
                          .locationDetails && (
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                              <svg fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-700">
                              {
                                candidate.contactDetails?.currentLocation
                                  .locationDetails
                              }
                            </span>
                          </div>
                        )}

                        {/* Email */}
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700 break-all">
                            {candidate.contactDetails?.emailId}
                          </span>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">
                            {candidate.contactDetails?.primaryNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          href={{
                            pathname: `/candidates/${candidate?.contactDetails?.contactId}/interviews/${candidate?.clientJob?.jobId}`,
                            query: {
                              contactInterViewId: candidate?.interviewId,
                            },
                          }}
                        >
                          <button className="px-2 py-0.5 bg-cyan-500 text-white rounded hover:bg-cyan-600">
                            View Rounds
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}

              {!shortlisted && (
                <div className="flex col-span-3 my-6 flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto">
                  <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full border-2 border-[#a0d9f7] bg-white">
                    <User className="w-12 h-12 text-[#00bcd4]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                    No Candidates Shortlisted Yet!
                  </h2>
                  <p className="text-base text-[#888888] text-center mb-6">
                    Sortlist a Candidate and it will show up here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
