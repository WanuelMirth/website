import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Github, 
  ExternalLink, 
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
  Presentation,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';
import { NetworkNode } from './components/NetworkNode';
import { Connection } from './components/Connection';
import { PROJECTS, EDUCATION, EXPERIENCE, CONTACT_INFO, type Project, type Education, type Experience, type Contact } from './data';

type DetailItem = Project | Education | Experience | Contact;

const SkeletonImage = ({ src, alt, className = "", imgClassName = "" }: { src: string; alt: string; className?: string; imgClassName?: string }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <motion.div 
          className="absolute inset-0 bg-white/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${imgClassName} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

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

    // Preload important images
    const imagesToPreload = [CONTACT_INFO.image, ...PROJECTS.map(p => p.image)].filter(Boolean) as string[];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate offsets relative to viewport width
  // This ensures the straight segment clears the side text block accurately
  const sideTextOffset = windowWidth < 768 
    ? 160 // Reduced from 220 to match smaller mobile nodes
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

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (selectedItem) return;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (selectedItem) return;
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (selectedItem) return;
    if (
      touchStartX.current === null || 
      touchEndX.current === null || 
      touchStartY.current === null || 
      touchEndY.current === null
    ) return;
    
    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;
    
    // Ensure horizontal swipe is dominant and meets threshold
    if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > 50) {
      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) return;

      if (distanceX > 0 && activeLayer < 4) {
        nextLayer();
        lastScrollTime.current = now;
      } else if (distanceX < 0 && activeLayer > 0) {
        prevLayer();
        lastScrollTime.current = now;
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
  };

  const renderNodeLabel = (label: string) => {
    if (label === 'GITHUB') return <Github className="w-6 h-6 md:w-8 md:h-8" />;
    if (label === 'PAPER') return <FileText className="w-6 h-6 md:w-8 md:h-8" />;
    return <span className="text-[10px] md:text-lg font-bold font-mono">{label}</span>;
  };

  return (
    <div 
      className="relative w-full h-dvh overflow-hidden bg-black font-sans" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Elements */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='0.8' fill='white'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Global Static Background Tint */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,rgba(0,0,0,1)_100%)]" />
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
          className="p-1.5 md:p-2 rounded-full glass border border-white hover:bg-neural-blue/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-neural-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map(layer => (
            <div key={layer} className="flex items-center">
              <button
                onClick={() => setActiveLayer(layer)}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-500 z-10 border border-white/30 ${
                  activeLayer === layer 
                    ? "bg-neural-blue shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-125 border-white" 
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
          className="p-1.5 md:p-2 rounded-full glass border border-white hover:bg-neural-blue/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-neural-white group-hover:scale-110 transition-transform" />
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
              <h1 className="text-4xl md:text-7xl font-bold font-mono tracking-tighter text-white mb-4 uppercase">
                MANUEL WIRTH
              </h1>
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                M.Sc. <span className="text-neon-purple">Data Science</span> Student <br className="block md:hidden" /> @ University of Mannheim.
              </p>
            </div>

            {/* The Centered Node */}
            <NetworkNode 
              id="input-1"
              type="input"
              label={renderNodeLabel("START")}
              isActive={activeLayer >= 0}
              onClick={nextLayer}
              onPositionUpdate={updateNodePosition}
              onMouseEnter={() => setHoveredNode('input-1')}
              onMouseLeave={() => setHoveredNode(null)}
              className="w-20 h-20 md:w-32 md:h-32 z-10"
            />
          </div>
        </div>
        
        {/* LAYER 1: HIDDEN LAYER 1 (Education) */}
        <div className="w-full h-full flex items-center justify-center relative p-6 md:p-12 overflow-hidden">
          <div className="flex flex-col gap-8 md:gap-32">
            {EDUCATION.map((edu, index) => (
              <div key={edu.id} className="flex items-center space-x-2 md:space-x-6">
                <NetworkNode 
                  id={edu.id}
                  type="hidden"
                  label={renderNodeLabel(edu.nodeLabel)}
                  isActive={activeLayer >= 1}
                  onClick={() => setSelectedItem(edu)}
                  onPositionUpdate={updateNodePosition}
                  onMouseEnter={() => setHoveredNode(edu.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="w-16 h-16 md:w-28 md:h-28"
                />
                <div className="grid grid-rows-2 max-w-[140px] md:max-w-sm">
                  <div className="flex items-end pb-[3px] md:pb-[6px]">
                    <h3 className="text-white text-[12px] md:text-2xl leading-none font-bold truncate md:whitespace-normal">{edu.degree}</h3>
                  </div>
                  <div className="flex items-start pt-[3px] md:pt-[6px]">
                    <p className="text-neon-purple text-[10px] md:text-lg leading-none truncate md:whitespace-normal">{edu.institution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[18px] md:text-[24px] font-mono font-bold text-neon-purple/60 uppercase tracking-[0.3em] md:tracking-[0.5em]">EDUCATION</span>
          </div>
        </div>

        {/* LAYER 2: HIDDEN LAYER 2 (Experience) */}
        <div className="w-full h-full flex items-center justify-center relative p-6 md:p-12 overflow-hidden">
          <div className="flex flex-col gap-8 md:gap-32">
            {EXPERIENCE.map((exp, index) => (
              <div key={exp.id} className="flex items-center space-x-2 md:space-x-6">
                <NetworkNode 
                  id={exp.id}
                  type="hidden"
                  label={renderNodeLabel(exp.nodeLabel)}
                  isActive={activeLayer >= 2}
                  onClick={() => setSelectedItem(exp)}
                  onPositionUpdate={updateNodePosition}
                  onMouseEnter={() => setHoveredNode(exp.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="w-16 h-16 md:w-28 md:h-28"
                />
                <div className="grid grid-rows-2 max-w-[140px] md:max-w-sm">
                  <div className="flex items-end pb-[3px] md:pb-[6px]">
                    <h3 className="text-white text-[12px] md:text-2xl leading-none font-bold truncate md:whitespace-normal">{exp.shortRole}</h3>
                  </div>
                  <div className="flex items-start pt-[3px] md:pt-[6px]">
                    <p className="text-neon-purple text-[10px] md:text-lg leading-none truncate md:whitespace-normal font-normal">{exp.period}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[18px] md:text-[24px] font-mono font-bold text-neon-purple/60 uppercase tracking-[0.3em] md:tracking-[0.5em]">WORK_EXPERIENCE</span>
          </div>
        </div>

        {/* LAYER 3: HIDDEN LAYER 3 (Projects) */}
        <div className="w-full h-full flex items-center justify-center relative p-6 md:p-12 overflow-hidden">
          <div className="flex flex-col gap-6 md:gap-16">
            {PROJECTS.map((proj, index) => (
              <div key={proj.id} className="flex items-center space-x-2 md:space-x-6">
                <NetworkNode 
                  id={proj.id}
                  type="hidden"
                  label={renderNodeLabel(proj.nodeLabel)}
                  isActive={activeLayer >= 3}
                  onClick={() => setSelectedItem(proj)}
                  onPositionUpdate={updateNodePosition}
                  onMouseEnter={() => setHoveredNode(proj.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="w-16 h-16 md:w-28 md:h-28"
                />
                <div className="grid grid-rows-2 max-w-[140px] md:max-w-sm">
                  <div className="flex items-end pb-[3px] md:pb-[6px]">
                    <h3 className="text-white font-mono text-[12px] md:text-2xl leading-none font-bold truncate md:whitespace-normal">{proj.displayTitle || proj.title}</h3>
                  </div>
                  <div className="flex items-start pt-[3px] md:pt-[6px]">
                    <p className="text-neon-purple text-[10px] md:text-base leading-none line-clamp-1 truncate">{proj.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[18px] md:text-[24px] font-bold font-mono text-neon-purple/60 uppercase tracking-[0.3em] md:tracking-[0.5em]">SELECTED_PROJECTS</span>
          </div>
        </div>

        {/* LAYER 4: OUTPUT LAYER (The Inference) */}
        <div className="w-full h-full flex items-center justify-center relative p-6 md:p-12">
          <div className="relative flex flex-col items-center">
             {/* Top Content */}
             <div className="absolute bottom-full mb-12 md:mb-16 text-center w-[90vw] md:w-[80vw]">
                <div className="flex justify-center mb-4 md:mb-6">
                   <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center">
                      <div className="w-3 h-3 md:w-6 md:h-6 rounded-full bg-purple-500 shadow-[0_0_30px_rgba(168,83,244,0.8)]" />
                   </div>
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-purple-400 font-mono tracking-tighter uppercase">Candidate_Fit = 0.97</h2>
             </div>

             {/* The Centered Node */}
             <NetworkNode 
                id="output-inference"
                type="output"
                label={renderNodeLabel("CONTACT")}
                isActive={activeLayer >= 4}
                onClick={() => setSelectedItem(CONTACT_INFO)}
                onPositionUpdate={updateNodePosition}
                onMouseEnter={() => setHoveredNode('output-inference')}
                onMouseLeave={() => setHoveredNode(null)}
                className="w-24 h-24 md:w-36 md:h-36 z-10 cursor-pointer"
             />

             {/* Bottom Content removed */}
          </div>
        </div>
      </motion.main>

      <footer className="fixed bottom-4 md:bottom-8 right-6 md:right-12 z-50 text-right pointer-events-none hidden md:block">
        <p className="text-[8px] md:text-[12px] font-mono text-white-500/60 uppercase tracking-widest">
          Mannheim, DE | 2026-05-02
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
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              >
                <X size={20} className="text-gray-400" />
              </button>

              <div className="p-8 pt-12 max-h-[90vh] overflow-y-auto">
                {'title' in selectedItem ? (
                  // Project
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tighter mb-2 leading-tight">
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
                        <SkeletonImage 
                          src={selectedItem.image} 
                          alt={selectedItem.title} 
                          className="w-full"
                          imgClassName="w-full h-auto object-contain"
                        />
                      </div>
                    )}

                    {'images' in selectedItem && selectedItem.images && (
                      <div className="grid grid-cols-2 gap-4">
                        {selectedItem.images.map((img, i) => (
                          <div key={i} className="rounded-lg overflow-hidden border border-white/10 bg-black/20">
                            <SkeletonImage 
                              src={img} 
                              alt={`${selectedItem.title} screenshot ${i + 1}`} 
                              className="w-full h-auto"
                              imgClassName="w-full h-auto object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedItem.details}</p>
                    {selectedItem.metrics && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Key Metrics</h4>
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
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tighter  leading-tight">
                          {selectedItem.nodeLabel} {selectedItem.degree}
                        </h2>
                        <p className="text-neon-purple font-mono text-sm mt-1 ">{selectedItem.institution}</p>
                      </div>
                      <div className="flex flex-col md:items-end md:mt-2">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                          {selectedItem.id === 'edu-msc' ? 'Current Grade' : 'Final Grade'}
                        </span>
                        <span className="text-xl font-bold text-white font-mono">{selectedItem.grade}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed italic border-l border-neural-blue/30 pl-4 py-0.5">
                      {selectedItem.details}
                    </p>

                    {selectedItem.courses && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Courses</h4>
                        <ul className="space-y-2.5">
                          {selectedItem.courses.map((course, i) => (
                            <li key={i} className="flex items-center space-x-3 text-gray-200 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 opacity-80" />
                              <div className="flex-1 flex justify-between gap-4">
                                <span className="">{course.name}</span>
                                <span className="font-mono text-xs shrink-0 font-bold">[{course.grade}]</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedItem.association && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Activities</h4>
                        <div className="flex items-start space-x-3 text-gray-200 text-sm">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0 opacity-80" />
                          <span className="flex-1 ">{selectedItem.association}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : 'email' in selectedItem ? (
                  // Contact Card
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white bg-neural-dark overflow-hidden shrink-0">
                        {selectedItem.image ? (
                          <SkeletonImage 
                            src={selectedItem.image} 
                            alt={selectedItem.name} 
                            className="w-full h-full rounded-full"
                            imgClassName="w-full h-full object-cover scale-125 translate-x-[2%]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={48} className="text-neural-blue/40" />
                          </div>
                        )}
                      </div>
                      <div className="text-center md:text-left">
                        <h2 className="text-4xl font-bold text-white font-mono tracking-tighter mb-2 uppercase">{selectedItem.name}</h2>
                        <p className="text-neon-purple font-mono text-lg mb-4 uppercase">{selectedItem.role}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 text-sm font-mono">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {selectedItem.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <a href={selectedItem.linkedin} target="_blank" className="flex items-center justify-center gap-3 p-4 rounded-xl glass hover:bg-neural-blue/10 transition-all group">
                        <Linkedin size={20} className="text-gray-400 group-hover:text-neural-blue" />
                        <span className="text-sm font-mono text-gray-300">LinkedIn</span>
                      </a>
                      <a href={`mailto:${selectedItem.email}`} className="flex items-center justify-center gap-3 p-4 rounded-xl glass hover:bg-neural-blue/10 transition-all group">
                        <Mail size={20} className="text-gray-400 group-hover:text-neural-blue" />
                        <span className="text-sm font-mono text-gray-300">Email</span>
                      </a>
                      <a href={selectedItem.github} target="_blank" className="flex items-center justify-center gap-3 p-4 rounded-xl glass hover:bg-neural-blue/10 transition-all group">
                        <Github size={20} className="text-gray-400 group-hover:text-neural-blue" />
                        <span className="text-sm font-mono text-gray-300">GitHub</span>
                      </a>
                    </div>
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
                    <p className="text-sm font-mono text-gray-400 font-medium">{selectedItem.period}</p>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Responsibilities</h4>
                      <ul className="space-y-2">
                        {selectedItem.tasks.map((task, i) => (
                          <li key={i} className="flex items-start space-x-3 text-gray-300 text-sm md:text-base leading-relaxed">
                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-white shrink-0 shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
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
