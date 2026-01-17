
import React, { useState, useEffect, useRef, useMemo } from 'react';

interface Chemistry {
  Dopamine: number;
  Oxytocin: number;
  Cortisol: number;
}

interface LogEntry {
  id: number;
  event: string;
  data: Chemistry;
  timestamp: string;
}

const DigitalTwinSimulation: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [chemistry, setChemistry] = useState<Chemistry>({
    Dopamine: 50,
    Oxytocin: 50,
    Cortisol: 20
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const recommendations = useMemo(() => {
    const list: { type: string; msg: string; color: string }[] = [];
    if (chemistry.Cortisol > 60) {
      list.push({ 
        type: "STRESS ALERT", 
        msg: "High stress detected. Suggested action: 10-minute guided meditation or deep breathing exercise.",
        color: "text-red-400 border-red-900/50 bg-red-950/20"
      });
    }
    if (chemistry.Oxytocin < 40) {
      list.push({ 
        type: "BONDING DEFICIT", 
        msg: "Social isolation marker active. Suggested action: Schedule quality time or a phone call with a loved one.",
        color: "text-purple-400 border-purple-900/50 bg-purple-950/20"
      });
    }
    if (chemistry.Dopamine < 30) {
      list.push({ 
        type: "LOW REWARD", 
        msg: "Motivation levels dropping. Suggested action: Engage in a creative hobby or light physical exercise.",
        color: "text-yellow-400 border-yellow-900/50 bg-yellow-950/20"
      });
    }
    if (list.length === 0) {
      list.push({ 
        type: "OPTIMAL STATE", 
        msg: "Neuro-chemistry is within the target equilibrium zone. Maintain current routine.",
        color: "text-emerald-400 border-emerald-900/50 bg-emerald-950/20"
      });
    }
    return list;
  }, [chemistry]);

  const updateBioData = (interactionType: string) => {
    setChemistry(prev => {
      let next = { ...prev };
      
      if (interactionType === "physical_touch") {
        next.Oxytocin += 15;
        next.Cortisol -= 5;
      } else if (interactionType === "argument") {
        next.Cortisol += 20;
        next.Dopamine -= 10;
        next.Oxytocin -= 5;
      } else if (interactionType === "deep_talk") {
        next.Oxytocin += 12;
        next.Dopamine += 8;
        next.Cortisol -= 3;
      } else if (interactionType === "none") {
        // Natural decay towards baseline
        next.Dopamine = next.Dopamine > 50 ? next.Dopamine - 0.5 : next.Dopamine + 0.5;
        next.Oxytocin = next.Oxytocin > 50 ? next.Oxytocin - 0.5 : next.Oxytocin + 0.5;
        next.Cortisol = next.Cortisol > 20 ? next.Cortisol - 0.5 : next.Cortisol + 0.5;
      }

      return {
        Dopamine: Math.max(0, Math.min(100, next.Dopamine)),
        Oxytocin: Math.max(0, Math.min(100, next.Oxytocin)),
        Cortisol: Math.max(0, Math.min(100, next.Cortisol))
      };
    });
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        const events = ["physical_touch", "argument", "deep_talk", "none", "none"]; // More 'none' for stability
        const event = events[Math.floor(Math.random() * events.length)];
        
        updateBioData(event);
        
        setLogs(prev => {
          const newLog = {
            id: logIdRef.current++,
            event: event.replace('_', ' ').toUpperCase(),
            data: { ...chemistry },
            timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
          return [newLog, ...prev].slice(0, 8);
        });
      }, 2000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, chemistry]);

  const getChemistryColor = (val: number, type: keyof Chemistry) => {
    if (type === 'Cortisol' && val > 60) return 'text-red-500';
    if (type === 'Dopamine') return 'text-yellow-500';
    if (type === 'Oxytocin') return 'text-purple-500';
    return 'text-slate-300';
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${isRunning ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}></span>
            Parallel Neuro-Twin <span className="text-slate-600 font-light text-sm ml-2">v2.6.4</span>
          </h2>
          <p className="text-slate-400 text-sm font-thai mt-1">โมเดลจำลองสภาวะชีวเคมีคู่ขนานเพื่อตรวจจับพฤติกรรมและความเครียดอัตโนมัติ</p>
        </div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 ${
            isRunning 
              ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-900/30'
          }`}
        >
          {isRunning ? 'DISCONNECT SIMULATION' : 'INITIALIZE PARALLEL TWIN'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real-time Monitors */}
        <div className="lg:col-span-4 space-y-6">
          {(['Dopamine', 'Oxytocin', 'Cortisol'] as const).map((key) => (
            <div key={key} className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50 relative overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-widest">{key}</span>
                <span className={`text-xl font-mono font-black ${getChemistryColor(chemistry[key], key)}`}>
                  {Math.round(chemistry[key])}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    key === 'Dopamine' ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : key === 'Oxytocin' ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                  }`}
                  style={{ width: `${chemistry[key]}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Activity Log */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 font-mono text-xs overflow-hidden h-[220px] flex flex-col shadow-inner">
            <div className="flex justify-between border-b border-slate-800 pb-2 mb-3 text-slate-600 font-bold uppercase tracking-tighter">
              <span>TS_LOG</span>
              <span>BIO_EVENT</span>
              <span>NEURAL_METRICS</span>
            </div>
            <div className="overflow-y-auto space-y-2 flex-1 scrollbar-hide">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-700 italic text-[10px]">
                  [ STANDBY MODE: AWAITING SYNCHRONIZATION ]
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center animate-fadeIn border-l-2 border-slate-800 pl-3">
                    <span className="text-slate-600 font-mono">{log.timestamp}</span>
                    <span className={`font-bold font-mono tracking-tight ${log.event === 'ARGUMENT' ? 'text-red-400' : 'text-indigo-400'}`}>
                      {log.event}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      D:{Math.round(log.data.Dopamine)} O:{Math.round(log.data.Oxytocin)} C:{Math.round(log.data.Cortisol)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Automation Suggestions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Automation Recommendations</h3>
            <div className="grid grid-cols-1 gap-3">
              {recommendations.map((rec, i) => (
                <div key={i} className={`p-4 rounded-xl border transition-all animate-fadeIn ${rec.color}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase mb-1 tracking-tighter opacity-80">{rec.type}</span>
                      <p className="text-sm font-thai leading-snug">{rec.msg}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10 pt-8 border-t border-slate-800/50 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-slate-500 text-[10px] font-bold uppercase mb-2">Sync Status</div>
          <div className="text-indigo-400 font-mono text-xs">{isRunning ? "REAL-TIME UPLINK" : "OFFLINE"}</div>
        </div>
        <div className="text-center">
          <div className="text-slate-500 text-[10px] font-bold uppercase mb-2">Dataset</div>
          <div className="text-slate-400 font-mono text-xs">Human-Twin-DB-2026</div>
        </div>
        <div className="text-center">
          <div className="text-slate-500 text-[10px] font-bold uppercase mb-2">Engine</div>
          <div className="text-slate-400 font-mono text-xs">NeuralScript v3.1</div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinSimulation;
