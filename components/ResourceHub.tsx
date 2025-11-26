import React from 'react';
import { RESOURCES } from '../constants';
import { ExternalLink, Phone, BookOpen, PenTool } from 'lucide-react';

const ResourceHub: React.FC = () => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Emergency': return <Phone size={20} className="text-red-500 dark:text-red-400" />;
      case 'Education': return <BookOpen size={20} className="text-blue-500 dark:text-blue-400" />;
      case 'Tools': return <PenTool size={20} className="text-green-500 dark:text-green-400" />;
      default: return <ExternalLink size={20} className="text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-sage-600 to-sage-800 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Wellness Resources</h2>
        <p className="text-sage-100 opacity-90">Curated tools and contacts for your journey.</p>
      </div>

      <div className="grid gap-4">
        {RESOURCES.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-sage-900 p-5 rounded-xl shadow-sm border border-sage-100 dark:border-sage-800 hover:shadow-md hover:border-sage-300 dark:hover:border-sage-600 transition-all flex items-start gap-4"
          >
            <div className="p-3 bg-sage-50 dark:bg-sage-800 rounded-full group-hover:bg-sage-100 dark:group-hover:bg-sage-700 transition-colors">
              {getIcon(resource.category)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors">
                  {resource.title}
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    resource.category === 'Emergency' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300' :
                    resource.category === 'Education' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' :
                    'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                }`}>
                    {resource.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                {resource.description}
              </p>
            </div>
            <ExternalLink size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-sage-500 dark:group-hover:text-sage-400" />
          </a>
        ))}
      </div>

      <div className="bg-calm-50 dark:bg-sky-900/20 border border-calm-200 dark:border-sky-800 rounded-xl p-4 text-center">
        <p className="text-calm-800 dark:text-sky-200 text-sm">
            <span className="font-bold">Note:</span> Ask Doc is an AI companion and cannot handle emergencies. 
            If you are in immediate danger, please call emergency services or the 988 Lifeline immediately.
        </p>
      </div>
    </div>
  );
};

export default ResourceHub;