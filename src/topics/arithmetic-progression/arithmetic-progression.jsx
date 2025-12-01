import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  RotateCw,
  Award,
  X,
  List,
  Lock,
  ChevronDown,
  ArrowLeft,
  TrendingUp,
  Home
} from 'lucide-react';
import { Latex } from '../../components/Latex';
import { randomInt } from '../../utils/helpers';
import {
  generateDefinitionProblem,
  generateSimpleMissingTermProblem,
  generateNthTermProblem,
  generateMemberCheckProblem,
  generateFirstTermProblem,
  generateOtherTermProblem,
  generateSumProblem,
  generateSumGivenLastTermProblem,
  generateTermFromSumFormulaProblem,
  generateFormulaFromSumProblem
} from './problemGenerators';

const homeworkFlow = [
  generateDefinitionProblem,        // Level 1
  generateSimpleMissingTermProblem, // Level 2
  generateNthTermProblem,           // Level 3
  generateMemberCheckProblem,       // Level 4
  generateFirstTermProblem,         // Level 5
  generateOtherTermProblem,         // Level 6
  generateSumProblem,               // Level 7
  generateSumGivenLastTermProblem,  // Level 8
  generateTermFromSumFormulaProblem,// Level 9
  generateFormulaFromSumProblem     // Level 10
];

const levelCategories = homeworkFlow.map(fn => fn().category);

