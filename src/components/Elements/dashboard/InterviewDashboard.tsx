import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useRouter } from "next/router";

const interviewStats = [
  { status: "Scheduled", count: 45, color: "#3b82f6" },
  { status: "Completed", count: 128, color: "#10b981" },
  { status: "Cancelled", count: 12, color: "#ef4444" },
  { status: "Re-Scheduled", count: 8, color: "#d7e02c" },
];

const weeklyInterviews = [
  { day: "Mon", scheduled: 12, completed: 10, cancelled: 1, noShow: 1 },
  { day: "Tue", scheduled: 15, completed: 13, cancelled: 1, noShow: 1 },
  { day: "Wed", scheduled: 18, completed: 16, cancelled: 1, noShow: 1 },
  { day: "Thu", scheduled: 14, completed: 12, cancelled: 1, noShow: 1 },
  { day: "Fri", scheduled: 16, completed: 14, cancelled: 1, noShow: 1 },
];

const todayInterviews = [
  {
    time: "09:00 AM",
    candidate: "Sarah Johnson",
    position: "Senior Developer",
    interviewer: "John Smith",
    type: "Technical",
    status: "scheduled",
    initials: "SJ",
  },
  {
    time: "10:30 AM",
    candidate: "Michael Chen",
    position: "Product Manager",
    interviewer: "Emily Davis",
    type: "Behavioral",
    status: "completed",
    initials: "MC",
  },
  {
    time: "02:00 PM",
    candidate: "Lisa Wang",
    position: "UX Designer",
    interviewer: "David Wilson",
    type: "Portfolio Review",
    status: "scheduled",
    initials: "LW",
  },
  {
    time: "03:30 PM",
    candidate: "Robert Brown",
    position: "Data Analyst",
    interviewer: "Anna Taylor",
    type: "Technical",
    status: "scheduled",
    initials: "RB",
  },
];

export default function InterviewDashboard() {

  const router = useRouter();
  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          {/* <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </button> */}
          <button className="flex items-center px-4 py-2 text-sm bg-cyan-500 text-white rounded-md hover:bg-cyan-600" onClick={()=>{router.push("/search")}}>
            <Users className="h-4 w-4 mr-2" />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Interviews
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">8</p>
                <p className="text-xs text-gray-600 mt-2">
                  4 completed, 4 scheduled
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">75</p>
                <p className="text-xs text-green-600 mt-2">
                  65 completed successfully
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">73%</p>
                <p className="text-xs text-green-600 mt-2">
                  +4% from last month
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Duration
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">52 min</p>
                <p className="text-xs text-gray-600 mt-2">
                  3 min shorter than avg
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Weekly Interview Activity
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Interview outcomes by day of the week
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyInterviews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scheduled" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Interview Status Distribution
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Overall interview status breakdown
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={interviewStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {interviewStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Today's Interview Schedule
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upcoming and completed interviews for today
          </p>
          <div className="space-y-4">
            {todayInterviews.map((interview, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-900 w-20">
                    {interview.time}
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {interview.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {interview.candidate}
                    </p>
                    <p className="text-sm text-gray-500">
                      {interview.position}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{interview.type}</p>
                  <p className="text-xs text-gray-500">
                    with {interview.interviewer}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    interview.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {interview.status === "completed" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {interview.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
