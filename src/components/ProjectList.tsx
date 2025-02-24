import React from 'react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project | null) => void;
  calculateHoursUsed: (projectId: string) => number;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  selectedProject, 
  onSelectProject,
  calculateHoursUsed
}) => {
  return (
    <div className="space-y-2">
      {projects.map(project => {
        const hoursUsed = calculateHoursUsed(project.id);
        const percentUsed = Math.min(100, Math.round((hoursUsed / project.totalHours) * 100));
        
        return (
          <div 
            key={project.id}
            onClick={() => onSelectProject(selectedProject?.id === project.id ? null : project)}
            className={`p-3 border border-gray-300 rounded cursor-pointer transition-all ${
              selectedProject?.id === project.id ? 'ring-2 ring-sky-600' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: project.color }}
                ></span>
                <span className="font-medium">{project.name}</span>
              </div>
              <span className="text-sm font-medium">
                {hoursUsed}/{project.totalHours}h
              </span>
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