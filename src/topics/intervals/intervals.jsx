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
    X,
    List,
    Lock,
    ChevronDown,
    ArrowLeft,
    Home,
    Unlock,
    CheckSquare,
    Square,
    AlertTriangle
} from 'lucide-react';
import Latex from '../../components/Latex';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- UTILS FOR DRAWING ---

const NumberLine = ({ a, b, type }) => {
    // type: 0: (a, b), 1: [a, b], 2: [a, b), 3: (a, b]
    //       4: (a, +inf), 5: [a, +inf), 6: (-inf, a), 7: (-inf, a]

    // Config
    const width = 280;
    const height = 80; // Increased height to fit text
    const midY = 35;   // Moved axis up to make space for numbers below

    // Determine logical range to display
    let rangeStart, rangeEnd, val1, val2;

    const isDouble = type < 4;

    if (isDouble) {
        val1 = a;
        val2 = b;
        const diff = b - a;
        const padding = Math.max(1, diff * 0.5);
        rangeStart = a - padding;
        rangeEnd = b + padding;
    } else {
        val1 = a; // The boundary point
        rangeStart = a - 3;
        rangeEnd = a + 3;
    }

    // Map logical value to pixel x
    const scale = (val) => {
        const percent = (val - rangeStart) / (rangeEnd - rangeStart);
        return 20 + percent * (width - 60); // Keep padding for arrow/labels
    };

    const x1 = scale(val1);
    const x2 = isDouble ? scale(val2) : null;

    // Determine boundaries for shading
    let shadeStart = x1;
    let shadeEnd = x1;

    if (isDouble) {
        shadeEnd = x2;
    } else {
        if (type === 4 || type === 5) { // To +inf
            shadeEnd = width - 15;
        } else { // To -inf
            shadeStart = 20;
            shadeEnd = x1;
        }
    }

    // Generate hatch lines
    const hatches = [];
    for (let x = shadeStart; x <= shadeEnd; x += 4) {
        hatches.push(<line key={x} x1={x} y1={midY} x2={x} y2={midY - 12} stroke="#333" strokeWidth="1" />);
    }

    // Determine circle styles
    const getCircle = (cx, filled, label) => (
        <g key={cx}>
            <circle
                cx={cx}
                cy={midY}
                r={4}
                fill={filled ? "#333" : "white"}
                stroke="#333"
                strokeWidth="2"
            />
            <text x={cx} y={midY + 25} textAnchor="middle" fontSize="14" fill="#333" fontFamily="serif">
                {label}
            </text>
        </g>
    );

    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none pointer-events-none">
            {/* Arrow / Axis */}
            <line x1="10" y1={midY} x2={width - 10} y2={midY} stroke="#333" strokeWidth="2" />
            <path d={`M${width - 12},${midY - 5} L${width - 2},${midY} L${width - 12},${midY + 5}`} fill="none" stroke="#333" strokeWidth="2" />
            <text x={width - 5} y={midY + 20} textAnchor="middle" fontSize="16" fill="#333" fontStyle="italic" fontFamily="serif">X</text>

            {/* Shading */}
            {hatches}

            {/* Boundary Points */}
            {/* 0: (), 1: [], 2: [), 3: (] */}
            {type === 0 && <>{getCircle(x1, false, a)}{getCircle(x2, false, b)}</>}
            {type === 1 && <>{getCircle(x1, true, a)}{getCircle(x2, true, b)}</>}
            {type === 2 && <>{getCircle(x1, true, a)}{getCircle(x2, false, b)}</>}
            {type === 3 && <>{getCircle(x1, false, a)}{getCircle(x2, true, b)}</>}

            {/* 4: (a; +inf), 5: [a; +inf), 6: (-inf; a), 7: (-inf; a] */}
            {type === 4 && getCircle(x1, false, a)}
            {type === 5 && getCircle(x1, true, a)}
            {type === 6 && getCircle(x1, false, a)}
            {type === 7 && getCircle(x1, true, a)}
        </svg>
    );
};

// --- PROBLEM GENERATORS ---

