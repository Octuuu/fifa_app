import React from 'react'
import clsx from 'clsx'

const Card = ({ children, className = '', padding = true, hover = false }) => {
  return (
    <div className={clsx(
      'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20',
      padding && 'p-6',
      hover && 'hover:shadow-xl transition-all duration-300',
      className
    )}>
      {children}
    </div>
  )
}

export default Card