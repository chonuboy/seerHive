import { useEffect, useState } from "react";
import { Interview } from "@/lib/models/candidate";
import { fetchAllContactInterviews } from "@/api/candidates/interviews";
import { useRouter } from "next/router";
import MainLayout from "@/components/Layouts/layout";
import Link from "next/link";
import ContentHeader from "@/components/Layouts/content-header";
import { IndianRupee, Route, UserCog, Calendar } from "lucide-react";

export default function AllInterviews() {
  const [allInterviews, setAllInterviews] = useState<Interview[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      setIsLoading(true);
      fetchAllContactInterviews().then((data) => {
        setAllInterviews(data);
        console.log(data);
        setIsLoading(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-between mb-4 items-center">
          <ContentHeader title="All Interviews"></ContentHeader>
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg flex items-center transition-colors duration-200 flex-grow"
            onClick={() => router.push("/interviews/candidates")}
          >
            Schedule Interview
          </button>
        </div>
        <div className="flex justify-center items-center h-64">
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
      <div className="flex justify-between mb-4 items-center">
        <ContentHeader title="All Interviews"></ContentHeader>
        <button
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          onClick={() => router.push("/interviews/candidates")}
        >
          Schedule Interview
        </button>
      </div>

      {allInterviews && allInterviews.length === 0 ? (
        // Fallback screen when no interviews
        <div className="flex flex-col items-center justify-center rounded-lg w-full max-w-md mx-auto py-12">
          <div className="mb-6">
            <Calendar className="w-20 h-20 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            No Interviews Scheduled Yet!
          </h2>
          <p className="text-base text-gray-600 text-center mb-4">
            Schedule interviews and they will show up here
          </p>
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
            onClick={() => router.push("/interviews/candidates")}
          >
            Schedule Interview
          </button>
        </div>
      ) : (
        // Interviews grid when interviews exist
        <div>
          <section className="">
            <div
              id="interviews"
              className="grid grid-cols-1 md:grid-cols-3 dark:bg-black gap-6"
            >
              {allInterviews?.map((item, index) => {
                // Null checks for nested properties
                const clientName =
                  item.clientJob?.client?.clientName || "Unknown Client";
                const jobTitle = item.clientJob?.jobTitle || "No Job Title";
                const salary = item.clientJob?.salaryInCtc || "Not specified";
                const jobPostType =
                  item.clientJob?.jobPostType || "Not specified";
                const jobMode =
                  item.clientJob?.clientJob?.preferredJobMode || "Remote";
                const experience =
                  item.clientJob?.experience || "Not specified";

                return (
                  <div
                    key={index}
                    className="transform transition-all max-w-2xl duration-300 rounded-lg hover:shadow-xl bg-white"
                  >
                    <div className="border border-gray-300 rounded-lg p-6 relative">
                      {/* Header Section */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <UserCog className="w-6 h-6 text-cyan-600 font-semibold"></UserCog>
                          <p className="text-xl font-bold">
                            {item.contactDetails?.firstName +
                              "" +
                              item.contactDetails?.lastName}
                          </p>
                        </div>
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
                            className={`text-md w-20 capitalize font-semibold ${
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

                      <h3 className="text-blue-500 font-medium text-lg">
                        {clientName}
                      </h3>

                      {/* Job Details and View Rounds Button */}
                      <div className="grid grid-rows-2 grid-cols-2 mt-6 gap-4 border-b pb-4 text-gray-500">
                        {/* Job Details */}
                        <div className="flex items-center space-x-2">
                          <Route className="w-4 h-4 text-cyan-600 font-semibold"></Route>
                          <span>{jobPostType}</span>
                        </div>

                        {/* Job Title */}
                        <div className="flex items-center gap-2">
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
                          <h2>{jobTitle}</h2>
                        </div>

                        {/* Salary */}
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-cyan-600"></IndianRupee>
                          {salary} LPA
                        </div>

                        <div className="flex items-center space-x-2 ">
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
                          <span>{jobMode}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-cyan-600"
                            viewBox="0 0 100 100"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="currentColor"
                              opacity="0.2"
                            />
                            <path
                              d="M50 25v25l15 10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                          </svg>
                          <span>{experience} YRS</span>
                        </div>
                      </div>

                      {/* View Rounds Button - Only show if interviewId exists */}
                      {item.interviewId && (
                        <div className="mt-6 flex justify-end">
                          <Link
                            href={{
                              pathname: `/candidates/${Number(
                                item?.contactDetails?.contactId
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
          </section>
        </div>
      )}
    </MainLayout>
  );
}
