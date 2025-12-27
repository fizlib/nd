import React, { useState, useEffect, useRef } from 'react';
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
    ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- KaTeX Loader & Component ---
const useKatex = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
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

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- PROBLEM GENERATORS (GEOMETRIC PROGRESSION) ---

// LEVEL 1: Definition (Multiple Choice)
// "Is this a geometric progression?"
const generateDefinitionProblem = () => {
    const isGP = Math.random() > 0.4;
    let formula, hints;

    if (isGP) {
        const base = randomInt(2, 5);
        const multiplier = randomInt(2, 4);
        // b_n = 3 * 2^n
        formula = `b_n = ${multiplier} \\cdot ${base}^n`;

        hints = [
            <span>Sakykime, kad <Latex>n</Latex> yra laisvai pasirinktas natūralusis skaičius. Reikia įrodyti, kad <Latex>{`\\frac{b_{n+1}}{b_n} = q`}</Latex> (pastovus skaičius).</span>,
            <span>
                Apskaičiuojame santykį:<br />
                <Latex>{`\\frac{b_{n+1}}{b_n} = \\frac{${multiplier} \\cdot ${base}^{n+1}}{${multiplier} \\cdot ${base}^n}`}</Latex>
            </span>,
            <span>
                Suprastiname:<br />
                <Latex>{`= \\frac{${base}^{n+1}}{${base}^n} = ${base}`}</Latex>.<br />
                <br />
                Gavome pastovų skaičių <Latex>{base}</Latex>, kuris nepriklauso nuo <Latex>n</Latex>. Todėl ši seka <strong>yra</strong> geometrinė progresija.<br />
                <strong>Atsakymas: Taip</strong>
            </span>
        ];
    } else {
        const coeff = randomInt(2, 4);
        formula = `b_n = ${coeff}n^2`;

        hints = [
            <span>Sakykime, kad <Latex>n</Latex> yra laisvai pasirinktas natūralusis skaičius. Reikia patikrinti, ar <Latex>{`\\frac{b_{n+1}}{b_n}`}</Latex> yra pastovus skaičius.</span>,
            <span>
                Apskaičiuojame santykį:<br />
                <Latex>{`\\frac{b_{n+1}}{b_n} = \\frac{${coeff}(n+1)^2}{${coeff}n^2} = \\frac{(n+1)^2}{n^2}`}</Latex>
            </span>,
            <span>
                <Latex>{`= (\\frac{n+1}{n})^2 = (1 + \\frac{1}{n})^2`}</Latex>.<br />
                <br />
                Šis santykis priklauso nuo <Latex>n</Latex> (pvz., kai <Latex>n=1</Latex>, gauname 4, kai <Latex>n=2</Latex>, gauname 2.25).<br />
                Todėl ši seka <strong>nėra</strong> geometrinė progresija.<br />
                <strong>Atsakymas: Ne</strong>
            </span>
        ];
    }

    return {
        id: `def-gp-${Date.now()}`,
        category: '1 Lygis: Apibrėžimas',
        type: 'CHOICE',
        options: ['Taip', 'Ne'],
        question: (
            <span>
                Skaičių sekos <Latex>n</Latex>-tojo nario formulė yra <Latex>{formula}</Latex> su kiekvienu <Latex>n \in N</Latex>.<br />
                Ar ši seka yra <strong>geometrinė progresija</strong>?
            </span>
        ),
        answer: isGP ? "Taip" : "Ne",
        hints: hints
    };
};

// LEVEL 2: Simple Next Term (Input)
// "Find the next number in the sequence: 3, 6, 12..."
const generateSimpleMissingTermProblem = () => {
    const start = randomInt(1, 5);
    const ratio = randomInt(2, 4);
    const sequence = `${start}, ${start * ratio}, ${start * ratio * ratio}`;
    const answer = start * ratio * ratio * ratio;

    return {
        id: `simple-miss-gp-${Date.now()}`,
        category: '2 Lygis: Sekos Tęsimas',
        type: 'INPUT',
        question: (
            <span>
                Pratęskite geometrinę progresiją įrašydami kitą narį:<br />
                <div className="text-2xl mt-4 bg-emerald-50 p-4 rounded-lg text-center tracking-widest text-emerald-700 font-mono">
                    <Latex>{`${sequence}, \\dots`}</Latex> <span className="underline decoration-dotted text-slate-400">?</span>
                </div>
            </span>
        ),
        answer: answer.toString(),
        hints: [
            <span>Raskite vardiklį <Latex>q</Latex> (santykį tarp gretimų narių).</span>,
            <span><Latex>{`q = \\frac{${start * ratio}}{${start}} = ${ratio}`}</Latex>. Vardiklis yra {ratio}.</span>,
            <span>Paskutinį narį (<Latex>{start * ratio * ratio}</Latex>) padauginkite iš <Latex>{ratio}</Latex>.<br />
                <Latex>{`${start * ratio * ratio} \\cdot ${ratio} = ${answer}`}</Latex>.<br />
                <strong>Atsakymas: {answer}</strong></span>
        ]
    };
};

// LEVEL 3: Find Nth Term (Input)
// "Find the 6th term using formula"
const generateNthTermProblem = () => {
    const start = randomInt(1, 5);
    const ratio = randomInt(2, 3);
    const targetN = randomInt(5, 8); // Keep numbers reasonable
    const sequence = `${start}, ${start * ratio}, ${start * ratio * ratio}`;
    const answer = start * Math.pow(ratio, targetN - 1);

    return {
        id: `nth-gp-${Date.now()}`,
        category: '3 Lygis: n-tojo Nario Formulė',
        type: 'INPUT',
        question: (
            <span>
                Duota seka: <strong><Latex>{`${sequence}, \\dots`}</Latex></strong><br />
                Apskaičiuokite šios sekos <strong>{targetN}-ąjį</strong> narį (<Latex>{`b_{${targetN}}`}</Latex>).
            </span>
        ),
        answer: answer.toString(),
        hints: [
            <span>Formulė: <Latex>b_n = b_1 \cdot q^{n - 1}</Latex></span>,
            <span>Čia <Latex>{`b_1 = ${start}, q = ${ratio}, n = ${targetN}`}</Latex>.</span>,
            <span><Latex>{`b_{${targetN}} = ${start} \\cdot ${ratio}^{${targetN}-1} = ${start} \\cdot ${ratio}^{${targetN - 1}} = ${answer}`}</Latex>.<br />
                <strong>Atsakymas: {answer}</strong></span>
        ]
    };
};

// LEVEL 4: Member Check (Choice)
// "Is 162 a member of GP with b1=2, q=3?"
const generateMemberCheckProblem = () => {
    const isMember = Math.random() > 0.5;
    const b1 = randomInt(1, 5);
    const q = randomInt(2, 3);

    let target, n;

    if (isMember) {
        n = randomInt(4, 7);
        target = b1 * Math.pow(q, n - 1);
    } else {
        n = randomInt(4, 7);
        // Create a non-member
        target = b1 * Math.pow(q, n - 1) + randomInt(1, q - 1);
        if (target % q === 0) target += 1; // Ensure it's not divisible by q if possible to make it obvious
    }

    return {
        id: `mem-check-gp-${Date.now()}`,
        category: '4 Lygis: Nario Tikrinimas',
        type: 'CHOICE',
        options: ['Taip', 'Ne'],
        question: (
            <span>
                Geometrinės progresijos (<Latex>b_n</Latex>) pirmasis narys yra <Latex>b_1 = {b1}</Latex>,
                vardiklis <Latex>q = {q}</Latex>.<br />
                Ar skaičius <Latex>{target}</Latex> yra šios progresijos narys?
            </span>
        ),
        answer: isMember ? "Taip" : "Ne",
        hints: [
            <span>Naudokite <Latex>n</Latex>-tojo nario formulę: <Latex>b_n = b_1 \cdot q^{n - 1}</Latex></span>,
            <span>Įstatykite žinomus skaičius: <Latex>{`${target} = ${b1} \\cdot ${q}^{n-1}`}</Latex></span>,
            <span>
                Išreiškiame <Latex>{`${q}^{n-1}`}</Latex>:<br />
                <Latex>{`${q}^{n-1} = \\frac{${target}}{${b1}} = ${target / b1}`}</Latex>.<br />
                {Number.isInteger(target / b1)
                    ? <span>Ar <Latex>{target / b1}</Latex> yra <Latex>{q}</Latex> laipsnis? {isMember ? `Taip, ${q}^${n - 1} = ${target / b1}.` : `Ne, ${q} laipsniai yra ..., ${Math.pow(q, Math.floor(Math.log(target / b1) / Math.log(q)))}, ...`}</span>
                    : <span><Latex>{target / b1}</Latex> nėra sveikasis skaičius, todėl negali būti <Latex>{q}</Latex> laipsnis.</span>
                }<br />
                <strong>Atsakymas: {isMember ? "Taip" : "Ne"}</strong>
            </span>
        ]
    };
};

// LEVEL 5: Find First Term b1 (Input)
// "If b_4 = 24 and q=2, find b_1"
const generateFirstTermProblem = () => {
    const targetN = randomInt(3, 6);
    const q = randomInt(2, 4);
    const b1 = randomInt(1, 10);
    const targetVal = b1 * Math.pow(q, targetN - 1);

    return {
        id: `find-b1-gp-${Date.now()}`,
        category: '5 Lygis: Pirmojo Nario Radimas',
        type: 'INPUT',
        question: (
            <span>
                Apskaičiuokite <Latex>b_1</Latex>, jei žinoma:<br />
                <div className="flex justify-center gap-8 mt-4 mb-2 text-lg">
                    <Latex>{`b_{${targetN}} = ${targetVal}`}</Latex>
                    <Latex>{`q = ${q}`}</Latex>
                </div>
            </span>
        ),
        answer: b1.toString(),
        hints: [
            <span>Naudokite formulę: <Latex>b_n = b_1 \cdot q^{n - 1}</Latex></span>,
            <span>Įstatykite skaičius: <Latex>{`${targetVal} = b_1 \\cdot ${q}^{${targetN}-1}`}</Latex></span>,
            <span>
                <Latex>{`${targetVal} = b_1 \\cdot ${Math.pow(q, targetN - 1)}`}</Latex>.<br />
                <Latex>{`b_1 = ${targetVal} : ${Math.pow(q, targetN - 1)} = ${b1}`}</Latex>.<br />
                <strong>Atsakymas: {b1}</strong>
            </span>
        ]
    };
};

// LEVEL 6: Find Other Term (Input)
// "If b_3 = 12 and q=2, find b_6"
const generateOtherTermProblem = () => {
    const knownN = randomInt(2, 4);
    let targetN = randomInt(5, 7);

    const q = randomInt(2, 3);
    const b1 = randomInt(1, 5);
    const knownVal = b1 * Math.pow(q, knownN - 1);
    const targetVal = b1 * Math.pow(q, targetN - 1);

    return {
        id: `find-other-gp-${Date.now()}`,
        category: '6 Lygis: Kito Nario Radimas',
        type: 'INPUT',
        question: (
            <span>
                Apskaičiuokite <Latex>{`b_{${targetN}}`}</Latex>, jei žinoma:<br />
                <div className="flex justify-center gap-8 mt-4 mb-2 text-lg">
                    <Latex>{`b_{${knownN}} = ${knownVal}`}</Latex>
                    <Latex>{`q = ${q}`}</Latex>
                </div>
            </span>
        ),
        answer: targetVal.toString(),
        hints: [
            <span>Galite rasti <Latex>b_1</Latex> arba pasinaudoti savybe <Latex>{`b_k = b_m \\cdot q^{k-m}`}</Latex>.</span>,
            <span>
                Naudojame savybę:<br />
                <Latex>{`b_{${targetN}} = b_{${knownN}} \\cdot q^{${targetN}-${knownN}}`}</Latex>
            </span>,
            <span>
                <Latex>{`b_{${targetN}} = ${knownVal} \\cdot ${q}^{${targetN - knownN}} = ${knownVal} \\cdot ${Math.pow(q, targetN - knownN)} = ${targetVal}`}</Latex>.<br />
                <strong>Atsakymas: {targetVal}</strong>
            </span>
        ]
    };
};

// LEVEL 7: Sum (Input)
// "Find sum of first 5 members"
const generateSumProblem = () => {
    const start = randomInt(1, 5);
    const q = randomInt(2, 3);
    const n = randomInt(4, 6);
    const sequence = `${start}, ${start * q}, ${start * q * q}`;

    // Sn = b1 * (q^n - 1) / (q - 1)
    const sum = start * (Math.pow(q, n) - 1) / (q - 1);

    return {
        id: `sum-gp-${Date.now()}`,
        category: '7 Lygis: Sumos Skaičiavimas',
        type: 'INPUT',
        question: (
            <span>
                Apskaičiuokite geometrinės progresijos pirmųjų <strong>{n}</strong> narių sumą (<Latex>{`S_{${n}}`}</Latex>):<br />
                <div className="text-xl my-4 text-center font-mono text-slate-700">
                    <Latex>{`${sequence}, \\dots`}</Latex>
                </div>
            </span>
        ),
        answer: sum.toString(),
        hints: [
            <span>Formulė: <Latex>{`S_n = \\frac{b_1(q^n - 1)}{q-1}`}</Latex></span>,
            <span>
                Čia <Latex>{`b_1=${start}, q=${q}, n=${n}`}</Latex>.
            </span>,
            <span>
                Įstatome į formulę:<br />
                <Latex>{`S_{${n}} = \\frac{${start}(${q}^{${n}} - 1)}{${q}-1} = \\frac{${start}(${Math.pow(q, n)} - 1)}{${q - 1}}`}</Latex><br />
                <Latex>{`= \\frac{${start} \\cdot ${Math.pow(q, n) - 1}}{${q - 1}} = ${sum}`}</Latex>.<br />
                <strong>Atsakymas: {sum}</strong>
            </span>
        ]
    };
};

// LEVEL 8: Sum Given Last Term (Input)
// "Find sum of sequence: 2, 6, ..., 162"
const generateSumGivenLastTermProblem = () => {
    const start = randomInt(1, 5);
    const q = randomInt(2, 3);
    const n = randomInt(4, 6);
    const lastTerm = start * Math.pow(q, n - 1);
    const sum = start * (Math.pow(q, n) - 1) / (q - 1);

    const sequence = `${start}, ${start * q}, \\dots, ${lastTerm}`;

    return {
        id: `sum-last-gp-${Date.now()}`,
        category: '8 Lygis: Suma (žinomas paskutinis narys)',
        type: 'INPUT',
        question: (
            <span>
                Apskaičiuokite geometrinės progresijos visų narių sumą:<br />
                <div className="text-xl my-4 text-center font-mono text-slate-700">
                    <Latex>{`${sequence}`}</Latex>
                </div>
            </span>
        ),
        answer: sum.toString(),
        hints: [
            <span>
                Galite naudoti formulę <Latex>{`S_n = \\frac{b_n q - b_1}{q-1}`}</Latex> arba pirmiausia rasti <Latex>n</Latex>.
            </span>,
            <span>
                Žinome <Latex>{`b_1 = ${start}, b_n = ${lastTerm}`}</Latex>. Randame <Latex>{`q = ${start * q} / ${start} = ${q}`}</Latex>.
            </span>,
            <span>
                Naudojame formulę <Latex>{`S_n = \\frac{b_n q - b_1}{q-1}`}</Latex>:<br />
                <Latex>{`S_n = \\frac{${lastTerm} \\cdot ${q} - ${start}}{${q}-1} = \\frac{${lastTerm * q} - ${start}}{${q - 1}} = \\frac{${lastTerm * q - start}}{${q - 1}} = ${sum}`}</Latex>.<br />
                <strong>Atsakymas: {sum}</strong>
            </span>
        ]
    };
};

// LEVEL 9: Find Term from Sn Formula (Input)
// "Given Sn = 3(2^n - 1), find b_4"
const generateTermFromSumFormulaProblem = () => {
    const b1 = randomInt(2, 5);
    const q = randomInt(2, 3);
    const k = randomInt(3, 5);

    // Sn = b1 * (q^n - 1) / (q-1)
    // Let's make q=2 so denominator is 1, simpler formula Sn = b1(2^n - 1)
    // Or q=3, denominator 2. Let's stick to q=2 for simplicity of display or handle generic.

    // Let's use specific simple formula types: Sn = A * (q^n - 1)
    // This implies b1/(q-1) = A => b1 = A(q-1).

    const A = randomInt(2, 5);
    const simpleQ = 2; // Fixed for this problem type to keep formula clean "A(2^n - 1)"
    const simpleB1 = A * (simpleQ - 1); // = A

    const snFormula = `${A}(2^n - 1)`;

    const Sk = A * (Math.pow(2, k) - 1);
    const Sk_1 = A * (Math.pow(2, k - 1) - 1);
    const bk = Sk - Sk_1;

    return {
        id: `term-from-sn-gp-${Date.now()}`,
        category: '9 Lygis: Nario radimas iš sumos formulės',
        type: 'INPUT',
        question: (
            <span>
                Geometrinės progresijos (<Latex>b_n</Latex>) pirmųjų <Latex>n</Latex> narių suma apskaičiuojama pagal formulę <Latex>{`S_n = ${snFormula}`}</Latex>.<br />
                Apskaičiuokite šios progresijos <strong>{k}-ąjį</strong> narį (<Latex>{`b_{${k}}`}</Latex>).
            </span>
        ),
        answer: bk.toString(),
        hints: [
            <span>
                Naudojame savybę: <Latex>{`b_n = S_n - S_{n-1}`}</Latex>.<br />
                Šiuo atveju: <Latex>{`b_{${k}} = S_{${k}} - S_{${k - 1}}`}</Latex>.
            </span>,
            <span>
                Apskaičiuojame <Latex>{`S_{${k}}`}</Latex> ir <Latex>{`S_{${k - 1}}`}</Latex>:<br />
                <Latex>{`S_{${k}} = ${A}(2^{k} - 1) = ${A}(${Math.pow(2, k)} - 1) = ${Sk}`}</Latex>.<br />
                <Latex>{`S_{${k - 1}} = ${A}(2^{${k - 1}} - 1) = ${A}(${Math.pow(2, k - 1)} - 1) = ${Sk_1}`}</Latex>.
            </span>,
            <span>
                Atimame:<br />
                <Latex>{`b_{${k}} = ${Sk} - ${Sk_1} = ${bk}`}</Latex>.<br />
                <strong>Atsakymas: {bk}</strong>
            </span>
        ]
    };
};

// LEVEL 10: Find bn Formula from Sn (Choice)
// "Given Sn = 3(2^n - 1), find bn formula"
const generateFormulaFromSumProblem = () => {
    const A = randomInt(2, 5);
    const q = 2; // Fixed for simplicity
    const b1 = A; // Since Sn = A(2^n - 1), b1 = S1 = A(2-1) = A.

    const snFormula = `${A}(2^n - 1)`;

    // Correct Answer: bn = b1 * q^(n-1) = A * 2^(n-1)
    const correctAns = `${A} \\cdot 2^{n-1}`;

    // Distractors
    const options = [
        correctAns,
        `${A} \\cdot 2^n`,
        `${A * 2} \\cdot 2^{n-1}`,
        `${A} \\cdot 2^{n+1}`
    ];

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    const formattedOptions = options.map(o => `b_n = ${o}`);
    const formattedAnswer = `b_n = ${correctAns}`;

    return {
        id: `sn-to-bn-gp-${Date.now()}`,
        category: '10 Lygis: n-tojo nario formulė iš sumos',
        type: 'CHOICE',
        renderOptionsAsLatex: true,
        options: formattedOptions,
        question: (
            <span>
                Geometrinės progresijos (<Latex>b_n</Latex>) pirmųjų <Latex>n</Latex> narių suma apskaičiuojama pagal formulę <Latex>{`S_n = ${snFormula}`}</Latex>.<br />
                Raskite šios progresijos <Latex>n</Latex>-tojo nario formulę.
            </span>
        ),
        answer: formattedAnswer,
        hints: [
            <span>
                Norint rasti <Latex>n</Latex>-tojo nario formulę, reikia rasti pirmąjį narį <Latex>b_1</Latex> ir vardiklį <Latex>q</Latex>.
            </span>,
            <span>
                Randame <Latex>b_1</Latex> ir <Latex>b_2</Latex>:<br />
                <Latex>{`b_1 = S_1 = ${A}(2^1 - 1) = ${A}`}</Latex>.<br />
                <Latex>{`S_2 = ${A}(2^2 - 1) = ${A} \\cdot 3 = ${A * 3}`}</Latex>.<br />
                <Latex>{`b_2 = S_2 - S_1 = ${A * 3} - ${A} = ${A * 2}`}</Latex>.
            </span>,
            <span>
                Randame vardiklį <Latex>q</Latex>:<br />
                <Latex>{`q = b_2 / b_1 = ${A * 2} / ${A} = 2`}</Latex>.<br />
                Dabar įstatome į formulę <Latex>b_n = b_1 \\cdot q^{n - 1}</Latex>:<br />
                <Latex>{`b_n = ${A} \\cdot 2^{n-1}`}</Latex>.<br />
                <strong>Atsakymas: <Latex>{formattedAnswer}</Latex></strong>
            </span>
        ]
    };
};

const homeworkFlow = [
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
];

const levelCategories = homeworkFlow.map(fn => fn().category);

export default function GeometricHomeworkApp() {
    // State with localStorage persistence (using 'geo' prefix)
    const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
        const saved = localStorage.getItem('mathlab_geo_level');
        return saved !== null ? parseInt(saved, 10) : 0;
    });

    const [problem, setProblem] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState({ type: null, message: "" });
    const [revealedHints, setRevealedHints] = useState([]);
    const [maxHints] = useState(3);

    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('mathlab_geo_progress');
        return saved !== null ? parseFloat(saved) : 0;
    });

    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem('mathlab_geo_streak');
        return saved !== null ? parseInt(saved, 10) : 0;
    });

    const [showModal, setShowModal] = useState(() => {
        const saved = localStorage.getItem('mathlab_geo_showModal');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [isLevelComplete, setIsLevelComplete] = useState(false);

    const [maxLevelReached, setMaxLevelReached] = useState(() => {
        const savedMax = localStorage.getItem('mathlab_geo_max_level');
        const savedCurrent = localStorage.getItem('mathlab_geo_level');
        const current = savedCurrent !== null ? parseInt(savedCurrent, 10) : 0;
        const max = savedMax !== null ? parseInt(savedMax, 10) : 0;
        return Math.max(current, max);
    });

    const [showLevelMenu, setShowLevelMenu] = useState(false);
    const [isGameComplete, setIsGameComplete] = useState(false);

    // Save state to localStorage
    useEffect(() => { localStorage.setItem('mathlab_geo_level', currentLevelIndex); }, [currentLevelIndex]);
    useEffect(() => { localStorage.setItem('mathlab_geo_progress', progress); }, [progress]);
    useEffect(() => { localStorage.setItem('mathlab_geo_streak', streak); }, [streak]);
    useEffect(() => { localStorage.setItem('mathlab_geo_showModal', JSON.stringify(showModal)); }, [showModal]);
    useEffect(() => { localStorage.setItem('mathlab_geo_max_level', maxLevelReached); }, [maxLevelReached]);

    useEffect(() => {
        if (currentLevelIndex > maxLevelReached) {
            setMaxLevelReached(currentLevelIndex);
        }
    }, [currentLevelIndex, maxLevelReached]);

    // Sync progress
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

        setRevealedHints(problem.hints.map((_, i) => i));

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
                        Jūs sėkmingai įveikėte visus geometrinės progresijos lygius!
                    </p>
                    <div className="space-y-4">
                        <Link to="/" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2">
                            <ArrowLeft className="w-5 h-5" />
                            Grįžti į pradžią
                        </Link>
                        <button
                            onClick={handleBackToGame}
                            className="w-full bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            Peržiūrėti lygius
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100">

            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b border-slate-200 p-4 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="text-slate-400 hover:text-indigo-600 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-xl font-bold flex items-center text-emerald-600 gap-2">
                                <TrendingUp className="w-6 h-6" />
                                HomeworkLab <span className="text-slate-400 font-normal text-sm hidden sm:inline">| Geometrinė Progresija</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                            <div className="relative">
                                <button
                                    onClick={() => setShowLevelMenu(!showLevelMenu)}
                                    className="flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer"
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
                              ${isActive ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}
                              ${isLocked ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:bg-slate-50 text-slate-700'}
                            `}
                                                    >
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border
                              ${isActive ? 'bg-emerald-600 text-white border-emerald-600' : ''}
                              ${!isActive && !isLocked ? 'bg-white text-slate-500 border-slate-200' : ''}
                              ${isLocked ? 'bg-slate-100 text-slate-400 border-slate-200' : ''}
                            `}>
                                                            {isLocked ? <Lock className="w-3 h-3" /> : idx + 1}
                                                        </div>
                                                        <div className="flex-1 text-sm truncate">
                                                            {cat.split(': ')[1] || cat}
                                                        </div>
                                                        {isActive && <div className="w-2 h-2 rounded-full bg-emerald-600"></div>}
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
                            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-700 ease-out relative"
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
                    <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
                        <div>
                            <span className="font-semibold tracking-wide uppercase text-xs opacity-75 block">
                                Užduotis
                            </span>
                            <span className="font-bold text-sm md:text-base">
                                {problem.category}
                            </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-md font-mono ${revealedHints.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}>
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
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                                        >
                                            Kitas pratimas <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleRepeat}
                                            className="bg-white hover:bg-slate-50 text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
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
                                            className="py-4 px-6 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {problem.renderOptionsAsLatex ? <Latex>{opt}</Latex> : opt}
                                        </button>
                                    ))}
                                </div>
                                {revealedHints.length === problem.hints.length && !isLevelComplete && (
                                    <button
                                        onClick={handleRepeat}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95"
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
                                            className="flex-1 text-lg p-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-mono disabled:bg-slate-100 disabled:text-slate-400"
                                            autoFocus
                                        />
                                        {revealedHints.length === problem.hints.length && !isLevelComplete ? (
                                            <button
                                                type="button"
                                                onClick={handleRepeat}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-8 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-200 active:scale-95"
                                            >
                                                <RotateCw className="w-5 h-5" />
                                                <span className="hidden sm:inline">Bandyti dar kartą</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={!userAnswer || feedback.type === 'success'}
                                                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 md:px-8 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-200 active:scale-95"
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
                                        : 'text-emerald-600 hover:bg-emerald-50'}`}
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
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto text-emerald-600 shadow-inner">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Geometrinė Progresija</h2>
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
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-emerald-200 active:scale-95"
                        >
                            Pradėti 1 lygį
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
