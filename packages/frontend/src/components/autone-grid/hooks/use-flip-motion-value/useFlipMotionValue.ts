import { animate, useMotionValue } from 'motion/react';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { draggingTransition, othersTransition } from '../../utilities/motion';

/**
 * A custom hook to animate a `MotionValue` using the FLIP technique for performant
 * transform-driven animations. FLIP stands for "First, Last, Invert, Play".
 *
 * @see https://www.joshwcomeau.com/react/animating-the-unanimatable/
 *
 * In a nutshell, using `transforms` to drive animations is preferrable than manually
 * animating `left/right/top/bottom` properties. This is because `left/right/top/bottom`
 * are layout-bound properties which demand a reflow of the layout tree. `transforms`
 * on the other hand, only operates on the rasterization layer - the process of projecting
 * the DOM tree into a 2D bitmap (image) to be rendered on screen.
 *
 * Rasterization is a GPU-accelerated operation which gets upgraded to the compositor
 * thread. This means animations will never get blocked by heavy React rendering work
 * on the main thread.
 *
 * With FLIP, we perform the following steps:
 * 1. `First` - Capture the original position of the element.
 * 2. `Last` - Capture the target final position of the element.
 * 3. `Invert` - Calculate the inverse transform needed to move the element to its
 *    initial position and apply this.
 * 4. `Play` - Animate the inverse transform to the target final position.
 *
 * For `AutoneGrid`, we use `left` to position the element in the x-axis. When columns
 * get reordered, `Tanstack` computes their new `left` positions which we apply as usual
 * on paint. However, through effects managed by `useFlipMotionValue`, we compute the
 * difference between the original and new target `left`. This is the `deltaX` value we
 * FLIP during the animation.
 */
export const useFlipMotionValue = (
  initialValue: number,
  isDragging: boolean,
) => {
  const transition = isDragging ? draggingTransition : othersTransition;
  const delta = useDelta(initialValue);
  const motionValue = useMotionValue(delta);

  useLayoutEffect(() => {
    if (delta === 0) return;
    motionValue.jump(-1 * delta);
  }, [delta, motionValue]);

  useEffect(() => {
    animate(motionValue, 0, transition);
  }, [delta, motionValue, transition]);

  return motionValue;
};

const useDelta = (x: number) => {
  const lastValue = useRef<number>(x);

  useLayoutEffect(() => {
    lastValue.current = x;
  }, [x]);

  return x - lastValue.current;
};
