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

// --- KaTeX Loader & Component ---
const useKatex = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Prevent duplicate loading
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

    return () => {
      // Cleanup not strictly necessary for single file app lifecycle, but good practice
    };
  }, []);

  return isLoaded;
};

const Latex = ({ children, block = false }) => {
  const containerRef = useRef(null);
  const katexLoaded = useKatex();

  useEffect(() => {
    if (katexLoaded && containerRef.current) {
      try {
        // Fix: KaTeX expects a string. If children is a number (e.g. calculated result), convert it.
        // Fix: KaTeX expects a string. If children is an array (mixed text/vars), join them without commas.
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

// --- PROBLEM GENERATORS ---

// LEVEL 1: Definition (Multiple Choice)
// "Is this an arithmetic progression?"
const generateDefinitionProblem = () => {
  const isAP = Math.random() > 0.4;
  let formula, hints;

  if (isAP) {
    const slope = randomInt(2, 6);
    const intercept = randomInt(1, 10);
    const sign = Math.random() > 0.5 ? '+' : '-';
    // LaTeX formula: a_n = 5n + 2
    formula = `a_n = ${slope}n ${sign} ${intercept}`;

    // Constructing the proof steps
    const realIntercept = sign === '+' ? intercept : -intercept;
    const term1 = `${slope}(n+1) ${sign} ${intercept}`;
    const term2 = `(${slope}n ${sign} ${intercept})`;
    const expanded = `${slope}n + ${slope} ${sign} ${intercept}`;
    const simplified = `${slope}`;

    hints = [
      <span>Sakykime, kad <Latex>n</Latex> yra laisvai pasirinktas natūralusis skaičius. Reikia įrodyti, kad <Latex>a_{`{n+1}`} - a_n = d</Latex> (pastovus skaičius).</span>,
      <span>
        Apskaičiuojame <Latex>a_{`{n+1}`} - a_n</Latex>:<br />
        <Latex>{`a_{n+1} - a_n = (${term1}) - ${term2}`}</Latex>
      </span>,
      <span>
        Atskliaudžiame ir suprastiname:<br />
        <Latex>{`= ${expanded} - ${slope}n ${sign === '+' ? '-' : '+'} ${intercept} = ${simplified}`}</Latex>.<br />
        <br />
        Įrodėme, kad bet kurių dviejų gretimų sekos narių skirtumas yra tas pats skaičius (<Latex>{simplified}</Latex>), nepriklausantis nuo <Latex>n</Latex>. Todėl ši seka <strong>yra</strong> aritmetinė progresija.<br />
        <strong>Atsakymas: Taip</strong>
      </span>
    ];
  } else {
    const coeff = randomInt(2, 4);
    formula = `a_n = ${coeff}n^2 + 1`;

    hints = [
      <span>Sakykime, kad <Latex>n</Latex> yra laisvai pasirinktas natūralusis skaičius. Reikia įrodyti, kad <Latex>a_{`{n+1}`} - a_n = d</Latex>.</span>,
      <span>
        Apskaičiuojame <Latex>a_{`{n+1}`} - a_n</Latex>:<br />
        <Latex>{`a_{n+1} - a_n = (${coeff}(n+1)^2 + 1) - (${coeff}n^2 + 1)`}</Latex>
      </span>,
      <span>
        <Latex>{`= ${coeff}(n^2 + 2n + 1) + 1 - ${coeff}n^2 - 1`}</Latex><br />
        <Latex>{`= ${coeff}n^2 + ${2 * coeff}n + ${coeff} - ${coeff}n^2 = ${2 * coeff}n + ${coeff}`}</Latex>.<br />
        <br />
        Skirtumas priklauso nuo <Latex>n</Latex>, todėl ši seka <strong>nėra</strong> aritmetinė progresija.<br />
        <strong>Atsakymas: Ne</strong>
      </span>
    ];
  }

  return {
    id: `def-${Date.now()}`,
    category: '1 Lygis: Apibrėžimas',
    type: 'CHOICE',
    options: ['Taip', 'Ne'],
    question: (
      <span>
        Skaičių sekos <Latex>n</Latex>-tojo nario formulė yra <Latex>{formula}</Latex> su kiekvienu <Latex>n \in N</Latex>.<br />
        Ar ši seka yra <strong>aritmetinė progresija</strong>?
      </span>
    ),
    answer: isAP ? "Taip" : "Ne",
    hints: hints
  };
};

// LEVEL 2: Simple Next Term (Input)
// "Find the next number in the sequence: 2, 5, 8..."
const generateSimpleMissingTermProblem = () => {
  const start = randomInt(1, 15);
  const diff = randomInt(2, 8);
  const sequence = `${start}, ${start + diff}, ${start + 2 * diff}`;
  const answer = start + 3 * diff;

  return {
    id: `simple-miss-${Date.now()}`,
    category: '2 Lygis: Sekos Tęsimas',
    type: 'INPUT',
    question: (
      <span>
        Pratęskite aritmetinę progresiją įrašydami kitą narį:<br />
        <div className="text-2xl mt-4 bg-blue-50 p-4 rounded-lg text-center tracking-widest text-indigo-700 font-mono">
          <Latex>{`${sequence}, \\dots`}</Latex> <span className="underline decoration-dotted text-slate-400">?</span>
        </div>
      </span>
    ),
    answer: answer.toString(),
    hints: [
      <span>Raskite skirtumą tarp gretimų narių (<Latex>d</Latex>).</span>,
      <span><Latex>{`${start + diff} - ${start} = ${diff}`}</Latex>. Skirtumas yra {diff}.</span>,
      <span>Prie paskutinio nario (<Latex>{start + 2 * diff}</Latex>) pridėkite <Latex>{diff}</Latex>.<br />
        <Latex>{`${start + 2 * diff} + ${diff} = ${answer}`}</Latex>.<br />
        <strong>Atsakymas: {answer}</strong></span>
    ]
  };
};

// LEVEL 3: Find Nth Term (Input)
// "Find the 20th term using formula"
const generateNthTermProblem = () => {
  const start = randomInt(2, 20);
  const diff = randomInt(3, 10);
  const targetN = randomInt(15, 45);
  const sequence = `${start}, ${start + diff}, ${start + 2 * diff}`;
  const answer = start + (targetN - 1) * diff;

  return {
    id: `nth-${Date.now()}`,
    category: '3 Lygis: n-tojo Nario Formulė',
    type: 'INPUT',
    question: (
      <span>
        Duota seka: <strong><Latex>{`${sequence}, \\dots`}</Latex></strong><br />
        Apskaičiuokite šios sekos <strong>{targetN}-ąjį</strong> narį (<Latex>{`a_{${targetN}}`}</Latex>).
      </span>
    ),
    answer: answer.toString(),
    hints: [
      <span>Formulė: <Latex>a_n = a_1 + d(n-1)</Latex></span>,
      <span>Čia <Latex>{`a_1 = ${start}, d = ${diff}, n = ${targetN}`}</Latex>.</span>,
      <span><Latex>{`a_{${targetN}} = ${start} + ${diff} \\cdot (${targetN}-1) = ${answer}`}</Latex>.<br />
        <strong>Atsakymas: {answer}</strong></span>
    ]
  };
};

// LEVEL 4: Member Check (Choice)
// "Is -3 a member of AP with a1=12, d=-1.5?"
const generateMemberCheckProblem = () => {
  const isMember = Math.random() > 0.5;
  const a1 = randomInt(10, 50);
  // Use a mix of integer and decimal differences
  const useDecimal = Math.random() > 0.4;
  const dVal = randomInt(2, 8) * (Math.random() > 0.5 ? 1 : -1);
  const d = useDecimal ? dVal / 2 : dVal;

  let target, n;

  if (isMember) {
    n = randomInt(5, 15);
    target = a1 + (n - 1) * d;
  } else {
    n = randomInt(5, 15);
    // Create a non-member by adding a small offset
    const offset = useDecimal ? 0.25 : 0.5;
    target = a1 + (n - 1) * d + offset;
  }

  // Format numbers for display (comma for decimals)
  const format = (num) => num.toString().replace('.', '{,}');

  const calcN = (target - a1) / d + 1;

  return {
    id: `mem-check-${Date.now()}`,
    category: '4 Lygis: Nario Tikrinimas',
    type: 'CHOICE',
    options: ['Taip', 'Ne'],
    question: (
      <span>
        Aritmetinės progresijos (<Latex>a_n</Latex>) pirmasis narys yra <Latex>a_1 = {a1}</Latex>
        skirtumas <Latex>d = {format(d)}</Latex>.<br />
        Ar skaičius <Latex>{format(target)}</Latex> yra šios progresijos narys?
      </span>
    ),
    answer: isMember ? "Taip" : "Ne",
    hints: [
      <span>Naudokite <Latex>n</Latex>-tojo nario formulę: <Latex>a_n = a_1 + d(n-1)</Latex></span>,
      <span>Įstatykite žinomus skaičius: <Latex>{`${format(target)} = ${a1} + (${format(d)}) \\cdot (n-1)`}</Latex></span>,
      <span>
        Išspręskite lygtį <Latex>n</Latex> atžvilgiu:<br />
        <Latex>{`n - 1 = \\frac{${format(target)} - ${a1}}{${format(d)}} = ${format((target - a1) / d)}`}</Latex><br />
        <Latex>{`n = ${format((target - a1) / d)} + 1 = ${format(calcN)}`}</Latex>.<br />
        {isMember ? "Tai yra natūralusis skaičius." : "Tai nėra natūralusis skaičius."}<br />
        <strong>Atsakymas: {isMember ? "Taip" : "Ne"}</strong>
      </span>
    ]
  };
};

// LEVEL 5: Find First Term a1 (Input/Algebra)
// "If a_10 = 50 and d=5, find a_1"
const generateFirstTermProblem = () => {
  const targetN = randomInt(10, 25);
  const diff = randomInt(2, 6);
  const a1 = randomInt(1, 20);
  const targetVal = a1 + (targetN - 1) * diff;

  return {
    id: `find-a1-${Date.now()}`,
    category: '5 Lygis: Pirmojo Nario Radimas',
    type: 'INPUT',
    question: (
      <span>
        Apskaičiuokite <Latex>a_1</Latex>, jei žinoma:<br />
        <div className="flex justify-center gap-8 mt-4 mb-2 text-lg">
          <Latex>{`a_{${targetN}} = ${targetVal}`}</Latex>
          <Latex>{`d = ${diff}`}</Latex>
        </div>
      </span>
    ),
    answer: a1.toString(),
    hints: [
      <span>Naudokite formulę: <Latex>a_n = a_1 + d(n-1)</Latex></span>,
      <span>Įstatykite skaičius: <Latex>{`${targetVal} = a_1 + ${diff} \\cdot (${targetN}-1)`}</Latex></span>,
      <span>
        <Latex>{`${targetVal} = a_1 + ${(targetN - 1) * diff}`}</Latex>. Atimkite <Latex>{(targetN - 1) * diff}</Latex> iš <Latex>{targetVal}</Latex>.<br />
        <Latex>{`a_1 = ${targetVal} - ${(targetN - 1) * diff} = ${a1}`}</Latex>.<br />
        <strong>Atsakymas: {a1}</strong>
      </span>
    ]
  };
};

// LEVEL 6: Find Other Term (Input/Algebra)
// "If a_10 = 50 and d=5, find a_20"
const generateOtherTermProblem = () => {
  const knownN = randomInt(5, 15);
  let targetN = randomInt(16, 30);
  // Ensure they are different
  if (targetN === knownN) targetN++;

  const diff = randomInt(2, 6);
  const a1 = randomInt(1, 20);
  const knownVal = a1 + (knownN - 1) * diff;
  const targetVal = a1 + (targetN - 1) * diff;

  return {
    id: `find-other-${Date.now()}`,
    category: '6 Lygis: Kito Nario Radimas',
    type: 'INPUT',
    question: (
      <span>
        Apskaičiuokite <Latex>{`a_{${targetN}}`}</Latex>, jei žinoma:<br />
        <div className="flex justify-center gap-8 mt-4 mb-2 text-lg">
          <Latex>{`a_{${knownN}} = ${knownVal}`}</Latex>
          <Latex>{`d = ${diff}`}</Latex>
        </div>
      </span>
    ),
    answer: targetVal.toString(),
    hints: [
      <span>Pirmiausia raskite pirmąjį narį <Latex>a_1</Latex> naudodami formulę <Latex>a_n = a_1 + d(n-1)</Latex>.</span>,
      <span>
        Randame <Latex>a_1</Latex>:<br />
        <Latex>{`${knownVal} = a_1 + ${diff}(${knownN}-1)`}</Latex><br />
        <Latex>{`a_1 = ${knownVal} - ${diff * (knownN - 1)} = ${a1}`}</Latex>
      </span>,
      <span>
        Dabar apskaičiuojame <Latex>{`a_{${targetN}}`}</Latex>:<br />
        <Latex>{`a_{${targetN}} = ${a1} + ${diff}(${targetN}-1) = ${a1} + ${diff * (targetN - 1)} = ${targetVal}`}</Latex>.<br />
        <strong>Atsakymas: {targetVal}</strong>
      </span>
    ]
  };
};

// LEVEL 7: Sum (Input/Complex)
// "Find sum of first 20 members"
const generateSumProblem = () => {
  const start = randomInt(1, 10);
  const diff = randomInt(2, 5);
  const n = randomInt(3, 50);
  const sequence = `${start}, ${start + diff}, ${start + 2 * diff}`;
  const sum = (n / 2) * (2 * start + (n - 1) * diff);

  // Randomly choose which formula to display
  const useShortFormula = Math.random() > 0.5;

  let hints;

  if (useShortFormula) {
    const an = start + (n - 1) * diff;
    hints = [
      <span>Formulė: <Latex>{`S_n = \\frac{a_1 + a_n}{2} \\cdot n`}</Latex></span>,
      <span>
        <Latex>{`a_1=${start}, n=${n}`}</Latex>.<br />
        Pirmiausia randame <Latex>{`a_{${n}}`}</Latex>:<br />
        <Latex>{`a_{${n}} = a_1 + d(n-1) = ${start} + ${diff} \\cdot ${n - 1} = ${an}`}</Latex>
      </span>,
      <span>
        Įstatome į sumos formulę:<br />
        <Latex>{`S_{${n}} = \\frac{${start} + ${an}}{2} \\cdot ${n} = \\frac{${start + an}}{2} \\cdot ${n} = ${sum}`}</Latex>.<br />
        <strong>Atsakymas: {sum}</strong>
      </span>
    ];
  } else {
    hints = [
      <span>Formulė: <Latex>{`S_n = \\frac{2a_1 + d(n-1)}{2} \\cdot n`}</Latex></span>,
      <span><Latex>{`a_1=${start}, d=${diff}, n=${n}`}</Latex>.</span>,
      <span>
        <Latex>{`S_{${n}} = \\frac{2\\cdot${start} + ${diff}(${n}-1)}{2} \\cdot ${n}`}</Latex><br />
        <Latex>{`S_{${n}} = \\frac{${2 * start} + ${diff * (n - 1)}}{2} \\cdot ${n} = \\frac{${2 * start + diff * (n - 1)}}{2} \\cdot ${n} = ${sum}`}</Latex>.<br />
        <strong>Atsakymas: {sum}</strong>
      </span>
    ];
  }

  return {
    id: `sum-${Date.now()}`,
    category: '7 Lygis: Sumos Skaičiavimas',
    type: 'INPUT',
    question: (
      <span>
        Apskaičiuokite aritmetinės progresijos pirmųjų <strong>{n}</strong> narių sumą (<Latex>{`S_{${n}}`}</Latex>):<br />
        <div className="text-xl my-4 text-center font-mono text-slate-700">
          <Latex>{`${sequence}, \\dots`}</Latex>
        </div>
      </span>
    ),
    answer: sum.toString(),
    hints: hints
  };
};

// LEVEL 8: Sum Given Last Term (Input/Complex)
// "Find sum of sequence: 6, 1, -4, ..., -109"
const generateSumGivenLastTermProblem = () => {
  const start = randomInt(-10, 10);
  let diff = randomInt(-5, 5);
  while (diff === 0) diff = randomInt(-5, 5); // Ensure non-zero difference

  const n = randomInt(15, 35);
  const lastTerm = start + (n - 1) * diff;
  const sum = ((start + lastTerm) / 2) * n;

  const sequence = `${start}, ${start + diff}, ${start + 2 * diff}, \\dots, ${lastTerm}`;

  return {
    id: `sum-last-${Date.now()}`,
    category: '8 Lygis: Suma (žinomas paskutinis narys)',
    type: 'INPUT',
    question: (
      <span>
        Apskaičiuokite aritmetinės progresijos visų narių sumą:<br />
        <div className="text-xl my-4 text-center font-mono text-slate-700">
          <Latex>{`${sequence}`}</Latex>
        </div>
      </span>
    ),
    answer: sum.toString(),
    hints: [
      <span>
        Iš sąlygos žinome, kad pirmasis narys yra <Latex>{`a_1 = ${start}`}</Latex>, o paskutinis narys <Latex>{`a_n = ${lastTerm}`}</Latex>.<br />
        Reikia rasti narių skaičių <Latex>n</Latex>.
      </span>,
      <span>
        Randame skirtumą <Latex>d</Latex>:<br />
        <Latex>{`d = a_2 - a_1 = ${start + diff} - ${start < 0 ? `(${start})` : start} = ${diff}`}</Latex>.<br />
        <br />
        Naudojame formulę <Latex>a_n = a_1 + d(n-1)</Latex>:<br />
        <Latex>{`${lastTerm} = ${start} + ${diff < 0 ? `(${diff})` : diff} \\cdot (n-1)`}</Latex><br />
        <Latex>{`${lastTerm} - ${start < 0 ? `(${start})` : start} = ${diff}(n-1)`}</Latex><br />
        <Latex>{`${lastTerm - start} = ${diff}(n-1)`}</Latex><br />
        <Latex>{`n-1 = ${lastTerm - start} : ${diff < 0 ? `(${diff})` : diff} = ${(lastTerm - start) / diff}`}</Latex><br />
        <Latex>{`n = ${(lastTerm - start) / diff} + 1 = ${n}`}</Latex>.
      </span>,
      <span>
        Dabar skaičiuojame sumą <Latex>{`S_{${n}}`}</Latex>:<br />
        <Latex>{`S_{${n}} = \\frac{a_1 + a_n}{2} \\cdot n`}</Latex><br />
        <Latex>{`S_{${n}} = \\frac{${start} + ${lastTerm < 0 ? `(${lastTerm})` : lastTerm}}{2} \\cdot ${n} = \\frac{${start + lastTerm}}{2} \\cdot ${n} = ${sum}`}</Latex>.<br />
        <strong>Atsakymas: {sum}</strong>
      </span>
    ]
  };
};
// LEVEL 9: Find Term from Sn Formula (Input)
// "Given Sn = 9n - 4n^2, find a_4"
const generateTermFromSumFormulaProblem = () => {
  const dHalf = randomInt(-5, 5);
  // Ensure dHalf is not 0
  const A = dHalf === 0 ? 2 : dHalf;
  const d = 2 * A;

  const a1 = randomInt(1, 10);
  const B = a1 - A;

  // Sn = An^2 + Bn (or Bn + An^2)
  let snFormula = "";
  if (B !== 0) {
    snFormula += `${B}n`;
    if (A > 0) snFormula += ` + ${A === 1 ? "" : A}n^2`;
    else if (A < 0) snFormula += ` - ${Math.abs(A) === 1 ? "" : Math.abs(A)}n^2`;
  } else {
    if (A === 1) snFormula = "n^2";
    else if (A === -1) snFormula = "-n^2";
    else snFormula = `${A}n^2`;
  }

  const k = randomInt(3, 8); // Find a_k

  // Calculate Sk and S(k-1)
  const Sk = B * k + A * k * k;
  const Sk_1 = B * (k - 1) + A * (k - 1) * (k - 1);
  const ak = Sk - Sk_1;

  return {
    id: `term-from-sn-${Date.now()}`,
    category: '9 Lygis: Nario radimas iš sumos formulės',
    type: 'INPUT',
    question: (
      <span>
        Aritmetinės progresijos (<Latex>a_n</Latex>) pirmųjų <Latex>n</Latex> narių suma apskaičiuojama pagal formulę <Latex>{`S_n = ${snFormula}`}</Latex>.<br />
        Apskaičiuokite šios progresijos <strong>{k}-ąjį</strong> narį (<Latex>{`a_{${k}}`}</Latex>).
      </span>
    ),
    answer: ak.toString(),
    hints: [
      <span>
        Norint rasti <Latex>{`a_{${k}}`}</Latex>, galime pasinaudoti savybe: <Latex>{`a_n = S_n - S_{n-1}`}</Latex>.<br />
        Šiuo atveju: <Latex>{`a_{${k}} = S_{${k}} - S_{${k - 1}}`}</Latex>.
      </span>,
      <span>
        Apskaičiuojame <Latex>{`S_{${k}}`}</Latex> ir <Latex>{`S_{${k - 1}}`}</Latex>:<br />
        <Latex>{`S_{${k}} = ${B}\\cdot${k} + ${A < 0 ? `(${A})` : A}\\cdot${k}^2 = ${B * k} + ${A * k * k} = ${Sk}`}</Latex>.<br />
        <Latex>{`S_{${k - 1}} = ${B}\\cdot${k - 1} + ${A < 0 ? `(${A})` : A}\\cdot${k - 1}^2 = ${B * (k - 1)} + ${A * (k - 1) * (k - 1)} = ${Sk_1}`}</Latex>.
      </span>,
      <span>
        Atimame:<br />
        <Latex>{`a_{${k}} = S_{${k}} - S_{${k - 1}} = ${Sk} - ${Sk_1 < 0 ? `(${Sk_1})` : Sk_1} = ${ak}`}</Latex>.<br />
        <strong>Atsakymas: {ak}</strong>
      </span>
    ]
  };
};

// LEVEL 10: Find an Formula from Sn (Choice)
// "Given Sn = 9n - 4n^2, find an formula"
const generateFormulaFromSumProblem = () => {
  const dHalf = randomInt(-5, 5);
  // Ensure dHalf is not 0
  const A = dHalf === 0 ? 2 : dHalf;
  const d = 2 * A;

  const a1 = randomInt(1, 10);
  const B = a1 - A;

  // Sn = An^2 + Bn (or Bn + An^2)
  // Image shows 9n - 4n^2, so Bn + An^2 format is possible.
  let snFormula = "";
  if (B !== 0) {
    snFormula += `${B}n`;
    if (A > 0) snFormula += ` + ${A === 1 ? "" : A}n^2`;
    else if (A < 0) snFormula += ` - ${Math.abs(A) === 1 ? "" : Math.abs(A)}n^2`;
  } else {
    if (A === 1) snFormula = "n^2";
    else if (A === -1) snFormula = "-n^2";
    else snFormula = `${A}n^2`;
  }

  // Correct Answer: an = a1 + d(n-1) = a1 + dn - d = (a1-d) + dn
  const constTerm = a1 - d;
  const nCoeff = d;

  const formatAn = (c, nC) => {
    // c + nC n
    let res = "";
    if (c !== 0) res += `${c}`;

    if (nC > 0) res += (c !== 0 ? ` + ${nC}n` : `${nC}n`);
    else if (nC < 0) res += (c !== 0 ? ` - ${Math.abs(nC)}n` : `-${Math.abs(nC)}n`);

    return res === "" ? "0" : res;
  };

  const correctAns = formatAn(constTerm, nCoeff);

  // Distractors
  const options = [correctAns];
  while (options.length < 4) {
    const fakeC = constTerm + randomInt(-5, 5);
    const fakeN = nCoeff + randomInt(-2, 2);
    const fake = formatAn(fakeC, fakeN);
    if (!options.includes(fake) && fake !== "") options.push(fake);
  }

  // Shuffle options
  options.sort(() => Math.random() - 0.5);

  const formattedOptions = options.map(o => `a_n = ${o}`);
  const formattedAnswer = `a_n = ${correctAns}`;

  return {
    id: `sn-to-an-${Date.now()}`,
    category: '10 Lygis: n-tojo nario formulė iš sumos',
    type: 'CHOICE',
    renderOptionsAsLatex: true,
    options: formattedOptions,
    question: (
      <span>
        Aritmetinės progresijos (<Latex>a_n</Latex>) pirmųjų <Latex>n</Latex> narių suma apskaičiuojama pagal formulę <Latex>{`S_n = ${snFormula}`}</Latex>.<br />
        Raskite šios progresijos <Latex>n</Latex>-tojo nario formulę.
      </span>
    ),
    answer: formattedAnswer,
    hints: [
      <span>
        Norint rasti <Latex>n</Latex>-tojo nario formulę, reikia rasti pirmąjį narį <Latex>a_1</Latex> ir skirtumą <Latex>d</Latex>.
      </span>,
      <span>
        Randame <Latex>a_1</Latex> ir <Latex>a_2</Latex>:<br />
        <Latex>{`a_1 = S_1 = ${B}\\cdot 1 + ${A < 0 ? `(${A})` : A}\\cdot 1^2 = ${B + A}`}</Latex>.<br />
        <Latex>{`S_2 = ${B}\\cdot 2 + ${A < 0 ? `(${A})` : A}\\cdot 2^2 = ${2 * B} + ${4 * A} = ${2 * B + 4 * A}`}</Latex>.<br />
        <Latex>{`a_2 = S_2 - S_1 = ${2 * B + 4 * A} - ${B + A < 0 ? `(${B + A})` : B + A} = ${B + 3 * A}`}</Latex>.
      </span>,
      <span>
        Randame skirtumą <Latex>d</Latex>:<br />
        <Latex>{`d = a_2 - a_1 = ${B + 3 * A} - ${B + A < 0 ? `(${B + A})` : B + A} = ${2 * A}`}</Latex>.<br />
        Dabar įstatome į formulę <Latex>a_n = a_1 + d(n-1)</Latex>:<br />
        <Latex>{`a_n = ${a1} + ${d < 0 ? `(${d})` : d}(n-1) = ${a1} ${d < 0 ? '-' : '+'} ${Math.abs(d)}n ${d < 0 ? '+' : '-'} ${Math.abs(d)} = ${correctAns}`}</Latex>.<br />
        <strong>Atsakymas: <Latex>{formattedAnswer}</Latex></strong>
      </span>
    ]
  };
};

// Strict Progression: Definition -> Next Term -> Nth Formula -> Algebra -> Sum Formula
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

export default function MathHomeworkApp() {
  // State with localStorage persistence
  const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
    const saved = localStorage.getItem('mathlab_level');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const [revealedHints, setRevealedHints] = useState([]);
  const [maxHints] = useState(3);

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('mathlab_progress');
    return saved !== null ? parseFloat(saved) : 0;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('mathlab_streak');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [showModal, setShowModal] = useState(() => {
    const saved = localStorage.getItem('mathlab_showModal');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const [maxLevelReached, setMaxLevelReached] = useState(() => {
    const savedMax = localStorage.getItem('mathlab_max_level');
    const savedCurrent = localStorage.getItem('mathlab_level');
    const current = savedCurrent !== null ? parseInt(savedCurrent, 10) : 0;
    const max = savedMax !== null ? parseInt(savedMax, 10) : 0;
    return Math.max(current, max);
  });

  const [showLevelMenu, setShowLevelMenu] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Save state to localStorage
  useEffect(() => { localStorage.setItem('mathlab_level', currentLevelIndex); }, [currentLevelIndex]);
  useEffect(() => { localStorage.setItem('mathlab_progress', progress); }, [progress]);
  useEffect(() => { localStorage.setItem('mathlab_streak', streak); }, [streak]);
  useEffect(() => { localStorage.setItem('mathlab_showModal', JSON.stringify(showModal)); }, [showModal]);
  useEffect(() => { localStorage.setItem('mathlab_max_level', maxLevelReached); }, [maxLevelReached]);

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
            <h1 className="text-xl font-bold flex items-center text-indigo-600 gap-2">
              <Calculator className="w-6 h-6" />
              MathLab <span className="text-slate-400 font-normal text-sm hidden sm:inline">| Aritmetinė Progresija</span>
            </h1>
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