import { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The content of the button */
  children: ReactNode
  /** The visual style variant */
  variant?: 'primary' | 'secondary' | 'outline'
  /** The size of the button */
  size?: 'small' | 'medium' | 'large'
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

