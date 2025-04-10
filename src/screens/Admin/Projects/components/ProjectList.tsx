import React from 'react';

// Define interface for project objects
interface Project {
    id: number;
    name: string;
    image: string;
    amount: string;
    duration: string; // Add duration property
}

// Add props for handling project selection
interface ProjectListProps {
    onSelectProject: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject }) => {
    // Sample project data with duration added
    const projects: Project[] = [
        { id: 1, name: 'Website Redesign', image: 'https://via.placeholder.com/150', amount: '$5,000', duration: '3 months' },
        { id: 2, name: 'Mobile App', image: 'https://via.placeholder.com/150', amount: '$12,000', duration: '6 months' },
        { id: 3, name: 'E-commerce Platform', image: 'https://via.placeholder.com/150', amount: '$8,500', duration: '4 months' },
        { id: 4, name: 'CRM Integration', image: 'https://via.placeholder.com/150', amount: '$7,200', duration: '2 months' },
        { id: 5, name: 'Brand Identity', image: 'https://via.placeholder.com/150', amount: '$3,500', duration: '1 month' },
        { id: 6, name: 'Social Media Campaign', image: 'https://via.placeholder.com/150', amount: '$2,800', duration: '3 months' }
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-6">Projects</h2>

            <div className="grid grid-cols-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {projects.map(project => (
                    <div
                        key={project.id}
                        className="flex flex-col items-center cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => onSelectProject(project)} // Handle click to select project
                    >
                        {/* Circular project image */}
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-md hover:shadow-lg transition-shadow">
                            <img
                                src={'https://cdn-icons-png.flaticon.com/512/9299/9299357.png'}
                                alt={project.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Project name and details */}
                        <h3 className="text-center font-medium text-sm">{project.name}</h3>
                        <p className="text-gray-600 text-xs mt-1">{project.amount}</p>
                        <p className="text-gray-600 text-xs">{project.duration}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjectList