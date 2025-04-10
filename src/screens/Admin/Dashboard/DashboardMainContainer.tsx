import { useState } from "react";
import {
    PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";


const DashboardMainContainer = () => {
    const [activeProject, setActiveProject] = useState("");
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("Projects");

    // Sample data for pie charts
    const pieData = [
        { name: "Development", value: 400 },
        { name: "Design", value: 300 },
        { name: "Testing", value: 200 },
        { name: "Management", value: 100 }
    ];

    // Sample data for line chart
    const lineData = [
        { month: "Jan", eGov: 400, eLGU: 240, other: 180 },
        { month: "Feb", eGov: 300, eLGU: 290, other: 220 },
        { month: "Mar", eGov: 550, eLGU: 300, other: 250 },
        { month: "Apr", eGov: 420, eLGU: 380, other: 220 },
        { month: "May", eGov: 580, eLGU: 420, other: 310 },
        { month: "Jun", eGov: 620, eLGU: 480, other: 350 }
    ];

    // Sample data for table
    const tableData = [
        { id: 1, project: "eGov Portal", client: "National Government", status: "In Progress", completion: "65%" },
        { id: 2, project: "eLGU System", client: "Metro City", status: "On Track", completion: "42%" },
        { id: 3, project: "Digital Archive", client: "National Library", status: "Delayed", completion: "23%" }
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    // Toggle sidebar for mobile responsiveness
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // Handle menu item click
    const handleMenuClick = (menuItem:any) => {
        setActiveMenu(menuItem);
    };


    return (
        <>
            {/* Pie Charts Row */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
                {/* eGov Project */}
                <div
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center cursor-pointer"
                    onClick={() => setActiveProject("eGov")}
                >
                    <div className="w-40 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <span className="mt-2 font-medium">eGov</span>
                </div>

                {/* eLGU Project */}
                <div
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center cursor-pointer"
                    onClick={() => setActiveProject("eLGU")}
                >
                    <div className="w-40 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData.map(item => ({ ...item, value: item.value * 0.8 }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <span className="mt-2 font-medium">eLGU</span>
                </div>

                {/* Other Project */}
                <div
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center cursor-pointer"
                    onClick={() => setActiveProject("Other")}
                >
                    <div className="w-40 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData.map(item => ({ ...item, value: item.value * 0.6 }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <span className="mt-2 font-medium">Other Project</span>
                </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-4 mb-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4">Project Expenses Over Time</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={lineData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="eGov" stroke="#0088FE" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="eLGU" stroke="#00C49F" />
                            <Line type="monotone" dataKey="other" stroke="#FFBB28" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <h3 className="text-lg font-medium mb-4">Project Summary</h3>
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left">Project</th>
                            <th className="py-2 px-4 text-left">Client</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Completion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map(item => (
                            <tr
                                key={item.id}
                                className="border-b hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                onClick={() => setActiveProject(item.project)}
                            >
                                <td className="py-3 px-4">{item.project}</td>
                                <td className="py-3 px-4">{item.client}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${item.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                                        item.status === "On Track" ? "bg-green-100 text-green-800" :
                                            "bg-red-100 text-red-800"
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">{item.completion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default DashboardMainContainer
