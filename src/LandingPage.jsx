import React from 'react';
import { Calculator, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';

export default function LandingPage({ onSelectTopic }) {
  const topics = [
    {
      id: 'arithmetic-progression',
      title: 'Aritmetinė Progresija',
      description: 'Išmokite spręsti aritmetinės progresijos uždavinius - nuo apibrėžimo iki sudėtingų formulių.',
      icon: Calculator,
      color: 'indigo',
      levels: 10,
      isAvailable: true
    },
    {
      id: 'geometric-progression',
      title: 'Geometrinė Progresija',
      description: 'Greitai! Geometrinės progresijos užduotys.',
      icon: TrendingUp,
      color: 'purple',
      levels: 10,
      isAvailable: false
    },
    {
      id: 'sequences',
      title: 'Sekos ir Eilutės',
      description: 'Greitai! Bendros sekos ir eilučių temos.',
      icon: BookOpen,
      color: 'blue',
      levels: 8,
      isAvailable: false
    }
  ];

  const getColorClasses = (color, available) => {
    if (!available) {
      return {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        icon: 'bg-slate-100 text-slate-400',
        text: 'text-slate-600',
        button: 'bg-slate-300 text-slate-500 cursor-not-allowed'
      };
    }

    const colors = {
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: 'bg-indigo-100 text-indigo-600',
        text: 'text-indigo-700',
        button: 'bg-indigo-600 hover:bg-indigo-700 text-white'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'bg-purple-100 text-purple-600',
        text: 'text-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700 text-white'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'bg-blue-100 text-blue-600',
        text: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700 text-white'
      }
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">MathLab</h1>
              <p className="text-slate-500 text-sm">Interaktyvus matematikos mokymas</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 mt-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Pasirinkite Temą
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Pradėkite mokymąsi pasirinkdami vieną iš temų. Kiekviena tema turi kelis lygius -
            nuo pagrindų iki pažangių užduočių.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const colors = getColorClasses(topic.color, topic.isAvailable);

            return (
              <div
                key={topic.id}
                className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-6 transition-all duration-300 ${
                  topic.isAvailable ? 'hover:shadow-xl hover:-translate-y-1' : 'opacity-75'
                }`}
              >
                <div className={`w-16 h-16 ${colors.icon} rounded-xl flex items-center justify-center mb-4 shadow-inner`}>
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
                  {topic.title}
                </h3>

                <p className="text-slate-600 text-sm mb-4 min-h-[3rem]">
                  {topic.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {topic.levels} Lygių
                  </span>
                  {!topic.isAvailable && (
                    <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                      GREITAI
                    </span>
                  )}
                </div>

                <button
                  onClick={() => topic.isAvailable && onSelectTopic(topic.id)}
                  disabled={!topic.isAvailable}
                  className={`w-full ${colors.button} px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:active:scale-100`}
                >
                  {topic.isAvailable ? (
                    <>
                      Pradėti <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    'Neprieinama'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            Kaip Tai Veikia?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h4 className="font-bold text-slate-700 mb-2">Pasirinkite Temą</h4>
              <p className="text-sm text-slate-600">
                Pradėkite nuo temos, kurią norite mokytis
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-bold text-slate-700 mb-2">Spręskite Užduotis</h4>
              <p className="text-sm text-slate-600">
                Pradėkite nuo lengvų užduočių ir progresuokite
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-bold text-slate-700 mb-2">Atrakinkite Lygius</h4>
              <p className="text-sm text-slate-600">
                Teisingai atsakykite be užuominų, kad atrakintumėte naujus lygius
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-slate-500 text-sm border-t border-slate-200">
        <p>MathLab - Interaktyvus matematikos mokymas</p>
      </footer>
    </div>
  );
}
