import React from 'react';

interface ResolutionSelectorProps {
  onSelectResolution: (resolution: string) => void;
}

const RESOLUTIONS = ['144p', '220p', '360p', '480p', '720p', '1080p', '2160p'];

const ResolutionSelector: React.FC<ResolutionSelectorProps> = ({ onSelectResolution }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      {RESOLUTIONS.map((res) => (
        <button
          key={res}
          onClick={() => onSelectResolution(res)}
          className="px-4 py-2 bg-gray-700 text-gray-200 font-semibold rounded-lg shadow-md hover:bg-cyan-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
        >
          {res}
        </button>
      ))}
    </div>
  );
};

export default ResolutionSelector;