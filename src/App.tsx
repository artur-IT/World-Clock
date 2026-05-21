import './App.css';
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
  return (
    <>
      <div style={style}>
        <ClockMinus />
        <ClockMain />
        <ClockPlus />
      </div>

      <WorldMap />
    </>
  );
}

export default App;
