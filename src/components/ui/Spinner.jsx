import React from 'react'
import clsx from 'clsx'

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }
  
  return (
    <div className="flex justify-center items-center">
      <div className={clsx(
        'animate-spin rounded-full border-b-2 border-blue-600',
        sizes[size],
        className
      )} />
    </div>
  )
}

export default Spinner