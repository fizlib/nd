import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calculator,
    CheckCircle,
    HelpCircle,
    ArrowRight,
    RotateCw,
    TrendingUp,
    Award,
    AlertCircle,
    X,
    List,
    Lock,
    ChevronDown,
    ArrowLeft,
    Home,
    Unlock
} from 'lucide-react';
import Latex from '../../components/Latex';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- PROBLEM GENERATORS ---

// LEVEL 1: Basic Comparisons (Choice)
// "4 < 5?"
// Visualization Component
const ComparisonVisualization = ({ a, b }) => {
    // Determine bounds to fit points comfortably
    const minVal = Math.min(a, b);
    const maxVal = Math.max(a, b);
    const padding = 2;
    const rangeStart = minVal - padding;
    const rangeEnd = maxVal + padding;
    const range = rangeEnd - rangeStart;

    const width = 300;
    const scale = (val) => ((val - rangeStart) / range) * (width - 40) + 20;

    const xa = scale(a);
    const xb = scale(b);

    return (
        <svg width="300" height="60" className="mx-auto my-2 select-none">
            {/* Axis */}
            <line x1="10" y1="30" x2="290" y2="30" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
            </defs>

            {/* Point A */}
            <circle cx={xa} cy="30" r="5" fill="#4f46e5" />
            <text x={xa} y="50" textAnchor="middle" fontSize="14" fill="#4f46e5" fontWeight="bold">{a}</text>

            {/* Point B */}
            <circle cx={xb} cy="30" r="5" fill="#db2777" />
            <text x={xb} y="50" textAnchor="middle" fontSize="14" fill="#db2777" fontWeight="bold">{b}</text>
        </svg>
    );
};

// LEVEL 1: Basic Comparisons (Choice)
// "4 < 5?"
const generateBasicComparisonProblem = () => {
    const isTrue = Math.random() > 0.5;
    const isNegative = Math.random() > 0.5;

    let a = randomInt(1, 20) * (isNegative ? -1 : 1);
    let b = a + randomInt(1, 10) * (Math.random() > 0.5 ? 1 : -1);

    // 0: <, 1: >, 2: <=, 3: >=
    const symbolType = randomInt(0, 3);
    let symbol = "";

    switch (symbolType) {
        case 0: symbol = "<"; break;
        case 1: symbol = ">"; break;
        case 2: symbol = "\\le"; break;
        case 3: symbol = "\\ge"; break;
    }

    // Check truth
    let correct = false;
    if (symbolType === 0) correct = a < b;
    else if (symbolType === 1) correct = a > b;
    else if (symbolType === 2) correct = a <= b;
    else if (symbolType === 3) correct = a >= b;

    // Force specific truth value if needed? No, let's just use what we generated and ask "Taip/Ne".
    // Alternatively, generate a statement and ask if it is true.

    return {
        id: `basic-${Date.now()}`,
        category: '1 Lygis: Skaičių Palyginimas',
        type: 'CHOICE',
        options: ['Teisinga', 'Neteisinga'],
        question: (
            <span>
                Ar ši nelygybė yra teisinga?<br />
                <div className="text-2xl mt-4 bg-indigo-50 p-4 rounded-lg text-center font-mono">
                    <Latex>{`${a} ${symbol} ${b}`}</Latex>
                </div>
            </span>
        ),
        answer: correct ? "Teisinga" : "Neteisinga",
        hints: [
            <span>
                Prisiminkite skaičių tiesę. {isNegative ? "Neigiamiems skaičiams: kuo skaičius toliau nuo nulio į kairę, tuo jis mažesnis." : "Teigiamiems skaičiams: kuo skaičius toliau nuo nulio į dešinę, tuo jis didesnis."}
            </span>,
            <span>
                Matome skaičių tiesėje:<br />
                <ComparisonVisualization a={a} b={b} />
                <Latex>{a}</Latex> yra {a < b ? "kairiau" : "dešiniau"} už <Latex>{b}</Latex>.
            </span>,
            <span>
                Ši nelygybė teigia, kad <Latex>{a}</Latex> yra {symbolType === 0 ? "mažiau už" : symbolType === 1 ? "daugiau už" : symbolType === 2 ? "mažiau arba lygu" : "daugiau arba lygu"} <Latex>{b}</Latex>.
                Tai yra <strong>{correct ? "tiesa" : "netiesa"}</strong>.
            </span>
        ]
    };
};

