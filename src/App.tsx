import './App.css';
import { useState } from 'react';
import { ClockMinus } from './components/ClockMinus';
import { ClockMain } from './components/ClockMain';
import { ClockPlus } from './components/ClockPlus';
import { WorldMap } from './components/WorldMap';

const style = {
  display: 'flex' as const,
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  gap: '10px' as const,
};

function App() {
  const [offsetHours, setOffsetHours] = useState(0);

  return (
    <>
      <div style={style}>
        <ClockMinus offsetHours={offsetHours} />
        <ClockMain
          offsetHours={offsetHours}
          onOffsetHoursChange={setOffsetHours}
        />
        <ClockPlus offsetHours={offsetHours} />
      </div>

      <WorldMap />
    </>
  );
}

export default App;
