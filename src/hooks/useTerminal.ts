import { useState } from 'react';

export type LogEntry = {
  sender: 'user' | 'system';
  text: string;
  rank?: string;
  qi?: number;
};

export const useTerminal = () => {
  const [systemLog, setSystemLog] = useState<LogEntry[]>([
    { sender: 'system', text: 'CONNECTION ESTABLISHED. WAITING FOR CULTIVATOR REPORT...' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReportTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = inputValue.trim();
    setSystemLog(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue("");
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      let rank = 'B';
      let qi = 150;
      let text = "Task Recorded. Acceptable progress.";

      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.length < 5 || ['yes', 'no', 'test'].includes(lowerInput)) {
        rank = 'F';
        qi = 10;
        text = "INSUFFICIENT DATA. REPORT REJECTED. ELABORATE ON YOUR ACTIONS.";
      }
      else if (lowerInput.includes('hack') || lowerInput.includes('build') || lowerInput.includes('deploy') || lowerInput.includes('create') || lowerInput.includes('finish')) {
        rank = 'S';
        qi = 500;
        text = "EXCEPTIONAL WORK. SIGNIFICANT VALUE ADDED TO THE SECT.";
      }
      else if (lowerInput.includes('read') || lowerInput.includes('study') || lowerInput.includes('learn') || lowerInput.includes('fix') || lowerInput.includes('debug')) {
        rank = 'A';
        qi = 300;
        text = "KNOWLEDGE ACQUIRED. GOOD CONSISTENT EFFORT DETECTED.";
      }
      else if (lowerInput.length > 20) {
        rank = 'B';
        qi = 150;
        text = "Task Verified. Standard operational progress.";
      }

      setSystemLog(prev => [...prev, { sender: 'system', text, rank, qi }]);
      setIsProcessing(false);
    }, 1200);
  };

  return {
    systemLog,
    setSystemLog,
    inputValue,
    setInputValue,
    isProcessing,
    handleReportTask
  };
};
