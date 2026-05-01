import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Github, 
  ExternalLink, 
  Download, 
  Mail, 
  Linkedin,
  Brain,
  Database,
  Code2,
  Cpu,
  Layers,
  GraduationCap,
  Briefcase,
  Terminal,
  Trophy,
  X,
  FileText,
  Presentation
} from 'lucide-react';
import { NetworkNode } from './components/NetworkNode';
import { Connection } from './components/Connection';
import { PROJECTS, EDUCATION, EXPERIENCE, type Project, type Education, type Experience } from './data';

type DetailItem = Project | Education | Experience;

export default function App() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [selectedItem, setSelectedItem] = useState<DetailItem | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number, y: number }>>({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate offsets relative to viewport width
  // This ensures the straight segment clears the side text block accurately
  const sideTextOffset = windowWidth < 768 
    ? 220 // Static minimum for mobile
    : Math.max((windowWidth / 1920) * 450, 300); // Scaled for desktop with a floor

  const updateNodePosition = React.useCallback((id: string, rect: DOMRect) => {
    if (!contentRef.current) return;
    const contentRect = contentRef.current.getBoundingClientRect();
    
    setNodePositions(prev => {
      const newX = rect.left - contentRect.left + rect.width / 2;
      const newY = rect.top - contentRect.top + rect.height / 2;
      
      // Only update if position actually changed significantly (avoid micro-jitters)
      const current = prev[id];
      if (current && Math.abs(current.x - newX) < 0.1 && Math.abs(current.y - newY) < 0.1) {
        return prev;
      }

      return {
        ...prev,
        [id]: { x: newX, y: newY }
      };
    });
  }, []);

  const nextLayer = () => setActiveLayer(prev => Math.min(prev + 1, 4));
  const prevLayer = () => setActiveLayer(prev => Math.max(prev - 1, 0));

  // Handle scroll-based navigation
  const lastScrollTime = useRef(0);
  const scrollCooldown = 1000; // ms

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent scrolling if a project is selected
      if (selectedItem) return;

      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) return;

      if (Math.abs(e.deltaY) > 20) {
        if (e.deltaY > 0) {
          if (activeLayer < 4) {
            nextLayer();
            lastScrollTime.current = now;
          }
        } else {
          if (activeLayer > 0) {
            prevLayer();
            lastScrollTime.current = now;
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeLayer, selectedItem]);

  const renderNodeLabel = (label: string) => {
    if (label === 'GITHUB') return <Github className="w-6 h-6 md:w-8 md:h-8" />;
    if (label === 'PAPER') return <FileText className="w-6 h-6 md:w-8 md:h-8" />;
    return <span className="text-[10px] md:text-lg font-bold font-mono">{label}</span>;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neural-dark font-sans" ref={containerRef}>
      {/* Background Elements */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='0.5' fill='white'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Global Static Background Tint */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,rgba(11,14,20,1)_100%)]" />
      </div>

      <div className="fixed top-20 right-20 opacity-5 pointer-events-none select-none">
        <pre className="font-mono text-xs text-neural-blue">
          {`y = σ(Wx + b)\nL = -Σ y_log(y_pred)\n∇W = ∂L/∂W`}
        </pre>
      </div>

      {/* Layer Navigation Indicators (Bottom) */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-4 md:space-x-8">
        <button 
          onClick={prevLayer}
          disabled={activeLayer === 0}
          className="p-1.5 md:p-2 rounded-full glass hover:bg-neural-blue/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-neural-blue group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map(layer => (
            <div key={layer} className="flex items-center">
              <button
                onClick={() => setActiveLayer(layer)}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-500 z-10 ${
                  activeLayer === layer 
                    ? "bg-neural-blue shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-125" 
                    : "bg-white/10 hover:bg-white/30"
                }`}
              />
              {layer < 4 && (
                <div className={`w-8 md:w-12 h-[1px] transition-colors duration-500 ${
                  activeLayer > layer ? "bg-neural-blue/40" : "bg-white/10"
                }`} />
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={nextLayer}
          disabled={activeLayer === 4}
          className="p-1.5 md:p-2 rounded-full glass hover:bg-neural-blue/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-neural-blue group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Main Layers Container */}
      <motion.main
        ref={contentRef}
        className="flex w-[500vw] h-full"
        style={{ willChange: 'transform' }}
        animate={{ x: `-${activeLayer * 100}vw` }}
        transition={{ 
          type: "spring", 
          damping: 20, 
          stiffness: 100,
          mass: 0.8,
          restDelta: 0.001
        }}
      >
        {/* SVG Connections Container (Inside Sliding Content) - Consolidated into ONE SVG */}
        <svg className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-visible">
          {/* All connections are rendered and kept in DOM (Prerendered) */}
          {nodePositions['input-1'] && EDUCATION.map((edu) => (
            nodePositions[edu.id] && (
              <Connection 
                key={`conn-input-${edu.id}`}
                from={nodePositions['input-1']} 
                to={nodePositions[edu.id]} 
                active={activeLayer >= 1 || hoveredNode === 'input-1' || hoveredNode === edu.id}
                isConsolidated
              />
            )
          ))}
          
          {EDUCATION.map((edu) => (
            EXPERIENCE.map((exp) => (
              nodePositions[edu.id] && nodePositions[exp.id] && (
                <Connection 
                  key={`conn-${edu.id}-${exp.id}`}
                  from={nodePositions[edu.id]} 
                  to={nodePositions[exp.id]} 
                  active={activeLayer >= 2 || hoveredNode === edu.id || hoveredNode === exp.id}
                  isConsolidated
                  startOffset={sideTextOffset}
                />
              )
            ))
          ))}

          {EXPERIENCE.map((exp) => (
            PROJECTS.map((proj) => (
              nodePositions[exp.id] && nodePositions[proj.id] && (
                <Connection 
                  key={`conn-${exp.id}-${proj.id}`}
                  from={nodePositions[exp.id]} 
                  to={nodePositions[proj.id]} 
                  active={activeLayer >= 3 || hoveredNode === exp.id || hoveredNode === proj.id}
                  isConsolidated
                  startOffset={sideTextOffset}
                  endOffset={0}
                />
              )
            ))
          ))}

          {PROJECTS.map((proj) => (
            ['output-inference'].map(outId => (
              nodePositions[proj.id] && nodePositions[outId] && (
                <Connection 
                  key={`conn-proj-${proj.id}-${outId}`}
                  from={nodePositions[proj.id]} 
                  to={nodePositions[outId]} 
                  active={activeLayer >= 4 || hoveredNode === proj.id || hoveredNode === outId}
                  isConsolidated
                  startOffset={sideTextOffset}
                />
              )
            ))
          ))}
        </svg>

        {/* LAYER 0: INPUT LAYER (Intro) */}
        <div className="w-full h-full flex items-center justify-center relative p-6 md:p-12">
          <div className="relative flex flex-col items-center">
            {/* Top Content (Positioned relative to centered node) */}
            <div className="absolute bottom-full mb-8 md:mb-12 w-[90vw] md:w-[80vw] max-w-2xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-3 py-1 rounded-full border border-neural-blue/30 bg-neural-blue/10 text-neural-blue text-[9px] md:text-[10px] font-mono mb-4 md:mb-6"
              >
                Portfolio
              </motion.div>
              <h1 className="text-4xl md:text-7xl font-bold font-mono tracking-tighter text-white mb-4">
                MANUEL WIRTH
              </h1>
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                M.Sc. <span className="text-neon-purple">Data Science</span> Student @ University of Mannheim.
              </p>
            </div>

            {/* The Centered Node */}
            <NetworkNode 
              id="input-1"
              type="input"
              label="START"
              isActive={activeLayer >= 0}
              onClick={nextLayer}
              onPositionUpdate={updateNodePosition}
              onMouseEnter={() => setHoveredNode('input-1')}
              onMouseLeave={() => setHoveredNode(null)}
              className="w-24 h-24 md:w-32 md:h-32 text-xs md:text-sm z-10"
            />
          </div>
        </div>
        
        {/* LAYER 1: HIDDEN LAYER 1 (Education) */}
        <div className="w-full h-full flex items-center justify-center relative p-6 md:p-12 overflow-hidden">
          <div className="flex flex-col gap-16 md:gap-32">
            {EDUCATION.map((edu, index) => (
              <div key={edu.id} className="flex items-center space-x-4 md:space-x-6">
                <NetworkNode 
                  id={edu.id}
                  type="hidden"
                  label={renderNodeLabel(edu.nodeLabel)}
                  isActive={activeLayer >= 1}
                  onClick={() => setSelectedItem(edu)}
                  onPositionUpdate={updateNodePosition}
                  onMouseEnter={() => setHoveredNode(edu.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="w-20 h-20 md:w-28 md:h-28"
                />
                <div className="flex flex-col justify-center max-w-[140px] md:max-w-sm space-y-1 md:space-y-2 -translate-y-[4px]">
                  <h3 className="text-white font-mono text-sm md:text-2xl leading-tight font-bold truncate md:whitespace-normal">{edu.degree}</h3>
                  <p className="text-neon-purple text-[10px] md:text-lg leading-tight truncate md:whitespace-normal">{edu.institution}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[18px] md:text-[24px] font-mono text-neon-purple/60 uppercase tracking-[0.3em] md:tracking-[0.5em]">EDUCATION</span>
          </div>
        </div>

        {/* LAYER 2: HIDDEN LAYER 2 (Experience) */}
        <div className="w-full h-full flex items-center justify-center relative p-6 md:p-12 overflow-hidden">
          <div className="flex flex-col gap-16 md:gap-32">
            {EXPERIENCE.map((exp, index) => (
              <div key={exp.id} className="flex items-center space-x-4 md:space-x-6">
                <NetworkNode 
                  id={exp.id}
                  type="hidden"
                  label={renderNodeLabel(exp.nodeLabel)}
                  isActive={activeLayer >= 2}
                  onClick={() => setSelectedItem(exp)}
                  onPositionUpdate={updateNodePosition}
                  onMouseEnter={() => setHoveredNode(exp.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="w-20 h-20 md:w-28 md:h-28"
                />
                <div className="flex flex-col justify-center max-w-[140px] md:max-w-sm space-y-1 md:space-y-2 -translate-y-[4px]">
                  <h3 className="text-white font-mono text-sm md:text-xl leading-tight font-bold truncate md:whitespace-normal">{exp.role}</h3>
                  <p className="text-neon-purple text-[10px] md:text-base font-mono leading-tight truncate md:whitespace-normal">{exp.company} • {exp.period}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[18px] md:text-[24px] font-mono text-neon-purple/60 uppercase tracking-[0.3em] md:tracking-[0.5em]">WORK_EXPERIENCE</span>
          </div>
        </div>

        {/* LAYER 3: HIDDEN LAYER 3 (Projects) */}
        <div className="w-full h-full flex items-center justify-center relative p-6 md:p-12 overflow-hidden">
          <div className="flex flex-col gap-12 md:gap-16">
            {PROJECTS.map((proj, index) => (
              <div key={proj.id} className="flex items-center space-x-4 md:space-x-6">
                <NetworkNode 
                  id={proj.id}
                  type="hidden"
                  label={renderNodeLabel(proj.nodeLabel)}
                  isActive={activeLayer >= 3}
                  onClick={() => setSelectedItem(proj)}
                  onPositionUpdate={updateNodePosition}
                  onMouseEnter={() => setHoveredNode(proj.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="w-20 h-20 md:w-28 md:h-28"
                />
                <div className="flex flex-col justify-center max-w-[140px] md:max-w-sm space-y-1 md:space-y-2 -translate-y-[4px]">
                  <h3 className="text-white font-mono text-sm md:text-2xl leading-tight font-bold truncate md:whitespace-normal">
                    {proj.displayTitle || proj.title}
                  </h3>
                  <p className="text-neon-purple text-[10px] md:text-base line-clamp-1 leading-tight">{proj.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[18px] md:text-[24px] font-mono text-neon-purple/60 uppercase tracking-[0.3em] md:tracking-[0.5em]">SELECTED_PROJECTS</span>
          </div>
        </div>

        {/* LAYER 4: OUTPUT LAYER (The Inference) */}
        <div className="w-full h-full flex items-center justify-center relative p-6 md:p-12">
          <div className="relative flex flex-col items-center">
             {/* Top Content */}
             <div className="absolute bottom-full mb-12 md:mb-16 text-center w-[90vw] md:w-[80vw]">
                <div className="flex justify-center mb-4 md:mb-6">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center">
                      <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-purple-500 shadow-[0_0_30px_rgba(168,83,244,0.8)]" />
                   </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-purple-400 font-mono tracking-tighter">Candidate_Fit = 0.97</h2>
             </div>

             {/* The Centered Node */}
             <NetworkNode 
                id="output-inference"
                type="output"
                label="CONTACT"
                isActive={activeLayer >= 4}
                onPositionUpdate={updateNodePosition}
                className="w-28 h-28 md:w-36 md:h-36 z-10 cursor-default hover:scale-100"
             />

             {/* Bottom Content */}
             <div className="absolute top-full mt-8 md:mt-12 flex flex-col items-center space-y-6 md:space-y-8">
                <div className="flex space-x-4 md:space-x-6">
                  <a href="https://www.linkedin.com/in/manuel-wirth-3a2a29264/" target="_blank" className="p-2.5 md:p-3 rounded-full glass hover:bg-neural-blue/20 transition-all text-gray-400 hover:text-neural-blue">
                    <Linkedin size={18} />
                  </a>
                  <a href="mailto:manuelwirth.mail@gmail.com" className="p-2.5 md:p-3 rounded-full glass hover:bg-neural-blue/20 transition-all text-gray-400 hover:text-neural-blue">
                    <Mail size={18} />
                  </a>
                  <a href="https://github.com/WanuelMirth" target="_blank" className="p-3 rounded-full glass hover:bg-neural-blue/20 transition-all text-gray-400 hover:text-neural-blue">
                    <Github size={18} />
                  </a>
                </div>
             </div>
          </div>
        </div>
      </motion.main>

      <footer className="fixed bottom-4 md:bottom-8 right-6 md:right-12 z-50 text-right pointer-events-none">
        <p className="text-[8px] md:text-[12px] font-mono text-white-500/60 uppercase tracking-widest">
          Mannheim, DE | 2026-05-01
        </p>
      </footer>

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-2xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              >
                <X size={20} className="text-gray-400" />
              </button>

              <div className="p-8 pt-12 max-h-[90vh] overflow-y-auto">
                {'title' in selectedItem ? (
                  // Project
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tighter mb-2">
                        {selectedItem.title}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tech.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-neural-blue/10 border border-neural-blue/30 text-neural-blue text-[10px] font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedItem.image && (
                      <div className="w-full rounded-lg overflow-hidden border border-white/10 bg-black/20">
                        <img 
                          src={selectedItem.image} 
                          alt={selectedItem.title} 
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    )}

                    {'images' in selectedItem && selectedItem.images && (
                      <div className="grid grid-cols-2 gap-4">
                        {selectedItem.images.map((img, i) => (
                          <div key={i} className="rounded-lg overflow-hidden border border-white/10 bg-black/20">
                            <img 
                              src={img} 
                              alt={`${selectedItem.title} screenshot ${i + 1}`} 
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedItem.details}</p>
                    {selectedItem.metrics && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Key Metrics</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedItem.metrics.map((m, i) => (
                            <div key={i} className="flex items-center space-x-2 text-sm text-green-400">
                              <Trophy size={14} />
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                      {selectedItem.link && (
                        <a 
                          href={selectedItem.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-neural-blue hover:underline text-sm font-mono"
                        >
                          <ExternalLink size={14} />
                          <span>View Project Source</span>
                        </a>
                      )}
                      {selectedItem.pdf && (
                        <a 
                          href={selectedItem.pdf} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-neural-blue hover:underline text-sm font-mono"
                        >
                          <FileText size={14} />
                          <span>View Full Document (PDF)</span>
                        </a>
                      )}
                      {'report' in selectedItem && selectedItem.report && (
                        <a 
                          href={selectedItem.report} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-neural-blue hover:underline text-sm font-mono"
                        >
                          <FileText size={14} />
                          <span>View Project Report</span>
                        </a>
                      )}
                      {'slides' in selectedItem && selectedItem.slides && (
                        <a 
                          href={selectedItem.slides} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-neural-blue hover:underline text-sm font-mono"
                        >
                          <Presentation size={14} />
                          <span>View Presentation Slides</span>
                        </a>
                      )}
                    </div>
                  </div>
                ) : 'degree' in selectedItem ? (
                  // Education
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white font-mono tracking-tighter mb-1">
                        {selectedItem.degree}
                      </h2>
                      <p className="text-neon-purple font-mono text-sm">{selectedItem.institution}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-xs font-mono text-gray-500">
                      <span>{selectedItem.period}</span>
                      <span>•</span>
                      <span>Grade: {selectedItem.grade}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{selectedItem.details}</p>
                  </div>
                ) : (
                  // Experience
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white font-mono tracking-tighter mb-1">
                        {selectedItem.role}
                      </h2>
                      <p className="text-neon-purple font-mono text-sm">{selectedItem.company}</p>
                    </div>
                    <p className="text-xs font-mono text-gray-500">{selectedItem.period}</p>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Responsibilities</h4>
                      <ul className="space-y-2">
                        {selectedItem.tasks.map((task, i) => (
                          <li key={i} className="flex items-start space-x-3 text-gray-300 text-sm">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neural-blue shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
