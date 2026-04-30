import React from 'react';
import { motion } from 'motion/react';

interface ConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active?: boolean;
}

export const Connection: React.FC<ConnectionProps> = ({ from, to, active = false }) => {
  // Use a slight curve for the path
  const midX = (from.x + to.x) / 2;
  const path = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;

  return (
    <svg 
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: -1 }}
    >
      <motion.path
        d={path}
        fill="none"
        stroke={active ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.05)"}
        strokeWidth={active ? 2 : 1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      {active && (
        <motion.path
          d={path}
          fill="none"
          stroke="rgba(59, 130, 246, 0.8)"
          strokeWidth={2}
          strokeDasharray="4 12"
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      )}
    </svg>
  );
};
