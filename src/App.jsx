import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import LandingPage from './LandingPage';
import MathHomeworkApp from '../medos.jsx';

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState(() => {
    return localStorage.getItem('mathlab_selected_topic') || null;
  });

  useEffect(() => {
    if (selectedTopic) {
      localStorage.setItem('mathlab_selected_topic', selectedTopic);
    } else {
      localStorage.removeItem('mathlab_selected_topic');
    }
  }, [selectedTopic]);

  const handleSelectTopic = (topicId) => {
    setSelectedTopic(topicId);
  };

  const handleBackToLanding = () => {
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
