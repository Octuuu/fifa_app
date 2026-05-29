import React from 'react'

const StatsGrid = ({ totalMatches, totalGoals, averageGoals }) => {
  return (
    <div className="mb-8 ml-6">
      <h1 className="text-xl font-bold mb-4">Estadísticas generales de nuestros partidos</h1>
      <ul className="list-disc pl-5 space-y-2">
        <li>Partidos Totales: <span className="font-semibold">{totalMatches}</span></li>
        <li>Goles Totales: <span className="font-semibold">{totalGoals}</span></li>
        <li>Promedio por Partido: <span className="font-semibold">{averageGoals}</span></li>
      </ul>
    </div>
  )
}

export default StatsGrid