// Helper to get random symbol
const randomSymbol = (allowInclusive = true) => {
    // 0: >, 1: <, 2: >=, 3: <=
    // For simplicity, just return string directly
    const types = allowInclusive ? ['>', '<', '\\ge', '\\le'] : ['>', '<'];
    return types[randomInt(0, types.length - 1)];
};

const getFlippedSymbol = (symbol) => {
    switch (symbol) {
        case '>': return '<';
        case '<': return '>';
        case '\\ge': return '\\le';
        case '\\le': return '\\ge';
        default: return symbol;
    }
};

// LEVEL 2: One-step addition/subtraction (Input)
const generateOneStepAddSubProblem = () => {
    const x = randomInt(-10, 10);
    const op = randomInt(1, 10) * (Math.random() > 0.5 ? 1 : -1);
    const val = x + op;

    const symbol = randomSymbol();

    const opStr = op > 0 ? `+ ${op}` : `- ${Math.abs(op)}`;
    const inequality = `x ${opStr} ${symbol} ${val}`;

    const ansVal = val - op;
    const ansSymbol = symbol;

    const answer = `x ${ansSymbol} ${ansVal}`;

    return {
        id: `one-step-add-${Date.now()}`,
        category: '2 Lygis: Vieno veiksmo (Sudėtis/Atimtis)',
        type: 'INPUT',
        question: (
            <span>
                Išspręskite nelygybę:<br />
                <div className="text-2xl mt-4 mb-2 text-center">
                    <Latex>{inequality}</Latex>
                </div>
            </span>
        ),
        answer: answer.replace(/\s/g, ''),
        hints: [
            <span>Norint rasti <Latex>x</Latex>, reikia perkelti skaičių prie <Latex>x</Latex> į kitą pusę su priešingu ženklu.</span>,
            <span>Šiuo atveju: <Latex>{op > 0 ? "atimame" : "pridedame"} {Math.abs(op)}</Latex> abiejose pusėse.</span>,
            <span>
                <Latex>{`x ${symbol} ${val} ${op > 0 ? '-' : '+'} ${Math.abs(op)}`}</Latex><br />
                <strong>Atsakymas: <Latex>{answer}</Latex></strong>
            </span>
        ]
    };
};

// LEVEL 3: One-step multiplication (Positive) (Input)
const generateOneStepMultPosProblem = () => {
    const k = randomInt(2, 6);
    const x = randomInt(-5, 5);
    const val = k * x;

    const symbol = randomSymbol();

    const inequality = `${k}x ${symbol} ${val}`;
    const answer = `x ${symbol} ${x}`;

    return {
        id: `one-step-mult-pos-${Date.now()}`,
        category: '3 Lygis: Vieno veiksmo (Daugyba, teigiamas)',
        type: 'INPUT',
        question: (
            <span>
                Išspręskite nelygybę:<br />
                <div className="text-2xl mt-4 mb-2 text-center">
                    <Latex>{inequality}</Latex>
                </div>
            </span>
        ),
        answer: answer.replace(/\s/g, ''),
        hints: [
            <span><Latex>x</Latex> padaugintas iš <Latex>{k}</Latex>. Turime padalinti abi puses iš <Latex>{k}</Latex>.</span>,
            <span>Kadangi daliname iš <strong>teigiamo</strong> skaičiaus, nelygybės ženklas <strong>nesikeičia</strong>.</span>,
            <span>
                <Latex>{`x ${symbol} ${val} : ${k}`}</Latex><br />
                <strong>Atsakymas: <Latex>{answer}</Latex></strong>
            </span>
        ]
    };
};

