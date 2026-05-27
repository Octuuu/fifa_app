import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export const useMatches = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMatches = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        player1:player1_id(id, name),
        player2:player2_id(id, name),
        winner:winner_id(id, name)
      `)
      .order('played_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching matches:', error)
      toast.error('Error al cargar partidos')
      setLoading(false)
      return []
    }
    
    setMatches(data || [])
    setLoading(false)
    return data
  }

  const addMatch = async (matchData) => {
    const { error } = await supabase
      .from('matches')
      .insert([{
        ...matchData,
        played_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Error inserting match:', error)
      toast.error('Error al registrar el partido')
      return false
    }
    
    toast.success('Partido registrado correctamente')
    await fetchMatches()
    return true
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  return { matches, loading, addMatch, refreshMatches: fetchMatches }
}