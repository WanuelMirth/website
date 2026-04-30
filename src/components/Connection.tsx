import React from 'react';
import { motion } from 'motion/react';

interface ConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active?: boolean;
  isConsolidated?: boolean;
  startOffset?: number;
  endOffset?: number;
}

export const Connection: React.FC<ConnectionProps> = ({ 
  from, 
  to, 
  active = false, 
  isConsolidated = false,
  startOffset = 60,
  endOffset = 30
}) => {
  // Path: Start Center -> Straight to startOffset -> Curve to endOffset -> Straight to Center
  const curveStartX = from.x + startOffset;
  const curveEndX = to.x - endOffset;
  
  // Control point offset for a smooth S-curve
  const cpOffset = Math.max(Math.abs(curveEndX - curveStartX) * 0.5, 40);
  
  const path = `M ${from.x} ${from.y} 
                L ${curveStartX} ${from.y} 
                C ${curveStartX + cpOffset} ${from.y}, 
                  ${curveEndX - cpOffset} ${to.y}, 
                  ${curveEndX} ${to.y} 
                L ${to.x} ${to.y}`;

  const content = (
    <>
      <motion.path
        d={path}
        fill="none"
        stroke={active ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.3)"}
        strokeWidth={active ? 2 : 1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </>
  );

  if (isConsolidated) {
    return content;
  }

  return (
    <svg 
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: -1 }}
    >
      {content}
    </svg>
  );
};
