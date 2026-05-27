import React from 'react'
import { FaFutbol, FaTrophy } from 'react-icons/fa'

const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
        <FaFutbol className="w-8 h-8" />
        <h1 className="text-3xl font-bold tracking-tight">FIFA Stats Tracker</h1>
        <FaTrophy className="w-8 h-8" />
      </div>
      <p className="text-gray-600">Registra todos tus partidos y domina la estadística</p>
    </div>
  )
}

export default Header