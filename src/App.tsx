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
  Trophy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { NetworkNode } from './components/NetworkNode';
import { Connection } from './components/Connection';
import { PROJECTS, EDUCATION, EXPERIENCE, type Project, type Education, type Experience } from './data';

type DetailItem = Project | Education | Experience;

export default function App() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [selectedItem, setSelectedItem] = useState<DetailItem | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number, y: number }>>({});
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const updateNodePosition = (id: string, rect: DOMRect) => {
    if (!contentRef.current) return;
    const contentRect = contentRef.current.getBoundingClientRect();
    
    setNodePositions(prev => ({
      ...prev,
      [id]: {
        x: rect.left - contentRect.left + rect.width / 2,
        y: rect.top - contentRect.top + rect.height / 2
      }
    }));
  };

  const nextLayer = () => setActiveLayer(prev => Math.min(prev + 1, 4));
  const prevLayer = () => setActiveLayer(prev => Math.max(prev - 1, 0));

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neural-dark font-sans" ref={containerRef}>
      {/* Background Elements */}
      <div className="fixed inset-0 neural-grid opacity-20 pointer-events-none" />
      
      {/* Global Dynamic Background Tint */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -1 }}
        animate={{
          background: activeLayer === 4 
            ? 'radial-gradient(circle at bottom, rgba(34, 197, 94, 0.08) 0%, rgba(11, 14, 20, 1) 100%)'
            : activeLayer === 0
            ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.03) 0%, rgba(11, 14, 20, 1) 100%)'
            : 'radial-gradient(circle at center, rgba(168, 85, 247, 0.03) 0%, rgba(11, 14, 20, 1) 100%)'
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      <div className="fixed top-20 right-20 opacity-5 pointer-events-none select-none">
        <pre className="font-mono text-xs text-neural-blue">
          {`y = σ(Wx + b)\nL = -Σ y_log(y_pred)\n∇W = ∂L/∂W`}
        </pre>
      </div>

      {/* Layer Navigation Indicators (Top) */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-4">
        {[0, 1, 2, 3, 4].map(layer => (
          <div key={layer} className="flex items-center">
            <button
              onClick={() => setActiveLayer(layer)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                activeLayer === layer 
                  ? "bg-neural-blue glow-blue scale-125" 
                  : "bg-white/10 hover:bg-white/30"
              }`}
            />
            {layer < 4 && <div className="w-8 h-[1px] bg-white/5 mx-2" />}
          </div>
        ))}
      </div>

      {/* Main Layers Container */}
      <motion.main
        ref={contentRef}
        className="flex w-[500vw] h-full"
        animate={{ x: `-${activeLayer * 100}vw` }}
        transition={{ type: "spring", damping: 20, stiffness: 60 }}
      >
        {/* SVG Connections Container (Inside Sliding Content) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Input to Education Connections */}
          {activeLayer >= 0 && nodePositions['input-1'] && EDUCATION.map((edu) => (
            nodePositions[edu.id] && (
              <Connection 
                key={`conn-input-${edu.id}`}
                from={nodePositions['input-1']} 
                to={nodePositions[edu.id]} 
                active={activeLayer === 1 || hoveredNode === edu.id}
              />
            )
          ))}
          
          {/* Education to Experience Connections */}
          {activeLayer >= 1 && EDUCATION.map((edu) => (
            EXPERIENCE.map((exp) => (
              nodePositions[edu.id] && nodePositions[exp.id] && (
                <Connection 
                  key={`conn-${edu.id}-${exp.id}`}
                  from={nodePositions[edu.id]} 
                  to={nodePositions[exp.id]} 
                  active={activeLayer === 2 || hoveredNode === edu.id || hoveredNode === exp.id}
                />
              )
            ))
          ))}

          {/* Experience to Projects Connections */}
          {activeLayer >= 2 && EXPERIENCE.map((exp) => (
            PROJECTS.map((proj) => (
              nodePositions[exp.id] && nodePositions[proj.id] && (
                <Connection 
                  key={`conn-${exp.id}-${proj.id}`}
                  from={nodePositions[exp.id]} 
                  to={nodePositions[proj.id]} 
                  active={activeLayer === 3 || hoveredNode === exp.id || hoveredNode === proj.id}
                />
              )
            ))
          ))}

          {/* Projects to Output Connections */}
          {activeLayer >= 3 && PROJECTS.map((proj) => (
            ['output-inference'].map(outId => (
              nodePositions[proj.id] && nodePositions[outId] && (
                <Connection 
                  key={`conn-proj-${proj.id}-${outId}`}
                  from={nodePositions[proj.id]} 
                  to={nodePositions[outId]} 
                  active={activeLayer === 4}
                />
              )
            ))
          ))}
        </div>

        {/* LAYER 0: INPUT LAYER (Intro) */}
        <div className="w-full h-full flex items-center justify-center relative p-12">
          <div className="max-w-2xl text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full border border-neural-blue/30 bg-neural-blue/10 text-neural-blue text-xs font-mono mb-4"
            >
              Input Node #IDENTITY
            </motion.div>
            <h1 className="text-7xl font-bold font-mono tracking-tighter text-white">
              MANUEL <span className="text-gradient">WIRTH</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg mx-auto font-light leading-relaxed">
              Master of Science: <span className="text-neural-blue">Data Science</span> at University of Mannheim.
            </p>
            <div className="pt-12 flex justify-center">
              <NetworkNode 
                id="input-1"
                type="input"
                label="FORWARD PASS"
                isActive={activeLayer === 0}
                onClick={nextLayer}
                onPositionUpdate={updateNodePosition}
                className="w-32 h-32 text-sm"
              />
            </div>
            
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-gray-500 animate-pulse">
              <span className="text-xs font-mono uppercase tracking-widest">Propagation Started</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>

        {/* LAYER 1: HIDDEN LAYER 1 (Education) */}
        <div className="w-full h-full flex items-center justify-center relative p-12 overflow-hidden">
          <div className="flex flex-col gap-24">
            {EDUCATION.map((edu, index) => (
              <div key={edu.id} className="flex items-center space-x-12">
                <NetworkNode 
                  id={edu.id}
                  type="hidden"
                  label={edu.degree.split(' ')[0]}
                  isActive={activeLayer === 1}
                  onClick={() => setSelectedItem(edu)}
                  onPositionUpdate={updateNodePosition}
                  onMouseEnter={() => setHoveredNode(edu.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   className="hidden md:block max-w-sm"
                >
                  <h3 className="text-white font-mono text-lg mb-1">{edu.degree}</h3>
                  <p className="text-gray-500 text-sm">{edu.institution} | Grade: {edu.grade}</p>
                </motion.div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-1/2 left-12 -translate-y-1/2">
             <button onClick={prevLayer} className="p-4 rounded-full glass hover:bg-white/10 transition-colors">
               <ChevronLeft className="text-neon-purple" />
             </button>
          </div>
          <div className="absolute top-1/2 right-12 -translate-y-1/2">
             <button onClick={nextLayer} className="p-4 rounded-full glass hover:bg-white/10 transition-colors">
               <ChevronRight className="text-neon-purple" />
             </button>
          </div>
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[10px] font-mono text-neon-purple/60 uppercase tracking-[0.5em]">LAYER_01: EDUCATION</span>
          </div>
        </div>

        {/* LAYER 2: HIDDEN LAYER 2 (Experience) */}
        <div className="w-full h-full flex items-center justify-center relative p-12 overflow-hidden">
          <div className="flex flex-col gap-16">
            {EXPERIENCE.map((exp, index) => (
              <div key={exp.id} className="flex items-center space-x-12">
                <NetworkNode 
                  id={exp.id}
                  type="hidden"
                  label={exp.company.split(' ')[0]}
                  isActive={activeLayer === 2}
                  onClick={() => setSelectedItem(exp)}
                  onPositionUpdate={updateNodePosition}
                  onMouseEnter={() => setHoveredNode(exp.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   className="hidden md:block max-w-sm"
                >
                  <h3 className="text-white font-mono text-lg mb-1">{exp.role}</h3>
                  <p className="text-neon-purple text-xs font-mono">{exp.company} • {exp.period}</p>
                </motion.div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-1/2 left-12 -translate-y-1/2">
             <button onClick={prevLayer} className="p-4 rounded-full glass hover:bg-white/10 transition-colors">
               <ChevronLeft className="text-neon-purple" />
             </button>
          </div>
          <div className="absolute top-1/2 right-12 -translate-y-1/2">
             <button onClick={nextLayer} className="p-4 rounded-full glass hover:bg-white/10 transition-colors">
               <ChevronRight className="text-neon-purple" />
             </button>
          </div>
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[10px] font-mono text-neon-purple/60 uppercase tracking-[0.5em]">LAYER_02: WORK_EXPERIENCE</span>
          </div>
        </div>

        {/* LAYER 3: HIDDEN LAYER 3 (Projects) */}
        <div className="w-full h-full flex items-center justify-center relative p-12 overflow-hidden">
          <div className="flex flex-col gap-16">
            {PROJECTS.map((proj, index) => (
              <div key={proj.id} className="flex items-center space-x-12">
                <NetworkNode 
                  id={proj.id}
                  type="hidden"
                  label={proj.title.split(' ')[0]}
                  isActive={activeLayer === 3}
                  onClick={() => setSelectedItem(proj)}
                  onPositionUpdate={updateNodePosition}
                  onMouseEnter={() => setHoveredNode(proj.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   className="hidden md:block max-w-sm"
                >
                  <h3 className="text-white font-mono text-lg mb-1">{proj.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-1">{proj.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-1/2 left-12 -translate-y-1/2">
             <button onClick={prevLayer} className="p-4 rounded-full glass hover:bg-white/10 transition-colors">
               <ChevronLeft className="text-neon-purple" />
             </button>
          </div>
          <div className="absolute top-1/2 right-12 -translate-y-1/2">
             <button onClick={nextLayer} className="p-4 rounded-full glass hover:bg-white/10 transition-colors">
               <ChevronRight className="text-neon-purple" />
             </button>
          </div>
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[10px] font-mono text-neon-purple/60 uppercase tracking-[0.5em]">LAYER_03: SELECTED_PROJECTS</span>
          </div>
        </div>

        {/* LAYER 4: OUTPUT LAYER (The Inference) */}
        <div className="w-full h-full flex flex-col items-center justify-center relative p-12">
           <div className="text-center mb-16 space-y-4">
             <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center">
                   <div className="w-8 h-8 rounded-full bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.8)]" />
                </div>
             </div>
             <h2 className="text-6xl font-bold text-green-400 font-mono tracking-tighter">Candidate_Fit = 0.97</h2>
           </div>

           <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex flex-col items-center space-y-8">
                <NetworkNode 
                  id="output-inference"
                  type="output"
                  label="INFERENCE"
                  isActive={activeLayer === 4}
                  onPositionUpdate={updateNodePosition}
                  className="w-36 h-36"
                />
                <div className="flex space-x-6">
                  <a href="https://linkedin.com" target="_blank" className="p-3 rounded-full glass hover:bg-neural-blue/20 transition-all text-gray-400 hover:text-neural-blue">
                    <Linkedin size={20} />
                  </a>
                  <a href="mailto:wirthosmanuel@gmail.com" className="p-3 rounded-full glass hover:bg-neon-purple/20 transition-all text-gray-400 hover:text-neon-purple">
                    <Mail size={20} />
                  </a>
                  <a href="https://github.com" target="_blank" className="p-3 rounded-full glass hover:bg-white/10 transition-all text-gray-400 hover:text-white">
                    <Github size={20} />
                  </a>
                </div>
              </div>
           </div>

           <footer className="absolute bottom-12 w-full max-w-5xl px-12 flex justify-between items-end border-t border-white/5 pt-8">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-widest">Recursive Optimization Complete</span>
                <div className="text-xs font-mono text-neural-blue opacity-50 flex items-center space-x-2">
                   <Terminal size={14} />
                   <span>Loss minimized at iter 10,000</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter">© 2026 Manuel Wirth Portfolio</p>
                <p className="text-[10px] font-mono text-neural-blue">Inference Engine v5.0.0</p>
              </div>
           </footer>

           <div className="absolute top-1/2 left-12 -translate-y-1/2">
             <button onClick={prevLayer} className="p-4 rounded-full glass hover:bg-white/10 transition-colors">
               <ChevronLeft className="text-neural-blue" />
             </button>
          </div>
        </div>
      </motion.main>

      {/* Modal (Glassmorphism) */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`node-${'id' in selectedItem ? selectedItem.id : ''}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl glass p-10 rounded-3xl shadow-2xl space-y-8 overflow-hidden"
            >
              {/* Modal Background Decor */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-neural-blue/10 blur-[80px] rounded-full" />
              
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-neural-blue text-[10px] font-mono">
                    <Database size={12} />
                    <span>OBJECT_METADATA_LOADED</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white font-mono tracking-tighter">
                    {'title' in selectedItem ? selectedItem.title : ('degree' in selectedItem ? selectedItem.degree : selectedItem.company)}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-400 hover:text-white transition-colors"
                >
                   EXIT_NODE [esc]
                </button>
              </div>

              {/* Education Details */}
              {'institution' in selectedItem && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 text-neural-blue">
                    <GraduationCap size={24} />
                    <span className="font-mono text-lg">{selectedItem.institution}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-mono uppercase">Performance_Index (Grade)</span>
                    <span className="text-2xl font-bold font-mono text-white">{selectedItem.grade}</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed font-mono text-sm">{selectedItem.details}</p>
                </div>
              )}

              {/* Experience Details */}
              {'role' in selectedItem && !('degree' in selectedItem) && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 text-neon-purple">
                    <Briefcase size={24} />
                    <span className="font-mono text-lg">{selectedItem.role}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Core_Responsibilities</h4>
                    <ul className="space-y-3">
                      {(selectedItem as Experience).tasks.map((task, i) => (
                        <li key={i} className="flex items-start space-x-3 text-sm text-gray-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-neon-purple mt-1.5 shrink-0" />
                           <span className="font-mono">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Project Details */}
              {'tech' in selectedItem && !('role' in selectedItem) && (
                <div className="space-y-6">
                   <div className="flex items-center space-x-3">
                      <Trophy className="text-yellow-500" size={20} />
                      <p className="text-gray-300 font-mono text-sm">{(selectedItem as Project).description}</p>
                   </div>
                   <div className="space-y-2">
                    <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Architecture_Overview</h4>
                    <p className="text-gray-400 leading-relaxed font-mono text-sm">{(selectedItem as Project).details}</p>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {(selectedItem as Project).tech.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full bg-neural-blue/10 border border-neural-blue/30 text-neural-blue text-[10px] font-mono">
                          {t}
                        </span>
                      ))}
                   </div>
                   {(selectedItem as Project).link && (
                     <a 
                       href={(selectedItem as Project).link} 
                       target="_blank" 
                       className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-neural-blue hover:text-white transition-all transform hover:scale-[1.02]"
                     >
                       <ExternalLink size={18} />
                       <span>ACCESS_PUBLIC_PREPRINT</span>
                     </a>
                   )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Status Bar (Bottom Left) */}
      <div className="fixed bottom-8 left-8 z-[60] hidden lg:flex items-center space-x-6 text-[10px] font-mono text-gray-500">
         <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>GPU_CONVOLUTION_ACTIVE</span>
         </div>
         <div className="flex items-center space-x-2">
            <Cpu size={12} className="text-neural-blue" />
            <span>RTX_ON</span>
         </div>
         <div className="flex items-center space-x-2">
            <Layers size={12} className="text-neon-purple" />
            <span>NETWORK_DEPTH: {activeLayer + 1}/5</span>
         </div>
      </div>
    </div>
  );
}
