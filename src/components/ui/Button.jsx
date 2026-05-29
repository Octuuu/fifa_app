import React from 'react'
import clsx from 'clsx'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'border hover:shadow-xl',
    secondary: ' shadow-md hover:shadow-xl',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-xl',
    outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900',
    ghost: 'hover:bg-gray-100 text-gray-700'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'font-semibold rounded-xl',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed active:scale-100',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </div>
    </button>
  )
}

export default Button