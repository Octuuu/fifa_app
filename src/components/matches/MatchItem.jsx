import React from 'react'
import { FaTrophy, FaCalendarAlt } from 'react-icons/fa'
import { formatDate } from '../../utils/formatters'

const MatchItem = ({ match }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg text-gray-800">
                {match.player1?.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-blue-600">
                  {match.player1_score}
                </span>
                <span className="text-gray-400 font-bold">-</span>
                <span className="text-2xl font-black text-red-600">
                  {match.player2_score}
                </span>
              </div>
              <span className="font-bold text-lg text-gray-800">
                {match.player2?.name}
              </span>
            </div>
            
            {match.winner && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <FaTrophy className="w-4 h-4" />
                <span className="font-semibold">Ganó {match.winner.name}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <FaCalendarAlt className="w-3 h-3" />
            {formatDate(match.played_at)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchItem