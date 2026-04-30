import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NetworkNodeProps {
  id: string;
  type: 'input' | 'hidden' | 'output';
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  onPositionUpdate?: (id: string, rect: DOMRect) => void;
}

export const NetworkNode: React.FC<NetworkNodeProps> = ({
  id,
  type,
  label,
  isActive = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  onPositionUpdate,
}) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (nodeRef.current && onPositionUpdate) {
      const updatePosition = () => {
        const rect = nodeRef.current?.getBoundingClientRect();
        if (rect) onPositionUpdate(id, rect);
      };
      
      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [id, onPositionUpdate]);

  const variants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.1, cursor: 'pointer' },
    active: { scale: 1.1, borderColor: '#3b82f6', color: '#3b82f6' }
  };

  const typeConfig = {
    input: 'border-neural-blue text-neural-blue',
    hidden: 'border-neon-purple text-neon-purple',
    output: 'border-green-400 text-green-400',
  };

  return (
    <motion.div
      ref={nodeRef}
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={variants}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 glass transition-colors duration-300",
        typeConfig[type],
        isActive && "shadow-[0_0_20px_rgba(59,130,246,0.6)] border-white text-white",
        className
      )}
    >
      <div className="text-xs font-bold text-center px-1 truncate w-full">
        {label}
      </div>
    </motion.div>
  );
};
