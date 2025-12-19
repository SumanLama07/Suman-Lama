import React, { useState, useCallback } from 'react';
import { enhanceImageWithGemini } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import ImageUploader from './components/ImageUploader';
import ResolutionSelector from './components/ResolutionSelector';
import ImageComparator from './components/ImageComparator';
import Spinner from './components/Spinner';
import ResetIcon from './components/icons/ResetIcon';
import DownloadIcon from './components/icons/DownloadIcon';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [downloadFileName, setDownloadFileName] = useState<string>('');

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setError(null);
      const base64 = await fileToBase64(file);
      setOriginalImage(base64);
      setOriginalFileName(file.name);
    } catch (err) {
      setError('Failed to read the image file. Please try another one.');
      console.error(err);
    }
  }, []);

  const handleEnhance = useCallback(async (resolution: string) => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    try {
      const enhanced = await enhanceImageWithGemini(originalImage, resolution);
      setEnhancedImage(enhanced);

      // Generate a descriptive filename for the download
      const nameParts = originalFileName.split('.');
      const extension = nameParts.length > 1 ? nameParts.pop() : 'png';
      const baseName = nameParts.join('.');
      setDownloadFileName(`${baseName}-enhanced-${resolution}.${extension}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to enhance image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, originalFileName]);

  const handleReset = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setIsLoading(false);
    setError(null);
    setOriginalFileName('');
    setDownloadFileName('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            Photo Pixel Enhance
          </h1>
          <p className="text-md md:text-lg text-gray-400">
            Transform your low-quality photos into high-resolution masterpieces.
          </p>
        </header>

        <main className="bg-gray-800 rounded-2xl shadow-2xl shadow-black/30 p-6 md:p-8 min-h-[500px] flex flex-col items-center justify-center relative">
          {isLoading && <Spinner />}
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white p-3 rounded-lg shadow-lg z-20 text-center">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {!originalImage && <ImageUploader onImageUpload={handleImageUpload} />}
          
          {originalImage && !enhancedImage && !isLoading && (
            <div className="w-full flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Choose Enhancement Level</h2>
              <div className="mb-6 w-full max-w-md p-2 border-2 border-dashed border-gray-600 rounded-lg">
                <img src={originalImage} alt="Original preview" className="max-h-64 w-auto mx-auto rounded-md" />
              </div>
              <ResolutionSelector onSelectResolution={handleEnhance} />
            </div>
          )}

          {originalImage && enhancedImage && !isLoading && (
            <div className="w-full flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Compare Your Enhanced Image</h2>
              <ImageComparator originalImage={originalImage} enhancedImage={enhancedImage} />
              <a
                href={enhancedImage}
                download={downloadFileName}
                className="mt-6 px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-700 transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 flex items-center gap-2"
              >
                <DownloadIcon />
                Download Enhanced Image
              </a>
               <div className="mt-8 border-t border-gray-700 w-full max-w-2xl pt-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-300">Enhance Again</h3>
                <p className="text-sm text-gray-400 mb-4">Select a different resolution to re-enhance your original photo.</p>
                <ResolutionSelector onSelectResolution={handleEnhance} />
              </div>
            </div>
          )}

          {(originalImage || error) && (
            <button
              onClick={handleReset}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-red-600 text-white font-bold p-2 rounded-full transition-colors duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Start Over"
            >
              <ResetIcon />
            </button>
          )}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;