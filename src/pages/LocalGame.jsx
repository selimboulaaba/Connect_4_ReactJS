import React, { useEffect, useState } from 'react'
import Winner from '../components/Winner'
import useSound from 'use-sound'
import SUI from '../assets/siu.mp3'

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

  const handleClick = (colIndex) => {
    const pos = getDownPos(colIndex);
    if ((p1.indexOf(pos) === -1) && (p2.indexOf(pos) === -1)) {
      if (+pos[0] >= 0) {
        if (p1.length === p2.length) {
          setP1((prevP1) => [...prevP1, pos]);
        } else {
          setP2((prevP2) => [...prevP2, pos]);
        }
      }
    }
  }

  const color = (pos) => {
    if (p1.indexOf(pos) != -1) {
      return "border-opacity-50 border-blue-700 bg-blue-500"
    } else if (p2.indexOf(pos) != -1) {
      return "border-opacity-50 border-red-700 bg-red-500"
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
              setWinner("Player 2\nis the Winner!")
            } else {
              setWinner("Player 1\nis the Winner!")
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    if (p1.length + p2.length === 42) {
      setWinner("It's a Draw!")
    } else {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
          checkWinner(i, j, p1)
          checkWinner(i, j, p2)
        }
      }
    }
  }, [p1, p2])

  const [play] = useSound(SUI);
  useEffect(() => {
    if (winner) {
      play()
    }
  }, [winner])

  return (
    <div className='border-[#646cff] border-[1px] rounded-xl pb-16 lg:px-20 mt-14'>
      <button className='mb-16 mt-10' onClick={reset}>Reset</button>
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className='flex justify-center items-center px-3'>
          {[...Array(columns)].map((_, colIndex) => (
            <div
              key={rowIndex * columns + colIndex}
              className={color(rowIndex.toString() + colIndex.toString()) + ` w-[20vw] sm:w-[10vw] md:w-16 lg:w-20 aspect-square m-[2px] sm:m-[3px] md:m-[5px] rounded-full border-4 ${winner ? '' : 'cursor-pointer'}`}
              onClick={() => winner ? null : handleClick(colIndex)}
            >
            </div>
          ))}
        </div>
      ))}
      {winner && <Winner winner={winner} />}
    </div>
  )
}

export default LocalGame