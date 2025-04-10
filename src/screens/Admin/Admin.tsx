import { useState } from "react";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import DashboardMainContainer from "./Dashboard/DashboardMainContainer";
import ProjectsMainContainer from "./Projects/ProjectsMainContainer";
import AttendanceMainContainer from "./Attendance/AttendanceMainContainer";
import SettingMainContainer from "./Setting/SettingMainContainer";

export default function ProjectDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Projects");

  // Toggle sidebar for mobile responsiveness
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Handle menu item click
  const handleMenuClick = (menuItem: any) => {
    setActiveMenu(menuItem);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Mobile menu button - right aligned and only visible below md */}
      <button
        className="block md:hidden fixed top-4 right-4 z-50 bg-green-500 p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar - relative by default, fixed on md screens */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transform transition-transform duration-300 
        relative md:fixed z-40 w-64 bg-green-500 h-full flex flex-col
      `}>
        {/* Logo */}
        <div className="p-4 pb-8">
          <div className="bg-white rounded-full py-2 px-4 inline-block">
            <span className="font-bold text-green-500">eProjEx</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-1">
          <div
            className={`${activeMenu === "Dashboard" ? "bg-green-700" : "hover:bg-green-600"} 
              transition-colors duration-200 rounded-md py-2 px-4 mx-4 mb-2 cursor-pointer`}
            onClick={() => handleMenuClick("Dashboard")}
          >
            <span className="text-white">Dashboard</span>
          </div>
          <div
            className={`${activeMenu === "Projects" ? "bg-green-700" : "hover:bg-green-600"} 
              transition-colors duration-200 rounded-md py-2 px-4 mx-4 mb-2 cursor-pointer`}
            onClick={() => handleMenuClick("Projects")}
          >
            <span className="text-white">Projects</span>
          </div>
          <div
            className={`${activeMenu === "Attendance" ? "bg-green-700" : "hover:bg-green-600"} 
              transition-colors duration-200 rounded-md py-2 px-4 mx-4 mb-2 cursor-pointer`}
            onClick={() => handleMenuClick("Attendance")}
          >
            <span className="text-white">Attendance</span>
          </div>
          <div
            className={`${activeMenu === "Settings" ? "bg-green-700" : "hover:bg-green-600"} 
              transition-colors duration-200 rounded-md py-2 px-4 mx-4 mb-2 cursor-pointer`}
            onClick={() => handleMenuClick("Settings")}
          >
            <span className="text-white">Settings</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <button className="bg-white text-red-500 rounded-md py-2 px-4 w-full hover:bg-gray-100 transition-colors duration-200">
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4 md:p-6 overflow-auto ml-0 md:ml-64">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-900">{activeMenu}</h2>
        </div>



        {activeMenu === "Dashboard" && (
          <DashboardMainContainer />
        )}

        {activeMenu === "Projects" && (
          // <>
          //   {/* Pie Charts Row */}
          //   <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
          //     {/* eGov Project */}
          //     <div
          //       className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center cursor-pointer"
          //       onClick={() => setActiveProject("eGov")}
          //     >
          //       <div className="w-40 h-40">
          //         <ResponsiveContainer width="100%" height="100%">
          //           <PieChart>
          //             <Pie
          //               data={pieData}
          //               cx="50%"
          //               cy="50%"
          //               innerRadius={30}
          //               outerRadius={60}
          //               fill="#8884d8"
          //               paddingAngle={5}
          //               dataKey="value"
          //             >
          //               {pieData.map((entry, index) => (
          //                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          //               ))}
          //             </Pie>
          //             <Tooltip />
          //           </PieChart>
          //         </ResponsiveContainer>
          //       </div>
          //       <span className="mt-2 font-medium">eGov</span>
          //     </div>

          //     {/* eLGU Project */}
          //     <div
          //       className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center cursor-pointer"
          //       onClick={() => setActiveProject("eLGU")}
          //     >
          //       <div className="w-40 h-40">
          //         <ResponsiveContainer width="100%" height="100%">
          //           <PieChart>
          //             <Pie
          //               data={pieData.map(item => ({ ...item, value: item.value * 0.8 }))}
          //               cx="50%"
          //               cy="50%"
          //               innerRadius={30}
          //               outerRadius={60}
          //               fill="#8884d8"
          //               paddingAngle={5}
          //               dataKey="value"
          //             >
          //               {pieData.map((entry, index) => (
          //                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          //               ))}
          //             </Pie>
          //             <Tooltip />
          //           </PieChart>
          //         </ResponsiveContainer>
          //       </div>
          //       <span className="mt-2 font-medium">eLGU</span>
          //     </div>

          //     {/* Other Project */}
          //     <div
          //       className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center cursor-pointer"
          //       onClick={() => setActiveProject("Other")}
          //     >
          //       <div className="w-40 h-40">
          //         <ResponsiveContainer width="100%" height="100%">
          //           <PieChart>
          //             <Pie
          //               data={pieData.map(item => ({ ...item, value: item.value * 0.6 }))}
          //               cx="50%"
          //               cy="50%"
          //               innerRadius={30}
          //               outerRadius={60}
          //               fill="#8884d8"
          //               paddingAngle={5}
          //               dataKey="value"
          //             >
          //               {pieData.map((entry, index) => (
          //                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          //               ))}
          //             </Pie>
          //             <Tooltip />
          //           </PieChart>
          //         </ResponsiveContainer>
          //       </div>
          //       <span className="mt-2 font-medium">Other Project</span>
          //     </div>
          //   </div>

          //   {/* Line Chart */}
          //   <div className="bg-white p-4 mb-6 rounded-lg shadow-md">
          //     <h3 className="text-lg font-medium mb-4">Project Expenses Over Time</h3>
          //     <div className="h-64">
          //       <ResponsiveContainer width="100%" height="100%">
          //         <LineChart
          //           data={lineData}
          //           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          //         >
          //           <CartesianGrid strokeDasharray="3 3" />
          //           <XAxis dataKey="month" />
          //           <YAxis />
          //           <Tooltip />
          //           <Legend />
          //           <Line type="monotone" dataKey="eGov" stroke="#0088FE" activeDot={{ r: 8 }} />
          //           <Line type="monotone" dataKey="eLGU" stroke="#00C49F" />
          //           <Line type="monotone" dataKey="other" stroke="#FFBB28" />
          //         </LineChart>
          //       </ResponsiveContainer>
          //     </div>
          //   </div>

          //   {/* Table */}
          //   <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          //     <h3 className="text-lg font-medium mb-4">Project Summary</h3>
          //     <table className="min-w-full">
          //       <thead>
          //         <tr className="bg-gray-100">
          //           <th className="py-2 px-4 text-left">Project</th>
          //           <th className="py-2 px-4 text-left">Client</th>
          //           <th className="py-2 px-4 text-left">Status</th>
          //           <th className="py-2 px-4 text-left">Completion</th>
          //         </tr>
          //       </thead>
          //       <tbody>
          //         {tableData.map(item => (
          //           <tr
          //             key={item.id}
          //             className="border-b hover:bg-gray-50 cursor-pointer transition-colors duration-150"
          //             onClick={() => setActiveProject(item.project)}
          //           >
          //             <td className="py-3 px-4">{item.project}</td>
          //             <td className="py-3 px-4">{item.client}</td>
          //             <td className="py-3 px-4">
          //               <span className={`px-2 py-1 rounded-full text-xs ${item.status === "In Progress" ? "bg-blue-100 text-blue-800" :
          //                 item.status === "On Track" ? "bg-green-100 text-green-800" :
          //                   "bg-red-100 text-red-800"
          //                 }`}>
          //                 {item.status}
          //               </span>
          //             </td>
          //             <td className="py-3 px-4">{item.completion}</td>
          //           </tr>
          //         ))}
          //       </tbody>
          //     </table>
          //   </div>
          // </>
          <ProjectsMainContainer />
        )}

        {activeMenu === "Attendance" && (
          <AttendanceMainContainer />
        )}

        {activeMenu === "Settings" && (
          <SettingMainContainer />
        )}
      </div>
    </div>
  );
}