import { useState } from "react";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import DashboardMainContainer from "./Dashboard/DashboardMainContainer";
import ProjectsMainContainer from "./Projects/ProjectsMainContainer";
import AttendanceMainContainer from "./Attendance/AttendanceMainContainer";
import SettingMainContainer from "./Setting/SettingMainContainer";
import EmployeeMainContainer from "./Employees/EmployeeMainContainer";

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
            className={`${activeMenu === "Attendance" ? "bg-green-700" : "hover:bg-green-600"} 
              transition-colors duration-200 rounded-md py-2 px-4 mx-4 mb-2 cursor-pointer`}
            onClick={() => handleMenuClick("Employees")}
          >
            <span className="text-white">Employee List</span>
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
          <ProjectsMainContainer />
        )}

        {activeMenu === "Attendance" && (
          <AttendanceMainContainer />
        )}

        {activeMenu === "Employees" && (
          <EmployeeMainContainer />
        )}

        {activeMenu === "Settings" && (
          <SettingMainContainer />
        )}
      </div>
    </div>
  );
}