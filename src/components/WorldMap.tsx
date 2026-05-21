import {
  formatUtcOffsetLabel,
  getActiveTimeZoneIndex,
  UTC_OFFSETS,
} from '../lib/getActiveTimeZoneIndex';
import styles from '../styles/worldMap.module.css';

type WorldMapProps = {
  offsetHours?: number;
};

export function WorldMap({ offsetHours = 0 }: WorldMapProps) {
  const activeZone = getActiveTimeZoneIndex(offsetHours);

  return (
    <section className={styles.worldMap} aria-label='World time zones'>
      <div className={styles.grid}>
        {UTC_OFFSETS.map((utcOffset, zoneIndex) => {
          const isActive = zoneIndex === activeZone;

          return (
            <div
              key={utcOffset}
              className={styles.column}
              data-zone-offset={utcOffset}
            >
              <div className={styles.zoneHeader}>
                {formatUtcOffsetLabel(utcOffset)}
              </div>
              <div
                className={`${styles.zone} ${isActive ? styles.zoneActive : ''}`}
                data-zone-index={zoneIndex}
                aria-current={isActive ? 'true' : undefined}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
