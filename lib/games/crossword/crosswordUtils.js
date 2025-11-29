// تابع برای ایجاد گرید خالی
export function createEmptyGrid(rows = 5, cols = 5) {
  return Array(rows).fill().map(() => 
    Array(cols).fill().map(() => ({
      value: '',
      isBlack: false,
      number: null,
      across: null,
      down: null,
      isSelected: false,
      isHighlighted: false
    }))
  )
}

// تابع برای پیدا کردن موقعیت‌های قابل شماره‌گذاری
export function findNumberPositions(grid) {
  const positions = []
  let number = 1
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      // اگر خانه سیاه نیست
      if (!grid[row][col].isBlack) {
        const isStartOfAcross = (
          col === 0 || 
          (col > 0 && grid[row][col - 1].isBlack)
        ) && 
        col < grid[row].length - 1 && 
        !grid[row][col + 1].isBlack

        const isStartOfDown = (
          row === 0 || 
          (row > 0 && grid[row - 1][col].isBlack)
        ) && 
        row < grid.length - 1 && 
        !grid[row + 1][col].isBlack

        if (isStartOfAcross || isStartOfDown) {
          positions.push({ row, col, number })
          number++
        }
      }
    }
  }
  
  return positions
}

// تابع برای اعمال شماره‌ها به گرید
export function applyNumbersToGrid(grid, numberPositions) {
  const newGrid = JSON.parse(JSON.stringify(grid))
  
  numberPositions.forEach(pos => {
    newGrid[pos.row][pos.col].number = pos.number
  })
  
  return newGrid
}

// تابع برای تولید یک پازل تست ساده
export function generateTestPuzzle() {
  const grid = createEmptyGrid(5, 5)
  
  // تنظیم برخی خانه‌ها به عنوان سیاه (مسدود)
  grid[0][0].isBlack = true
  grid[2][2].isBlack = true
  grid[4][4].isBlack = true
  
  const numberPositions = findNumberPositions(grid)
  const numberedGrid = applyNumbersToGrid(grid, numberPositions)
  
  return {
    grid: numberedGrid,
    clues: {
      across: [
        { number: 1, clue: "نوعی میوه (۳ حرف)", answer: "سیب", length: 3 },
        { number: 3, clue: "رنگ آسمان (۴ حرف)", answer: "آبی", length: 3 },
        { number: 5, clue: "مخالف روز (۴ حرف)", answer: "شب", length: 2 }
      ],
      down: [
        { number: 1, clue: "وسیله نقلیه (۳ حرف)", answer: "قط", length: 3 },
        { number: 2, clue: "عدد بین ۱ و ۳ (۳ حرف)", answer: "دو", length: 2 },
        { number: 4, clue: "حیوان خانگی (۳ حرف)", answer: "سگ", length: 3 }
      ]
    }
  }
}