import React from 'react';

interface Project {
    id: number;
    name: string;
    image: string;
    amount: string;
    duration: string;
}

interface ProjectDetailsProps {
    project: Project | null;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
    if (!project) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mr-6">
                    <img
                        src={'https://cdn-icons-png.flaticon.com/512/9299/9299357.png'}
                        alt={project.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold">{project.name}</h2>
                    <p className="text-gray-600 mt-1">Budget: {project.amount}</p>
                    <p className="text-gray-600">Duration: {project.duration}</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Project Details</h3>
                <p className="text-gray-600">
                    This is where you would display detailed information about the project,
                    such as description, status updates, team members, milestones, etc.
                </p>
            </div>
        </div>
    );
};

export default ProjectDetails;