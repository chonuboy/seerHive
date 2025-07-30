import { fetchAllJobs } from "@/api/client/clientJob";
import JobCard from "@/components/Elements/cards/jobCard";
import ContentHeader from "@/components/Layouts/content-header";
import MainLayout from "@/components/Layouts/layout";
import { Briefcase, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const AllJobs = () => {
  const [allJobs, setAllJobs] = useState<any[]|null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []); // Empty dependency array to run once

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchAllJobs();
      if (Array.isArray(data)) {
        setAllJobs(data);
        console.log(data);
      } else {
        setAllJobs([]); // Fallback to empty array if data is invalid
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs. Please try again.");
      setAllJobs([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <ContentHeader title="All Jobs" />
         <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">Loading</span>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ContentHeader title="All Jobs" />
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-red-200 flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Jobs</h2>
          <p className="text-gray-500 text-center mb-8 max-w-sm">{error}</p>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!Array.isArray(allJobs) || allJobs.length === 0) {
    return (
      <MainLayout>
        <ContentHeader title="All Jobs" />
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Jobs Found</h2>
          <p className="text-gray-500 text-center mb-8 max-w-sm">
            Create a job Under a Client, and it will show up here.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ContentHeader title="All Jobs" />
      <div className="grid grid-cols-1 text-xs md:text-base md:grid-cols-3 gap-6 mt-4">
        {allJobs.map((job, index) => (
          <JobCard onUpdate={fetchJobs} job={job} key={index} />
        ))}
      </div>
    </MainLayout>
  );
};

export default AllJobs;