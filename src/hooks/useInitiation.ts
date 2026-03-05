import { useState, useCallback } from 'react';

export type InitiationStep = 'IDLE' | 'Q1' | 'Q2' | 'Q3' | 'COMPLETE';

export interface InitiationQuestion {
  id: InitiationStep;
  text: string;
  options: string[];
  correct: string;
  discipline: 'SECURITY' | 'SOFTWARE ENG' | 'WEB DEV' | 'GAME DEV';
}

const initiationQuestions: InitiationQuestion[] = [
  {
    id: 'Q1',
    text: "IDENTIFY THE PRIMARY TARGET: A system is unresponsive due to a flood of ICMP packets. Protocol?",
    options: ["TCP", "UDP", "ICMP", "HTTP"],
    correct: "ICMP",
    discipline: 'SECURITY'
  },
  {
    id: 'Q2',
    text: "ARCHITECTURAL CHECK: Which data structure follows the Last-In, First-Out (LIFO) principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correct: "Stack",
    discipline: 'SOFTWARE ENG'
  },
  {
    id: 'Q3',
    text: "DOM MANIPULATION: Which method is used to select an element by its ID in JavaScript?",
    options: ["querySelector", "getElementById", "getElementByClassName", "find"],
    correct: "getElementById",
    discipline: 'WEB DEV'
  }
];

export const useInitiation = () => {
  const [step, setStep] = useState<InitiationStep>('IDLE');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assignedClass, setAssignedClass] = useState<string | null>(null);

  const startInitiation = useCallback(() => {
    setStep('Q1');
    setAnswers({});
    setAssignedClass(null);
  }, []);

  const handleAnswer = useCallback((answer: string) => {
    setAnswers(prev => ({ ...prev, [step]: answer }));
    
    if (step === 'Q1') setStep('Q2');
    else if (step === 'Q2') setStep('Q3');
    else if (step === 'Q3') {
      setStep('COMPLETE');
      // Logic to determine class based on answers (simplified for demo)
      const correctCount = [
        answer === initiationQuestions[2].correct,
        answers['Q1'] === initiationQuestions[0].correct,
        answers['Q2'] === initiationQuestions[1].correct
      ].filter(Boolean).length;

      if (correctCount === 3) setAssignedClass('SECURITY ANALYST (RANK A)');
      else if (correctCount === 2) setAssignedClass('SOFTWARE ENGINEER (RANK B)');
      else setAssignedClass('RECRUIT (RANK F)');
    }
  }, [step, answers]);

  return {
    step,
    questions: initiationQuestions,
    assignedClass,
    startInitiation,
    handleAnswer
  };
};
