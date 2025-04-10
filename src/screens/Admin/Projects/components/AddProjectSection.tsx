import React, { useState } from 'react'
const AddProjectSection = () => {
    // Project form state
    const [formData, setFormData] = useState({
        projectName: '',
        projectAmount: '',
        startDate: '',  // Changed from projectDuration to startDate
        endDate: '',    // Added endDate
        aboutProject: ''
    });

    // Employee management state
    const [employees, setEmployees] = useState<Array<{
        lastName: string;
        firstName: string;
        middleInitial: string;
        designation: string;
    }>>([]);
    const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        lastName: '',
        firstName: '',
        middleInitial: '',
        designation: ''
    });

    // Form input handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Employee form handlers
    const handleEmployeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEmployee({
            ...newEmployee,
            [name]: value
        });
    };

    const handleAddEmployee = () => {
        if (newEmployee.firstName && newEmployee.lastName) {
            setEmployees([...employees, { ...newEmployee }]);
            setNewEmployee({
                lastName: '',
                firstName: '',
                middleInitial: '',
                designation: ''
            });
            setShowEmployeeDialog(false);
        }
    };

    const handleRemoveEmployee = (index: number) => {
        const updatedEmployees = [...employees];
        updatedEmployees.splice(index, 1);
        setEmployees(updatedEmployees);
    };

    // Form submission handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create submission data
        const submitData = {
            ...formData,
            employees,
            // Calculate duration in days if needed
            duration: formData.startDate && formData.endDate
                ? Math.floor((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                : null
        };

        console.log('Form submitted:', submitData);
        // Add your API call or state management logic here
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Project</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                        Project Name
                    </label>
                    <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Project Amount */}
                <div>
                    <label htmlFor="projectAmount" className="block text-sm font-medium text-gray-700 mb-1">
                        Project Amount
                    </label>
                    <input
                        type="number"
                        id="projectAmount"
                        name="projectAmount"
                        value={formData.projectAmount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                {/* Project Duration as Date Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Duration
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-xs text-gray-500 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-xs text-gray-500 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                min={formData.startDate} // Prevents selecting end date before start date
                            />
                        </div>
                    </div>
                    {formData.startDate && formData.endDate && (
                        <p className="text-sm text-gray-500 mt-1">
                            Duration: {Math.floor((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                        </p>
                    )}
                </div>

                {/* About Project */}
                <div>
                    <label htmlFor="aboutProject" className="block text-sm font-medium text-gray-700 mb-1">
                        About Project
                    </label>
                    <textarea
                        id="aboutProject"
                        name="aboutProject"
                        value={formData.aboutProject}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Rest of the form remains the same */}
                {/* Employee Section */}
                <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Project Employees</h3>
                        <button
                            type="button"
                            onClick={() => setShowEmployeeDialog(true)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Add Employee
                        </button>
                    </div>

                    {employees.length === 0 ? (
                        <p className="text-gray-500 text-sm">No employees added yet</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {employees.map((employee, index) => (
                                <li key={index} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">
                                            {employee.firstName} {employee.middleInitial && employee.middleInitial + '.'} {employee.lastName}
                                        </p>
                                        <p className="text-sm text-gray-600">{employee.designation}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEmployee(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Employee Dialog */}
                {showEmployeeDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">Add Employee</h3>

                            <div className="space-y-4">
                                {/* Employee form fields */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={newEmployee.lastName}
                                        onChange={handleEmployeeInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={newEmployee.firstName}
                                        onChange={handleEmployeeInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Middle Initial
                                    </label>
                                    <input
                                        type="text"
                                        name="middleInitial"
                                        value={newEmployee.middleInitial}
                                        onChange={handleEmployeeInputChange}
                                        maxLength={1}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Designation
                                    </label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={newEmployee.designation}
                                        onChange={handleEmployeeInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowEmployeeDialog(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddEmployee}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Submit Project
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddProjectSection