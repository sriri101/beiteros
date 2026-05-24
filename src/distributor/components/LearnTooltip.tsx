import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useDistributorStore } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";

interface LearnTooltipProps {
  title: string;
  desc: string;
  children: React.ReactNode;
  /** Which side the tooltip appears. Defaults to 'top'. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Tooltip width in px. Defaults to 248. */
  width?: number;
}

/**
 * Wraps any content with an explainer tooltip.
 * Only active when "Learn Mode" is ON in the distributor store.
 * Uses a React portal so it is never clipped by overflow:hidden parents.
 */
export function LearnTooltip({
  title, desc, children, side = 'top', width = 248,
}: LearnTooltipProps) {
  const learnMode = useDistributorStore((s) => s.learnMode);
  const [show, setShow]   = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  const handleEnter = useCallback(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const GAP = 10;
    let x = r.left + r.width / 2;
    let y = r.top - GAP;

    if (side === 'bottom') { y = r.bottom + GAP; }
    if (side === 'left')   { x = r.left - GAP;  y = r.top + r.height / 2; }
    if (side === 'right')  { x = r.right + GAP; y = r.top + r.height / 2; }

    setCoords({ x, y });
    setShow(true);
  }, [side]);

  // When learnMode is OFF just render children as-is — zero overhead
  if (!learnMode) return <>{children}</>;

  const TIP_BG = '#111111';
  const ACCENT = '#E31E24';

  /** Tooltip position transforms per side */
  const tipTransform = {
    top:    'translate(-50%, -100%)',
    bottom: 'translate(-50%, 0%)',
    left:   'translate(-100%, -50%)',
    right:  'translate(0%, -50%)',
  }[side];

  /** Arrow styles per side */
  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    width: 0, height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    ...(side === 'top'    && { bottom: -5, left: '50%', transform: 'translateX(-50%)', borderTop: `5px solid ${TIP_BG}`, borderBottom: 'none' }),
    ...(side === 'bottom' && { top: -5,    left: '50%', transform: 'translateX(-50%)', borderBottom: `5px solid ${TIP_BG}`, borderTop: 'none', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }),
    ...(side === 'left'   && { right: -7,  top: '50%',  transform: 'translateY(-50%)', borderLeft: `5px solid ${TIP_BG}`, borderRight: 'none', borderTop: '6px solid transparent', borderBottom: '6px solid transparent' }),
    ...(side === 'right'  && { left: -7,   top: '50%',  transform: 'translateY(-50%)', borderRight: `5px solid ${TIP_BG}`, borderLeft: 'none', borderTop: '6px solid transparent', borderBottom: '6px solid transparent' }),
  };

  const motionY = side === 'top' ? 4 : side === 'bottom' ? -4 : 0;
  const motionX = side === 'left' ? 4 : side === 'right' ? -4 : 0;

  return (
    <span
      ref={ref}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'help', position: 'relative' }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {/* Pulsing "?" badge */}
      <span
        style={{
          width: 14, height: 14, borderRadius: '50%',
          background: ACCENT, color: '#fff',
          fontSize: 8, fontWeight: 900, letterSpacing: '-0.03em',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, lineHeight: 1,
          boxShadow: `0 0 0 2px ${ACCENT}44`,
          animation: 'learnPulse 2.4s ease-in-out infinite',
        }}
      >
        ?
      </span>

      {/* Portal tooltip */}
      {createPortal(
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, x: motionX, y: motionY, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                left: coords.x,
                top: coords.y,
                transform: tipTransform,
                width,
                background: TIP_BG,
                borderRadius: 12,
                padding: '11px 13px 12px',
                zIndex: 999999,
                pointerEvents: 'none',
                boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.09)',
                fontFamily: FF,
              }}
            >
              {/* Accent top bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${ACCENT}, #FF6B6B)`,
                borderRadius: '12px 12px 0 0',
              }} />

              <p style={{ fontSize: 11, fontWeight: 800, color: '#fff', margin: '0 0 5px', letterSpacing: '-0.01em' }}>
                {title}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.58)', margin: 0, lineHeight: 1.6 }}>
                {desc}
              </p>

              {/* Directional arrow */}
              <div style={arrowStyle} />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  );
}
