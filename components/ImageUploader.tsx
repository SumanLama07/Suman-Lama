import React, { useCallback, useState } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const uploaderClass = `w-full max-w-2xl h-80 flex flex-col items-center justify-center p-6 border-4 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out ${
    isDragging ? 'border-cyan-400 bg-gray-700/50 scale-105' : 'border-gray-600 hover:border-cyan-500 hover:bg-gray-700/30'
  }`;

  return (
    <div className="text-center w-full flex justify-center">
      <label
        htmlFor="image-upload"
        className={uploaderClass}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center pointer-events-none">
          <UploadIcon className="w-16 h-16 mb-4 text-gray-500 transition-colors duration-300" />
          <p className="text-xl font-semibold text-gray-300">
            <span className="text-cyan-400">Click to upload</span> or drag and drop
          </p>
          <p className="mt-2 text-sm text-gray-500">Supports PNG, JPG, WEBP, etc.</p>
        </div>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default ImageUploader;