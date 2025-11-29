'use client'

export default function CrosswordLeaderboard({ onBack }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">جدول امتیازات</h2>
          <p className="text-gray-600 mt-1">رتبه‌بندی بازیکنان کراسورد</p>
        </div>
        
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          بازگشت
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-yellow-600">🏆</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">جدول امتیازات خالی است</h3>
          <p className="text-gray-600">هنوز بازیکنی امتیازی کسب نکرده است</p>
        </div>
      </div>
    </div>
  )
}