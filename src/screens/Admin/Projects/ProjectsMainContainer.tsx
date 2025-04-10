import { useState } from 'react'
import AddProjectSection from './components/AddProjectSection';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails'; // You'll need to create this component

// Define Project interface (same as in ProjectList)
interface Project {
    id: number;
    name: string;
    image: string;
    amount: string;
    duration: string;
}

const ProjectsMainContainer = () => {
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleAddProject = () => {
        setIsAddMode(true);
        setSelectedProject(null); // Clear any selected project when switching to add mode
    };

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
        setIsAddMode(false); // Ensure add mode is off when viewing a project
    };

    // Determine current view mode
    const viewingProject = selectedProject !== null;

    return (
        <div className="relative h-full">
            {/* Breadcrumb Navigation */}
            {(isAddMode || viewingProject) && (
                <nav className="p-4">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li>
                            <button
                                onClick={() => {
                                    setIsAddMode(false);
                                    setSelectedProject(null);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Projects
                            </button>
                        </li>
                        <li className="text-gray-500">
                            <span className="mx-2">&gt;</span>
                        </li>
                        <li className="text-gray-700 font-medium">
                            {isAddMode ? 'Add Project' : selectedProject?.name}
                        </li>
                    </ol>
                </nav>
            )}

            {/* Main content */}
            {isAddMode ? (
                <div className="p-4">
                    <AddProjectSection />
                </div>
            ) : viewingProject ? (
                <div className="p-4">
                    <ProjectDetails project={selectedProject} />
                </div>
            ) : (
                <div className="p-4">
                    <ProjectList onSelectProject={handleSelectProject} />
                </div>
            )}

            {/* FAB - only show when in main project list view */}
            {!isAddMode && !viewingProject && (
                <button
                    onClick={handleAddProject}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-green-300 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 focus:outline-none"
                    aria-label="Add project"
                >
                    <span className="text-2xl font-bold">+</span>
                </button>
            )}
        </div>
    )
}

export default ProjectsMainContainer