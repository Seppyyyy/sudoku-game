import React, { useState } from 'react';

function SeekBarSlider({ min = 0, max = 81, step = 1, value, onChange }) {
  const [sliderValue, setSliderValue] = useState(value);

  const handleChange = (event) => {
    const newValue = parseInt(event.target.value);
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="seekbar-slider">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleChange}
        className="w-full"
      />

    </div>
  );
}

export default SeekBarSlider;
