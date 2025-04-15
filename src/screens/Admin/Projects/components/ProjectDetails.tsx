import { formatDate } from '@/helper/date';
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Plus } from 'lucide-react';
import { formatMoney } from '@/helper/money';
import { createExpense, getProjectExpenses, Expense, CreateExpenseData } from '@/services/expense';
import { NumericFormat } from 'react-number-format';
import { DollarSign, FileText } from 'lucide-react'; // Add DollarSign and FileText icons
import { addProjectBudget, Budget, getProjectBudgets } from '@/services/projects';
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Project {
    id: number;
    name: string;
    image: string;
    amount: string;
    duration: string;
    about: string;
    duration_start: string;
    duration_end: string;
    total_budget: string;
}


interface ProjectDetailsProps {
    project: Project | null;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
    if (!project) return null;

    // Parse budget amount (removing currency symbols if present)
    const totalBudget = parseFloat(String(project.total_budget).replace(/[^0-9.-]+/g, "")) || 0;

    // State for expenses from API
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // Add these new state variables
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [showFabMenu, setShowFabMenu] = useState(false);
    const [showAddBudgetDialog, setShowAddBudgetDialog] = useState(false);
    const [newBudgetName, setNewBudgetName] = useState('');
    const [newBudgetAmount, setNewBudgetAmount] = useState('');
    const [isAddingBudget, setIsAddingBudget] = useState(false);

    // Updated state to match API fields
    const [newExpense, setNewExpense] = useState({
        item: '',
        categories: 'Materials',
        remarks: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
    });

    type LogEntry = {
        id?: number; // Optional ID for sorting
        type: 'expense' | 'budget';
        title: string;
        category?: string;
        date: string;
        amount: number;
    };

