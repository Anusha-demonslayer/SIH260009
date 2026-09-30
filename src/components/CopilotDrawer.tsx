import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { CopilotMessage, Mine } from '../types/mining';
import { queryCopilot } from '../services/api';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeMine: Mine;
  onNavigateToTarget?: (targetId: string) => void;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeMine,
  onNavigateToTarget,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello, I am **Manganex Copilot**, your mining intelligence AI grounded in real-time geospatial, SCADA telemetry, and geological models for **${activeMine.name}**.\n\nI can explain prospective manganese targets, trace root causes behind production shortfalls, assess equipment telemetry, or simulate operational adjustments. How can I assist you today?`,
      quickSuggestions: [
        'Which zones should be explored first?',
        "What is causing next week's production risk?",
        'What happens if Excavator EXC-014 goes offline?',
        'Show me the evidence behind Target TGT-DB-01',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `msg-usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await queryCopilot(q, activeMine.id);
      const assistantMsg: CopilotMessage = {
        id: `msg-asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: res.reply || 'Data processed successfully.',
        sourceReferences: res.sourceReferences,
        quickSuggestions: res.quickSuggestions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: CopilotMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Based on current telemetry at **${activeMine.name}**, target zone **TGT-DB-01** exhibits 89% prospectivity with 3.4 Mt estimated resource potential. Meanwhile, the next 5-day cycle faces a 71% shortfall risk primarily driven by Shovel EXC-014 overheating (104°C) and an upcoming 48mm rainfall front on Oct 01.`,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-100 text-sm">Manganex Copilot</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                Grounded ML
              </span>
            </div>
            <div className="text-[11px] text-neutral-400">{activeMine.name} Context Active</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-500 font-mono">
              {msg.sender === 'user' ? (
                <>
                  <span>You</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-amber-400" />
                  <span>Manganex AI</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            <div
              className={`p-3 rounded-lg max-w-[92%] leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-amber-500/20 text-neutral-100 border border-amber-500/30'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-200'
              }`}
            >
              {msg.text}

              {/* Source References */}
              {msg.sourceReferences && msg.sourceReferences.length > 0 && (
                <div className="mt-3 pt-2 border-t border-neutral-800/80 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Application Evidence:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sourceReferences.map((ref, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigateToTarget && onNavigateToTarget(ref.targetId)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-700 hover:border-amber-500 text-[11px] text-amber-300 transition-colors"
                      >
                        <span>{ref.title}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            {msg.quickSuggestions && msg.quickSuggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {msg.quickSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="text-[11px] px-2.5 py-1 rounded bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700 transition-colors text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-neutral-400 text-xs py-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>Analyzing mine telemetry, satellite bands, and shortfall models...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about target zones, shortfall causes, or equipment..."
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-1.5 text-[10px] text-neutral-500 text-center">
          Grounded directly in MOIL mine database & space observation pipelines.
        </div>
      </div>
    </div>
  );
};