export default function ArithmeticProgression() {
  const navigate = useNavigate();

  // State with localStorage persistence
  const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
    const saved = localStorage.getItem('mathlab_ap_level');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const [revealedHints, setRevealedHints] = useState([]);
  const [maxHints] = useState(3);

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('mathlab_ap_progress');
    return saved !== null ? parseFloat(saved) : 0;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('mathlab_ap_streak');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [showModal, setShowModal] = useState(() => {
    const saved = localStorage.getItem('mathlab_ap_showModal');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const [maxLevelReached, setMaxLevelReached] = useState(() => {
    const savedMax = localStorage.getItem('mathlab_ap_max_level');
    const savedCurrent = localStorage.getItem('mathlab_ap_level');
    const current = savedCurrent !== null ? parseInt(savedCurrent, 10) : 0;
    const max = savedMax !== null ? parseInt(savedMax, 10) : 0;
    return Math.max(current, max);
  });

  const [showLevelMenu, setShowLevelMenu] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Save state to localStorage
  useEffect(() => { localStorage.setItem('mathlab_ap_level', currentLevelIndex); }, [currentLevelIndex]);
  useEffect(() => { localStorage.setItem('mathlab_ap_progress', progress); }, [progress]);
  useEffect(() => { localStorage.setItem('mathlab_ap_streak', streak); }, [streak]);
  useEffect(() => { localStorage.setItem('mathlab_ap_showModal', JSON.stringify(showModal)); }, [showModal]);
  useEffect(() => { localStorage.setItem('mathlab_ap_max_level', maxLevelReached); }, [maxLevelReached]);

  useEffect(() => {
    if (currentLevelIndex > maxLevelReached) {
      setMaxLevelReached(currentLevelIndex);
    }
  }, [currentLevelIndex, maxLevelReached]);

  // Sync progress with maxLevelReached to ensure it reflects unlocked levels
  useEffect(() => {
    const minProgress = (maxLevelReached / homeworkFlow.length) * 100;
    setProgress(prev => Math.max(prev, minProgress));
  }, [maxLevelReached]);

  // Initialize first problem
  useEffect(() => {
    if (!problem) loadProblem(currentLevelIndex);
  }, []);

  const loadProblem = (idx) => {
    const generator = homeworkFlow[idx % homeworkFlow.length];
    const newProb = generator();
    setProblem(newProb);
    setFeedback({ type: null, message: "" });
    setUserAnswer("");
    setRevealedHints([]);
    setIsLevelComplete(false);
  };

  const handleLevelComplete = (withHints) => {
    const isLastLevel = currentLevelIndex === homeworkFlow.length - 1;
    setIsLevelComplete(true);

    // Show all hints on correct answer
    setRevealedHints(problem.hints.map((_, i) => i));

    // Only advance level if no hints were used (mastery)
    if (!withHints) {
      setStreak(s => s + 1);

      const newProgress = Math.min(100, ((currentLevelIndex + 1) / homeworkFlow.length) * 100);
      setProgress(prev => Math.max(prev, newProgress));

      setFeedback({
        type: 'success',
        message: isLastLevel
          ? "Sveikiname! Įveikėte visą programą!"
          : "Puiku! Atsakymas teisingas."
      });
    } else {
      setStreak(0);
      setFeedback({
        type: 'warning',
        message: "Teisingai! Tačiau naudojote užuominas."
      });
    }
  };

  const handleNextLevel = () => {
    const nextLevel = currentLevelIndex + 1;
    if (nextLevel >= homeworkFlow.length) {
      setIsGameComplete(true);
    } else {
      setCurrentLevelIndex(nextLevel);
      loadProblem(nextLevel);
    }
  };

  const handleBackToGame = () => {
    setIsGameComplete(false);
  };

  const handleRepeat = () => {
    loadProblem(currentLevelIndex);
  };

  const submitAnswer = (val) => {
    const normalizedUser = val.toString().trim().toLowerCase();
    const normalizedCorrect = problem.answer.toString().trim().toLowerCase();

    if (normalizedUser === normalizedCorrect) {
      handleLevelComplete(revealedHints.length > 0);
    } else {
      setFeedback({
        type: 'error',
        message: "Neteisingai. Pabandykite dar kartą."
      });
      setStreak(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer) return;
    submitAnswer(userAnswer);
  };

  const handleChoice = (option) => {
    setUserAnswer(option);
    submitAnswer(option);
  };

  const handleHint = () => {
    if (revealedHints.length === 0) {
      setRevealedHints([0]);
    }
  };

  const getFeedbackStyles = () => {
    switch (feedback.type) {
      case 'success': return "bg-green-100 text-green-800 border-green-300";
      case 'warning': return "bg-amber-100 text-amber-800 border-amber-300";
      case 'error': return "bg-red-100 text-red-800 border-red-300";
      default: return "";
    }
  };

  if (!problem) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Kraunama...</div>;

  if (isGameComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Award className="w-12 h-12 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Sveikiname!</h1>
          <p className="text-slate-500 mb-8 text-lg">
            Jūs sėkmingai įveikėte visus aritmetinės progresijos lygius!
          </p>

          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <p className="text-indigo-800 font-medium">
                Jūsų žinios dabar yra puikios!
              </p>
            </div>

            <button
              onClick={handleBackToGame}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Grįžti
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100">

      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Grįžti į pradžią"
              >
                <Home className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-xl font-bold flex items-center text-indigo-600 gap-2">
                <Calculator className="w-6 h-6" />
                MathLab <span className="text-slate-400 font-normal text-sm hidden sm:inline">| Aritmetinė Progresija</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <div className="relative">
                <button
                  onClick={() => setShowLevelMenu(!showLevelMenu)}
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <List className="w-4 h-4" />
                  Lygis {currentLevelIndex + 1}/{homeworkFlow.length}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showLevelMenu ? 'rotate-180' : ''}`} />
                </button>

                {showLevelMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Pasirinkite lygį
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto">
                      {levelCategories.map((cat, idx) => {
                        const isLocked = idx > maxLevelReached;
                        const isActive = idx === currentLevelIndex;

                        return (
                          <button
                            key={idx}
                            disabled={isLocked}
                            onClick={() => {
                              setCurrentLevelIndex(idx);
                              loadProblem(idx);
                              setShowLevelMenu(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors
                              ${isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : ''}
                              ${isLocked ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:bg-slate-50 text-slate-700'}
                            `}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border
                              ${isActive ? 'bg-indigo-600 text-white border-indigo-600' : ''}
                              ${!isActive && !isLocked ? 'bg-white text-slate-500 border-slate-200' : ''}
                              ${isLocked ? 'bg-slate-100 text-slate-400 border-slate-200' : ''}
                            `}>
                              {isLocked ? <Lock className="w-3 h-3" /> : idx + 1}
                            </div>
                            <div className="flex-1 text-sm truncate">
                              {cat.split(': ')[1] || cat}
                            </div>
                            {isActive && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <span className="flex items-center gap-1">
                <Award className={`w-4 h-4 ${streak > 2 ? 'text-amber-500' : 'text-slate-300'}`} />
                {streak}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4 mt-6 pb-20">

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300">

          {/* Card Header */}
          <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
            <div>
              <span className="font-semibold tracking-wide uppercase text-xs opacity-75 block">
                Užduotis
              </span>
              <span className="font-bold text-sm md:text-base">
                {problem.category}
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-md font-mono ${revealedHints.length > 0 ? 'bg-amber-500' : 'bg-indigo-500'}`}>
              {revealedHints.length}/{problem.hints.length} Užuominos
            </span>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8">
            <div className="text-xl leading-relaxed text-slate-800 mb-8 font-medium">
              {problem.question}
            </div>

            {/* Feedback Area */}
            {feedback.message && (
              <div className={`p-4 mb-8 rounded-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 ${getFeedbackStyles()}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    {feedback.type === 'success' && <CheckCircle className="w-6 h-6" />}
                    {feedback.type === 'error' && <X className="w-6 h-6" />}
                    {feedback.type === 'warning' && <RotateCw className="w-6 h-6" />}
                  </div>
                  <div className="text-sm font-medium pt-0.5">
                    {feedback.message}
                  </div>
                </div>

                {isLevelComplete && (
                  <div className="flex gap-3 mt-2 pl-9">
                    <button
                      onClick={handleNextLevel}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                    >
                      Kitas pratimas <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleRepeat}
                      className="bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                    >
                      Kartoti panašų <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hints Section */}
            {revealedHints.length > 0 && (
              <div className="mb-8 space-y-3 bg-amber-50 p-4 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-2">
                <h3 className="text-amber-800 font-bold text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> Pagalba
                </h3>
                {problem.hints.map((hint, idx) => {
                  const isRevealed = revealedHints.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (!isRevealed) setRevealedHints(prev => [...prev, idx]);
                      }}
                      className={`text-sm p-3 rounded-lg border shadow-sm transition-all relative overflow-hidden
                        ${isRevealed
                          ? 'bg-white/60 text-amber-900 border-amber-100/50'
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-pointer hover:bg-slate-200'
                        }
                      `}
                    >
                      <div className={`transition-all duration-500 ${isRevealed ? '' : 'blur-sm select-none'}`}>
                        <span className="font-bold mr-2 text-amber-700">{idx + 1}.</span> {hint}
                      </div>
                      {!isRevealed && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/10 font-medium text-xs uppercase tracking-wider text-slate-500">
                          Rodyti
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Input Area: Choice vs Text */}
            {problem.type === 'CHOICE' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {problem.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleChoice(opt)}
                      disabled={feedback.type === 'success' || revealedHints.length === problem.hints.length}
                      className="py-4 px-6 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {problem.renderOptionsAsLatex ? <Latex>{opt}</Latex> : opt}
                    </button>
                  ))}
                </div>
                {revealedHints.length === problem.hints.length && !isLevelComplete && (
                  <button
                    onClick={handleRepeat}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-95"
                  >
                    <RotateCw className="w-5 h-5" />
                    Bandyti dar kartą
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Jūsų atsakymas
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder=""
                      disabled={revealedHints.length === problem.hints.length}
                      className="flex-1 text-lg p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-mono disabled:bg-slate-100 disabled:text-slate-400"
                      autoFocus
                    />
                    {revealedHints.length === problem.hints.length && !isLevelComplete ? (
                      <button
                        type="button"
                        onClick={handleRepeat}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 md:px-8 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 active:scale-95"
                      >
                        <RotateCw className="w-5 h-5" />
                        <span className="hidden sm:inline">Bandyti dar kartą</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!userAnswer || feedback.type === 'success'}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 md:px-8 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 active:scale-95"
                      >
                        <span className="hidden sm:inline">Pateikti</span> <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* Hint Button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleHint}
                disabled={revealedHints.length > 0 || feedback.type === 'success'}
                className={`text-sm font-medium flex items-center gap-1 transition-colors px-3 py-2 rounded-lg
                    ${revealedHints.length > 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-indigo-600 hover:bg-indigo-50'}`}
              >
                <HelpCircle className="w-4 h-4" />
                {revealedHints.length > 0 ? "Užuominos rodomos" : "Rodyti užuominą"}
              </button>
            </div>
          </div>


        </div>
      </main>

      {/* Welcome Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform scale-100 transition-all">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto text-indigo-600 shadow-inner">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Pasiruošę mokytis?</h2>
            <p className="text-center text-slate-500 mb-8">
              Spręsime uždavinius nuo lengvų testų iki sudėtingesnių formulių.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span>Spręskite be užuominų, kad atrakintumėte kitą lygį.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <RotateCw className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Naudojant užuominas, lygį reikės kartoti.</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-indigo-200 active:scale-95"
            >
              Pradėti 1 lygį
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
