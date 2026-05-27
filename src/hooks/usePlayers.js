import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export const usePlayers = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlayers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching players:', error)
      toast.error('Error al cargar jugadores')
      setLoading(false)
      return []
    }
    
    setPlayers(data || [])
    setLoading(false)
    return data
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  return { players, loading, refreshPlayers: fetchPlayers }
}