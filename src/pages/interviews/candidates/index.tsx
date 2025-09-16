import MainLayout from "@/components/Layouts/layout";
import ContentHeader from "@/components/Layouts/content-header";
import { ResultCard } from "@/components/Elements/cards/resultCard";
import { useEffect, useState } from "react";
import { store } from "@/Features/Store";
import { fetchCandidates, searchCandidates } from "@/api/candidates/candidates";
import { Candidate } from "@/lib/definitions";
import { UserPlus } from "lucide-react";
import AddNewCandidate from "@/components/Forms/candidates/AddNewCandidate";
export default function InterviewRoundCandidates() {
  const [results, setResults] = useState<any>();
  const [pageNo, setpageNo] = useState(0);
  const [allPages, setAllPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageElements, setPageElements] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    try {
      fetchCandidates(pageNo)
        .then((data) => {
          if (data) {
            setResults(data.content);
            setAllPages(data.totalPages);
            setCurrentPage(data.pageNumber);
            setTotalElements(data.totalElements);
            setPageElements(data.content.length);
          }else{
            console.log(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }, [pageNo]);

  const handlePageChange = (newPage: number) => {
    setpageNo(newPage);
  };

  return (
    <MainLayout>
      <ContentHeader title="All Candidates" />
      <ResultCard candidateData={results}></ResultCard>
      {/* Pagination */}
      {results && (
        <div className="flex justify-center gap-4 items-center mt-4 pr-4">
          <div className="flex items-center justify-between mt-8">
            
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => {
                  handlePageChange(currentPage - 1);
                }}
                disabled={currentPage === 0}
                className={`px-3 py-1 text-sm ${
                  currentPage === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {"<"}
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, allPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
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

              {/* Ellipsis for many pages */}
              {allPages > 5 && (
                <>
                  <span className="px-2 text-sm text-gray-500">...</span>
                  <button
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === allPages - 1
                        ? "bg-blue-500 text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {allPages}
                  </button>
                </>
              )}

              {/* Next Button */}
              <button
                onClick={() => {
                  handlePageChange(currentPage + 1);
                }}
                disabled={currentPage === allPages - 1}
                className={`px-3 py-1 text-sm ${
                  currentPage === allPages - 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
