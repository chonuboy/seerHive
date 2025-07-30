import { Building2, Briefcase, DollarSign, Clock, TrendingUp, CheckCheck, CheckCircle2 } from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

const clientData = [
  { name: "Tech Corp", projects: 12, revenue: 450000, status: "Active" },
  { name: "StartupXYZ", projects: 8, revenue: 280000, status: "Active" },
  { name: "Enterprise Ltd", projects: 15, revenue: 620000, status: "Active" },
  { name: "Innovation Inc", projects: 6, revenue: 180000, status: "On Hold" },
]

const projectStatusData = [
  { name: "Active", value: 45, color: "#10b981" },
  { name: "Planning", value: 23, color: "#3b82f6" },
  { name: "On Hold", value: 12, color: "#f59e0b" },
  { name: "Completed", value: 67, color: "#6b7280" },
]

const revenueData = [
  { month: "Jan", revenue: 4200, projects: 38 },
  { month: "Feb", revenue: 3800, projects: 42 },
  { month: "Mar", revenue: 5200, projects: 45 },
  { month: "Apr", revenue: 4800, projects: 41 },
  { month: "May", revenue: 5900, projects: 48 },
  { month: "Jun", revenue: 6500, projects: 52 },
]

const industryData = [
  { industry: "Technology", count: 28, color: "#3b82f6" },
  { industry: "Finance", count: 22, color: "#10b981" },
  { industry: "Healthcare", count: 18, color: "#f59e0b" },
  { industry: "Retail", count: 15, color: "#8b5cf6" },
  { industry: "Manufacturing", count: 12, color: "#ef4444" },
]

const projectTypes = [
  { type: "Web Development", count: 34, duration: "3-6 months" },
  { type: "Mobile Apps", count: 28, duration: "4-8 months" },
  { type: "Data Analytics", count: 22, duration: "2-4 months" },
  { type: "Cloud Migration", count: 18, duration: "6-12 months" },
]

export default function ClientProjectDashboard() {
  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <Building2 className="h-4 w-4 mr-2" />
            Add Client
          </button>
          <button className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Briefcase className="h-4 w-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">156</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8 new this month
                </div>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">89</p>
                <p className="text-xs text-gray-600 mt-2">23 starting this month</p>
              </div>
              <Briefcase className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Closures</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">20</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Closures</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">20</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% from last month
                </div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue & Project Trends</h3>
            <p className="text-sm text-gray-600 mb-4">Monthly revenue and project count over time</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Status Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">Current status of all projects</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {projectStatusData.map((item, index) => (
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

      {/* Client Overview & Industry Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Clients</h3>
            <p className="text-sm text-gray-600 mb-4">Clients by project count and revenue</p>
            <div className="space-y-4">
              {clientData.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.projects} active projects</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${(client.revenue / 1000).toFixed(0)}K</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        client.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">Clients by industry sector</p>
            <div className="space-y-4">
              {industryData.map((industry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: industry.color }} />
                    <span className="text-sm font-medium text-gray-900">{industry.industry}</span>
                  </div>
                  <span className="text-sm text-gray-600">{industry.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Types */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Types & Duration</h3>
          <p className="text-sm text-gray-600 mb-4">Most common project types and their typical duration</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projectTypes.map((type, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 mb-1">{type.count}</div>
                <div className="text-sm font-medium text-gray-700 mb-1">{type.type}</div>
                <div className="text-xs text-gray-500 mb-3">Avg: {type.duration}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(type.count / 34) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
