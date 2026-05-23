import { useState } from 'react';
import { ClockMain } from './components/ClockMain';
import { SmallClock } from './components/SmallClock';
import { WorldMap } from './components/WorldMap';
import styles from './styles/App.module.css';

function App() {
  const [offsetHours, setOffsetHours] = useState(0);

  return (
    <>
      <header className={styles.title}>World Time Zones Clock</header>
      <main className={styles.wrapper}>
        <section className={styles.clockWrapper}>
          <SmallClock offsetHours={offsetHours} variant='minus' />
          <ClockMain
            offsetHours={offsetHours}
            onOffsetHoursChange={setOffsetHours}
          />
          <SmallClock offsetHours={offsetHours} variant='plus' />
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
