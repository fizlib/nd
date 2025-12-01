import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, TrendingUp } from 'lucide-react';

const topics = [
  {
    id: 'arithmetic-progression',
    title: 'Aritmetinė Progresija',
    description: 'Mokykitės aritmetinės progresijos pagrindų: narių radimo, sumos skaičiavimo ir formulių.',
    levels: 10,
    color: 'indigo',
    path: '/topics/arithmetic-progression'
  }
  // Add more topics here in the future
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center text-indigo-600 gap-3">
            <Calculator className="w-8 h-8" />
            MathLab
          </h1>
          <p className="text-slate-500 mt-2">Interaktyvūs matematikos pratimai</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 mt-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Pasirinkite temą</h2>
          <p className="text-slate-600">Pradėkite mokytis pasirinkę vieną iš žemiau esančių temų</p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => navigate(topic.path)}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group"
            >
              <div className="bg-indigo-600 p-6 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                <p className="text-sm opacity-90">{topic.levels} lygiai</p>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-6">{topic.description}</p>

                <button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:gap-3"
                >
                  Pradėti <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 p-8 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <h3 className="text-xl font-bold text-slate-700 mb-2">Daugiau temų greitai!</h3>
          <p className="text-slate-500">
            Dirbame prie daugiau interaktyvių matematikos temų. Grįžkite vėliau!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>© 2025 MathLab - Interaktyvūs matematikos pratimai</p>
      </footer>
    </div>
  );
}