const generateValueSelectionProblem = () => {
    const boundary = randomInt(-10, 10);
    // 0: >, 1: >=, 2: <, 3: <=
    const type = randomInt(0, 3);

    let inequalityLatex = "";
    let checkFn = null;
    let symbol = "";

    switch (type) {
        case 0: // x > a
            inequalityLatex = `x > ${boundary}`;
            checkFn = (x) => x > boundary;
            symbol = ">";
            break;
        case 1: // x >= a
            inequalityLatex = `x \\ge ${boundary}`;
            checkFn = (x) => x >= boundary;
            symbol = "\\ge";
            break;
        case 2: // x < a
            inequalityLatex = `x < ${boundary}`;
            checkFn = (x) => x < boundary;
            symbol = "<";
            break;
        case 3: // x <= a
            inequalityLatex = `x \\le ${boundary}`;
            checkFn = (x) => x <= boundary;
            symbol = "\\le";
            break;
    }

    let candidates = new Set();
    candidates.add(boundary); // Always include the boundary to test strictness

    while (candidates.size < 4) {
        candidates.add(boundary + randomInt(-5, 5));
    }

    const options = Array.from(candidates).sort((a, b) => a - b);
    const correctOptions = options.filter(checkFn);

    const hints = [
        <span>Statykite kiekvieną skaičių vietoje <Latex>{'x'}</Latex> ir tikrinkite ar nelygybė teisinga.</span>,
        <span>
            Pavyzdžiui, ar <Latex>{`${options[0]} ${symbol} ${boundary}`}</Latex>?
            {checkFn(options[0]) ? " Taip." : " Ne."}
        </span>,
        <span>
            Teisingi atsakymai: {correctOptions.join(", ")}.
        </span>
    ];

    return {
        id: `values-${Date.now()}`,
        category: '1 Lygis: Skaičių parinkimas',
        type: 'MULTI_SELECT',
        renderOptionsAsLatex: false,
        options: options,
        question: (
            <span>
                Kurie skaičiai tenkina nelygybę <Latex>{inequalityLatex}</Latex>?
                <br />
                <span className="text-sm text-slate-500 font-normal mt-2 block">(Pasirinkite visus tinkamus variantus)</span>
            </span>
        ),
        answer: correctOptions,
        hints: hints
    };
};

const generateIntervalProblem = () => {
    const isDecimal = Math.random() > 0.5;
    let a, b;
    if (isDecimal) {
        a = randomInt(-20, 16) / 2;
        b = a + randomInt(1, 10) / 2;
        if (a === b) b += 0.5;
    } else {
        a = randomInt(-10, 10);
        b = a + randomInt(1, 10);
    }

    // Types: 0: (), 1: [], 2: [), 3: (], 4: (a; +inf), 5: [a; +inf), 6: (-inf; a), 7: (-inf; a]
    const type = randomInt(0, 7);

    let inequality = "";
    let interval = "";
    let explanation = null;

    switch (type) {
        case 0: // (a; b)
            inequality = `${a} < x < ${b}`;
            interval = `(${a}; ${b})`;
            explanation = <>Kairėje yra griežta (<Latex>{'<'}</Latex>), dešinėje yra griežta (<Latex>{'<'}</Latex>).</>;
            break;
        case 1: // [a; b]
            inequality = `${a} \\le x \\le ${b}`;
            interval = `[${a}; ${b}]`;
            explanation = <>Kairėje yra negriežta (<Latex>{'\\le'}</Latex>), dešinėje yra negriežta (<Latex>{'\\le'}</Latex>).</>;
            break;
        case 2: // [a; b)
            inequality = `${a} \\le x < ${b}`;
            interval = `[${a}; ${b})`;
            explanation = <>Kairėje yra negriežta (<Latex>{'\\le'}</Latex>), dešinėje yra griežta (<Latex>{'<'}</Latex>).</>;
            break;
        case 3: // (a; b]
            inequality = `${a} < x \\le ${b}`;
            interval = `(${a}; ${b}]`;
            explanation = <>Kairėje yra griežta (<Latex>{'<'}</Latex>), dešinėje yra negriežta (<Latex>{'\\le'}</Latex>).</>;
            break;
        case 4: // (a; +∞)
            inequality = `x > ${a}`;
            interval = `(${a}; +\\infty)`;
            explanation = <>Nelygybė yra griežta (<Latex>{'>'}</Latex>), todėl prie skaičiaus rašome paprastą skliaustą. Prie begalybės visada rašome paprastą skliaustą.</>;
            break;
        case 5: // [a; +∞)
            inequality = `x \\ge ${a}`;
            interval = `[${a}; +\\infty)`;
            explanation = <>Nelygybė yra negriežta (<Latex>{'\\ge'}</Latex>), todėl prie skaičiaus rašome laužtinį skliaustą. Prie begalybės visada rašome paprastą skliaustą.</>;
            break;
        case 6: // (-∞; a)
            inequality = `x < ${a}`;
            interval = `(-\\infty; ${a})`;
            explanation = <>Nelygybė yra griežta (<Latex>{'<'}</Latex>), todėl prie skaičiaus rašome paprastą skliaustą. Prie begalybės visada rašome paprastą skliaustą.</>;
            break;
        case 7: // (-∞; a]
            inequality = `x \\le ${a}`;
            interval = `(-\\infty; ${a}]`;
            explanation = <>Nelygybė yra negriežta (<Latex>{'\\le'}</Latex>), todėl prie skaičiaus rašome laužtinį skliaustą. Prie begalybės visada rašome paprastą skliaustą.</>;
            break;
    }

    const options = [];
    if (type < 4) {
        const bracketPairs = [["(", ")"], ["[", "]"], ["[", ")"], ["(", "]"]];
        bracketPairs.forEach(pair => options.push(`${pair[0]}${a}; ${b}${pair[1]}`));
    } else {
        options.push(`(${a}; +\\infty)`);
        options.push(`[${a}; +\\infty)`);
        options.push(`(-\\infty; ${a})`);
        options.push(`(-\\infty; ${a}]`);
    }

    options.sort(() => Math.random() - 0.5);

    const hints = [
        <span>Griežta nelygybė (<Latex>{`<`}</Latex> arba <Latex>{`>`}</Latex>) atitinka paprastus skliaustus <Latex>{`()`}</Latex>.</span>,
        <span>Negriežta nelygybė (<Latex>{`\\le`}</Latex> arba <Latex>{`\\ge`}</Latex>) atitinka laužtinius skliaustus <Latex>{`[]`}</Latex>.</span>,
        <span>
            Šiuo atveju: <Latex>{inequality}</Latex>.<br />
            {explanation}<br />
            Todėl intervalas yra <Latex>{interval}</Latex>.<br />
            <strong>Atsakymas: <Latex>{interval}</Latex></strong>
        </span>
    ];

    return {
        id: `interval-${Date.now()}`,
        category: '2 Lygis: Nelygybės ir Intervalai',
        type: 'CHOICE',
        renderOptionsAsLatex: true,
        options: options,
        question: (
            <span>
                Kuris duotų intervalų atitinka nelygybę <Latex>{inequality}</Latex>?
            </span>
        ),
        answer: interval,
        hints: hints
    };
};

