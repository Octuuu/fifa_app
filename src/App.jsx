import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Container from './components/layout/Container'
import Header from './components/layout/Header'
import StatsGrid from './components/stats/StatsGrid'
import PlayersTable from './components/players/PlayersTable'
import MatchList from './components/matches/MatchList'
import MatchForm from './components/matches/MatchForm'
import Modal from './components/ui/Modal'
import { useMatches } from './hooks/useMatches'
import { usePlayers } from './hooks/usePlayers'
import { useStats } from './hooks/useStats'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { matches, loading: matchesLoading, addMatch } = useMatches()
  const { players, loading: playersLoading } = usePlayers()
  const { stats, getTotalStats } = useStats(matches, players)
  const { totalMatches, totalGoals, avgGoals } = getTotalStats()

  const handleAddMatch = async (matchData) => {
    const success = await addMatch(matchData)
    if (success) {
      setIsModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <Container>
        <Header />
        <StatsGrid 
          totalMatches={totalMatches}
          totalGoals={totalGoals}
          averageGoals={avgGoals}
        />
        <PlayersTable 
          players={players}
          stats={stats}
        />
        <MatchList 
          matches={matches}
          loading={matchesLoading}
          onNewMatch={() => setIsModalOpen(true)}
        />
      </Container>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Partido"
      >
        <MatchForm
          players={players}
          onSubmit={handleAddMatch}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App