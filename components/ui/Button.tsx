'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-white text-black 
    hover:bg-white/90 
    active:bg-white/80
    shadow-sm
  `,
  secondary: `
    bg-white/10 text-text-primary 
    hover:bg-white/15 
    active:bg-white/20
    border border-border-hairline
  `,
  ghost: `
    bg-transparent text-text-secondary 
    hover:bg-bg-hover hover:text-text-primary
    active:bg-white/10
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-7 px-2.5 text-[11px] rounded',
  md: 'h-9 px-4 text-[13px] rounded-md',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, disabled, children, className = '', ...props }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.1 }}
        disabled={isDisabled}
        className={`
          relative inline-flex items-center justify-center gap-2
          font-medium select-none
          transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel
          disabled:opacity-50 disabled:pointer-events-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
        <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
