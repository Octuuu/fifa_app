import React, { useState } from 'react'
import Button from '../ui/Button'
import { FaTrophy } from 'react-icons/fa'

const MatchForm = ({ players, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    player1_id: '',
    player2_id: '',
    player1_score: 0,
    player2_score: 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.player1_id === formData.player2_id) {
      alert('No puedes jugar contra ti mismo')
      return
    }
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Jugador 1
        </label>
        <select
          value={formData.player1_id}
          onChange={(e) => handleChange('player1_id', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Seleccionar jugador</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>{player.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Goles Jugador 1
        </label>
        <input
          type="number"
          min="0"
          value={formData.player1_score}
          onChange={(e) => handleChange('player1_score', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Jugador 2
        </label>
        <select
          value={formData.player2_id}
          onChange={(e) => handleChange('player2_id', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Seleccionar jugador</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>{player.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Goles Jugador 2
        </label>
        <input
          type="number"
          min="0"
          value={formData.player2_score}
          onChange={(e) => handleChange('player2_score', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" icon={FaTrophy} className="flex-1">
          Registrar
        </Button>
      </div>
    </form>
  )
}

export default MatchForm