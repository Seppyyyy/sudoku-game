import React, { useState, useEffect } from "react";

function generateSudokuBoard(prefilledCount) {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  let count = 0;

  while (count < prefilledCount) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    let num = Math.floor(Math.random() * 9) + 1;

    if (board[row][col] === 0 && isValid(board, row, col, num)) {
      board[row][col] = num;
      count++;
    } else {
      num = (num % 9) + 1;
    }
  }

  if (count < prefilledCount) {
    console.error(
      "Failed to generate a valid Sudoku board with the given prefilled count."
    );

    return generateSudokuBoard(prefilledCount);
  }

  return board;
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

const Sudoku = ({ prefilledCount }) => {
  const [board, setBoard] = useState(generateSudokuBoard(prefilledCount));
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [numberCounts, setNumberCounts] = useState(Array(9).fill(0));

  useEffect(() => {
    // Code to generate Sudoku board when component mounts
    setBoard(generateSudokuBoard(prefilledCount));
    setHistory([]);
    setRedoHistory([]);
    setSelectedCell(null);
    setNumberCounts(Array(9).fill(0));
  }, [prefilledCount]);

  const handleChange = (rowIndex, colIndex, value) => {
    const updatedBoard = board.map((row, r) =>
      row.map((cell, c) => (r === rowIndex && c === colIndex ? value : cell))
    );
    setBoard(updatedBoard);
    setHistory([...history, { board, selectedCell }]);
    setRedoHistory([]);
    setSelectedCell(null);
    if (value !== 0) {
      setNumberCounts((prevCounts) => {
        const newCounts = [...prevCounts];
        newCounts[value - 1]++;
        return newCounts;
      });
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setBoard(prevState.board);
      setRedoHistory([...redoHistory, { board, selectedCell }]);
      setHistory(history.slice(0, -1));
      setSelectedCell(prevState.selectedCell);
      updateNumberCounts(prevState.board);
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[redoHistory.length - 1];
      setBoard(nextState.board);
      setHistory([...history, { board, selectedCell }]);
      setRedoHistory(redoHistory.slice(0, -1));
      setSelectedCell(nextState.selectedCell);
      updateNumberCounts(nextState.board);
    }
  };

  const handleErase = () => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const value = board[row][col];
      handleChange(row, col, 0);
      if (value !== 0) {
        setNumberCounts((prevCounts) => {
          const newCounts = [...prevCounts];
          newCounts[value - 1]--;
          return newCounts;
        });
      }
    }
  };

  const handleHint = () => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const correctNum = board[row][col];
      handleChange(row, col, correctNum);
    }
  };

  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  const updateNumberCounts = (updatedBoard) => {
    const counts = Array(9).fill(0);
    updatedBoard.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== 0) {
          counts[cell - 1]++;
        }
      });
    });
    setNumberCounts(counts);
  };

  return (
    <div className="sudoku-container">
      <div className="sudoku-toolbar">
        <button
          className="text-white rounded-md bg-blue-500 px-4 py-2 mb-2 mr-2"
          onClick={handleUndo}
        >
          Undo
        </button>
        <button
          className="text-white rounded-md bg-blue-500 px-4 py-2 mb-2 mr-2"
          onClick={handleRedo}
        >
          Redo
        </button>
        <button
          className="text-white rounded-md bg-blue-500 px-4 py-2 mb-2 mr-2"
          onClick={handleErase}
        >
          Erase
        </button>
        <button
          className="text-white rounded-md bg-blue-500 px-4 py-2 mb-2 mr-2"
          onClick={handleHint}
        >
          Hint
        </button>
      </div>

      <table className="sudoku-table">
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={`text-center w-12 h-12 border border-black ${
                    cell !== 0 ? "bg-blue-500" : "bg-gray-100"
                  } ${
                    (colIndex + 1) % 3 === 0 && colIndex !== 8
                      ? "border-r-2"
                      : ""
                  } ${
                    (rowIndex + 1) % 3 === 0 && rowIndex !== 8
                      ? "border-b-2"
                      : ""
                  } ${
                    selectedCell?.row === rowIndex &&
                    selectedCell?.col === colIndex
                      ? "bg-yellow-300"
                      : ""
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  <input
                    type="number"
                    value={cell !== 0 ? cell : ""}
                    onChange={(e) =>
                      handleChange(
                        rowIndex,
                        colIndex,
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    min="1"
                    max="9"
                    className="w-full h-full bg-transparent text-center appearance-none"
                    style={{ outline: "none", border: "none" }}
                    disabled={prefilledCount > 0 && cell !== 0}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sudoku;
