import React from 'react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project | null) => void;
  calculateHoursUsed: (projectId: string) => number;
  onDeleteProject: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  selectedProject, 
  onSelectProject,
  calculateHoursUsed,
  onDeleteProject
}) => {
  return (
    <div className="space-y-2">
      {projects.map(project => {
        const hoursUsed = calculateHoursUsed(project.id);
        const percentUsed = Math.min(100, Math.round((hoursUsed / project.totalHours) * 100));
        
        return (
          <div 
            key={project.id}
            className={`p-3 border border-gray-300 rounded group transition-all ${
              selectedProject?.id === project.id ? 'ring-2 ring-sky-600' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div 
                className="flex-1 cursor-pointer" 
                onClick={() => onSelectProject(selectedProject?.id === project.id ? null : project)}
              >
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: project.color }}
                ></span>
                <span className="font-medium">{project.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {hoursUsed}/{project.totalHours}h
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this project?')) {
                      onDeleteProject(project.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-600 transition-opacity cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{ 
                  width: `${percentUsed}%`, 
                  backgroundColor: project.color 
                }}
              ></div>
            </div>
          </div>
        );
      })}
      
      {projects.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          No projects added yet. Add your first project above!
        </div>
      )}
    </div>
  );
};

export default ProjectList;