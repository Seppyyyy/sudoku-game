"use client"
import React, { useState } from "react";
import SeekBarSlider from "./seekBarSlider";
import Sudoku from "./makeBoard"
function SudokuGame() {
  const [prefilledCells, setPrefilledCells] = useState<number>(0);
    const [select, setSelect] = useState(true);
    const handleBackButtonClick = () => {
        setSelect(true); // Update the state to true when the back button is clicked
      };
      const handleStartButtonClick = () => {
        setSelect(false); // Update the state to true when the back button is clicked
      };


  const handleChangeSlider = (newValue: number) => {
    setPrefilledCells(Math.round(newValue)); // Update the number of cells to fill
  };

  return (
    select ? (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <h1 className="text-4xl font-bold mb-4 text-black">Sudoku Game</h1>
        <label className="flex flex-col text-gray-700">
          Start with {prefilledCells} cells prefilled
        </label>
        <div className="mt-2 w-full md:w-2/3 lg:w-1/2 xl:w-1/3"> {/* Adjust height here */}
          <SeekBarSlider
            min={0}
            max={81}
            step={1}
            value={prefilledCells}
            onChange={handleChangeSlider}
          />
        </div>
  
        <button
          type="button"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleStartButtonClick}
        >
          Start Game
        </button>
      </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-white px-50 py-50">
<button className="text-White rounded-md bg-blue-500 px-4 py-2 mb-2 float-left" type="button" onClick={handleBackButtonClick}>
  New Game
</button>
        <Sudoku prefilledCount={prefilledCells}/>
    </div>
    ) // Return null or an empty fragment when showBoard is false
  );
  
}

export default SudokuGame;