const generateInequalityFromIntervalProblem = () => {
    const isDecimal = Math.random() > 0.5;
    let a, b;
    if (isDecimal) {
        a = randomInt(-20, 16) / 2;
        b = a + randomInt(1, 10) / 2;
        if (a === b) b += 0.5;
    } else {
        a = randomInt(-10, 10);
        b = a + randomInt(1, 10);
    }

    const type = randomInt(0, 7);
    let inequality = "";
    let interval = "";
    let explanation = null;

    switch (type) {
        case 0: // (a; b)
            inequality = `${a} < x < ${b}`;
            interval = `(${a}; ${b})`;
            explanation = <>Paprasti skliaustai <Latex>{'()'}</Latex> atitinka griežtas nelygybes (<Latex>{'<'}</Latex>).</>;
            break;
        case 1: // [a; b]
            inequality = `${a} \\le x \\le ${b}`;
            interval = `[${a}; ${b}]`;
            explanation = <>Laužtiniai skliaustai <Latex>{'[]'}</Latex> atitinka negriežtas nelygybes (<Latex>{'\\le'}</Latex>).</>;
            break;
        case 2: // [a; b)
            inequality = `${a} \\le x < ${b}`;
            interval = `[${a}; ${b})`;
            explanation = <>Laužtinis skliaustas <Latex>{'['}</Latex> atitinka negriežtą nelygybę (<Latex>{'\\le'}</Latex>), o paprastas <Latex>{')'}</Latex> - griežtą (<Latex>{'<'}</Latex>).</>;
            break;
        case 3: // (a; b]
            inequality = `${a} < x \\le ${b}`;
            interval = `(${a}; ${b}]`;
            explanation = <>Paprastas skliaustas <Latex>{'('}</Latex> atitinka griežtą nelygybę (<Latex>{'<'}</Latex>), o laužtinis <Latex>{']'}</Latex> - negriežtą (<Latex>{'\\le'}</Latex>).</>;
            break;
        case 4: // (a; +∞)
            inequality = `x > ${a}`;
            interval = `(${a}; +\\infty)`;
            explanation = <>Paprastas skliaustas prie skaičiaus reiškia griežtą nelygybę. Kadangi intervalas eina į plius begalybę, tai <Latex>{`x > ${a}`}</Latex>.</>;
            break;
        case 5: // [a; +∞)
            inequality = `x \\ge ${a}`;
            interval = `[${a}; +\\infty)`;
            explanation = <>Laužtinis skliaustas prie skaičiaus reiškia negriežtą nelygybę. Kadangi intervalas eina į plius begalybę, tai <Latex>{`x \\ge ${a}`}</Latex>.</>;
            break;
        case 6: // (-∞; a)
            inequality = `x < ${a}`;
            interval = `(-\\infty; ${a})`;
            explanation = <>Paprastas skliaustas prie skaičiaus reiškia griežtą nelygybę. Kadangi intervalas eina į minus begalybę, tai <Latex>{`x < ${a}`}</Latex>.</>;
            break;
        case 7: // (-∞; a]
            inequality = `x \\le ${a}`;
            interval = `(-\\infty; ${a}]`;
            explanation = <>Laužtinis skliaustas prie skaičiaus reiškia negriežtą nelygybę. Kadangi intervalas eina į minus begalybę, tai <Latex>{`x \\le ${a}`}</Latex>.</>;
            break;
    }

    const options = [];
    if (type < 4) {
        options.push(`${a} < x < ${b}`);
        options.push(`${a} \\le x \\le ${b}`);
        options.push(`${a} \\le x < ${b}`);
        options.push(`${a} < x \\le ${b}`);
    } else {
        options.push(`x > ${a}`);
        options.push(`x \\ge ${a}`);
        options.push(`x < ${a}`);
        options.push(`x \\le ${a}`);
    }

    options.sort(() => Math.random() - 0.5);

    const hints = [
        <span>Paprasti skliaustai <Latex>{`()`}</Latex> reiškia griežtą nelygybę (<Latex>{`<`}</Latex> arba <Latex>{`>`}</Latex>).</span>,
        <span>Laužtiniai skliaustai <Latex>{`[]`}</Latex> reiškia negriežtą nelygybę (<Latex>{`\\le`}</Latex> arba <Latex>{`\\ge`}</Latex>).</span>,
        <span>
            Šiuo atveju intervalas yra <Latex>{interval}</Latex>.<br />
            {explanation}<br />
            Todėl nelygybė yra <Latex>{inequality}</Latex>.<br />
            <strong>Atsakymas: <Latex>{inequality}</Latex></strong>
        </span>
    ];

    return {
        id: `inequality-${Date.now()}`,
        category: '3 Lygis: Intervalai į Nelygybes',
        type: 'CHOICE',
        renderOptionsAsLatex: true,
        options: options,
        question: (
            <span>
                Kuri duotų nelygybių atitinka intervalą <Latex>{interval}</Latex>?
            </span>
        ),
        answer: inequality,
        hints: hints
    };
};

