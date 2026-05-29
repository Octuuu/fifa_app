import React from 'react'
import Card from '../ui/Card'
import { FaUsers } from 'react-icons/fa'
import clsx from 'clsx'

const PlayersTable = ({ players, stats }) => {
  if (players.length === 0) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-500">
          <FaUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay jugadores registrados</p>
        </div>
      </Card>
    )
  }

  const getWinPercentage = (player) => {
    if (!player.total_matches) return 0
    return Math.round((player.wins / player.total_matches) * 100)
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
      
        <h2 className="text-xl font-bold text-gray-800">Estadísticas de Jugadores</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Jugador</th>
              <th className="text-center py-3 px-4 text-gray-600 font-semibold">PJ</th>
              <th className="text-center py-3 px-4 text-gray-600 font-semibold">G</th>
              <th className="text-center py-3 px-4 text-gray-600 font-semibold">E</th>
              <th className="text-center py-3 px-4 text-gray-600 font-semibold">P</th>
              <th className="text-center py-3 px-4 text-gray-600 font-semibold">GF</th>
              <th className="text-center py-3 px-4 text-gray-600 font-semibold">GC</th>
              <th className="text-center py-3 px-4 text-gray-600 font-semibold">%</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((player) => (
              <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-gray-800">{player.name}</td>
                <td className="text-center py-3 px-4 text-gray-700">{player.total_matches || 0}</td>
                <td className="text-center py-3 px-4 text-green-600 font-semibold">{player.wins || 0}</td>
                <td className="text-center py-3 px-4 text-gray-600">{player.draws || 0}</td>
                <td className="text-center py-3 px-4 text-red-600">{player.losses || 0}</td>
                <td className="text-center py-3 px-4 text-blue-600 font-semibold">{player.goals_scored || 0}</td>
                <td className="text-center py-3 px-4 text-orange-600">{player.goals_conceded || 0}</td>
                <td className="text-center py-3 px-4">
                  <span className={clsx(
                    "px-2 py-1 rounded-full text-sm font-semibold",
                    getWinPercentage(player) >= 50
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  )}>
                    {getWinPercentage(player)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default PlayersTable