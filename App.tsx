import React, { useEffect, useState } from 'react';
import SplineScene from './components/SplineScene';
import LiveDemo from './components/LiveDemo';
import { 
  SPLINE_DNA, 
  SPLINE_HUD, 
  TECH_STACK, 
  DATASET_STATS,
  EVALUATION_PHASES,
  PROJECT_NAME
} from './constants';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<'landing' | 'main'>('landing');
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRoleSelect = (role: 'student' | 'admin') => {
    setUserRole(role);
    setView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <SplineScene url={SPLINE_DNA} isBackground={true} />
        </div>
        
        <div className="relative z-10 text-center mb-16 max-w-2xl">
          <h1 className="text-6xl md:text-7xl font-bold font-heading mb-6 tracking-tight gradient-text">
            {PROJECT_NAME}
          </h1>
          <p className="text-slate-400 text-lg">Select your portal to enter the deep learning diagnostic suite.</p>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-12 w-full max-w-4xl">
          <button 
            onClick={() => handleRoleSelect('student')}
            className="group flex-1 h-[400px] rotating-border-box p-12 flex flex-col items-center justify-center text-center transition-all duration-500 hover:-translate-y-2"
          >
            <div className="text-7xl mb-8 group-hover:scale-110 transition-transform duration-500">🎓</div>
            <h3 className="text-3xl font-bold text-white mb-4">Student Portal</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Access educational ECG modules, model insights, and training performance visualizations.</p>
          </button>

          <button 
            onClick={() => handleRoleSelect('admin')}
            className="group flex-1 h-[400px] rotating-border-box p-12 flex flex-col items-center justify-center text-center transition-all duration-500 hover:-translate-y-2"
          >
            <div className="text-7xl mb-8 group-hover:scale-110 transition-transform duration-500">⚖️</div>
            <h3 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h3>
            <p className="text-slate-500 text-sm leading-relaxed">System-wide monitoring, threshold optimization, and advanced clinical validation tools.</p>
          </button>
        </div>
        
        <div className="relative z-10 mt-20 text-[10px] font-mono text-slate-700 uppercase tracking-[0.5em]">
          Powered by Deep Neural ResNet & LSTM
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center font-bold text-slate-950">C</div>
            <span className="text-xl font-bold font-heading tracking-tight">{PROJECT_NAME}</span>
          </div>
          <div className="hidden md:flex space-x-10 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="#dataset" className="hover:text-cyan-400 transition-colors">Dataset</a>
            <a href="#demo" className="hover:text-cyan-400 transition-colors">Live Demo</a>
            <a href="#footer" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-[10px] font-mono px-3 py-1 bg-white/5 rounded-full border border-white/10 text-slate-500 uppercase">{userRole}</span>
             <a href="#demo" className="px-6 py-2.5 bg-cyan-500 text-slate-950 text-xs font-bold rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
               Analyze Now
             </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-70">
          <SplineScene url={SPLINE_DNA} isBackground={true} />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-[0.3em] uppercase backdrop-blur-md">
            AI-Powered ECG Arrhythmia Detection
          </div>
          <h1 className="text-6xl md:text-8xl font-bold font-heading mb-8 tracking-tight leading-[1] text-white">
            Future of Cardiac <br /> <span className="gradient-text">Diagnostics</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Multi-label deep learning for real-world cardiac diagnosis using 12-lead signals across CNN, LSTM, and Transformer layers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <a href="#demo" className="w-full sm:w-auto px-12 py-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl transition-all shadow-2xl shadow-cyan-500/30">
              View Live Demo
            </a>
            <a href="#dataset" className="w-full sm:w-auto px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 backdrop-blur-md">
              Learn Technicals
            </a>
          </div>
        </div>
      </header>

      {/* Home / Problem Section */}
      <section id="home" className="relative py-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-80">
          <SplineScene url={SPLINE_HUD} isBackground={true} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <div className="inline-block px-3 py-1 mb-8 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono uppercase tracking-[0.2em]">
                The Problem Statement
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-10 text-white font-heading glow-text leading-tight">
                Beyond Single-Label <br /> Boundaries
              </h2>
              <div className="space-y-8 text-slate-300 text-lg leading-relaxed">
                <p>ECG arrhythmias often co-occur in real clinical practice. Traditional single-label models fail to capture the complexity of multiple concurrent cardiac pathologies.</p>
                <p>Our solution utilizes multi-label classification trained on the CPSC 2018 dataset, capable of detecting AF, PVC, LBBB, and more simultaneously from a single 60s window.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {TECH_STACK.slice(0, 4).map((tech, i) => (
                <div key={i} className="glass-panel p-8 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-4">{tech.icon}</div>
                  <div className="text-lg font-bold text-white">{tech.name}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-2 uppercase">{tech.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dataset / Evaluation Section */}
      <section id="dataset" className="py-32 px-6 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-bold mb-6 font-heading">Architecture & Evaluation</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Handling variable-length sequence inputs with an ensemble of optimized multi-label architectures.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {EVALUATION_PHASES.map((phase, idx) => (
              <div key={idx} className="glass-panel p-10 rounded-[2.5rem] hover:border-cyan-500/30 transition-all">
                <h3 className="text-2xl font-bold mb-6 text-cyan-400">{phase.title}</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">{phase.description}</p>
                <div className="space-y-3">
                  {phase.points.map((p, i) => (
                    <div key={i} className="flex items-center text-[10px] font-mono text-slate-500 uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3"></div>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {DATASET_STATS.map((stat, i) => (
              <div key={i} className="text-center p-8 bg-slate-950/50 rounded-3xl border border-white/5">
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <LiveDemo />

      {/* Footer / Contact */}
      <footer id="footer" className="py-32 px-6 bg-slate-950 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-slate-950 text-2xl">C</div>
                <span className="text-2xl font-bold font-heading text-white">{PROJECT_NAME}</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Advancing cardiac health through multi-label deep learning and explainable AI insights.
              </p>
              <div className="flex space-x-4">
                 <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all">G</button>
                 <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all">L</button>
                 <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all">X</button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-8">Navigation</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Home Portal</a></li>
                <li><a href="#dataset" className="hover:text-cyan-400 transition-colors">Dataset Hub</a></li>
                <li><a href="#demo" className="hover:text-cyan-400 transition-colors">Neural Dashboard</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">PhysioNet Integration</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-8">Team</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li className="flex justify-between"><span>Lead Researcher</span> <span className="text-white/80">Dr. A. Neural</span></li>
                <li className="flex justify-between"><span>Architecture</span> <span className="text-white/80">S. Deep</span></li>
                <li className="flex justify-between"><span>Data Science</span> <span className="text-white/80">J. Signals</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-8">Hackathon 2024</h4>
              <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                 <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mb-4">Official Submission</p>
                 <p className="text-xs text-slate-300 leading-relaxed">Built for the AI Healthcare Global Hackathon. Multi-Label Classification Challenge.</p>
                 <div className="mt-6 flex gap-4">
                    <button className="flex-1 py-3 bg-cyan-500 text-slate-950 text-[10px] font-bold uppercase rounded-lg">GitHub Repo</button>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-700">
              © 2024 {PROJECT_NAME} • Built for Clinical Impact
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;