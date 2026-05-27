import React from 'react'
import StatCard from '../ui/StatCard'
import { FaCalendarAlt, FaBullseye, FaChartLine } from 'react-icons/fa'

const StatsGrid = ({ totalMatches, totalGoals, averageGoals }) => {
  const stats = [
    {
      title: 'Partidos Totales',
      value: totalMatches,
      icon: FaCalendarAlt,
      color: 'blue'
    },
    {
      title: 'Goles Totales',
      value: totalGoals,
      icon: FaBullseye,
      color: 'green'
    },
    {
      title: 'Promedio por Partido',
      value: averageGoals,
      icon: FaChartLine,
      color: 'purple'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}

export default StatsGrid