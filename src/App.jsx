import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import clsx from 'clsx'

// Importaciones correctas de react-icons
import { FaTrophy, FaCalendarAlt, FaChartLine, FaUsers, FaPlusCircle, FaTimesCircle, FaBullseye, FaFutbol, FaClock, FaExclamationTriangle } from 'react-icons/fa'

// Si prefieres usar react-icons/io (Ionicons) u otra colección, también puedes:
// import { IoIosTrophy, IoIosCalendar, IoIosTrendingUp, IoIosPeople, IoIosAddCircle, IoIosCloseCircle, IoIosTarget, IoIosFootball, IoIosTime, IoIosWarning } from 'react-icons/io'

function App() {
  const [matches, setMatches] = useState([])
  const [players, setPlayers] = useState([])
  const [stats, setStats] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState(false)
  const [newMatch, setNewMatch] = useState({
    player1_id: '',
    player2_id: '',
    player1_score: 0,
    player2_score: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setConnectionError(false)
    
    try {
      await Promise.all([
        fetchMatches(),
        fetchPlayers(),
        fetchStats()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
      setConnectionError(true)
      toast.error('Error de conexión con Supabase')
    } finally {
      setLoading(false)
    }
  }

  const fetchMatches = async () => {
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
      return []
    }
    
    setMatches(data || [])
  }

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching players:', error)
      toast.error('Error al cargar jugadores')
      return []
    }
    
    setPlayers(data || [])
  }

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('stats_view')
      .select('*')
      .order('wins', { ascending: false })

    if (error) {
      console.error('Error fetching stats:', error)
      if (error.message.includes('does not exist')) {
        console.log('Vista stats_view no encontrada, usando cálculo local')
        return calculateLocalStats()
      }
      toast.error('Error al cargar estadísticas')
      return []
    }
    
    setStats(data || [])
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
        playerStats[match.player1_id].total_matches++
        playerStats[match.player1_id].goals_scored += match.player1_score
        playerStats[match.player1_id].goals_conceded += match.player2_score
        
        if (match.player1_score > match.player2_score) {
          playerStats[match.player1_id].wins++
        } else if (match.player1_score === match.player2_score) {
          playerStats[match.player1_id].draws++
        } else {
          playerStats[match.player1_id].losses++
        }
      }
      
      if (playerStats[match.player2_id]) {
        playerStats[match.player2_id].total_matches++
        playerStats[match.player2_id].goals_scored += match.player2_score
        playerStats[match.player2_id].goals_conceded += match.player1_score
        
        if (match.player2_score > match.player1_score) {
          playerStats[match.player2_id].wins++
        } else if (match.player2_score === match.player1_score) {
          playerStats[match.player2_id].draws++
        } else {
          playerStats[match.player2_id].losses++
        }
      }
    })
    
    const statsArray = Object.values(playerStats)
    statsArray.sort((a, b) => b.wins - a.wins)
    setStats(statsArray)
  }

  const handleAddMatch = async (e) => {
    e.preventDefault()
    
    if (newMatch.player1_id === newMatch.player2_id) {
      toast.error('No puedes jugar contra ti mismo')
      return
    }

    const matchData = {
      player1_id: newMatch.player1_id,
      player2_id: newMatch.player2_id,
      player1_score: newMatch.player1_score,
      player2_score: newMatch.player2_score,
      played_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('matches')
      .insert([matchData])

    if (error) {
      console.error('Error inserting match:', error)
      toast.error('Error al registrar el partido')
    } else {
      toast.success('Partido registrado correctamente')
      setIsModalOpen(false)
      setNewMatch({
        player1_id: '',
        player2_id: '',
        player1_score: 0,
        player2_score: 0
      })
      fetchData()
    }
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )

  const getTotalStats = () => {
    const totalMatches = matches.length
    const totalGoals = matches.reduce((sum, m) => sum + m.player1_score + m.player2_score, 0)
    const avgGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(1) : 0
    
    return { totalMatches, totalGoals, avgGoals }
  }

  const { totalMatches, totalGoals, avgGoals } = getTotalStats()

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 max-w-md text-center">
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-4">
            No se pudo conectar con Supabase. Por favor verifica:
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
            <li>• Que las variables de entorno estén configuradas correctamente</li>
            <li>• Que las tablas estén creadas en Supabase</li>
            <li>• Que las políticas RLS estén configuradas</li>
          </ul>
          <button onClick={fetchData} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
            <FaFutbol className="w-8 h-8" />
            <h1 className="text-3xl font-bold">FIFA Stats Tracker</h1>
            <FaTrophy className="w-8 h-8" />
          </div>
          <p className="text-gray-600">Registra todos tus partidos y domina la estadística</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Partidos Totales" 
            value={totalMatches} 
            icon={FaCalendarAlt}
            color="text-blue-600"
          />
          <StatCard 
            title="Goles Totales" 
            value={totalGoals} 
            icon={FaBullseye}
            color="text-green-600"
          />
          <StatCard 
            title="Promedio por Partido" 
            value={avgGoals} 
            icon={FaChartLine}
            color="text-purple-600"
          />
        </div>

        {/* Player Stats */}
        <div className="card p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FaTrophy className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-800">Estadísticas de Jugadores</h2>
          </div>
          {players.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay jugadores registrados</p>
            </div>
          ) : (
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
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">% Victorias</th>
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
                          player.total_matches > 0 && ((player.wins / player.total_matches) * 100) >= 50
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        )}>
                          {player.total_matches > 0 
                            ? Math.round((player.wins / player.total_matches) * 100) 
                            : 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Matches */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <FaClock className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-800">Últimos Partidos</h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FaPlusCircle className="w-5 h-5" />
              Nuevo Partido
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaUsers className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No hay partidos registrados aún</p>
              <p className="text-sm">¡Registra tu primer partido!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <div key={match.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg text-gray-800">{match.player1?.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-blue-600">{match.player1_score}</span>
                            <span className="text-gray-400 font-bold">-</span>
                            <span className="text-2xl font-black text-red-600">{match.player2_score}</span>
                          </div>
                          <span className="font-bold text-lg text-gray-800">{match.player2?.name}</span>
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
                        {format(new Date(match.played_at), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <FaFutbol className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Registrar Partido</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimesCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddMatch} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jugador 1
                  </label>
                  <select
                    value={newMatch.player1_id}
                    onChange={(e) => setNewMatch({ ...newMatch, player1_id: e.target.value })}
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
                    value={newMatch.player1_score}
                    onChange={(e) => setNewMatch({ ...newMatch, player1_score: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jugador 2
                  </label>
                  <select
                    value={newMatch.player2_id}
                    onChange={(e) => setNewMatch({ ...newMatch, player2_id: e.target.value })}
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
                    value={newMatch.player2_score}
                    onChange={(e) => setNewMatch({ ...newMatch, player2_score: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
                >
                  <FaTrophy className="w-5 h-5" />
                  Registrar Partido
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default App