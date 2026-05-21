import './App.css';
import { useState } from 'react';
import { ClockMinus } from './components/ClockMinus';
import { ClockMain } from './components/ClockMain';
import { ClockPlus } from './components/ClockPlus';
import { WorldMap } from './components/WorldMap';

const style = {
  wrapper: {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: '10px' as const,
    marginTop: '90px' as const,
  },
  title: {
    fontSize: '28px' as const,
    fontWeight: 'bold' as const,
    position: 'absolute' as const,
    top: '10px' as const,
    left: '50%' as const,
    transform: 'translateX(-50%)' as const,
  },
};

function App() {
  const [offsetHours, setOffsetHours] = useState(0);

  return (
    <>
      <p style={style.title}>World Time Zones</p>
      <div style={style.wrapper}>
        <ClockMinus offsetHours={offsetHours} />
        <ClockMain
          offsetHours={offsetHours}
          onOffsetHoursChange={setOffsetHours}
        />
        <ClockPlus offsetHours={offsetHours} />
      </div>
      <WorldMap offsetHours={offsetHours} />
    </>
  );
}

export default App;
