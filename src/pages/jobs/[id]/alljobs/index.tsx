import { createContactInterview } from "@/api/candidates/interviews";
import { fetchAllJobs } from "@/api/client/clientJob";
import JobCard from "@/components/Elements/cards/jobCard";
import ContentHeader from "@/components/Layouts/content-header";
import MainLayout from "@/components/Layouts/layout";
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  User,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AllJobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [contactId, setContactId] = useState(0);
  const router = useRouter();

  const handleAssignJob = (jobId: number) => {
    try {
      createContactInterview({
        interviewStatus: "Scheduled",
        clientJob: {
          jobId: jobId,
        },
        contactDetails: {
          contactId: contactId,
        },
        interviewDate: new Date().toISOString().split('T')[0],
      }).then((data) => {
        if (
          data.message ===
          "The combination of contact ID and jobId ID already exists."
        ) {
          toast.error("Interview already scheduled", {
            position: "top-right",
          });
        } else {
          console.log(data);
          toast.success("Interview scheduled successfully", {
            position: "top-right",
          });
          setTimeout(() => {
            router.push({
              pathname: `/candidates/${contactId}/interviews/${jobId}`,
              query: { contactInterViewId: data.interviewId },
            });
          }, 1000);
        }
      });
    } catch (err: any) {
      toast.error(err.message, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    try {
      fetchAllJobs(0, 100).then((data) => {
        setAllJobs(data.content);
        console.log(data);
      });
      const candidateId = localStorage.getItem("interviewCandidateId");
      setContactId(Number(candidateId));
    } catch (err: any) {
      toast.error(err.message, {
        position: "top-right",
      });
    }
  }, []);

  return (
    <MainLayout>
      <ContentHeader title="All Jobs"></ContentHeader>
      <div>
        <div
          className={
            allJobs?.length > 0
              ? "grid grid-cols-1 text-xs md:text-base md:grid-cols-3 gap-6 mt-4"
              : "py-2"
          }
        >
          {allJobs?.length > 0 ? (
            allJobs.map((job: any, index: any) => (
              // <div className="border border-gray-200 rounded-xl p-6">
              //   <div className="flex justify-between items-start mb-4">
              //     <div>
              //       <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              //         {job.jobTitle || "Untitled Position"}
              //       </h2>
              //       <div className="flex items-center mt-1 text-gray-600 dark:text-white">
              //         <Tag className="h-4 w-4 mr-1" />
              //         <span className="text-sm mr-3">{job.jobCode}</span>
              //         <span
              //           className={`text-xs px-2 py-1 rounded-full ${
              //             job.isJobActive === "Active"
              //               ? "bg-green-100 text-green-800"
              //               : "bg-red-100 text-red-800"
              //           }`}
              //         >
              //           {job.isJobActive}
              //         </span>
              //       </div>
              //     </div>
              //     <div className="text-right">
              //       <div className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              //         <DollarSign className="h-5 w-5 mr-1 text-gray-600 dark:text-white" />
              //         {job.salaryInCtc} LPA
              //       </div>
              //       <span className="text-sm text-gray-500 dark:text-white">
              //         CTC
              //       </span>
              //     </div>
              //   </div>

              //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              //     <div className="flex items-center text-gray-700">
              //       <Briefcase className="h-5 w-5 mr-2 text-gray-500 dark:text-white" />
              //       <div>
              //         <div className="text-sm font-medium dark:bg-black dark:text-white">
              //           Experience Required
              //         </div>
              //         <div className="dark:bg-black dark:text-white">
              //           {job.experience}{" "}
              //           {job.experience === 1 ? "Year" : "Years"}
              //         </div>
              //       </div>
              //     </div>

              //     <div className="flex items-center text-gray-700">
              //       <User className="h-5 w-5 mr-2 text-gray-500 dark:text-white" />
              //       <div>
              //         <div className="text-sm font-medium dark:bg-black dark:text-white">
              //           Posted By
              //         </div>
              //         <div className="dark:bg-black dark:text-white">
              //           {job.insertedBy}
              //         </div>
              //       </div>
              //     </div>

              //     <div className="flex items-center text-gray-700">
              //       <Calendar className="h-5 w-5 mr-2 text-gray-500 dark:text-white" />
              //       <div>
              //         <div className="text-sm font-medium dark:bg-black dark:text-white">
              //           Created On
              //         </div>
              //         <div className="dark:bg-black dark:text-white">
              //           {formatDate(job.createdOn)}
              //         </div>
              //       </div>
              //     </div>

              //     <div className="flex items-center text-gray-700">
              //       <Clock className="h-5 w-5 mr-2 text-gray-500 dark:text-white" />
              //       <div>
              //         <div className="text-sm font-medium dark:bg-black dark:text-white">
              //           Job Post Type
              //         </div>
              //         <div className="dark:bg-black dark:text-white">
              //           {job.jobPostType}
              //         </div>
              //       </div>
              //     </div>
              //   </div>
              //   <div className="flex mt-4 justify-end">
              //     <button
              //       className="bg-blue-500 text-white px-4 py-1 rounded-md"
              //       onClick={() => {
              //         handleAssignJob(job.jobId);
              //       }}
              //     >
              //       Assign
              //     </button>
              //   </div>
              // </div>
              <JobCard job={job} isClient></JobCard>
            ))
          ) : (
            <div>
              <p>No Active Jobs</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