// LEVEL 4: One-step multiplication (Negative) (Input)
const generateOneStepMultNegProblem = () => {
    const k = randomInt(2, 6) * -1;
    const x = randomInt(-5, 5);
    const val = k * x;

    const symbol = randomSymbol();
    const flippedSymbol = getFlippedSymbol(symbol);

    const inequality = `${k}x ${symbol} ${val}`;
    const answer = `x ${flippedSymbol} ${x}`;

    return {
        id: `one-step-mult-neg-${Date.now()}`,
        category: '4 Lygis: Vieno veiksmo (Daugyba, neigiamas)',
        type: 'INPUT',
        question: (
            <span>
                Išspręskite nelygybę:<br />
                <div className="text-2xl mt-4 mb-2 text-center text-red-700">
                    <Latex>{inequality}</Latex>
                </div>
                <div className="text-sm text-slate-500 mt-2 text-center">
                    Dėmesio: dalyba iš neigiamo skaičiaus!
                </div>
            </span>
        ),
        answer: answer.replace(/\s/g, ''),
        hints: [
            <span>Turime padalinti abi puses iš <Latex>{k}</Latex>.</span>,
            <span className="text-red-600 font-bold">
                Dėmesio! Dalinant nelygybę iš neigiamo skaičiaus, nelygybės ženklas apsiverčia!
                (<Latex>{symbol}</Latex> tampa <Latex>{flippedSymbol}</Latex>)
            </span>,
            <span>
                <Latex>{`x ${flippedSymbol} ${val} : (${k})`}</Latex><br />
                <strong>Atsakymas: <Latex>{answer}</Latex></strong>
            </span>
        ]
    };
};

// LEVEL 5: Two-step inequalities (Input)
const generateTwoStepProblem = () => {
    const k = randomInt(2, 5);
    const b = randomInt(1, 10) * (Math.random() > 0.5 ? 1 : -1);
    const x = randomInt(-5, 5);
    const rhs = k * x + b;

    const symbol = randomSymbol();

    const bStr = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const inequality = `${k}x ${bStr} ${symbol} ${rhs}`;

    const answer = `x ${symbol} ${x}`;

    return {
        id: `two-step-${Date.now()}`,
        category: '5 Lygis: Dviejų veiksmų nelygybės',
        type: 'INPUT',
        question: (
            <span>
                Išspręskite nelygybę:<br />
                <div className="text-2xl mt-4 mb-2 text-center">
                    <Latex>{inequality}</Latex>
                </div>
            </span>
        ),
        answer: answer.replace(/\s/g, ''),
        hints: [
            <span>Pirmiausia perkelkite laisvąjį narį (<Latex>{b}</Latex>) į kitą pusę.</span>,
            <span>
                <Latex>{`${k}x ${symbol} ${rhs} ${b > 0 ? '-' : '+'} ${Math.abs(b)}`}</Latex><br />
                <Latex>{`${k}x ${symbol} ${rhs - b}`}</Latex>
            </span>,
            <span>
                Dabar padalinkite iš <Latex>{k}</Latex> (ženklas nesikeičia).<br />
                <strong>Atsakymas: <Latex>{answer}</Latex></strong>
            </span>
        ]
    };
};

