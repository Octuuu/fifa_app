import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export const usePlayers = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name')

    if (error) {
      toast.error('Error al cargar jugadores')
      return []
    }
    
    setPlayers(data || [])
    return data
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  return { players, loading, refreshPlayers: fetchPlayers }
}