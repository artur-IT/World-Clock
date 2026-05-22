import { useState } from 'react';
import { ClockMinus } from './components/ClockMinus';
import { ClockMain } from './components/ClockMain';
import { ClockPlus } from './components/ClockPlus';
import { WorldMap } from './components/WorldMap';
import styles from './styles/App.module.css';

function App() {
  const [offsetHours, setOffsetHours] = useState(0);

  return (
    <>
      <header className={styles.title}>World Time Zones Clock</header>
      <main className={styles.wrapper}>
        <section className={styles.clockWrapper}>
          <ClockMinus offsetHours={offsetHours} />
          <ClockMain
            offsetHours={offsetHours}
            onOffsetHoursChange={setOffsetHours}
          />
          <ClockPlus offsetHours={offsetHours} />
        </section>
        <WorldMap offsetHours={offsetHours} />
      </main>
      <footer className={styles.footer}>
        Artur Matysiak - <strong>Frontend Developer</strong>
      </footer>
    </>
  );
}

export default App;