// LEVEL 6: Variable on right side (Input)
const generateRightSideVarProblem = () => {
    const x = randomInt(-10, 10);
    const b = randomInt(1, 10);
    const val = x + b;

    const symbol = randomSymbol();
    // Logic: val < x + b  <=>  x + b > val
    const invertedSymbol = getFlippedSymbol(symbol); // Symbol relative to x + b

    const inequality = `${val} ${symbol} x + ${b}`;
    // Final answer: x {invertedSymbol} {val - b}
    const answer = `x ${invertedSymbol} ${x}`;

    return {
        id: `right-side-${Date.now()}`,
        category: '6 Lygis: Kintamasis dešinėje',
        type: 'INPUT',
        question: (
            <span>
                Išspręskite nelygybę:<br />
                <div className="text-2xl mt-4 mb-2 text-center">
                    <Latex>{inequality}</Latex>
                </div>
                (Atsakymą pateikite forma <Latex>x ...</Latex>)
            </span>
        ),
        answer: answer.replace(/\s/g, ''),
        hints: [
            <span>Galite sukeisti puses vietomis, kad <Latex>x</Latex> būtų kairėje. Nepamirškite apversti ženklo!</span>,
            <span>
                <Latex>{`x + ${b} ${invertedSymbol} ${val}`}</Latex>
            </span>,
            <span>
                Atimame <Latex>{b}</Latex>:<br />
                <Latex>{`x ${invertedSymbol} ${val} - ${b}`}</Latex><br />
                <strong>Atsakymas: <Latex>{answer}</Latex></strong>
            </span>
        ]
    };
};

// LEVEL 7: Complex two-step with negatives (Input)
const generateComplexNegProblem = () => {
    const k = randomInt(2, 5); // Will be made negative
    const b = randomInt(1, 12);
    const x = randomInt(-4, 4);
    const val = b - k * x;

    const symbol = randomSymbol();
    const flippedSymbol = getFlippedSymbol(symbol);

    const inequality = `${b} - ${k}x ${symbol} ${val}`;
    const answer = `x ${flippedSymbol} ${x}`;

    return {
        id: `complex-neg-${Date.now()}`,
        category: '7 Lygis: Sudėtingesni su neigiamais',
        type: 'INPUT',
        question: (
            <span>
                Išspręskite nelygybę:<br />
                <div className="text-2xl mt-4 mb-2 text-center">
                    <Latex>{inequality}</Latex>
                </div>
            </span>
        ),
        answer: answer.replace(/\s/g, ''),
        hints: [
            <span>Paliekame narį su <Latex>x</Latex> kairėje, skaičių <Latex>{b}</Latex> perkeliame į dešinę.</span>,
            <span>
                <Latex>{`-${k}x ${symbol} ${val} - ${b}`}</Latex><br />
                <Latex>{`-${k}x ${symbol} ${val - b}`}</Latex>
            </span>,
            <span className="text-red-600">
                Daliname iš <Latex>{`-${k}`}</Latex>, todėl keičiame ženklo kryptį!<br />
                <strong>Atsakymas: <Latex>{answer}</Latex></strong>
            </span>
        ]
    };
};

