import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, ArrowRight, Activity, Percent } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 py-6">
                <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Calculator className="w-8 h-8" />
                        <span className="text-2xl font-bold tracking-tight">HomeworkLab</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        HomeworkLab
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Interaktyvūs matematikos ir fizikos pratimai
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Arithmetic Progression Card */}
                    <Link
                        to="/aritmetine"
                        className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <div className="p-8">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Activity className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                                Aritmetinė Progresija
                            </h2>
                            <p className="text-slate-500 mb-6 leading-relaxed">
                                Sekos, kurių kiekvienas narys gaunamas prie prieš tai buvusio pridedant tą patį skaičių.
                            </p>

                            <div className="flex items-center text-blue-600 font-bold text-sm uppercase tracking-wider">
                                Pradėti kursą <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        {/* Decorative background elements */}
                        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                    </Link>

                    {/* Geometric Progression Card */}
                    <Link
                        to="/geometrine"
                        className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                        <div className="p-8">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">
                                Geometrinė Progresija
                            </h2>
                            <p className="text-slate-500 mb-6 leading-relaxed">
                                Sekos, kurių kiekvienas narys gaunamas prieš tai buvusį dauginant iš to paties skaičiaus.
                            </p>

                            <div className="flex items-center text-emerald-600 font-bold text-sm uppercase tracking-wider">
                                Pradėti kursą <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        {/* Decorative background elements */}
                        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-slate-400 text-sm">
                <p>© {new Date().getFullYear()} HomeworkLab. FizLib.</p>
            </footer>
        </div>
    );
}
