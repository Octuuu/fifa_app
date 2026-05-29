import React from 'react'
import clsx from 'clsx'

const Card = ({ children, className = '', padding = true}) => {
  return (
    <div className={clsx(
      '',
      padding && 'p-6',
      
      className
    )}>
      {children}
    </div>
  )
}

export default Card