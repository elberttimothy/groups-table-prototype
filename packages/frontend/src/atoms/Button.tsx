import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { type HTMLMotionProps, motion } from 'motion/react';
import * as React from 'react';

import { cn } from '../utils';

export const buttonVariants = cva(
  "relative overflow-hidden cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-[3px] rounded-sm text-md font-medium text-foreground origin-center will-change-transform",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-accent focus-visible:ring-primary/50',
        destructive:
          'bg-destructive text-white hover:bg-destructive-accent focus-visible:ring-destructive/50',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground text-foreground focus-visible:ring-input focus-visible:border-input',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-accent focus-visible:ring-input',
        ghost:
          'hover:bg-accent hover:text-accent-foreground focus-visible:ring-input',
        link: 'underline-offset-4 underline hover:text-primary focus-visible:ring-input',
      },
      size: {
        sm: 'h-10 px-4 has-[>svg]:px-2.5',
        default: 'h-12 px-4 has-[>svg]:px-3',
        lg: 'h-14 px-6 has-[>svg]:px-4',
        icon: 'size-12 aspect-square',
        'icon-sm': 'size-10 aspect-square',
        'icon-xs': 'size-6 aspect-square',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const rippleVariants = cva('absolute rounded-full size-5 pointer-events-none', {
  variants: {
    variant: {
      default: 'bg-white/60',
      destructive: 'bg-white/50',
      secondary: 'bg-black/20 dark:bg-white/50',
      outline: 'bg-black/20 dark:bg-white/20',
      ghost: 'bg-black/20 dark:bg-white/20',
      link: 'bg-black/20 dark:bg-white/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type Ripple = {
  id: number;
  x: number;
  y: number;
};

interface ButtonProps
  extends Omit<
      HTMLMotionProps<'button'>,
      'color' | 'aria-label' | 'id' | 'ref'
    >,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  loading?: boolean;
  disableRipple?: boolean;
  'aria-label': string;
  id: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      className,
      variant,
      size,
      loading,
      disableRipple,
      ...props
    },
    ref,
  ) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(
      ref,
      () => buttonRef.current as HTMLButtonElement,
    );

    const createRipple = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const newRipple: Ripple = {
          id: Date.now(),
          x,
          y,
        };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);
      },
      [],
    );

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        createRipple(event);
        if (onClick) {
          onClick(event);
        }
      },
      [createRipple, onClick],
    );

    return (
      <motion.button
        data-slot="button"
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          }),
        )}
        {...props}
        disabled={loading || props.disabled}
        ref={buttonRef}
        data-testid={props.id}
      >
        {loading ? (
          <>
            <Loader2
              className="absolute h-4 w-4 animate-spin"
              data-testid="loading-spinner"
            />
            <span className="invisible">{children}</span>
          </>
        ) : (
          <>
            {children}
            {!disableRipple &&
              ripples.map((ripple) => (
                <motion.span
                  key={ripple.id}
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 10, opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                  }}
                  className={cn(rippleVariants({ variant }))}
                  style={{
                    top: ripple.y - 10,
                    left: ripple.x - 10,
                  }}
                />
              ))}
          </>
        )}
      </motion.button>
    );
  },
);

export { Button, type ButtonProps };
