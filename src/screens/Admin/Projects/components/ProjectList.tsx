import React, { useEffect, useState } from 'react';
import { getAllProjects } from '@/services/projects';
import { formatDate } from '@/helper/date';

// Define interface for project objects
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

const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                            className="flex flex-col border p-2 items-start cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => onSelectProject(project)}
                        >
                            {/* Circular project image - centered */}
                            <div className="w-24 h-24 mx-auto self-center rounded-full overflow-hidden mb-3 shadow-md hover:shadow-lg transition-shadow">
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
                            <h3 className="font-medium text-sm">{project.name}</h3>
                            <p className="text-gray-600 text-xs mt-1">{project.amount}</p>
                            <p className="text-gray-600 text-xs">{formatDate(project.duration_start) + " - " + formatDate(project.duration_end)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectList;