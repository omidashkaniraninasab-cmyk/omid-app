// components/games/crossword/CrosswordGame.jsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export default function CrosswordGame({ dailyPuzzle, onBack }) {
  const [grid, setGrid] = useState([])
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null })
  const [todayScore, setTodayScore] = useState(0)
  const [lockedCells, setLockedCells] = useState({})
  const [cellStatus, setCellStatus] = useState({})
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const inputRef = useRef(null)
  const [totalEmptyCells, setTotalEmptyCells] = useState(0)
const [filledCellsCount, setFilledCellsCount] = useState(0)
const [showGameGrid, setShowGameGrid] = useState(true)
const [completed, setCompleted] = useState(false)


// Effect برای چک کردن زمان
useEffect(() => {
  const checkTimeAndReset = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    
    // اگر ساعت 12 شب شده
    if (hours === 0 && minutes === 0) {
      console.log('🕛 ساعت 12 شب - بازی جدید')
      setShowCompletionModal(false)
      setShowGameGrid(true)
      window.location.reload() // یا بازی جدید رو لود کن
    }
  }

  // هر دقیقه چک کن
  const interval = setInterval(checkTimeAndReset, 60000)
  
  return () => clearInterval(interval)
}, [])

  // ایجاد گرید خالی
  const createEmptyGrid = useCallback((rows = 5, cols = 5) => {
    return Array(rows).fill().map(() => 
      Array(cols).fill().map(() => ({
        value: '',
        isBlack: false,
        number: null,
        isSelected: false,
        isHighlighted: false
      }))
    )
  }, [])

  // تولید پازل تستی
  const generateTestPuzzle = useCallback(() => {
    const grid = createEmptyGrid(5, 5)
    
    // خانه‌های سیاه
    grid[0][0].isBlack = true
    grid[2][2].isBlack = true
    grid[4][4].isBlack = true
    
    // شماره‌گذاری
    grid[0][1].number = 1
    grid[0][3].number = 2
    grid[1][0].number = 3
    grid[3][0].number = 4
    grid[1][4].number = 5
    grid[3][4].number = 6
    
    // پاسخ‌های صحیح
    const correctGrid = [
      ['', 'س', 'ی', 'آ', 'ب'],
      ['ق', 'ط', 'ا', 'ر', 'ش'],
      ['ب', 'ی', '', 'ب', 'ی'],
      ['س', 'گ', 'ب', 'د', 'و'],
      ['ب', 'ا', 'س', 'گ', '']
    ]

    return {
      grid: grid,
      correctGrid: correctGrid,
      title: "پازل تستی"
    }
  }, [createEmptyGrid])

  // لود امتیازات کاربر
  const loadUserScores = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { today: 0, total: 0 }

      const { data, error } = await supabase
        .from('crossword_scores')
        .select('today_score, total_score')
        .eq('user_id', user.id)
        .single()

      if (error) {
        // ایجاد رکورد جدید اگر وجود ندارد
        const { data: newData } = await supabase
          .from('crossword_scores')
          .insert({
            user_id: user.id,
            today_score: 0,
            total_score: 0,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        return newData ? { today: newData.today_score, total: newData.total_score } : { today: 0, total: 0 }
      }

      return { today: data.today_score, total: data.total_score }
    } catch (error) {
      return { today: 0, total: 0 }
    }
  }, [])

  // مقداردهی اولیه بازی
 // مقداردهی اولیه بازی - نسخه اصلاح شده
useEffect(() => {
  const initializeGame = async () => {
    try {
      setLoading(true)
      console.log('🎮 شروع مقداردهی اولیه بازی...')
      console.log('📦 dailyPuzzle از سرور:', dailyPuzzle)

      // لود امتیازات کاربر
      const scores = await loadUserScores()
      setTodayScore(scores.today)

      // اولویت با پازل سرور هست
      if (dailyPuzzle && dailyPuzzle.puzzle_data) {
        console.log('🚀 استفاده از پازل سرور')
        
        // تبدیل دیتای سرور به فرمت بازی
        const puzzleDataContent = typeof dailyPuzzle.puzzle_data === 'string' 
          ? JSON.parse(dailyPuzzle.puzzle_data)
          : dailyPuzzle.puzzle_data

        console.log('📋 محتوای پازل سرور:', puzzleDataContent)

        if (puzzleDataContent.grid) {
          const serverGrid = puzzleDataContent.grid
          const gridSize = serverGrid.length
          
          const newGrid = createEmptyGrid(gridSize, gridSize)
          const correctGrid = []
          
          // پر کردن گرید از دیتای سرور
          serverGrid.forEach((row, rowIndex) => {
            correctGrid[rowIndex] = []
            row.forEach((cell, colIndex) => {
              if (cell.isBlack || cell.correct === '' || cell.correct === null) {
                newGrid[rowIndex][colIndex].isBlack = true
                correctGrid[rowIndex][colIndex] = ''
              } else {
                newGrid[rowIndex][colIndex].number = cell.number
                newGrid[rowIndex][colIndex].isBlack = false
                correctGrid[rowIndex][colIndex] = cell.correct || ''
              }
            })
          })
          
          setGrid(newGrid)
          setCorrectAnswers(correctGrid)
          console.log('✅ پازل سرور با موفقیت لود شد')
          const emptyCellsCount = newGrid.flat().filter(cell => !cell.isBlack).length
setTotalEmptyCells(emptyCellsCount)
setFilledCellsCount(0)

console.log('📊 تعداد خانه‌های خالی:', emptyCellsCount)
          
        } else {
          throw new Error('گرید در دیتای سرور وجود ندارد')
        }
        
      } else {
        // فقط اگر پازل سرور وجود نداره، از تستی استفاده کن
        console.log('🔄 پازل سرور موجود نیست - استفاده از پازل تستی')
        const testPuzzle = generateTestPuzzle()
        setGrid(testPuzzle.grid)
        setCorrectAnswers(testPuzzle.correctGrid)
      }

      // پیدا کردن اولین خانه غیرسیاه
      let found = false
      const currentGrid = grid.length ? grid : (dailyPuzzle ? [] : generateTestPuzzle().grid)
      
      for (let row = 0; row < currentGrid.length; row++) {
        for (let col = 0; col < currentGrid[row].length; col++) {
          if (!currentGrid[row][col].isBlack) {
            setSelectedCell({ row, col })
            console.log('📍 اولین خانه انتخاب شد:', { row, col })
            found = true
            break
          }
        }
        if (found) break
      }

    } catch (error) {
      console.error('❌ خطا در لود پازل سرور:', error)
      // فقط در صورت خطا از پازل تستی استفاده کن
      console.log('🔄 استفاده از پازل تستی به دلیل خطا')
      const testPuzzle = generateTestPuzzle()
      setGrid(testPuzzle.grid)
      setCorrectAnswers(testPuzzle.correctGrid)
    } finally {
      setLoading(false)
    }
  }

  initializeGame()
}, [dailyPuzzle, loadUserScores, createEmptyGrid])

  // بررسی پاسخ
  const checkAnswer = useCallback((row, col, userInput) => {
    if (!correctAnswers || !correctAnswers[row] || correctAnswers[row][col] === undefined) {
      return false
    }
    
    return userInput.toUpperCase() === correctAnswers[row][col].toUpperCase()
  }, [correctAnswers])

  // ذخیره امتیاز در دیتابیس
  const saveScoreToDatabase = useCallback(async (scoreChange, result, gameCompleted = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // محاسبه امتیاز جدید
      const newTodayScore = todayScore + scoreChange

      // ذخیره در جدول اصلی امتیازات
      const { error: scoreError } = await supabase
        .from('crossword_scores')
        .upsert({
          user_id: user.id,
          today_score: newTodayScore,
          total_score: newTodayScore,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (!scoreError) {
        setTodayScore(newTodayScore)
      }

      // اگر بازی کامل شد، در تاریخچه ذخیره کن
      if (gameCompleted) {
        const today = new Date().toISOString().split('T')[0]
        const correctCount = Object.values(cellStatus).filter(status => status === 'correct').length
        const totalCells = grid.flat().filter(cell => !cell.isBlack).length
        const accuracy = totalCells > 0 ? Math.round((correctCount / totalCells) * 100) : 0

        // ذخیره در تاریخچه
        await supabase
          .from('crossword_history')
          .insert({
            user_id: user.id,
            puzzle_id: '00000000-0000-0000-0000-000000000000',
            puzzle_date: today,
            score: newTodayScore,
            solve_time: 0,
            accuracy: accuracy,
            completed: true,
            difficulty: 'medium',
            words_found: correctCount,
            total_words: totalCells,
            hints_used: 0,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          })

        // اطلاع به کامپوننت تاریخچه
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('historyUpdated'))
        }, 1000)
      }

    } catch (error) {
      console.error('خطا در ذخیره‌سازی:', error)
    }
  }, [todayScore, cellStatus, grid])

  // بررسی پایان بازی
  const isGameCompleted = () => {
    const totalPlayableCells = grid.flat().filter(cell => !cell.isBlack).length
    const lockedCellsCount = Object.keys(lockedCells).length
    
    console.log('🏁 بررسی پایان:', lockedCellsCount + '/' + totalPlayableCells)
    return lockedCellsCount === totalPlayableCells
  }

  // پایان بازی
const completeGame = () => {
  console.log('🎉 بازی کامل شد!')
  
  const bonus = 50
  const finalTodayScore = todayScore + bonus
  
  setFinalScore(finalTodayScore)
  setCompleted(true) // ✅ اینجا بازی رو کامل标记 میکنیم
  setShowCompletionModal(true)
  
  // ذخیره در دیتابیس
  saveScoreToDatabase(bonus, 'completed', true)
}

  // مدیریت ورود کاربر
  const handleInputChange = useCallback((value) => {
    if (selectedCell.row === null || selectedCell.col === null) return
    
    const { row, col } = selectedCell
    const cellKey = `${row}-${col}`
    
    if (lockedCells[cellKey]) return
    
    // فقط حروف فارسی و انگلیسی
    if (!/^[آ-یa-zA-Z]?$/.test(value)) return
    
    // آپدیت گرید
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => [...r])
      newGrid[row][col].value = value.toUpperCase()
      return newGrid
    })
    
    // اگر کاربر حرفی وارد کرد
    if (value && value.length === 1) {
      const isCorrect = checkAnswer(row, col, value)
      
      if (isCorrect) {
        // پاسخ درست
        console.log('✅ پاسخ درست')
        setTodayScore(prev => prev + 3)
        setLockedCells(prev => ({ ...prev, [cellKey]: true }))
        setCellStatus(prev => ({ ...prev, [cellKey]: "correct" }))
        
         // 🔼 اینجا مهم: یکی به خانه‌های پر شده اضافه کن
  setFilledCellsCount(prev => {
    const newCount = prev + 1
    console.log('🏠 خانه‌های پر شده:', newCount + '/' + totalEmptyCells)
    return newCount
  })

        saveScoreToDatabase(3, 'correct')
        
        
  // بررسی پایان بازی - منطق جدید
  setTimeout(() => {
    if (filledCellsCount + 1 === totalEmptyCells) {
      completeGame()
    }
  }, 300)
        
      } else {
        // پاسخ اشتباه
        setTodayScore(prev => Math.max(0, prev - 1))
        setCellStatus(prev => ({ ...prev, [cellKey]: "wrong" }))
        
        saveScoreToDatabase(-1, 'wrong')
        
        // بازنشانی بعد از 2 ثانیه
        setTimeout(() => {
          setGrid(prevGrid => {
            const resetGrid = prevGrid.map(r => [...r])
            resetGrid[row][col].value = ''
            return resetGrid
          })
          setCellStatus(prev => {
            const { [cellKey]: removed, ...rest } = prev
            return rest
          })
        }, 2000)
      }
    }
  }, [selectedCell, lockedCells, checkAnswer, saveScoreToDatabase])

  // کلیک روی خانه
  const handleCellClick = (row, col) => {
    if (grid[row][col].isBlack) return
    
    const cellKey = `${row}-${col}`
    if (lockedCells[cellKey]) return
    
    setSelectedCell({ row, col })
  }

  // کلاس‌های خانه
  const getCellClasses = (cell, rowIndex, colIndex) => {
    const cellKey = `${rowIndex}-${colIndex}`
    
    let classes = "w-12 h-12 flex items-center justify-center relative text-sm font-bold transition-all duration-200"
    
    if (cell.isBlack) {
      classes += " bg-gray-800"
    } else {
      // وضعیت رنگ
      if (cellStatus[cellKey] === "correct") {
        classes += " bg-green-500 text-white border-2 border-green-600"
      } else if (cellStatus[cellKey] === "wrong") {
        classes += " bg-red-500 text-white border-2 border-red-600"
      } else if (lockedCells[cellKey]) {
        classes += " bg-green-200 border-2 border-green-500"
      } else {
        classes += " bg-white border border-gray-300"
      }
      
      // highlight انتخاب
      if (selectedCell.row === rowIndex && selectedCell.col === colIndex) {
        classes += " ring-2 ring-blue-500 ring-opacity-50"
      }
      
      // cursor فقط برای خانه‌های باز
      if (!lockedCells[cellKey]) {
        classes += " cursor-pointer hover:bg-gray-100"
      }
    }
    
    return classes
  }

  useEffect(() => {
    if (selectedCell.row !== null && selectedCell.col !== null && inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedCell])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری بازی...</p>
        </div>
      </div>
    )
  }