    // Add a computed value for combined log entries
    const logEntries: LogEntry[] = [
        ...expenses.map(expense => ({
            type: 'expense' as const,
            title: expense.item,
            category: expense.category,
            date: expense.date,
            amount: expense.amount
        })),
        ...budgets.map(budget => ({
            type: 'budget' as const,
            title: budget.name,
            date: budget.created_date,
            amount: budget.amount
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());  // Sort by date, newest first


    const totalExpenses = expenses.reduce((sum, expense: any) => sum + parseFloat(expense?.amount), 0);
    const remainingBalance = totalBudget - totalExpenses;

    // Fetch real expenses from the API
    useEffect(() => {
        if (project?.id) {
            setIsLoading(true);

            // Fetch expenses
            getProjectExpenses(project.id)
                .then(data => {
                    setExpenses(data);

                    // Then fetch budgets
                    return getProjectBudgets(project.id);
                })
                .then(budgetData => {
                    setBudgets(budgetData);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch data:', err);
                    setError('Failed to load project data. Please try again.');
                    setIsLoading(false);
                });
        }
    }, [project?.id]);

    // Prepare chart data
    const chartData = {
        labels: ['Expenses', 'Remaining Balance'],
        datasets: [
            {
                data: [totalExpenses, remainingBalance],
                backgroundColor: ['red', 'green'],
                borderColor: ['red', 'green'],
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
                        // Don't call toLocaleString before formatMoney
                        return `${label}: ₱${value.toLocaleString()}`;
                    }
                }
            }
        },
    };

    // Updated to use the createExpense API function
    const handleAddExpense = () => {
        if (!project?.id) return;

        if (newExpense.item && newExpense.amount) {
            setIsLoading(true);

            const expenseData: CreateExpenseData = {
                item: newExpense.item,
                category: newExpense.categories,
                remarks: newExpense.remarks || '',
                date: newExpense.date,
                amount: parseFloat(newExpense.amount),
                project_id: project.id
            };

            createExpense(expenseData)
                .then(createdExpense => {
                    // Add the new expense to the list
                    setExpenses(prev => [...prev, createdExpense]);

                    // Reset form
                    setNewExpense({
                        item: '',
                        categories: 'Materials',
                        remarks: '',
                        date: new Date().toISOString().split('T')[0],
                        amount: '',
                    });

                    setShowAddExpenseDialog(false);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error creating expense:', error);
                    setError('Failed to create expense. Please try again.');
                    setIsLoading(false);
                });
        }
    };

    const handleAddBudget = () => {
        if (!project?.id) return;

        if (newBudgetName && newBudgetAmount) {
            setIsAddingBudget(true);

            // Parse the budget value
            const parsedAmount = parseFloat(String(newBudgetAmount).replace(/[^0-9.-]+/g, ""));

            const budgetData: Budget = {
                proj_id: project.id,
                name: newBudgetName,
                amount: parsedAmount,
                created_date: new Date().toISOString(),
            };

            addProjectBudget(budgetData)
                .then(() => {
                    // Optionally, you might need to refresh the project data here
                    // For now, we'll just reload the page
                    window.location.reload();
                    setShowAddBudgetDialog(false);
                    setIsAddingBudget(false);

                    // Reset form
                    setNewBudgetName('');
                    setNewBudgetAmount('');
                })
                .catch(error => {
                    console.error('Error adding budget:', error);
                    setError('Failed to add budget. Please try again.');
                    setIsAddingBudget(false);
                });
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
                        <p className="text-gray-600 mt-1">Budget: ₱{totalBudget.toLocaleString()}</p>
                        <p className="text-gray-600">
                            Duration: {formatDate(project.duration_start)} - {formatDate(project.duration_end)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600">Total Budget</h4>
                        <p className="text-2xl font-bold">{totalBudget.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600">Remaining</h4>
                        <p className={`text-2xl font-bold ${remainingBalance < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                            {remainingBalance < 0 ? '-' : ''}₱{Math.abs(remainingBalance).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                            {Math.abs(Math.round((remainingBalance / totalBudget) * 100))}%
                            {remainingBalance < 0 ? ' overspent' : ' remaining'}
                        </p>
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
            <div className="grid grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-6 mb-24">
                {/* Column 1: Budget Distribution Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Budget Distribution</h3>
                    <div className="h-64">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-600">Expenses</h4>
                            <p className="text-xl font-bold text-red-500">{formatMoney(totalExpenses.toLocaleString())}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-600">Budget Utilization</h4>
                            <p className="text-xl font-bold">
                                {Math.round((totalExpenses / totalBudget) * 100)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Column 2: Combined Log */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Logs</h3>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-primary text-white rounded-md"
                            >
                                Retry
                            </button>
                        </div>
                    ) : logEntries.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No transactions recorded yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logEntries.map((entry) => (
                                        <tr key={`${entry.type}-${entry.id}`}>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${entry.type === 'expense'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {entry.type === 'expense' ? 'Expense' : 'Budget'}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-2 text-sm ${entry.type === 'expense' ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                {entry.title}
                                                {entry.category && <span className="text-gray-500 text-xs ml-2">({entry.category})</span>}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(entry.date)}</td>
                                            <td className={`px-4 py-2 text-sm font-medium text-right ${entry.type === 'expense' ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                {entry.type === 'expense' ? '-' : '+'}₱{entry.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900">Total Expenses</td>
                                        <td className="px-4 py-2 text-sm font-medium text-red-600 text-right">-{formatMoney(totalExpenses.toLocaleString())}</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900">Total Budget</td>
                                        <td className="px-4 py-2 text-sm font-medium text-green-600 text-right">+{formatMoney(totalBudget.toLocaleString())}</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900">Remaining Balance</td>
                                        <td className={`px-4 py-2 text-sm font-medium text-right ${remainingBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {formatMoney(remainingBalance.toLocaleString())}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button (FAB) with Menu */}
            <div className="fixed bottom-20 right-6 flex flex-col items-end space-y-2 z-40">
                {/* Menu options (visible when showFabMenu is true) */}
                {showFabMenu && (
                    <>
                        <div
                            className="flex items-center bg-white p-2 rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                                setShowAddBudgetDialog(true);
                                setShowFabMenu(false);
                            }}
                        >
                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">
                                <DollarSign size={20} />
                            </div>
                            <span className="text-sm font-medium">Add Budget</span>
                        </div>

                        <div
                            className="flex items-center bg-white p-2 rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                                setShowAddExpenseDialog(true);
                                setShowFabMenu(false);
                            }}
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                                <FileText size={20} />
                            </div>
                            <span className="text-sm font-medium">Add Expense</span>
                        </div>
                    </>
                )}

                {/* Main FAB button */}
                <button
                    onClick={() => setShowFabMenu(!showFabMenu)}
                    className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    aria-label="Show options"
                    disabled={isLoading}
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Add Expense Dialog - Updated for API fields */}
            {showAddExpenseDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Add Expense</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item
                                </label>
                                <input
                                    type="text"
                                    value={newExpense.item}
                                    onChange={(e) => setNewExpense({ ...newExpense, item: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount (₱)
                                </label>
                                <NumericFormat
                                    value={newExpense.amount}
                                    thousandSeparator={true}
                                    prefix={'₱'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    onValueChange={(values) => {
                                        const { value } = values;
                                        setNewExpense({ ...newExpense, amount: value });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Remarks
                                </label>
                                <textarea
                                    value={newExpense.remarks}
                                    onChange={(e) => setNewExpense({ ...newExpense, remarks: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows={3}
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
                                    value={newExpense.categories}
                                    onChange={(e) => setNewExpense({ ...newExpense, categories: e.target.value })}
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
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddExpense}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Adding...' : 'Add Expense'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddBudgetDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Add Budget</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Budget Name
                                </label>
                                <input
                                    type="text"
                                    value={newBudgetName}
                                    onChange={(e) => setNewBudgetName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="e.g., Q2 Additional Funding"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount (₱)
                                </label>
                                <NumericFormat
                                    value={newBudgetAmount}
                                    thousandSeparator={true}
                                    prefix={'₱'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    onValueChange={(values) => {
                                        const { value } = values;
                                        setNewBudgetAmount(value);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddBudgetDialog(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    disabled={isAddingBudget}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddBudget}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700"
                                    disabled={isAddingBudget || !newBudgetName || !newBudgetAmount}
                                >
                                    {isAddingBudget ? 'Adding...' : 'Add Budget'}
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