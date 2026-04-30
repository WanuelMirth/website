import React from 'react';
import { motion, type Variants } from 'motion/react';
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

  const variants: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    active: {
      scale: 1.1,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.15, 
      cursor: 'pointer',
      transition: { duration: 0.1, ease: "circOut" }
    }
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
      animate={isActive ? "active" : "animate"}
      whileHover="hover"
      variants={variants}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative flex flex-col items-center justify-center w-[110px] h-[110px] rounded-full border-2 glass",
        typeConfig[type],
        isActive && "shadow-[0_0_30px_rgba(59,130,246,0.4)] border-white text-white",
        className
      )}
    >
      <div className="text-[10px] md:text-xs font-bold text-center px-1 truncate w-full">
        {label}
      </div>
    </motion.div>
  );
};
