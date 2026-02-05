import { type Transition } from 'motion';

export const draggingTransition: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 38,
};

export const othersTransition: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 34,
  mass: 1,
};
