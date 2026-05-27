import React from 'react'
import clsx from 'clsx'

const Container = ({ children, className = '' }) => {
  return (
    <div className={clsx('max-w-7xl mx-auto px-4 py-8 md:px-8', className)}>
      {children}
    </div>
  )
}

export default Container