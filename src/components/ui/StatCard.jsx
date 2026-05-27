import React from 'react'
import Card from './Card'

const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600'
  }
  
  return (
    <Card hover>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
          {title}
        </h3>
        <Icon className={`w-6 h-6 ${colors[color]}`} />
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </Card>
  )
}

export default StatCard