return (
  <div className="space-y-6" onKeyDown={(e) => e.key === 'Backspace' && handleInputChange('')} tabIndex={0}>
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">بازی کراسورد</h2>
        <p className="text-gray-600 mt-1">گرید {grid.length}×{grid[0]?.length || 5}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold">
          🎯 امتیاز: {todayScore}
        </div>
        
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">
          🏠 خانه‌ها: {filledCellsCount}/{totalEmptyCells}
        </div>

        <button onClick={onBack} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          بازگشت
        </button>
      </div>
    </div>

    {/* اگر بازی کامل نشده، پازل رو نمایش بده */}
    {!completed && (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        
        {/* input خانه */}
        {selectedCell.row !== null && selectedCell.col !== null && (
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
              <span className="text-gray-600">مقدار خانه:</span>
              <input
                ref={inputRef}
                type="text"
                value={grid[selectedCell.row]?.[selectedCell.col]?.value || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                maxLength={1}
                dir="ltr"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* گرید */}
        <div className="flex justify-center">
          <div className="bg-gray-800 p-2 rounded-lg">
            <div className={`grid gap-1`} style={{ 
              gridTemplateColumns: `repeat(${grid[0]?.length || 5}, minmax(0, 1fr))` 
            }}>
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClasses(cell, rowIndex, colIndex)}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell.number && (
                      <div className="absolute top-1 left-1 text-xs text-gray-600">
                        {cell.number}
                      </div>
                    )}
                    
                    {!cell.isBlack && cell.value && (
                      <span className="text-gray-900 font-bold">
                        {cell.value}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">راهنما:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• ✅ پاسخ درست: +۳ امتیاز</li>
            <li>• ❌ پاسخ اشتباه: -۱ امتیاز</li>
            <li>• 🏆 تکمیل جدول: +۵۰ امتیاز پاداش</li>
            <li>• 🔒 خانه‌های سبز قفل می‌شوند</li>
          </ul>
        </div>
      </div>
    )}

    {/* اگر بازی کامل شده، منوی پایان رو نمایش بده */}
    {completed && (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            بازی امروز تموم شد!
          </h3>
          <p className="text-gray-600 mb-6">
            شما بازی امروز را با موفقیت کامل کردید!
          </p>
          
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg mb-6 max-w-md mx-auto">
            <div className="text-4xl font-bold mb-2">{finalScore}</div>
            <div className="text-lg">امتیاز نهایی شما</div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm mb-8 max-w-md mx-auto">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{filledCellsCount}</div>
              <div className="text-green-800">خانه پر شده</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalEmptyCells}</div>
              <div className="text-blue-800">کل خانه‌ها</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{todayScore}</div>
              <div className="text-purple-800">امتیاز کسب شده</div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <span>⏰</span>
              <span>بازی جدید فردا ساعت ۱۲ شب منتشر می‌شود</span>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)
}