import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X } from 'lucide-react';

function App() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    fetch('/content.txt')
      .then(response => response.text())
      .then(text => {
        // Extract title and content
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
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {title && (
        <header className="bg-white shadow-md py-8 mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900">{title}</h1>
        </header>
      )}
      
      <main className="container mx-auto px-4 py-8">
        <article className="prose prose-lg max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
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
                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>

      {showImageViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageViewer(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>
          <img
            src={currentImage}
            alt="Enlarged view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

export default App;