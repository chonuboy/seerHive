import { fetchAllJobs } from "@/api/client/clientJob";
import JobCard from "@/components/Elements/cards/jobCard";
import ContentHeader from "@/components/Layouts/content-header";
import MainLayout from "@/components/Layouts/layout";
import { Briefcase, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AllJobs = () => {
  const [allJobs, setAllJobs] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resetEntries, setResetEntries] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchJobs();
  }, []); // Empty dependency array to run once

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    try {
      setLoading(true);
      const data = await fetchAllJobs(newPage, 12);
      if (Array.isArray(data.content)) {
        setAllJobs(data.content);
        setTotalElements(data.totalElements);
        setResetEntries(data.content.length);
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

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchAllJobs(currentPage, resetEntries);
      if (Array.isArray(data.content)) {
        setAllJobs(data.content);
        setTotalElements(data.totalElements);
        setResetEntries(data.content.length);
        setTotalPages(data.totalPages);
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

  const handleEntriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      const numValue =
        value === "" ? 1 : Math.min(100, Math.max(1, parseInt(value, 10)));
      setResetEntries(numValue);
    }
  };

  const handleEntriesKeyDown = async(e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (resetEntries > totalElements) {
        toast.error("Cannot set entries more than total elements", {
          position: "top-center",
        });
        return;
      }

      setLoading(true);
      try {
      setLoading(true);
      const data = await fetchAllJobs(currentPage, resetEntries);
      if (Array.isArray(data.content)) {
        setAllJobs(data.content);
        setTotalElements(data.totalElements);
        setResetEntries(data.content.length);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Jobs
          </h2>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Jobs Found
          </h2>
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
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-500">
          Showing
          <input
            type="number"
            min={1}
            max={totalElements}
            value={resetEntries}
            onChange={handleEntriesChange}
            onKeyDown={handleEntriesKeyDown}
            className="w-14 px-2 mx-2 py-1 border rounded focus:border-cyan-500"
          />
          of {totalElements} entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`px-3 py-1 text-sm ${
              currentPage === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {"<"}
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber - 1)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === pageNumber - 1
                    ? "bg-cyan-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {totalPages > 5 && (
            <>
              <span className="px-2 text-sm text-gray-500">...</span>
              <button
                onClick={() => handlePageChange(totalPages - 1)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === totalPages - 1
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className={`px-3 py-1 text-sm ${
              currentPage === totalPages - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {">"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AllJobs;