const generateInequalityToGraphProblem = () => {
    const a = randomInt(-5, 5);
    const b = a + randomInt(2, 5);
    // Types: 0: (a, b), 1: [a, b], 4: (a, +inf), 5: [a, +inf), 6: (-inf, a)
    const availableTypes = [0, 1, 4, 5, 6, 7];
    const type = availableTypes[randomInt(0, availableTypes.length - 1)];

    let inequality = "";
    let correctId = `opt-${randomInt(1000, 9999)}`;

    // Determine inequality text
    switch (type) {
        case 0: inequality = `${a} < x < ${b}`; break;
        case 1: inequality = `${a} \\le x \\le ${b}`; break;
        case 4: inequality = `x > ${a}`; break;
        case 5: inequality = `x \\ge ${a}`; break;
        case 6: inequality = `x < ${a}`; break;
        case 7: inequality = `x \\le ${a}`; break;
    }

    // Generate option objects { id, component, isCorrect }
    let rawOptions = [];

    // Correct option
    rawOptions.push({
        id: correctId,
        component: <NumberLine a={a} b={b} type={type} />,
        isCorrect: true
    });

    // Distractor 1: Wrong strictness (open vs closed)
    let d1Type = type;
    if (type === 0) d1Type = 1; else if (type === 1) d1Type = 0;
    else if (type === 4) d1Type = 5; else if (type === 5) d1Type = 4;
    else if (type === 6) d1Type = 7; else if (type === 7) d1Type = 6;

    rawOptions.push({
        id: `opt-${randomInt(1000, 9999)}`,
        component: <NumberLine a={a} b={b} type={d1Type} />,
        isCorrect: false
    });

    // Distractor 2: Wrong direction or wrong interval bounds
    let d2Type = type;
    if (type < 4) {
        // Double bound -> Single bound distractor or different bounds
        d2Type = 4; // x > a
    } else if (type >= 4 && type <= 5) {
        // Greater than -> Less than
        d2Type = type + 2; // Flip direction
    } else {
        // Less than -> Greater than
        d2Type = type - 2;
    }
    rawOptions.push({
        id: `opt-${randomInt(1000, 9999)}`,
        component: <NumberLine a={a} b={b} type={d2Type} />,
        isCorrect: false
    });

    // Distractor 3: Shifted number or completely different
    rawOptions.push({
        id: `opt-${randomInt(1000, 9999)}`,
        component: <NumberLine a={a + (randomInt(0, 1) === 0 ? 1 : -1)} b={b} type={type} />,
        isCorrect: false
    });

    // Shuffle options
    rawOptions.sort(() => Math.random() - 0.5);

    const hints = [
        <span>Ar nelygybė griežta (<Latex>{'<'}</Latex>, <Latex>{'>'}</Latex>), ar negriežta (<Latex>{'\\le'}</Latex>, <Latex>{'\\ge'}</Latex>)?</span>,
        <span>Griežta nelygybė žymima tuščiu rutuliuku, negriežta - pilnu.</span>,
        <span>Raskite grafiką, kurio užtušuota dalis ir rutuliukai atitinka <Latex>{inequality}</Latex>.</span>
    ];

    return {
        id: `graph-select-${Date.now()}`,
        category: '4 Lygis: Nelygybės į Grafikus',
        type: 'CHOICE',
        renderOptionsAsLatex: false, // Options are components
        options: rawOptions.map(o => o.id), // We store IDs as answer keys
        optionComponents: rawOptions.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.component }), {}),
        question: (
            <span>
                Kuris grafikas atitinka nelygybę <Latex>{inequality}</Latex>?
            </span>
        ),
        answer: correctId,
        hints: hints
    };
};

