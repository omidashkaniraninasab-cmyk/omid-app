// app/games/page.js
import Link from 'next/link'

export default function GamesPage() {
  const games = [
    {
      id: 'crossword',
      name: '🧩 بازی کراسورد',
      description: 'چالش روزانه کلمات و معماها',
      color: 'blue',
      status: 'فعال'
    },
    {
      id: 'game2',
      name: '🎮 بازی دوم', 
      description: 'به زودی...',
      color: 'purple',
      status: 'به زودی'
    },
    {
      id: 'game3',
      name: '🎯 بازی سوم',
      description: 'به زودی...',
      color: 'green', 
      status: 'به زودی'
    }
  ]

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🎮 بازی‌ها</h1>
        <p className="text-lg text-gray-600">انتخاب بازی مورد علاقه</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}

function GameCard({ game }) {
  const isActive = game.status === 'فعال'
  
  return (
    <Link 
      href={isActive ? `/games/${game.id}` : '#'}
      className={`block p-6 rounded-2xl border-2 transition-all duration-300 ${
        isActive 
          ? 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer' 
          : 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="text-center">
        <div className={`w-16 h-16 bg-gradient-to-br from-${game.color}-500 to-${game.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <span className="text-2xl text-white">🎮</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{game.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{game.description}</p>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          game.status === 'فعال' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {game.status}
        </div>
      </div>
    </Link>
  )
}