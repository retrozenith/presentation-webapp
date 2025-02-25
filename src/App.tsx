import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, ZoomIn, ZoomOut, Download, Sun, Moon } from 'lucide-react';

function App() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    fetch('/content.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n');
        const titleLine = lines.find(line => line.startsWith('###!'));
        if (titleLine) {
          setTitle(titleLine.replace('###!', '').trim());
          setContent(lines.filter(line => line !== titleLine).join('\n'));
        } else {
          setContent(text);
        }
      })
      .catch(error => console.error('Error loading content:', error));
  }, []);

  const handleImageClick = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setShowImageViewer(true);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
              : 'bg-white hover:bg-gray-100 text-gray-800 shadow-lg'
          }`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {title && (
        <header className={`shadow-md py-8 mb-8 transition-colors ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h1 className={`text-4xl font-bold text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{title}</h1>
        </header>
      )}
      
      <main className="container mx-auto px-4 py-8">
        <article className={`prose prose-lg max-w-4xl mx-auto p-8 rounded-lg shadow-md transition-colors ${
          isDarkMode 
            ? 'bg-gray-800 prose-invert' 
            : 'bg-white'
        } prose-headings:scroll-mt-20`}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({node, ...props}) => (
                <img 
                  {...props} 
                  className="w-full rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(props.src || '')}
                />
              ),
              a: ({node, ...props}) => (
                <a {...props} target="_blank" rel="noopener noreferrer" className={`${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                }`} />
              ),
              h1: ({node, ...props}) => (
                <h1 {...props} className={props.children === 'Concluzie' ? 'text-2xl' : 'text-3xl'} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>

      {showImageViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-auto"
            style={{
              cursor: zoomLevel > 1 ? 'move' : 'auto'
            }}
          >
            <img
              src={currentImage}
              alt="Enlarged view"
              className="max-w-none transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel})`,
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
          </div>
          <div className="fixed top-4 right-4 flex gap-2 z-[60]">
            <button
              onClick={handleZoomIn}
              className="p-2 text-white hover:text-gray-300 transition-colors bg-gray-800 rounded-full"
              title="Zoom In"
            >
              <ZoomIn size={24} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 text-white hover:text-gray-300 transition-colors bg-gray-800 rounded-full"
              title="Zoom Out"
            >
              <ZoomOut size={24} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-white hover:text-gray-300 transition-colors bg-gray-800 rounded-full"
              title="Download"
            >
              <Download size={24} />
            </button>
            <button
              onClick={() => {
                setShowImageViewer(false);
                setZoomLevel(1);
              }}
              className="p-2 text-white hover:text-gray-300 transition-colors bg-gray-800 rounded-full"
              title="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;