import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gray-800/80 flex flex-col items-center justify-center z-10 rounded-2xl">
      <div className="w-16 h-16 border-4 border-dashed border-cyan-400 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-200">Enhancing your image...</p>
    </div>
  );
};

export default Spinner;