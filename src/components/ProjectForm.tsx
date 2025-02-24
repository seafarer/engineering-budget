import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectFormProps {
  onAddProject: (project: Project) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onAddProject }) => {
  const [name, setName] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [color, setColor] = useState('#3B82F6'); // Default blue
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !totalHours) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      totalHours: parseInt(totalHours),
      color
    };
    
    onAddProject(newProject);
    
    // Reset form
    setName('');
    setTotalHours('');
    setIsFormOpen(false);
  };
  
  return (
    <div className="mb-4">
      {!isFormOpen ? (
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full py-2 px-4 bg-sky-600 transition-colors text-white rounded hover:bg-sky-700"
        >
          Add New Project
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 p-3 border rounded bg-gray-50">
          <div>
            <label className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Website Redesign"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Total Hours
            </label>
            <input
              type="number"
              value={totalHours}
              onChange={e => setTotalHours(e.target.value)}
              min="1"
              className="w-full px-3 py-2 border rounded"
              placeholder="40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Color
            </label>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-full h-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Project
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProjectForm;