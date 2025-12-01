import React from 'react';
import { Latex } from '../../components/Latex';
import { randomInt } from '../../utils/helpers';

// LEVEL 1: Definition (Multiple Choice)
// "Is this an arithmetic progression?"
export const generateDefinitionProblem = () => {
  const isAP = Math.random() > 0.4;
  let formula, hints;

  if (isAP) {
    const slope = randomInt(2, 6);
    const intercept = randomInt(1, 10);
    const sign = Math.random() > 0.5 ? '+' : '-';
    formula = `a_n = ${slope}n ${sign} ${intercept}`;

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
export const generateSimpleMissingTermProblem = () => {
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
export const generateNthTermProblem = () => {
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
export const generateMemberCheckProblem = () => {
  const isMember = Math.random() > 0.5;
  const a1 = randomInt(10, 50);
  const useDecimal = Math.random() > 0.4;
  const dVal = randomInt(2, 8) * (Math.random() > 0.5 ? 1 : -1);
  const d = useDecimal ? dVal / 2 : dVal;

  let target, n;

  if (isMember) {
    n = randomInt(5, 15);
    target = a1 + (n - 1) * d;
  } else {
    n = randomInt(5, 15);
    const offset = useDecimal ? 0.25 : 0.5;
    target = a1 + (n - 1) * d + offset;
  }

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
export const generateFirstTermProblem = () => {
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
export const generateOtherTermProblem = () => {
  const knownN = randomInt(5, 15);
  let targetN = randomInt(16, 30);
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
export const generateSumProblem = () => {
  const start = randomInt(1, 10);
  const diff = randomInt(2, 5);
  const n = randomInt(3, 50);
  const sequence = `${start}, ${start + diff}, ${start + 2 * diff}`;
  const sum = (n / 2) * (2 * start + (n - 1) * diff);

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
export const generateSumGivenLastTermProblem = () => {
  const start = randomInt(-10, 10);
  let diff = randomInt(-5, 5);
  while (diff === 0) diff = randomInt(-5, 5);

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
export const generateTermFromSumFormulaProblem = () => {
  const dHalf = randomInt(-5, 5);
  const A = dHalf === 0 ? 2 : dHalf;
  const d = 2 * A;

  const a1 = randomInt(1, 10);
  const B = a1 - A;

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

  const k = randomInt(3, 8);

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
export const generateFormulaFromSumProblem = () => {
  const dHalf = randomInt(-5, 5);
  const A = dHalf === 0 ? 2 : dHalf;
  const d = 2 * A;

  const a1 = randomInt(1, 10);
  const B = a1 - A;

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

  const constTerm = a1 - d;
  const nCoeff = d;

  const formatAn = (c, nC) => {
    let res = "";
    if (c !== 0) res += `${c}`;

    if (nC > 0) res += (c !== 0 ? ` + ${nC}n` : `${nC}n`);
    else if (nC < 0) res += (c !== 0 ? ` - ${Math.abs(nC)}n` : `-${Math.abs(nC)}n`);

    return res === "" ? "0" : res;
  };

  const correctAns = formatAn(constTerm, nCoeff);

  const options = [correctAns];
  while (options.length < 4) {
    const fakeC = constTerm + randomInt(-5, 5);
    const fakeN = nCoeff + randomInt(-2, 2);
    const fake = formatAn(fakeC, fakeN);
    if (!options.includes(fake) && fake !== "") options.push(fake);
  }

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
