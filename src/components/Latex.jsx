import React, { useState, useEffect, useRef } from 'react';

// --- KaTeX Loader & Component ---
const useKatex = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Prevent duplicate loading
    if (window.katex) {
      setIsLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup not strictly necessary for single file app lifecycle, but good practice
    };
  }, []);

  return isLoaded;
};

const Latex = ({ children, block = false }) => {
  const containerRef = useRef(null);
  const katexLoaded = useKatex();

  useEffect(() => {
    if (katexLoaded && containerRef.current) {
      try {
        const processChildren = (child) => {
          if (Array.isArray(child)) return child.map(processChildren).join('');
          if (child === null || child === undefined) return '';
          let text = String(child);

          // Automatic formatting for European decimal notation
          // Replace 5.5 with 5{,}5
          text = text.replace(/(\d)\.(\d)/g, '$1{,}$2');
          // Replace 5,5 with 5{,}5 (if user manually typed comma without space)
          text = text.replace(/(\d),(\d)/g, '$1{,}$2');

          return text;
        };
        const content = processChildren(children);

        window.katex.render(content, containerRef.current, {
          throwOnError: false,
          displayMode: block
        });
      } catch (e) {
        console.error("KaTeX render error:", e);
      }
    }
  }, [children, block, katexLoaded]);

  if (!katexLoaded) return <span className="opacity-50">...</span>;
  return <span ref={containerRef} />;
};

export default Latex;