// LEVEL 8: Fractional Inequalities (Input)
const generateFractionProblem = () => {
    const isNegative = Math.random() > 0.4;
    const denom = randomInt(2, 5);
    const b = randomInt(1, 8) * (Math.random() > 0.5 ? 1 : -1);
    const targetX = randomInt(-10, 10);

    const rhs = randomInt(-5, 10);
    const symbol = randomSymbol();

    const step1Rhs = rhs - b;
    const multiplier = isNegative ? -denom : denom;
    const finalVal = step1Rhs * multiplier;

    let finalSymbol = symbol;
    if (isNegative) {
        finalSymbol = getFlippedSymbol(symbol);
    }

    const term = isNegative ? `-\\frac{x}{${denom}}` : `\\frac{x}{${denom}}`;
    const bStr = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

    const inequality = `${term} ${bStr} ${symbol} ${rhs}`;
    const answer = `x ${finalSymbol} ${finalVal}`;

    return {
        id: `frac-${Date.now()}`,
        category: '8 Lygis: Nelygybės su trupmenomis',
        type: 'INPUT',
        question: (
            <span>
                Išspręskite nelygybę:<br />
                <div className="text-2xl mt-4 mb-2 text-center">
                    <Latex>{inequality}</Latex>
                </div>
            </span>
        ),
        answer: answer.replace(/\s/g, ''),
        hints: [
            <span>Pirmiausia perkelkite laisvąjį narį (<Latex>{b}</Latex>) į kitą pusę.</span>,
            <span>
                <Latex>{`${term} ${symbol} ${rhs} ${b > 0 ? '-' : '+'} ${Math.abs(b)}`}</Latex><br />
                <Latex>{`${term} ${symbol} ${step1Rhs}`}</Latex>
            </span>,
            <span>
                {isNegative ? (
                    <>
                        Dauginame abi puses iš <Latex>{multiplier}</Latex>.<br />
                        <span className="text-red-600 font-bold">Dėmesio! Dauginant iš neigiamo skaičiaus, ženklas apsiverčia!</span>
                    </>
                ) : (
                    <>Dauginame abi puses iš <Latex>{multiplier}</Latex> (ženklas nesikeičia).</>
                )}
                <br />
                <Latex>{`x ${finalSymbol} ${step1Rhs} \\cdot (${multiplier})`}</Latex><br />
                <strong>Atsakymas: <Latex>{answer}</Latex></strong>
            </span>
        ]
    };
};


const homeworkFlow = [
    generateBasicComparisonProblem,
    generateOneStepAddSubProblem,
    generateOneStepMultPosProblem,
    generateOneStepMultNegProblem,
    generateTwoStepProblem,
    generateRightSideVarProblem,
    generateComplexNegProblem,
    generateFractionProblem
];

const levelCategories = homeworkFlow.map(fn => fn().category);

