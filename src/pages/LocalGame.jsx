import React, { useEffect, useState } from 'react'

function LocalGame() {

    const [p1, setP1] = useState([])
    const [p2, setP2] = useState([])
    const [winner, setWinner] = useState()
  
    const rows = 6
    const columns = 7
    const directions = [
      [1, 0],
      [0, 1],
      [1, 1],
      [-1, 1],
    ]
  
    const getDownPos = (colIndex) => {
      let pos = "5" + colIndex;
      p1.map(pos1 => {
        if (pos1[1] === pos[1] && pos1[0] <= pos[0]) {
          pos = (+pos1[0] - 1).toString() + pos[1];
        }
      })
      p2.map(pos2 => {
        if (pos2[1] === pos[1] && pos2[0] <= pos[0]) {
          pos = (+pos2[0] - 1).toString() + pos[1];
        }
      })
      return (pos)
    }
  
    const handleClick = (rowIndex, colIndex) => {
      const pos = getDownPos(colIndex);
      if ((p1.indexOf(pos) === -1) && (p2.indexOf(pos) === -1)) {
        if (p1.length === p2.length) {
          setP1((prevP1) => [...prevP1, pos]);
        } else {
          setP2((prevP2) => [...prevP2, pos]);
        }
      }
    }
  
    const color = (pos) => {
      if (p1.indexOf(pos) != -1) {
        return "border-opacity-50 border-blue-500"
      } else if (p2.indexOf(pos) != -1) {
        return "border-opacity-50 border-red-500"
      } else {
        return "border-opacity-20 border-white"
      }
    }
  
    const reset = () => {
      setP1([])
      setP2([])
      setWinner(null)
    }
  
    const checkWinner = (i, j, list) => {
      if (list.indexOf(i + "" + j) !== -1) {
        for (const [dx, dy] of directions) {
          let count = 1;
          for (let k = 1; k < 4; k++) {
            const newI = i + k * dx
            const newJ = j + k * dy
            if (newI < 0 || newI >= 6 || newJ < 0 || newJ >= 7 || list.indexOf(newI + "" + newJ) === -1) {
              break;
            }
            count++;
            if (count === 4) {
              if (p1.length === p2.length) {
                setWinner("Player 2")
              } else {
                setWinner("Player 1")
              }
            }
          }
        }
      }
    }
  
    useEffect(() => {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
          checkWinner(i, j, p1)
          checkWinner(i, j, p2)
        }
      }
    }, [p1, p2])

  return (
        <>
      <button className='' onClick={reset}>Reset</button>
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {[...Array(columns)].map((_, colIndex) => (
            <div
              key={rowIndex * columns + colIndex}
              className={color(rowIndex.toString() + colIndex.toString()) + ` w-12 h-12 m-1 rounded-full border-4 ${winner ? '' : 'cursor-pointer'}`}
              onClick={() => handleClick(rowIndex, colIndex)}
            >
            </div>
          ))}
        </div>
      ))}
      {
        winner &&
        <div className=''>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-center">{winner} is the Winner!</div>
        </div>
      }
    </>
  )
}

export default LocalGame