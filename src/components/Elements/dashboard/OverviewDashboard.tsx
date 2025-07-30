import { Users, Briefcase, TrendingUp, Calendar, DollarSign, MonitorUp, MoveUpRight, User } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const monthlyData = [
  { month: "Jan", hires: 12, interviews: 45},
  { month: "Feb", hires: 19, interviews: 52},
  { month: "Mar", hires: 15, interviews: 48},
  { month: "Apr", hires: 22, interviews: 61},
  { month: "May", hires: 18, interviews: 55},
  { month: "Jun", hires: 25, interviews: 68},
]

const statusData = [
  { name: "Hired", value: 45, color: "#10b981" },
  { name: "WaitListed", value: 23, color: "#f59e0b" },
  { name: "On Hold", value: 12, color: "#6b7280" },
  { name: "Shortlisted", value: 67, color: "#3b82f6" },
  { name:"Rejected",value: 20, color: "#ef4444" },
]

export default function OverviewDashboard() {
  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between">

      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">1,247</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Candidates</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">589</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from last month
                </div>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Interviews</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">15</p>
                <div className="flex items-center mt-2 text-xs text-amber-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  This week: 42
                </div>
              </div>
              <Calendar className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hired</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">45</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </div>
              </div>
              <MoveUpRight className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Hiring Trends</h3>
            <p className="text-sm text-gray-600 mb-4">Hires, interviews over the past 6 months</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="hires" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interviews" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Stats</h3>
            <p className="text-sm text-gray-600 mb-4">Current status of all Interviews in the system</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Quarterly Hiring Goal</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">74/100</span>
            <span className="text-sm text-gray-500">74%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "74%" }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">26 more hires needed</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Client Satisfaction</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">4.8/5.0</span>
            <span className="text-sm text-gray-500">96%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "96%" }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Based on 234 reviews</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Employee Utilization</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">892/1247</span>
            <span className="text-sm text-gray-500">71%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "71%" }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">355 available for projects</p>
        </div>
      </div> */}
    </div>
  )
}
