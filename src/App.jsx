import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import LandingPage from './LandingPage';
import MathHomeworkApp from '../medos.jsx';

export default function App() {
  const getTopicFromHash = () => {
    const hash = window.location.hash.slice(1); // Remove the '#'
    return hash || null;
  };

  const [selectedTopic, setSelectedTopic] = useState(getTopicFromHash);

  useEffect(() => {
    // Listen for hash changes (back/forward browser buttons)
    const handleHashChange = () => {
      setSelectedTopic(getTopicFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTopic = (topicId) => {
    window.location.hash = topicId;
    setSelectedTopic(topicId);
  };

  const handleBackToLanding = () => {
    window.location.hash = '';
    setSelectedTopic(null);
  };

  if (!selectedTopic) {
    return <LandingPage onSelectTopic={handleSelectTopic} />;
  }

  // Currently only arithmetic progression is available
  if (selectedTopic === 'arithmetic-progression') {
    return (
      <div>
        {/* Back button overlay */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={handleBackToLanding}
            className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 px-4 py-2 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Grįžti į Pradžią</span>
          </button>
        </div>
        <MathHomeworkApp />
      </div>
    );
  }

  // Fallback for other topics (not yet implemented)
  return <LandingPage onSelectTopic={handleSelectTopic} />;
}
