import {
  formatUtcOffsetLabel,
  getActiveTimeZoneIndex,
  UTC_OFFSETS,
} from '../lib/getActiveTimeZoneIndex';
import styles from '../styles/worldMap.module.css';
import worldMapImage from '../assets/world_map.webp';

type WorldMapProps = {
  offsetHours?: number;
};

/** World map grid with UTC columns; highlights the zone for the current offset. */
export function WorldMap({ offsetHours = 0 }: WorldMapProps) {
  const activeZone = getActiveTimeZoneIndex(offsetHours);

  return (
    <section className={styles.worldMap} aria-label='World time zones'>
      <div className={styles.grid}>
        {UTC_OFFSETS.map((utcOffset, zoneIndex) => (
          <div
            key={`header-${utcOffset}`}
            className={styles.zoneHeader}
            style={{ gridColumn: zoneIndex + 1 }}
          >
            {formatUtcOffsetLabel(utcOffset)}
          </div>
        ))}
        <img
          src={worldMapImage}
          alt='world map'
          aria-hidden
          className={styles.worldMapImage}
          fetchPriority='high'
        />
        {UTC_OFFSETS.map((utcOffset, zoneIndex) => {
          const isActive = zoneIndex === activeZone;

          return (
            <div
              key={`zone-${utcOffset}`}
              className={styles.column}
              data-zone-offset={utcOffset}
              style={{ gridColumn: zoneIndex + 1 }}
            >
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
