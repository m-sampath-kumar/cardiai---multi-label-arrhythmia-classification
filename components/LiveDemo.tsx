import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  YAxis, 
  XAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie
} from 'recharts';
import { ArrhythmiaResult } from '../types';

type LoadingPhase = 'idle' | 'reading' | 'preprocessing' | 'batch_scanning' | 'complete';

interface BatchSummary {
  total: number;
  processed: number;
  detections: { name: string; count: number; color: string }[];
}

const LiveDemo: React.FC = () => {
  const [phase, setPhase] = useState<LoadingPhase>('idle');
  const [activeTab, setActiveTab] = useState<'batch' | 'manual'>('manual');
  const [batchSummary, setBatchSummary] = useState<BatchSummary | null>(null);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [ecgData, setEcgData] = useState<{ t: number; v: number }[]>([]);
  
  const [manualInputs, setManualInputs] = useState({
    hr: 72,
    qrs: 90,
    stLevel: 0.0,
    prInterval: 160,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Dynamic Prediction Logic: Calculate results based on inputs
  const results: ArrhythmiaResult[] = useMemo(() => {
    const { hr, qrs, stLevel, prInterval } = manualInputs;
    
    // Simple heuristic-based simulation for a "Live AI" feel
    const afConf = hr > 110 ? 0.7 + (hr - 110) * 0.002 : 0.05 + (hr / 500);
    const pvcConf = qrs > 110 ? 0.6 + (qrs - 110) * 0.003 : 0.08;
    const steConf = Math.abs(stLevel) > 1.5 ? 0.8 : (Math.abs(stLevel) / 5);
    const rbbbConf = qrs > 140 ? 0.75 : 0.02;
    const normalConf = (hr > 60 && hr < 100 && qrs < 110 && Math.abs(stLevel) < 0.5) ? 0.92 : 0.1;

    return [
      { label: 'AF', fullName: 'Atrial Fibrillation', confidence: Math.min(0.98, afConf) },
      { label: 'PVC', fullName: 'Premature Ventricular Contraction', confidence: Math.min(0.98, pvcConf) },
      { label: 'STE', fullName: 'ST-segment Elevation', confidence: Math.min(0.98, steConf) },
      { label: 'RBBB', fullName: 'Right Bundle Branch Block', confidence: Math.min(0.98, rbbbConf) },
      { label: 'Normal', fullName: 'Sinus Rhythm', confidence: Math.min(0.98, normalConf) }
    ].sort((a, b) => b.confidence - a.confidence);
  }, [manualInputs]);

  // 2. Dynamic ECG Signal Generation: Frequency changes with HR
  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      setEcgData(prev => {
        const t = tick++;
        // Frequency logic: scale the modulo based on Heart Rate
        // 60 BPM = 1 beat/sec. If interval is 50ms, 1 beat every 20 ticks.
        // Formula: ticksPerBeat = (60 / HR) * (1000 / intervalTime)
        const ticksPerBeat = Math.max(8, (60 / manualInputs.hr) * 20);
        const phase = t % Math.floor(ticksPerBeat);
        
        let beat = 0;
        if (phase === Math.floor(ticksPerBeat * 0.2)) beat = 0.4; // P
        if (phase === Math.floor(ticksPerBeat * 0.4)) beat = -0.3; // Q
        if (phase === Math.floor(ticksPerBeat * 0.45)) beat = 4.0;  // R
        if (phase === Math.floor(ticksPerBeat * 0.5)) beat = -0.6; // S
        if (phase === Math.floor(ticksPerBeat * 0.7)) beat = 0.8 + (manualInputs.stLevel * 0.5); // T with ST shift
        
        const baseline = Math.sin(t * 0.05) * 0.1;
        const noise = (Math.random() - 0.5) * 0.15;
        const newData = [...prev, { t, v: beat + baseline + noise }];
        return newData.slice(-60);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [manualInputs.hr, manualInputs.stLevel]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setActiveTab('batch');
    setBatchSummary(null);
    setPhase('reading');
    
    await new Promise(r => setTimeout(r, 800));
    setPhase('batch_scanning');

    const total = files.length;
    const detectionsCount: Record<string, number> = { 'AF': 0, 'Normal': 0, 'PVC': 0, 'Others': 0 };

    for (let i = 0; i < total; i++) {
      setCurrentFileIndex(i + 1);
      await new Promise(r => setTimeout(r, Math.max(50, 500 / total)));
      const rand = Math.random();
      if (rand > 0.85) detectionsCount['AF']++;
      else if (rand > 0.75) detectionsCount['PVC']++;
      else if (rand > 0.25) detectionsCount['Normal']++;
      else detectionsCount['Others']++;
    }

    setBatchSummary({
      total,
      processed: total,
      detections: [
        { name: 'AF', count: detectionsCount['AF'], color: '#ef4444' },
        { name: 'Normal', count: detectionsCount['Normal'], color: '#10b981' },
        { name: 'PVC', count: detectionsCount['PVC'], color: '#f59e0b' },
        { name: 'Others', count: detectionsCount['Others'], color: '#6366f1' },
      ]
    });
    setPhase('complete');
  };

  const radarData = results.map(r => ({ subject: r.label, A: r.confidence * 100, fullMark: 100 }));

  return (
    <section id="demo" className="py-24 px-6 bg-slate-950 relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>AI Inference: Real-time Analysis Active</span>
          </div>
          <h2 className="text-5xl font-bold mb-4 font-heading text-white">Clinical AI Workspace</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Toggle between live parameter simulation and dataset folder uploads to see the multi-label engine in action.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Workspace Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border-white/5 bg-slate-900/40 relative min-h-[500px] flex flex-col overflow-hidden">
              
              <div className="flex bg-slate-950/80 p-1.5 rounded-2xl w-fit mb-8 border border-white/5 z-20">
                <button 
                  onClick={() => setActiveTab('manual')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest ${activeTab === 'manual' ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Live Simulator
                </button>
                <button 
                  onClick={() => setActiveTab('batch')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest ${activeTab === 'batch' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Folder Upload
                </button>
              </div>

              {/* Batch Processing Overlay */}
              {phase === 'batch_scanning' && (
                <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-300">
                   <div className="w-full max-w-sm mb-10">
                      <div className="flex justify-between text-[10px] font-mono text-cyan-400 mb-3 uppercase tracking-widest">
                        <span>Batch Progress</span>
                        <span>{currentFileIndex} / {batchSummary?.total || '?'}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-cyan-400 transition-all duration-75 shadow-[0_0_10px_#22d3ee]" 
                          style={{ width: `${(currentFileIndex / (batchSummary?.total || 1)) * 100}%` }}
                        ></div>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <p className="text-white font-bold tracking-[0.3em] uppercase text-sm animate-pulse">Running Neural Inference</p>
                      <p className="text-[10px] text-slate-500 font-mono max-w-[250px]">Analyzing morphological co-occurrences in 12-lead domain...</p>
                   </div>
                </div>
              )}

              <div className="flex-grow z-10">
                {activeTab === 'manual' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 py-4 animate-in fade-in zoom-in-95 duration-500">
                     <div className="space-y-10">
                        {/* Heart Rate Slider */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center">
                                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                                Heart Rate (BPM)
                              </label>
                              <span className="text-lg font-bold text-white font-mono">{manualInputs.hr}</span>
                           </div>
                           <input 
                             type="range" min="40" max="220" value={manualInputs.hr}
                             onChange={(e) => setManualInputs({...manualInputs, hr: parseInt(e.target.value)})}
                             className="w-full accent-cyan-500" 
                           />
                        </div>

                        {/* QRS Duration Slider */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                QRS Duration (ms)
                              </label>
                              <span className="text-lg font-bold text-white font-mono">{manualInputs.qrs}</span>
                           </div>
                           <input 
                             type="range" min="60" max="250" value={manualInputs.qrs}
                             onChange={(e) => setManualInputs({...manualInputs, qrs: parseInt(e.target.value)})}
                             className="w-full accent-blue-500" 
                           />
                        </div>
                     </div>

                     <div className="space-y-10">
                        {/* ST Level Slider */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                                ST Segment (mV)
                              </label>
                              <span className="text-lg font-bold text-white font-mono">{manualInputs.stLevel > 0 ? '+' : ''}{manualInputs.stLevel.toFixed(1)}</span>
                           </div>
                           <input 
                             type="range" min="-3" max="5" step="0.1" value={manualInputs.stLevel}
                             onChange={(e) => setManualInputs({...manualInputs, stLevel: parseFloat(e.target.value)})}
                             className="w-full accent-emerald-500" 
                           />
                        </div>

                        <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                           <div className="text-[9px] font-mono text-slate-500 uppercase mb-4 tracking-widest">Live Lead Monitor</div>
                           <div className="h-24">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={ecgData}>
                                    <Area type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={2} fillOpacity={0.1} fill="#22d3ee" isAnimationActive={false} />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col space-y-8 animate-in slide-in-from-right-10 duration-500">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-grow border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-12 hover:bg-cyan-500/5 hover:border-cyan-500/30 transition-all cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500">📂</div>
                      <h4 className="text-lg font-bold text-white mb-2">Process Local Dataset</h4>
                      <p className="text-sm text-slate-500 text-center max-w-xs mb-8">Upload a clinical ECG folder to trigger batch multi-label classification across all records.</p>
                      <input 
                        type="file" ref={fileInputRef} className="hidden" multiple 
                        /* @ts-ignore */
                        webkitdirectory="" directory="" 
                        onChange={handleFileUpload} 
                      />
                      <div className="px-10 py-3 bg-white/5 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/10 group-hover:border-cyan-500 transition-colors">
                        Scan Filesystem
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Analysis Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass-panel p-8 rounded-3xl bg-slate-900/60 transition-all duration-700">
                  <h4 className="text-lg font-bold text-white mb-8 font-heading flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                    Confidence Radar
                  </h4>
                  <div className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                           <PolarGrid stroke="#1e293b" />
                           <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                           <Radar name="AI Confidence" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.5} />
                        </RadarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
               
               <div className="glass-panel p-8 rounded-3xl bg-slate-900/60 transition-all duration-700">
                  <h4 className="text-lg font-bold text-white mb-8 font-heading flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Feature Weight Distribution
                  </h4>
                  <div className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results} layout="vertical">
                           <XAxis type="number" hide domain={[0, 1]} />
                           <YAxis dataKey="label" type="category" stroke="#64748b" fontSize={10} width={40} axisLine={false} tickLine={false} />
                           <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }} />
                           <Bar dataKey="confidence" fill="#10b981" radius={[0, 4, 4, 0]} animationDuration={1000}>
                              {results.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.confidence > 0.5 ? '#10b981' : '#1e293b'} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar: Diagnostic HUD */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border-cyan-500/20 bg-slate-900/80 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
              
              <div className="mb-12 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white font-heading leading-tight">Diagnostic Hub</h3>
                  <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em] mt-2">Active Neural Stream</p>
                </div>
                <div className="flex space-x-1">
                   <div className="w-1 h-4 bg-cyan-500 animate-pulse"></div>
                   <div className="w-1 h-3 bg-cyan-500/50"></div>
                   <div className="w-1 h-5 bg-cyan-500"></div>
                </div>
              </div>

              <div className="flex-grow space-y-6">
                 {/* Top Prediction Card */}
                 <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20 mb-8 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                       <span className="text-6xl">🧠</span>
                    </div>
                    <div className="relative z-10">
                       <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2">Primary Diagnosis</div>
                       <div className="text-3xl font-bold text-white mb-2 font-heading">{results[0].fullName}</div>
                       <div className="flex items-center space-x-3">
                          <span className="text-sm font-mono font-bold text-cyan-400">{(results[0].confidence * 100).toFixed(1)}% Confidence</span>
                          <div className="h-1 flex-grow bg-slate-950 rounded-full overflow-hidden">
                             <div className="h-full bg-cyan-500" style={{ width: `${results[0].confidence * 100}%` }}></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Multi-Label Spectrum</h4>
                    {results.slice(1, 5).map((res, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-white/5 group hover:border-white/10 transition-colors">
                         <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${res.confidence > 0.4 ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{res.label}</span>
                         </div>
                         <div className="text-[11px] font-mono text-slate-500">{(res.confidence * 100).toFixed(0)}%</div>
                      </div>
                    ))}
                 </div>

                 {/* Batch Summary Preview */}
                 {batchSummary && (
                   <div className="pt-10 mt-10 border-t border-white/5 animate-in fade-in slide-in-from-bottom-5 duration-700">
                      <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">Batch Insight Summary</h4>
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {batchSummary.detections.map((det, i) => (
                          <div key={i} className="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">{det.name}</div>
                            <div className="text-lg font-bold text-white" style={{ color: det.color }}>{det.count}</div>
                          </div>
                        ))}
                      </div>
                      <div className="h-40">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie
                                 data={batchSummary.detections}
                                 innerRadius={45}
                                 outerRadius={65}
                                 paddingAngle={8}
                                 dataKey="count"
                                 animationDuration={1500}
                               >
                                 {batchSummary.detections.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                               </Pie>
                               <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '10px', fontSize: '9px' }} />
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                 )}
              </div>

              <div className="mt-10 pt-10 border-t border-white/5">
                 <div className="flex justify-between items-center mb-6">
                    <div className="text-[9px] font-mono text-slate-600 uppercase">Latency: 14ms</div>
                    <div className="text-[9px] font-mono text-slate-600 uppercase">Hardware: V100 GPU</div>
                 </div>
                 <button 
                   onClick={() => { setPhase('idle'); setBatchSummary(null); setManualInputs({hr: 72, qrs: 90, stLevel: 0, prInterval: 160}); }}
                   className="w-full py-4 bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl hover:text-white hover:bg-slate-900 transition-all border border-white/5"
                 >
                   Reset Node
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;