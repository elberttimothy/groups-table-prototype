import type { Meta } from '@storybook/react-vite';

import { RippleRoot } from './RippleRoot';

const meta: Meta<typeof RippleRoot> = {
  title: 'atoms/Ripple Root',
  component: RippleRoot,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const EffectVariants = () => (
  <div className="grid grid-cols-1 grid-rows-5 w-[150px] gap-2">
    <button
      type="button"
      className="relative p-4 overflow-hidden text-base font-medium border-2 border-primary text-black rounded-md"
    >
      Primary
      <RippleRoot className="bg-primary" />
    </button>
    <button
      type="button"
      className="relative p-4 overflow-hidden text-base font-medium border text-black rounded-md"
    >
      Secondary
      <RippleRoot className="bg-secondary-foreground" />
    </button>
  </div>
);
