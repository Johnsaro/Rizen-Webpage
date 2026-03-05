import { useState } from 'react';

export type LogEntry = {
  sender: 'user' | 'system';
  text: string;
  rank?: string;
  xp?: number;
};

export const useTerminal = () => {
  const [guildMasterLog, setGuildMasterLog] = useState<LogEntry[]>([
    { sender: 'system', text: 'CONNECTION ESTABLISHED. WAITING FOR OPERATIVE REPORT...' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReportTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = inputValue.trim();
    setGuildMasterLog(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue("");
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      let rank = 'B';
      let xp = 150;
      let text = "Task Recorded. Acceptable progress.";

      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.length < 5 || ['yes', 'no', 'test'].includes(lowerInput)) {
        rank = 'F';
        xp = 10;
        text = "INSUFFICIENT DATA. REPORt REJECTED. ELABORATE ON YOUR ACTIONS.";
      }
      else if (lowerInput.includes('hack') || lowerInput.includes('build') || lowerInput.includes('deploy') || lowerInput.includes('create') || lowerInput.includes('finish')) {
        rank = 'S';
        xp = 500;
        text = "EXCEPTIONAL WORK. SIGNIFICANT VALUE ADDED TO THE GUILD.";
      }
      else if (lowerInput.includes('read') || lowerInput.includes('study') || lowerInput.includes('learn') || lowerInput.includes('fix') || lowerInput.includes('debug')) {
        rank = 'A';
        xp = 300;
        text = "KNOWLEDGE ACQUIRED. GOOD CONSISTENT EFFORT DETECTED.";
      }
      else if (lowerInput.length > 20) {
        rank = 'B';
        xp = 150;
        text = "Task Verified. Standard operational progress.";
      }

      setGuildMasterLog(prev => [...prev, { sender: 'system', text, rank, xp }]);
      setIsProcessing(false);
    }, 1200);
  };

  return {
    guildMasterLog,
    setGuildMasterLog,
    inputValue,
    setInputValue,
    isProcessing,
    handleReportTask
  };
};
