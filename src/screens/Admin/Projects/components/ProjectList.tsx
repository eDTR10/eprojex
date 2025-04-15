import React, { useEffect, useState } from 'react';
import { getAllProjects } from '@/services/projects';
import { formatDate } from '@/helper/date';
import { Edit, Trash2 } from 'lucide-react';
import { updateProject, deleteProject } from '@/services/projects';
import { NumericFormat } from 'react-number-format';
// import { formatMoney } from '@/helper/money';
import Swal from 'sweetalert2';
interface Project {
    id: number;
    name: string;
    image: string;
    amount: string;
    about: string;
    duration: string;
    duration_start: string;
    duration_end: string;
    total_budget: string;
}

// Add props for handling project selection
interface ProjectListProps {
    onSelectProject: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
    onSelectProject,
}) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit dialog state
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);

    // Delete dialog state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);



    useEffect(() => {
        // Fetch all projects when component mounts
        getAllProjects()
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch projects:', err);
                setError('Failed to load projects. Please try again later.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div>
                <h2 className="text-xl font-bold mb-6">Projects</h2>

                {/* Skeleton loading grid */}
                <div className="grid grid-cols-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Generate 6 skeleton cards */}
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="flex flex-col border p-2 items-start animate-pulse">
                            {/* Skeleton circular image */}
                            <div className="w-24 h-24 mx-auto self-center rounded-full mb-3 bg-gray-200"></div>

                            {/* Skeleton text lines */}
                            <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="w-1/2 h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Add this before the return statement
    const EditProjectDialog = () => {
        const [formData, setFormData] = useState({
            name: editProject?.name || '',
            about: editProject?.about || '',
            amount: editProject?.amount || '',
            total_budget: editProject?.total_budget || '',
            duration_start: editProject?.duration_start || '',
            duration_end: editProject?.duration_end || '',
        });
        const [updating, setUpdating] = useState(false);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!editProject) return;

            // Ensure both amount and total_budget are properly set before submitting
            const updatedFormData = {
                ...formData,
                // Make sure both fields have the same value
                amount: formData.amount,
            };

            setUpdating(true);
            updateProject({
                id: editProject.id,
                ...updatedFormData  // Use the updated form data
            })
                .then(updatedProject => {
                    // Update the projects list with the updated project
                    setProjects(projects.map(p =>
                        p.id === updatedProject.id ? updatedProject : p
                    ));
                    setShowEditDialog(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Project updated successfully!',
                    });
                    // alert('Project updated successfully');   
                    getAllProjects()
                        .then(data => {
                            setProjects(data);
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error('Failed to fetch projects:', err);
                            setError('Failed to load projects. Please try again later.');
                            setLoading(false);
                        });
                })
                .catch(err => {
                    console.error('Failed to update project:', err);
                    alert('Failed to update project. Please try again.');
                })
                .finally(() => {
                    setUpdating(false);
                });
        };

        if (!showEditDialog || !editProject) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Edit Project</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Project Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">About</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                rows={3}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Total Budget</label>
                            <NumericFormat
                                value={formData.amount}
                                thousandSeparator={true}
                                prefix={'₱'}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                onValueChange={(values) => {
                                    const { floatValue } = values;

                                    // Ensure both amount and total_budget fields are always in sync
                                    // with the same numeric value (as strings for API consistency)
                                    const numericValue = floatValue || 0;
                                    setFormData(prev => ({
                                        ...prev,
                                        amount: String(numericValue),
                                    }));
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="duration_start"
                                    value={formData.duration_start}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="duration_end"
                                    value={formData.duration_end}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowEditDialog(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                                disabled={updating}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                disabled={updating}
                            >
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const DeleteConfirmationDialog = () => {
        const [deleting, setDeleting] = useState(false);

        const handleDelete = () => {
            if (!projectToDelete) return;

            setDeleting(true);
            deleteProject(projectToDelete.id)
                .then(() => {
                    // Remove the deleted project from the state
                    setProjects(projects.filter(p => p.id !== projectToDelete.id));
                    setShowDeleteDialog(false);
                    setProjectToDelete(null);
                    // You could replace this with a toast notification
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Project deleted successfully.',
                    });
                })
                .catch(err => {
                    console.error('Failed to delete project:', err);
                    setError('Failed to delete project. Please try again.');
                })
                .finally(() => {
                    setDeleting(false);
                });
        };

        if (!showDeleteDialog || !projectToDelete) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4 text-red-600">Delete Project</h2>
                    <p className="mb-6">
                        Are you sure you want to delete <span className="font-semibold">{projectToDelete.name}</span>?
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setShowDeleteDialog(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                            disabled={deleting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete Project'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-6">Projects</h2>

            {projects.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-2">No projects found</p>
                    <p className="text-sm text-gray-400">Add a new project to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map(project => (
                        <div
                            key={project.id}
                            className="flex flex-col border p-4 rounded-lg shadow-sm items-start cursor-pointer transition-shadow hover:shadow-md relative"
                            onClick={() => onSelectProject(project)}
                        >
                            {/* Action buttons - always visible */}
                            <div className="absolute top-2 right-2 flex space-x-1">
                                <button
                                    className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the parent's onClick
                                        setEditProject(project);
                                        setShowEditDialog(true);
                                    }}
                                    title="Edit Project"
                                    aria-label="Edit Project"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the parent's onClick
                                        setProjectToDelete(project);
                                        setShowDeleteDialog(true);
                                    }}
                                    title="Delete Project"
                                    aria-label="Delete Project"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Circular project image - centered */}
                            <div className="w-24 h-24 mx-auto self-center rounded-full overflow-hidden mb-3 shadow-md">
                                <img
                                    src={project.image || 'https://cdn-icons-png.flaticon.com/512/9299/9299357.png'}
                                    alt={project.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Use fallback image if project image fails to load
                                        (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/9299/9299357.png';
                                    }}
                                />
                            </div>

                            {/* Project name and details - left aligned */}
                            <h3 className="font-medium text-sm mt-2">{project.name}</h3>
                            {/* <p className="text-gray-600 text-xs mt-1">{formatMoney(project.total_budget)}</p> */}
                            <p className="text-gray-600 text-xs">{formatDate(project.duration_start) + " - " + formatDate(project.duration_end)}</p>
                        </div>
                    ))}
                </div>
            )}
            <EditProjectDialog />
            <DeleteConfirmationDialog />
        </div>
    );
};

export default ProjectList;