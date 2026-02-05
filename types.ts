
export interface PlayerStats {
  fgm: number;
  fga: number;
  threePm: number;
  threePa: number;
  ftm: number;
  fta: number;
  offReb: number;
  defReb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  foul: number;
}

export interface Player {
  id: string;
  name: string;
  number: string;
  stats: PlayerStats;
}

export interface Team {
  name: string;
  players: Player[];
}

export type StatKey = keyof PlayerStats;
