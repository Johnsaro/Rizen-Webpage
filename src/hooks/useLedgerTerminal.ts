import { useState, useEffect, useCallback, useRef } from 'react';
import type { PlayerNotification } from './usePlayerProfile';

export type TerminalEntry = {
    id: string;
    type: 'system' | 'user' | 'command_output' | 'broadcast';
    message: string;
    timestamp: Date;
    label?: string; // e.g. <SYSTEM>, <ALERT>, etc.
    style?: string; // CSS class for coloring
};

export const useLedgerTerminal = (notifications: PlayerNotification[] = [], playerName: string = 'operative') => {
    const [history, setHistory] = useState<TerminalEntry[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const processedNotifIds = useRef<Set<string>>(new Set());

    const terminalUser = `${playerName.toLowerCase().replace(/\s+/g, '_')}@rizen-ledger`;

    // Sync notifications into history
    useEffect(() => {
        const newNotifs = notifications.filter(n => !processedNotifIds.current.has(n.id));
        if (newNotifs.length > 0) {
            const newEntries: TerminalEntry[] = newNotifs.map((n): TerminalEntry => {
                processedNotifIds.current.add(n.id);
                return {
                    id: n.id,
                    type: 'broadcast',
                    message: n.message,
                    timestamp: new Date(n.created_at),
                    label: n.type.toUpperCase(),
                    style: `type-${n.type.toLowerCase()}`
                };
            }).reverse(); // Reverse because we want chronological order in the feed
            
            setHistory(prev => [...prev, ...newEntries]);
        }
    }, [notifications]);

    const addEntry = useCallback((entry: Omit<TerminalEntry, 'id' | 'timestamp'>) => {
        const newEntry: TerminalEntry = {
            ...entry,
            id: Math.random().toString(36).substring(2, 11),
            timestamp: new Date()
        };
        setHistory(prev => [...prev, newEntry]);
    }, []);

    const executeCommand = (fullCommand: string) => {
        const trimmed = fullCommand.trim();
        if (!trimmed) return;

        // Add user command to history
        addEntry({
            type: 'user',
            message: trimmed
        });

        // Add to command history for up/down navigation
        setCommandHistory(prev => [trimmed, ...prev].slice(0, 50));
        setHistoryIndex(-1);

        const [cmd, ...args] = trimmed.toLowerCase().split(' ');
        const argText = args.join(' ');

        switch (cmd) {
            case 'help':
                addEntry({
                    type: 'command_output',
                    message: `AVAILABLE COMMANDS:
  help        - Show this menu
  clear/cls   - Clear terminal display
  logs        - List recent log entries
  broadcast   - Show recent broadcast messages
  status      - System diagnostic check
  whoami      - Identity verification
  echo [text] - Output custom string
  date        - Show system temporal coordinates
  history     - Show command history
  ping        - Test COORD-NET connectivity
  scan        - Perform local environment scan
  reboot      - Restart terminal session`
                });
                break;

            case 'clear':
            case 'cls':
                setHistory([]);
                break;

            case 'logs':
            case 'broadcast':
                const logs = history.filter(e => e.type === 'broadcast').slice(-5);
                if (logs.length === 0) {
                    addEntry({ type: 'command_output', message: 'NO RECENT ENTRIES FOUND.' });
                } else {
                    addEntry({
                        type: 'command_output',
                        message: `RECENT ${cmd.toUpperCase()}:\n` + logs.map(e => `[${e.timestamp.toLocaleTimeString()}] <${e.label}> ${e.message}`).join('\n')
                    });
                }
                break;

            case 'status':
                addEntry({
                    type: 'command_output',
                    message: `SYSTEM_STATUS: ONLINE
CORE_LINK: STABLE
COORD-NET: CONNECTED
LATENCY: 24ms
ENCRYPTION: AES-256-GCM
SESSIONS: 1 ACTIVE`
                });
                break;

            case 'whoami':
                addEntry({
                    type: 'command_output',
                    message: `USER: ${playerName.toUpperCase()}
ID: RZN-${Math.floor(Math.random() * 9000 + 1000)}
CLEARANCE: LEVEL_02
STATION: LEDGER_TERMINAL_V4`
                });
                break;

            case 'echo':
                addEntry({
                    type: 'command_output',
                    message: argText || ''
                });
                break;

            case 'date':
                addEntry({
                    type: 'command_output',
                    message: `CURRENT_TIME: ${new Date().toLocaleString()}`
                });
                break;

            case 'history':
                addEntry({
                    type: 'command_output',
                    message: commandHistory.map((c, i) => `${commandHistory.length - i}: ${c}`).reverse().join('\n')
                });
                break;

            case 'ping':
                addEntry({
                    type: 'command_output',
                    message: 'Pinging COORD-NET [127.0.0.1] with 32 bytes of data:\nReply from 127.0.0.1: bytes=32 time<1ms TTL=128\nCOORD-NET reachable.'
                });
                break;

            case 'scan':
                addEntry({
                    type: 'command_output',
                    message: 'SCANNING LOCAL_SECTOR...\n[||||||||||] 100%\nFOUND: 0 THREATS, 1 ACTIVE_DASHBOARD, 4 CORE_MODULES'
                });
                break;

            case 'reboot':
                addEntry({ type: 'system', message: 'SYSTEM REBOOT INITIATED...' });
                setTimeout(() => {
                    setHistory([]);
                    addEntry({ type: 'system', message: 'REBOOT COMPLETE. LEDGER_TERMINAL V4.0.2 ONLINE.' });
                }, 1500);
                break;

            default:
                addEntry({
                    type: 'command_output',
                    message: `COMMAND NOT RECOGNIZED: ${cmd}. TYPE 'HELP' FOR LIST OF COMMANDS.`,
                    style: 'type-alert'
                });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInputValue(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInputValue(commandHistory[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInputValue('');
            }
        }
    };

    return {
        history,
        inputValue,
        setInputValue,
        executeCommand,
        handleKeyDown,
        terminalUser
    };
};
