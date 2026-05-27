import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export const useStats = (matches, players) => {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStatsFromDB = async () => {
    const { data, error } = await supabase
      .from('stats_view')
      .select('*')
      .order('wins', { ascending: false })

    if (error) {
      if (error.message.includes('does not exist')) {
        return calculateLocalStats()
      }
      toast.error('Error al cargar estadísticas')
      return []
    }
    
    setStats(data || [])
    return data
  }

  const calculateLocalStats = () => {
    const playerStats = {}
    
    players.forEach(player => {
      playerStats[player.id] = {
        id: player.id,
        name: player.name,
        total_matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goals_scored: 0,
        goals_conceded: 0
      }
    })
    
    matches.forEach(match => {
      if (playerStats[match.player1_id]) {
        const p1 = playerStats[match.player1_id]
        p1.total_matches++
        p1.goals_scored += match.player1_score
        p1.goals_conceded += match.player2_score
        
        if (match.player1_score > match.player2_score) p1.wins++
        else if (match.player1_score === match.player2_score) p1.draws++
        else p1.losses++
      }
      
      if (playerStats[match.player2_id]) {
        const p2 = playerStats[match.player2_id]
        p2.total_matches++
        p2.goals_scored += match.player2_score
        p2.goals_conceded += match.player1_score
        
        if (match.player2_score > match.player1_score) p2.wins++
        else if (match.player2_score === match.player1_score) p2.draws++
        else p2.losses++
      }
    })
    
    const statsArray = Object.values(playerStats)
    statsArray.sort((a, b) => b.wins - a.wins)
    setStats(statsArray)
  }

  const getTotalStats = () => {
    const totalMatches = matches.length
    const totalGoals = matches.reduce((sum, m) => sum + m.player1_score + m.player2_score, 0)
    const avgGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(1) : 0
    
    return { totalMatches, totalGoals, avgGoals }
  }

  useEffect(() => {
    if (players.length > 0) {
      fetchStatsFromDB()
      setLoading(false)
    }
  }, [matches, players])

  return { stats, loading, getTotalStats }
}