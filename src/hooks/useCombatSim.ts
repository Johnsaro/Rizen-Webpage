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
    setCombatMessage('ENGAGEMENT_INITIALIZED: ANOMALY_DETECTED.');
  };

  const handleCombatAnswer = (selectedOption: string) => {
    if (isCombatAnimating) return;
    setIsCombatAnimating(true);

    const currentQ = combatQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQ.answer;

    if (isCorrect) {
      setMonsterHP(prev => Math.max(0, prev - 34));
      setCombatMessage('VALIDATION_SUCCESSFUL: NEUTRALIZING_ANOMALY.');
      setShakeTarget('monster');
    } else {
      setPlayerHP(prev => Math.max(0, prev - 34));
      setCombatMessage('VALIDATION_FAILED: INTEGRITY_COMPROMISED.');
      setShakeTarget('player');
    }

    setTimeout(() => {
      setShakeTarget(null);
      if (isCorrect && monsterHP - 34 <= 0) {
        setCombatState('victory');
        setCombatMessage('ANOMALY_NEUTRALIZED: PROTOCOL_STABILIZED.');
      } else if (!isCorrect && playerHP - 34 <= 0) {
        setCombatState('defeat');
        setCombatMessage('CRITICAL_FAILURE: SYSTEM_RECOVERY_REQUIRED.');
      } else {
        if (currentQuestionIndex + 1 < combatQuestions.length) {
          setCurrentQuestionIndex(prev => prev + 1);
          setCombatMessage('FETCHING_NEXT_QUERY...');
        } else {
          setCombatState('victory');
          setCombatMessage('ANOMALY_NEUTRALIZED: PROTOCOL_STABILIZED.');
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
