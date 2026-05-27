import React from 'react'
import MatchItem from './MatchItem'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Spinner from '../ui/Spinner'
import { FaUsers, FaPlusCircle, FaClock } from 'react-icons/fa'

const MatchList = ({ matches, loading, onNewMatch }) => {
  if (loading) {
    return (
      <Card>
        <div className="py-12">
          <Spinner />
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <FaClock className="w-6 h-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-800">Últimos Partidos</h2>
        </div>
        <Button onClick={onNewMatch} icon={FaPlusCircle}>
          Nuevo Partido
        </Button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FaUsers className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No hay partidos registrados aún</p>
          <p className="text-sm">¡Registra tu primer partido!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <MatchItem key={match.id} match={match} />
          ))}
        </div>
      )}
    </Card>
  )
}

export default MatchList