const generateGraphToInequalityProblem = () => {
    const a = randomInt(-5, 5);
    const b = a + randomInt(2, 5);
    // Types: 0: (a, b), 1: [a, b], 4: (a, +inf), 5: [a, +inf), 6: (-inf, a)
    const availableTypes = [0, 1, 4, 5, 6, 7];
    const type = availableTypes[randomInt(0, availableTypes.length - 1)];

    let correctInequality = "";
    switch (type) {
        case 0: correctInequality = `${a} < x < ${b}`; break;
        case 1: correctInequality = `${a} \\le x \\le ${b}`; break;
        case 4: correctInequality = `x > ${a}`; break;
        case 5: correctInequality = `x \\ge ${a}`; break;
        case 6: correctInequality = `x < ${a}`; break;
        case 7: correctInequality = `x \\le ${a}`; break;
    }

    const options = [];
    options.push(correctInequality);

    // Generate distractors
    const addDistractor = (t, valA, valB) => {
        let txt = "";
        switch (t) {
            case 0: txt = `${valA} < x < ${valB}`; break;
            case 1: txt = `${valA} \\le x \\le ${valB}`; break;
            case 2: txt = `${valA} \\le x < ${valB}`; break;
            case 3: txt = `${valA} < x \\le ${valB}`; break;
            case 4: txt = `x > ${valA}`; break;
            case 5: txt = `x \\ge ${valA}`; break;
            case 6: txt = `x < ${valA}`; break;
            case 7: txt = `x \\le ${valA}`; break;
        }
        if (!options.includes(txt) && txt !== "") options.push(txt);
    };

    // 1. Wrong strictness
    let d1Type = type;
    if (type === 0) d1Type = 1; else if (type === 1) d1Type = 0;
    else if (type === 4) d1Type = 5; else if (type === 5) d1Type = 4;
    else if (type === 6) d1Type = 7; else if (type === 7) d1Type = 6;
    addDistractor(d1Type, a, b);

    // 2. Wrong direction
    let d2Type = type;
    if (type >= 4 && type <= 5) d2Type = type + 2;
    else if (type >= 6) d2Type = type - 2;
    else d2Type = 4; // For intervals, maybe show single bound
    addDistractor(d2Type, a, b);

    // 3. Just fill randoms until 4
    let safeCount = 0;
    while (options.length < 4 && safeCount < 10) {
        addDistractor(randomInt(0, 7), a, b);
        safeCount++;
    }

    options.sort(() => Math.random() - 0.5);

    const hints = [
        <span>Pažiūrėkite į rutuliuką: tuščias reiškia griežtą nelygybę, pilnas - negriežtą.</span>,
        <span>Jei užtušuota į dešinę nuo skaičiaus, tai daugiau (<Latex>{`>`}</Latex>). Jei į kairę - mažiau (<Latex>{`<`}</Latex>).</span>,
        <span>
            <strong>Atsakymas: <Latex>{correctInequality}</Latex></strong>
        </span>
    ];

    return {
        id: `ineq-select-${Date.now()}`,
        category: '5 Lygis: Grafikai į Nelygybes',
        type: 'CHOICE',
        renderOptionsAsLatex: true,
        options: options,
        question: (
            <div className="flex flex-col items-center">
                <span className="mb-4">Kuri nelygybė atitinka pateiktą grafiką?</span>
                <div className="w-full max-w-md p-4 bg-white rounded-lg border border-slate-200">
                    <NumberLine a={a} b={b} type={type} />
                </div>
            </div>
        ),
        answer: correctInequality,
        hints: hints
    };
};

const homeworkFlow = [
    generateValueSelectionProblem,
    generateIntervalProblem,
    generateInequalityFromIntervalProblem,
    generateInequalityToGraphProblem,
    generateGraphToInequalityProblem
];

const levelCategories = homeworkFlow.map(fn => fn().category);

export default function IntervalsTopic() {
    const navigate = useNavigate();
    const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
        const saved = localStorage.getItem('intervals_level');
        return saved !== null ? parseInt(saved, 10) : 0;
    });

    const [problem, setProblem] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);

    const [feedback, setFeedback] = useState({ type: null, message: "" });
    const [revealedHints, setRevealedHints] = useState([]);

    // Track if the user has made a mistake on the CURRENT problem
    const [hasMadeMistake, setHasMadeMistake] = useState(false);
    // Track if the user has successfully passed the level logic (clean run)
    const [levelPassed, setLevelPassed] = useState(false);

    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('intervals_progress');
        return saved !== null ? parseFloat(saved) : 0;
    });

    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem('intervals_streak');
        return saved !== null ? parseInt(saved, 10) : 0;
    });

    const [showModal, setShowModal] = useState(() => {
        const saved = localStorage.getItem('intervals_showModal');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [isLevelComplete, setIsLevelComplete] = useState(false);

    const [maxLevelReached, setMaxLevelReached] = useState(() => {
        const savedMax = localStorage.getItem('intervals_max_level');
        const savedCurrent = localStorage.getItem('intervals_level');
        const current = savedCurrent !== null ? parseInt(savedCurrent, 10) : 0;
        const max = savedMax !== null ? parseInt(savedMax, 10) : 0;
        return Math.max(current, max);
    });

    const [showLevelMenu, setShowLevelMenu] = useState(false);
    const [isGameComplete, setIsGameComplete] = useState(false);

    useEffect(() => { localStorage.setItem('intervals_level', currentLevelIndex); }, [currentLevelIndex]);
    useEffect(() => { localStorage.setItem('intervals_progress', progress); }, [progress]);
    useEffect(() => { localStorage.setItem('intervals_streak', streak); }, [streak]);
    useEffect(() => { localStorage.setItem('intervals_showModal', JSON.stringify(showModal)); }, [showModal]);
    useEffect(() => { localStorage.setItem('intervals_max_level', maxLevelReached); }, [maxLevelReached]);

    useEffect(() => {
        if (currentLevelIndex > maxLevelReached) {
            setMaxLevelReached(currentLevelIndex);
        }
    }, [currentLevelIndex, maxLevelReached]);

    useEffect(() => {
        const minProgress = (maxLevelReached / homeworkFlow.length) * 100;
        setProgress(prev => Math.max(prev, minProgress));
    }, [maxLevelReached]);

    useEffect(() => {
        if (!problem) loadProblem(currentLevelIndex);
    }, []);

    const loadProblem = (idx) => {
        const generator = homeworkFlow[idx % homeworkFlow.length];
        const newProb = generator();
        setProblem(newProb);
        setFeedback({ type: null, message: "" });
        setUserAnswer("");
        setSelectedOptions([]);
        setRevealedHints([]);
        setIsLevelComplete(false);
        setHasMadeMistake(false); // Reset mistake flag for new problem
        setLevelPassed(false);
    };

    const handleLevelComplete = () => {
        const isLastLevel = currentLevelIndex === homeworkFlow.length - 1;
        setIsLevelComplete(true);
        setRevealedHints(problem.hints.map((_, i) => i));

        const isCleanRun = !hasMadeMistake && revealedHints.length === 0;

        if (isCleanRun) {
            setLevelPassed(true);
            setStreak(s => s + 1);
            const newProgress = Math.min(100, ((currentLevelIndex + 1) / homeworkFlow.length) * 100);
            setProgress(prev => Math.max(prev, newProgress));
            setFeedback({
                type: 'success',
                message: isLastLevel ? "Sveikiname! Įveikėte visą temą!" : "Puiku! Atsakymas teisingas."
            });
        } else {
            setLevelPassed(false);
            setStreak(0);
            setFeedback({
                type: 'warning',
                message: "Atsakymas teisingas. Tačiau norint pereiti lygį, reikia atsakyti be klaidų ir užuominų."
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

    const submitChoiceAnswer = (val) => {
        const normalizedUser = val.toString().trim().toLowerCase();
        const normalizedCorrect = problem.answer.toString().trim().toLowerCase();

        if (normalizedUser === normalizedCorrect) {
            handleLevelComplete();
        } else {
            setFeedback({ type: 'error', message: "Neteisingai. Bandykite dar kartą" });
            setStreak(0);
            setHasMadeMistake(true); // Mark as failed first try
        }
    };

    const submitMultiAnswer = () => {
        if (selectedOptions.length === 0) return;

        const sortedSelected = [...selectedOptions].sort((a, b) => a - b);
        const sortedCorrect = [...problem.answer].sort((a, b) => a - b);

        const isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);

        if (isCorrect) {
            handleLevelComplete();
        } else {
            const missing = sortedCorrect.filter(x => !sortedSelected.includes(x));
            const extras = sortedSelected.filter(x => !sortedCorrect.includes(x));

            let msg = "Neteisingai.";
            if (missing.length > 0 && extras.length === 0) msg = "Neteisingai. Nepasirinkote visų tinkamų skaičių.";
            else if (extras.length > 0 && missing.length === 0) msg = "Neteisingai. Pasirinkote netinkamų skaičių.";

            setFeedback({ type: 'error', message: msg });
            setStreak(0);
            setHasMadeMistake(true); // Mark as failed first try
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (problem.type === 'MULTI_SELECT') {
            submitMultiAnswer();
        } else {
            if (!userAnswer) return;
            submitChoiceAnswer(userAnswer);
        }
    };

    const handleChoice = (option) => {
        if (problem.type === 'MULTI_SELECT') {
            setSelectedOptions(prev => {
                if (prev.includes(option)) {
                    return prev.filter(item => item !== option);
                } else {
                    return [...prev, option];
                }
            });
            if (feedback.type === 'error') setFeedback({ type: null, message: "" });
        } else {
            setUserAnswer(option);
            submitChoiceAnswer(option);
        }
    };

    const handleHint = () => {
        if (revealedHints.length === 0) setRevealedHints([0]);
        // Using a hint also invalidates a clean run
        // We handle this check in handleLevelComplete via revealedHints.length
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
                    <p className="text-slate-500 mb-8 text-lg">Jūs sėkmingai įveikėte visus lygius!</p>
                    <div className="space-y-4">
                        <button onClick={handleBackToGame} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2">
                            <ArrowLeft className="w-5 h-5" /> Grįžti
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleUnlockAll = () => {
        const lastLevel = homeworkFlow.length - 1;
        setMaxLevelReached(lastLevel);
        setCurrentLevelIndex(lastLevel);
        loadProblem(lastLevel);
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
                            HomeworkLab <span className="text-slate-400 font-normal text-sm hidden sm:inline">| Intervalai</span>
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
                                <button onClick={() => setShowLevelMenu(!showLevelMenu)} className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer">
                                    <List className="w-4 h-4" /> Lygis {currentLevelIndex + 1}/{homeworkFlow.length}
                                    <ChevronDown className={`w-3 h-3 transition-transform ${showLevelMenu ? 'rotate-180' : ''}`} />
                                </button>
                                {showLevelMenu && (
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-2 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">Pasirinkite lygį</div>
                                        <div className="max-h-[60vh] overflow-y-auto">
                                            {levelCategories.map((cat, idx) => {
                                                const isLocked = idx > maxLevelReached;
                                                const isActive = idx === currentLevelIndex;
                                                return (
                                                    <button key={idx} disabled={isLocked} onClick={() => { setCurrentLevelIndex(idx); loadProblem(idx); setShowLevelMenu(false); }}
                                                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : ''} ${isLocked ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:bg-slate-50 text-slate-700'}`}>
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${isActive ? 'bg-indigo-600 text-white border-indigo-600' : ''} ${!isActive && !isLocked ? 'bg-white text-slate-500 border-slate-200' : ''} ${isLocked ? 'bg-slate-100 text-slate-400 border-slate-200' : ''}`}>
                                                            {isLocked ? <Lock className="w-3 h-3" /> : idx + 1}
                                                        </div>
                                                        <div className="flex-1 text-sm truncate">{cat.split(': ')[1] || cat}</div>
                                                        {isActive && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <span className="flex items-center gap-1"><Award className={`w-4 h-4 ${streak > 2 ? 'text-amber-500' : 'text-slate-300'}`} /> {streak}</span>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700 ease-out relative" style={{ width: `${progress}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/30 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto p-4 mt-6 pb-20">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300">
                    <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                        <div><span className="font-semibold tracking-wide uppercase text-xs opacity-75 block">Užduotis</span><span className="font-bold text-sm md:text-base">{problem.category}</span></div>
                        <span className={`text-xs px-2 py-1 rounded-md font-mono ${revealedHints.length > 0 ? 'bg-amber-500' : 'bg-indigo-500'}`}>{revealedHints.length}/{problem.hints.length} Užuominos</span>
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="text-xl leading-relaxed text-slate-800 mb-8 font-medium">{problem.question}</div>
                        {feedback.message && (
                            <div className={`p-4 mb-8 rounded-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 ${getFeedbackStyles()}`}>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 shrink-0">{feedback.type === 'success' && <CheckCircle className="w-6 h-6" />}{feedback.type === 'error' && <X className="w-6 h-6" />}{feedback.type === 'warning' && <AlertTriangle className="w-6 h-6" />}</div>
                                    <div className="text-sm font-medium pt-0.5">{feedback.message}</div>
                                </div>
                                {isLevelComplete && (
                                    <div className="flex gap-3 mt-2 pl-9">
                                        {levelPassed ? (
                                            <button onClick={handleNextLevel} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                                                Kitas lygis <ArrowRight className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button onClick={handleRepeat} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                                                Bandyti dar kartą <RotateCw className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        {revealedHints.length > 0 && (
                            <div className="mb-8 space-y-3 bg-amber-50 p-4 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-2">
                                <h3 className="text-amber-800 font-bold text-sm flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Pagalba</h3>
                                {problem.hints.map((hint, idx) => {
                                    const isRevealed = revealedHints.includes(idx);
                                    return (
                                        <div key={idx} onClick={() => { if (!isRevealed) setRevealedHints(prev => [...prev, idx]); }} className={`text-sm p-3 rounded-lg border shadow-sm transition-all relative overflow-hidden ${isRevealed ? 'bg-white/60 text-amber-900 border-amber-100/50' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-pointer hover:bg-slate-200'}`}>
                                            <div className={`transition-all duration-500 ${isRevealed ? '' : 'blur-sm select-none'}`}><span className="font-bold mr-2 text-amber-700">{idx + 1}.</span> {hint}</div>
                                            {!isRevealed && <div className="absolute inset-0 flex items-center justify-center bg-white/10 font-medium text-xs uppercase tracking-wider text-slate-500">Rodyti</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {problem.options.map((opt) => {
                                    const isSelected = selectedOptions.includes(opt);
                                    const isMulti = problem.type === 'MULTI_SELECT';

                                    let btnClass = "py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ";

                                    if (isMulti) {
                                        if (isSelected) btnClass += "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.02]";
                                        else btnClass += "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";
                                    } else {
                                        // For component-based options (SVGs), different spacing
                                        if (problem.optionComponents) {
                                            btnClass = "p-2 rounded-xl border-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 hover:bg-indigo-50 bg-white border-slate-200";
                                        } else {
                                            btnClass += "border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 bg-white";
                                        }
                                    }

                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => handleChoice(opt)}
                                            disabled={isLevelComplete || (feedback.type === 'success') || (feedback.type === 'error' && !isMulti)}
                                            className={btnClass}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                {isMulti && (
                                                    isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-300" />
                                                )}
                                                {problem.optionComponents ? problem.optionComponents[opt] : (problem.renderOptionsAsLatex ? <Latex>{opt}</Latex> : opt)}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {problem.type === 'MULTI_SELECT' && !isLevelComplete && (
                                <button
                                    onClick={submitMultiAnswer}
                                    disabled={selectedOptions.length === 0}
                                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-95"
                                >
                                    Tikrinti
                                </button>
                            )}

                            {(revealedHints.length === problem.hints.length || (feedback.type === 'error' && problem.type !== 'MULTI_SELECT')) && !isLevelComplete && (
                                <button onClick={handleRepeat} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-95">
                                    <RotateCw className="w-5 h-5" /> Bandyti dar kartą
                                </button>
                            )}
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={handleHint} disabled={revealedHints.length > 0 || feedback.type === 'success'} className={`text-sm font-medium flex items-center gap-1 transition-colors px-3 py-2 rounded-lg ${revealedHints.length > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}>
                                <HelpCircle className="w-4 h-4" /> {revealedHints.length > 0 ? "Užuominos rodomos" : "Rodyti užuominą"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform scale-100 transition-all">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto text-indigo-600 shadow-inner"><TrendingUp className="w-8 h-8" /></div>
                        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Skaičių Intervalai</h2>
                        <p className="text-center text-slate-500 mb-8">Mokykitės atpažinti intervalus ir nelygybes.</p>
                        <button onClick={() => setShowModal(false)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-indigo-200 active:scale-95">Pradėti</button>
                    </div>
                </div>
            )}
        </div>
    );
}