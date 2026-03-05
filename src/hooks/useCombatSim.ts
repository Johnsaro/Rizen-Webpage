import { useState } from 'react';

export type CombatState = 'idle' | 'active' | 'victory' | 'defeat';

const combatQuestions = [
  { q: "What flag in Nmap performs an aggressive scan?", options: ["-sS", "-A", "-sV", "-O"], answer: "-A" },
  { q: "Which HTTP status code indicates 'Forbidden'?", options: ["401", "403", "404", "500"], answer: "403" },
  { q: "In Python, which keyword is used to handle exceptions?", options: ["catch", "except", "error", "throw"], answer: "except" }
];

export const useCombatSim = () => {
  const [combatState, setCombatState] = useState<CombatState>('idle');
  const [playerHP, setPlayerHP] = useState(100);
  const [monsterHP, setMonsterHP] = useState(100);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [combatMessage, setCombatMessage] = useState('');
  const [isCombatAnimating, setIsCombatAnimating] = useState(false);
  const [shakeTarget, setShakeTarget] = useState<'player' | 'monster' | null>(null);

  const startCombat = () => {
    setCombatState('active');
    setPlayerHP(100);
    setMonsterHP(100);
    setCurrentQuestionIndex(0);
    setCombatMessage('TIME WRAITH ENGAGED. PREPARE FOR COMBAT.');
  };

  const handleCombatAnswer = (selectedOption: string) => {
    if (isCombatAnimating) return;
    setIsCombatAnimating(true);

    const currentQ = combatQuestions[currentQuestionIndex];
    if (selectedOption === currentQ.answer) {
      setMonsterHP(prev => Math.max(0, prev - 34));
      setCombatMessage('CRITICAL HIT! ENEMY TAKES DAMAGE.');
      setShakeTarget('monster');
    } else {
      setPlayerHP(prev => Math.max(0, prev - 34));
      setCombatMessage('ATTACK EVADED! YOU TAKE DAMAGE.');
      setShakeTarget('player');
    }

    setTimeout(() => {
      setShakeTarget(null);
      if (selectedOption === currentQ.answer && monsterHP - 34 <= 0) {
        setCombatState('victory');
        setCombatMessage('THREAT NEUTRALIZED. 500 XP GRANTED.');
      } else if (selectedOption !== currentQ.answer && playerHP - 34 <= 0) {
        setCombatState('defeat');
        setCombatMessage('COMBAT FAILED. SYSTEM COMPROMISED.');
      } else {
        if (currentQuestionIndex + 1 < combatQuestions.length) {
          setCurrentQuestionIndex(prev => prev + 1);
          setCombatMessage('NEXT THREAT DETECTED...');
        } else {
          setCombatState('victory');
          setCombatMessage('THREAT NEUTRALIZED. 500 XP GRANTED.');
        }
      }
      setIsCombatAnimating(false);
    }, 1500);
  };

  return {
    combatState,
    playerHP,
    monsterHP,
    currentQuestionIndex,
    combatMessage,
    isCombatAnimating,
    shakeTarget,
    combatQuestions,
    startCombat,
    handleCombatAnswer
  };
};