export default function InequalitiesTopic() {
    const navigate = useNavigate();

    // State with localStorage persistence (using 'inequalities_' prefix)
    const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
        const saved = localStorage.getItem('inequalities_level');
        return saved !== null ? parseInt(saved, 10) : 0;
    });

    const [problem, setProblem] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [selectedSymbol, setSelectedSymbol] = useState(null); // For input mode
    const [feedback, setFeedback] = useState({ type: null, message: "" });
    const [revealedHints, setRevealedHints] = useState([]);

    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('inequalities_progress');
        return saved !== null ? parseFloat(saved) : 0;
    });

    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem('inequalities_streak');
        return saved !== null ? parseInt(saved, 10) : 0;
    });

    const [levelStreak, setLevelStreak] = useState(0); // Track wins within current level

    const [showModal, setShowModal] = useState(() => {
        const saved = localStorage.getItem('inequalities_showModal');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [isLevelComplete, setIsLevelComplete] = useState(false);

    const [maxLevelReached, setMaxLevelReached] = useState(() => {
        const savedMax = localStorage.getItem('inequalities_max_level');
        const savedCurrent = localStorage.getItem('inequalities_level');
        const current = savedCurrent !== null ? parseInt(savedCurrent, 10) : 0;
        const max = savedMax !== null ? parseInt(savedMax, 10) : 0;
        return Math.max(current, max);
    });

    const [showLevelMenu, setShowLevelMenu] = useState(false);
    const [isGameComplete, setIsGameComplete] = useState(false);

    // Save state to localStorage
    useEffect(() => { localStorage.setItem('inequalities_level', currentLevelIndex); }, [currentLevelIndex]);
    useEffect(() => { localStorage.setItem('inequalities_progress', progress); }, [progress]);
    useEffect(() => { localStorage.setItem('inequalities_streak', streak); }, [streak]);
    useEffect(() => { localStorage.setItem('inequalities_showModal', JSON.stringify(showModal)); }, [showModal]);
    useEffect(() => { localStorage.setItem('inequalities_max_level', maxLevelReached); }, [maxLevelReached]);

    useEffect(() => {
        if (currentLevelIndex > maxLevelReached) {
            setMaxLevelReached(currentLevelIndex);
        }
    }, [currentLevelIndex, maxLevelReached]);

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
        setSelectedSymbol(null);
        setRevealedHints([]);
        setIsLevelComplete(false);
        // Note: We do NOT reset levelStreak here if we are just loading next problem in same level
        // But we SHOULD reset if we switched levels manually via menu. 
        // Current logic: handleNextLevel changes index -> calls loadProblem. 
        // handleRepeat -> calls loadProblem.
        // We need to know if we changed level.
        // Let's handle reset in handleNextLevel or useEffect.
    };

    // Reset streak when level index changes
    useEffect(() => {
        setLevelStreak(0);
    }, [currentLevelIndex]);

    const handleLevelComplete = (withHints) => {
        const isLastLevel = currentLevelIndex === homeworkFlow.length - 1;
        setIsLevelComplete(true);
        setRevealedHints(problem.hints.map((_, i) => i));

        if (!withHints) {
            setStreak(s => s + 1);
            const newLevelStreak = levelStreak + 1;
            setLevelStreak(newLevelStreak);

            // Only advance progress if this helps towards unlocking (simplified logic: just bump progress a bit or on full complete)
            // Actually, let's update progress bar slightly for each win or just kept as is.
            // Let's keep global progress tied to maxLevelReached for simplicity, or maybe update it here.

            // To unlock next level: need 3 clean wins
            const requiredWins = 3;

            let message = "Puiku! Atsakymas teisingas.";
            if (newLevelStreak < requiredWins) {
                message = `Teisingai! Dar ${requiredWins - newLevelStreak} teisingi atsakymai(-as) be užuominų, kad pereitumėte į kitą lygį.`;
            } else {
                message = isLastLevel
                    ? "Sveikiname! Įveikėte visą programą!"
                    : "Puiku! Įveikėte šį lygį.";

                // Unlock next level only if we met requirements
                const newProgress = Math.min(100, ((currentLevelIndex + 1) / homeworkFlow.length) * 100);
                setProgress(prev => Math.max(prev, newProgress));
            }

            setFeedback({
                type: 'success',
                message: message
            });
        } else {
            setStreak(0);
            setLevelStreak(0); // Reset level streak on hint usage
            setFeedback({
                type: 'warning',
                message: "Teisingai! Tačiau naudojote užuominas. Lygio progresas nulinamas."
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

    const normalize = (str) => str.toString().replace(/\s/g, '').toLowerCase();

    const parseInequality = (str) => {
        // Matches: part1 operator part2
        // Operators: <, >, <=, >=, \le, \ge
        // We need to handle Latex symbols too: \le is <=, \ge is >=
        // Clean string first
        let clean = str.replace(/\\le/g, '<=').replace(/\\ge/g, '>=').replace(/\s/g, '');

        // Find operator
        const operators = ['<=', '>=', '<', '>'];
        let op = null;
        let lhs = '';
        let rhs = '';

        for (let o of operators) {
            if (clean.includes(o)) {
                op = o;
                const parts = clean.split(o);
                lhs = parts[0];
                rhs = parts[1];
                break;
            }
        }

        return { lhs, op, rhs };
    };

    const isEquivalent = (userStr, correctStr) => {
        // 1. Direct string match (normalized)
        if (normalize(userStr) === normalize(correctStr)) return true;

        // 2. Parse and check for reversed inequality
        // e.g. x < 5 is equivalent to 5 > x
        // x <= 5 is equivalent to 5 >= x

        const user = parseInequality(userStr);
        const correct = parseInequality(correctStr);

        if (!user.op || !correct.op) return false; // parsing failed or no operator

        // Check standard: LHS=LHS, RHS=RHS, OP=OP (already covered by direct match, but good to be safe)
        if (user.lhs === correct.lhs && user.rhs === correct.rhs && user.op === correct.op) return true;

        // Check reversed: LHS=RHS, RHS=LHS, OP=Flipped
        const flipMap = {
            '<': '>',
            '>': '<',
            '<=': '>=',
            '>=': '<='
        };

        if (user.lhs === correct.rhs && user.rhs === correct.lhs && user.op === flipMap[correct.op]) return true;

        return false;
    };

    const submitAnswer = (val) => {
        if (isEquivalent(val, problem.answer)) {
            handleLevelComplete(revealedHints.length > 0);
        } else {
            setFeedback({
                type: 'error',
                message: "Neteisingai. Bandykite dar kartą"
            });
            setStreak(0);
            setLevelStreak(0); // Reset level streak on error
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // If CHOICE type, userAnswer handles it directly in handleChoice
        // If INPUT type:
        if (problem.type === 'INPUT') {
            if (!userAnswer || !selectedSymbol) return;
            // Construct string: "x [symbol] [value]"
            const fullAnswer = `x ${selectedSymbol} ${userAnswer}`;
            submitAnswer(fullAnswer);
        } else {
            // Should not happen via form submit loop, but safely:
            if (!userAnswer) return;
            submitAnswer(userAnswer);
        }
    };

    const handleChoice = (option) => {
        setUserAnswer(option);
        submitAnswer(option);
    };

    const handleHint = () => {
        if (revealedHints.length < problem.hints.length) {
            setRevealedHints(prev => [...prev, prev.length]);
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
                        Jūs sėkmingai įveikėte visus nelygybių lygius!
                    </p>
                    <button
                        onClick={handleBackToGame}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Grįžti
                    </button>
                </div>
            </div>
        );
    }

    const handleUnlockAll = () => {
        const lastLevel = homeworkFlow.length - 1;
        setMaxLevelReached(lastLevel);
        setCurrentLevelIndex(lastLevel);
        loadProblem(lastLevel); // Load the problem for the new level
        // No alert needed, UI update is enough
    };

    // Check if localhost
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b border-slate-200 p-4 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-xl font-bold flex items-center text-indigo-600 gap-2">
                            <Calculator className="w-6 h-6" />
                            MathLab <span className="text-slate-400 font-normal text-sm hidden sm:inline">| Nelygybės</span>
                            {isDev && (
                                <button
                                    onClick={handleUnlockAll}
                                    title="Dev: Unlock All Levels"
                                    className="ml-2 p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    <Unlock className="w-3 h-3" />
                                </button>
                            )}
                        </h1>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer mr-2"
                            >
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Pradžia</span>
                            </button>
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
                                                            if (!isLocked) {
                                                                setCurrentLevelIndex(idx);
                                                                loadProblem(idx);
                                                                setShowLevelMenu(false);
                                                            }
                                                        }}
                                                        className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors
                                                            ${isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}
                                                            ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                                        `}
                                                    >
                                                        <span className="truncate pr-2">{cat}</span>
                                                        {isLocked ? <Lock className="w-3 h-3" /> : (isActive && <ArrowRight className="w-3 h-3" />)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto p-4 sm:p-6 pb-32">
                {/* Stats */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                        <Award className={`w-4 h-4 ${streak > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
                        <span className="font-semibold text-sm">{streak}</span>
                        <span className="text-xs">iš eilės</span>
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {problem.category}
                        <div className="ml-4 flex gap-1">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${i < levelStreak ? 'bg-green-500' : 'bg-slate-200'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
                    <div className="p-8">
                        <div className="text-lg font-medium text-slate-800 leading-relaxed">
                            {problem.question}
                        </div>

                        {/* Input Area */}
                        <div className="mt-8">
                            {problem.type === 'CHOICE' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {problem.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleChoice(opt)}
                                            disabled={isLevelComplete}
                                            className={`
                                                p-4 rounded-xl border-2 font-bold text-lg transition-all
                                                ${userAnswer === opt
                                                    ? (feedback.type === 'success' ? 'border-green-500 bg-green-50 text-green-700'
                                                        : feedback.type === 'error' ? 'border-red-500 bg-red-50 text-red-700' : 'border-indigo-500 bg-indigo-50 text-indigo-700')
                                                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'
                                                }
                                            `}
                                        >
                                            <Latex>{opt}</Latex>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="relative">
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        {/* Variable is always x */}
                                        <div className="text-2xl font-mono font-bold text-slate-700">x</div>

                                        {/* Symbol Selector */}
                                        <div className="flex gap-2">
                                            {['>', '<', '\\ge', '\\le'].map(sym => (
                                                <button
                                                    key={sym}
                                                    type="button"
                                                    disabled={isLevelComplete}
                                                    onClick={() => setSelectedSymbol(sym)}
                                                    className={`
                                                        w-12 h-12 flex items-center justify-center rounded-xl text-xl transition-all
                                                        ${selectedSymbol === sym
                                                            ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                                            : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'}
                                                    `}
                                                >
                                                    <Latex>{sym}</Latex>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Number Input */}
                                        <input
                                            type="number"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            disabled={isLevelComplete}
                                            placeholder="..."
                                            className={`
                                                w-32 text-2xl p-3 text-center rounded-xl border-2 outline-none transition-all placeholder:text-slate-300 font-mono
                                                ${feedback.type === 'error'
                                                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500'
                                                    : isLevelComplete
                                                        ? 'border-green-300 bg-green-50 text-green-900'
                                                        : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                                                }
                                            `}
                                        />
                                    </div>

                                    {!isLevelComplete && (
                                        <div className="mt-6 flex justify-center">
                                            <button
                                                type="submit"
                                                disabled={!userAnswer || !selectedSymbol}
                                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
                                            >
                                                Tikrinti
                                            </button>
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Feedback & Actions */}
                    {(feedback.message || isLevelComplete) && (
                        <div className={`p-4 border-t ${getFeedbackStyles() ? getFeedbackStyles() : 'border-slate-100 bg-slate-50'}`}>
                            <div className="flex items-start gap-3">
                                {feedback.type === 'success' && <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />}
                                {feedback.type === 'error' && <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />}
                                {feedback.type === 'warning' && <HelpCircle className="w-6 h-6 shrink-0 mt-0.5" />}
                                <div>
                                    <p className="font-bold text-lg">{feedback.message}</p>
                                    {isLevelComplete && (
                                        <div className="flex gap-3 mt-4">
                                            {/* Show 'Next Problem' unless we have 3 wins and can move on */}
                                            {levelStreak < 3 ? (
                                                <button
                                                    onClick={handleRepeat}
                                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2 shadow-md"
                                                >
                                                    Kitas pratimas <ArrowRight className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleNextLevel}
                                                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform active:scale-95"
                                                >
                                                    Kitas lygis <ArrowRight className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hints */}
                <div className="mt-6 space-y-3">
                    {revealedHints.map((hintIndex) => (
                        <div key={hintIndex} className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-blue-600">{hintIndex + 1}</span>
                            </div>
                            <div className="text-slate-700">
                                {problem.hints[hintIndex]}
                            </div>
                        </div>
                    ))}

                    {!isLevelComplete && revealedHints.length < problem.hints.length && (
                        <button
                            onClick={handleHint}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <HelpCircle className="w-4 h-4" />
                            {revealedHints.length === 0 ? "Reikia pagalbos?" : "Rodyti kitą užuominą"}
                        </button>
                    )}
                </div>
            </main>
        </div>
    );

    function getFeedbackStyles() {
        switch (feedback.type) {
            case 'success': return "bg-green-100 text-green-800 border-green-300";
            case 'warning': return "bg-amber-100 text-amber-800 border-amber-300";
            case 'error': return "bg-red-100 text-red-800 border-red-300";
            default: return "";
        }
    }
}
