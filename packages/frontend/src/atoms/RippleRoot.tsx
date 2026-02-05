import { AnimatePresence, motion } from 'motion/react';
import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type TouchEvent,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { v4 } from 'uuid';

import { cn } from '../utils';

interface RippleElementParams {
  rippleId: string;
  x: number;
  y: number;
  targetWidth: number;
}

interface RipplePublicParams {
  pulseDuration?: number;
  pulseOpacity?: number;
}

interface RippleRootProps
  extends Omit<
      HTMLAttributes<HTMLSpanElement>,
      'children' | 'onAnimationEnd' | 'onAnimationStart'
    >,
    RipplePublicParams {
  pulseDuration?: number;
  pulseOpacity?: number;
}

// cubic bezier parameters used by MUI
const EASING_CURVE = [0.4, 0, 0.2, 1] as const;

const isMouseEvent = (e: MouseEvent | TouchEvent): e is MouseEvent => {
  return 'clientX' in e;
};

export const RippleRoot = forwardRef<HTMLSpanElement, RippleRootProps>(
  ({ className, pulseDuration = 0.55, pulseOpacity = 0.5, ...props }, ref) => {
    const rippleRoot = useRef<HTMLSpanElement>(null);

    const [ripples, setRipples] = useState<RippleElementParams[]>([]);
    const [mouseIsDown, setMouseIsDown] = useState(false);

    useImperativeHandle(ref, () => rippleRoot.current as HTMLSpanElement);

    const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
      if (rippleRoot.current) {
        const { clientX, clientY } = isMouseEvent(e)
          ? { clientX: e.clientX, clientY: e.clientY }
          : { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
        const { width, height, left, top } =
          rippleRoot.current.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;
        const maxY = Math.max(y, height - y);
        const maxX = Math.max(x, width - x);
        const targetWidth =
          Math.sqrt(Math.pow(maxX, 2) + Math.pow(maxY, 2)) * 2;
        const rippleId = v4();

        setRipples((prev) => [
          ...prev,
          {
            rippleId,
            x: x,
            y: y,
            targetWidth,
          },
        ]);
        setMouseIsDown(true);
      }
    }, []);

    const handleEndAnimation = useCallback(
      (rippleId: string) => {
        if (mouseIsDown) return;
        setRipples((prev) =>
          prev.filter((ripple) => ripple.rippleId !== rippleId),
        );
      },
      [mouseIsDown],
    );

    const removeAllRipples = useCallback(() => {
      setRipples([]);
      setMouseIsDown(false);
    }, []);

    return (
      <span
        className="absolute h-full w-full overflow-hidden left-0 top-0"
        onMouseDown={handleMouseDown}
        onMouseUp={removeAllRipples}
        onMouseLeave={removeAllRipples}
        onTouchStart={handleMouseDown}
        onTouchEnd={removeAllRipples}
        onTouchCancel={removeAllRipples}
        {...props}
        ref={rippleRoot}
      >
        <AnimatePresence>
          {ripples.map(({ rippleId, x, y, targetWidth }) => (
            <motion.span
              key={rippleId}
              className={cn(
                'absolute rounded-full -translate-x-[50%] -translate-y-[50%] pointer-events-none',
                className,
              )}
              style={{ left: x, top: y }}
              initial={{ width: 0, height: 0, opacity: pulseOpacity * 0.33 }}
              animate={{
                width: targetWidth,
                height: targetWidth,
                opacity: pulseOpacity,
                transition: {
                  type: 'tween',
                  duration: pulseDuration,
                  ease: EASING_CURVE,
                },
              }}
              exit={{
                opacity: 0,
                width: targetWidth,
                height: targetWidth,
                transition: {
                  type: 'tween',
                  duration: pulseDuration / 2,
                  ease: 'linear',
                },
              }}
              onAnimationComplete={() => handleEndAnimation(rippleId)}
            />
          ))}
        </AnimatePresence>
      </span>
    );
  },
);
