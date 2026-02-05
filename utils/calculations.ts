
import { PlayerStats } from '../types';

export const calculatePoints = (stats: PlayerStats): number => {
  const threePointPoints = stats.threePm * 3;
  const twoPointPoints = (stats.fgm - stats.threePm) * 2;
  const freeThrowPoints = stats.ftm;
  return threePointPoints + twoPointPoints + freeThrowPoints;
};

export const calculateTotalRebounds = (stats: PlayerStats): number => {
  return stats.offReb + stats.defReb;
};

export const calculatePercentage = (made: number, attempts: number): string => {
  if (attempts === 0) return '0.0%';
  return `${((made / attempts) * 100).toFixed(1)}%`;
};
