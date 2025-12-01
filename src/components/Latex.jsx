import React, { useEffect, useRef } from 'react';
import { useKatex } from '../hooks/useKatex';

export const Latex = ({ children, block = false }) => {
  const containerRef = useRef(null);
  const katexLoaded = useKatex();

  useEffect(() => {
    if (katexLoaded && containerRef.current) {
      try {
        const processChildren = (child) => {
          if (Array.isArray(child)) return child.map(processChildren).join('');
          if (child === null || child === undefined) return '';
          return String(child);
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
