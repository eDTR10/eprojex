import { formatDate } from '@/helper/date';
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Plus } from 'lucide-react';
import { formatMoney } from '@/helper/money';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Project {
    duration_end: string;
    duration_start: string;
    id: number;
    name: string;
    image: string;
    about: string;
    amount: string;
    duration: string;
}

interface Expense {
    id: number;
    description: string;
    amount: number;
    date: string;
    category: string;
}

interface ProjectDetailsProps {
    project: Project | null;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
    if (!project) return null;

    // Parse budget amount (removing currency symbols if present)
    const totalBudget = parseFloat(String(project.amount).replace(/[^0-9.-]+/g, "")) || 0;

    // For demo purposes, we'll create mock expenses
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Materials'
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBalance = totalBudget - totalExpenses;

    useEffect(() => {
        // Generate mock expenses for demo
        const mockExpenses: Expense[] = [
            { id: 1, description: 'Initial equipment purchase', amount: totalBudget * 0.2, date: '2023-01-15', category: 'Equipment' },
            { id: 2, description: 'Contractor payment', amount: totalBudget * 0.15, date: '2023-02-01', category: 'Labor' },
            { id: 3, description: 'Raw materials', amount: totalBudget * 0.1, date: '2023-02-10', category: 'Materials' },
        ];
        setExpenses(mockExpenses);
    }, [totalBudget]);

    // Prepare chart data
    const chartData = {
        labels: ['Expenses', 'Remaining Balance'],
        datasets: [
            {
                data: [totalExpenses, remainingBalance],
                backgroundColor: ['#FF6384', '#36A2EB'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: $${value.toLocaleString()}`;
                    }
                }
            }
        },
    };

    const handleAddExpense = () => {
        if (newExpense.description && newExpense.amount) {
            const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
            const expenseToAdd: Expense = {
                id: newId,
                description: newExpense.description,
                amount: parseFloat(newExpense.amount),
                date: newExpense.date,
                category: newExpense.category
            };

            setExpenses([...expenses, expenseToAdd]);
            setNewExpense({
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: 'Materials'
            });
            setShowAddExpenseDialog(false);
        }
    };

    return (
        <div className="container mx-auto px-4 relative">
            {/* Row 1: Basic project info in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start">
                    <div className="w-24 h-24 rounded-full overflow-hidden mr-4 shrink-0">
                        <img
                            src={project.image || 'https://cdn-icons-png.flaticon.com/512/9299/9299357.png'}
                            alt={project?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/9299/9299357.png';
                            }}
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{project.name}</h2>
                        <p className="text-gray-600 mt-1">Budget: ${totalBudget.toLocaleString()}</p>
                        <p className="text-gray-600">
                            Duration: {formatDate(project.duration_start)} - {formatDate(project.duration_end)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600">Total Budget</h4>
                        <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600">Remaining</h4>
                        <p className="text-2xl font-bold text-blue-600">${remainingBalance.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{Math.round((remainingBalance / totalBudget) * 100)}% remaining</p>
                    </div>
                </div>
            </div>

            {/* Row 2: Project Details */}
            <div className="mb-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Project Details</h3>
                    <p className="text-gray-600">
                        {project.about || 'No description available.'}
                    </p>
                </div>
            </div>

            {/* Row 3: Budget Distribution & Expenses in 2 columns */}
            <div className="grid grid-cols-2  md:grid-cols-1 sm:grid-cols-1 gap-6 mb-24">
                {/* Column 1: Budget Distribution Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Budget Distribution</h3>
                    <div className="h-64">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-600">Expenses</h4>
                            <p className="text-xl font-bold text-red-500">${totalExpenses.toLocaleString()}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-600">Budget Utilization</h4>
                            <p className="text-xl font-bold">
                                {Math.round((totalExpenses / totalBudget) * 100)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Column 2: Expense Table/Log */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Expense Log</h3>
                    {expenses.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No expenses recorded yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {expenses.map((expense) => (
                                        <tr key={expense.id}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{expense.description}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{expense.category}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900 text-right">₱{expense.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900">Total Expenses</td>
                                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">₱{totalExpenses.toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-blue-600">Total Budget</td>
                                        <td className="px-4 py-2 text-sm font-medium text-blue-600 text-right">₱{totalBudget.toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-green-500">Remaining Balance</td>
                                        <td className="px-4 py-2 text-sm font-medium text-green-500 text-right">₱{remainingBalance.toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => setShowAddExpenseDialog(true)}
                className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Add expense"
            >
                <Plus size={24} />
            </button>

            {/* Add Expense Dialog */}
            {showAddExpenseDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Add Expense</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount ($)
                                </label>
                                <input
                                    type="number"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={newExpense.date}
                                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="Materials">Materials</option>
                                    <option value="Labor">Labor</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Office">Office</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddExpenseDialog(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddExpense}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
                                >
                                    Add Expense
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;