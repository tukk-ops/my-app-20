
import React from 'react';
import { Player, StatKey } from '../types';
import StatControl from './StatControl';
import { calculatePoints, calculateTotalRebounds, calculatePercentage } from '../utils/calculations';

interface PlayerCardProps {
  player: Player;
  onUpdateStat: (playerId: string, key: StatKey, delta: number) => void;
  onRemove: (playerId: string) => void;
  accentColor: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onUpdateStat, onRemove, accentColor }) => {
  const points = calculatePoints(player.stats);
  const rebounds = calculateTotalRebounds(player.stats);
  const fgPct = calculatePercentage(player.stats.fgm, player.stats.fga);
  const tpPct = calculatePercentage(player.stats.threePm, player.stats.threePa);

  const handleStatChange = (key: StatKey, delta: number) => {
    // Logic to ensure consistency (e.g., FGM cannot exceed FGA)
    onUpdateStat(player.id, key, delta);
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl mb-4 group">
      {/* Player Header */}
      <div className={`p-3 flex justify-between items-center ${accentColor}`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3 py-1 rounded font-condensed text-xl">#{player.number}</div>
          <div className="font-bold text-lg">{player.name}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase opacity-70">Points</div>
            <div className="text-2xl font-bold font-condensed leading-none">{points}</div>
          </div>
          <button
            onClick={() => onRemove(player.id)}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 space-y-6">

        {/* Section: Shooting */}
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 border-b border-slate-800 pb-1">投籃數據 (Shooting)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <StatControl label="FG Made" value={player.stats.fgm} onIncrement={() => handleStatChange('fgm', 1)} onDecrement={() => handleStatChange('fgm', -1)} colorClass="bg-blue-600" />
            <StatControl label="FG Att" value={player.stats.fga} onIncrement={() => handleStatChange('fga', 1)} onDecrement={() => handleStatChange('fga', -1)} colorClass="bg-blue-500" />
            <StatControl label="3P Made" value={player.stats.threePm} onIncrement={() => handleStatChange('threePm', 1)} onDecrement={() => handleStatChange('threePm', -1)} colorClass="bg-indigo-600" />
            <StatControl label="3P Att" value={player.stats.threePa} onIncrement={() => handleStatChange('threePa', 1)} onDecrement={() => handleStatChange('threePa', -1)} colorClass="bg-indigo-500" />
            <StatControl label="FT Made" value={player.stats.ftm} onIncrement={() => handleStatChange('ftm', 1)} onDecrement={() => handleStatChange('ftm', -1)} colorClass="bg-cyan-600" />
            <StatControl label="FT Att" value={player.stats.fta} onIncrement={() => handleStatChange('fta', 1)} onDecrement={() => handleStatChange('fta', -1)} colorClass="bg-cyan-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section: Rebounds & Defense */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 border-b border-slate-800 pb-1">籃板 & 防守 (Def/Reb)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatControl label="Off Reb" value={player.stats.offReb} onIncrement={() => handleStatChange('offReb', 1)} onDecrement={() => handleStatChange('offReb', -1)} colorClass="bg-emerald-600" />
              <StatControl label="Def Reb" value={player.stats.defReb} onIncrement={() => handleStatChange('defReb', 1)} onDecrement={() => handleStatChange('defReb', -1)} colorClass="bg-emerald-500" />
              <StatControl label="Blk" value={player.stats.blk} onIncrement={() => handleStatChange('blk', 1)} onDecrement={() => handleStatChange('blk', -1)} colorClass="bg-pink-600" />
              <StatControl label="Stl" value={player.stats.stl} onIncrement={() => handleStatChange('stl', 1)} onDecrement={() => handleStatChange('stl', -1)} colorClass="bg-purple-600" />
              <div className="hidden sm:block"></div> {/* Spacer to fill grid if needed */}
            </div>
          </div>

          {/* Section: General */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 border-b border-slate-800 pb-1">綜合 (General)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatControl label="Ast" value={player.stats.ast} onIncrement={() => handleStatChange('ast', 1)} onDecrement={() => handleStatChange('ast', -1)} colorClass="bg-amber-600" />
              <StatControl label="TO" value={player.stats.to} onIncrement={() => handleStatChange('to', 1)} onDecrement={() => handleStatChange('to', -1)} colorClass="bg-red-600" />
              <StatControl label="Foul" value={player.stats.foul} onIncrement={() => handleStatChange('foul', 1)} onDecrement={() => handleStatChange('foul', -1)} colorClass="bg-orange-600" />
            </div>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="bg-slate-800/50 rounded-lg p-3 flex justify-around items-center border border-slate-700/50">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase">FG%</div>
            <div className="font-bold text-base text-white">{fgPct}</div>
          </div>
          <div className="w-px h-6 bg-slate-700"></div>
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase">3P%</div>
            <div className="font-bold text-base text-white">{tpPct}</div>
          </div>
          <div className="w-px h-6 bg-slate-700"></div>
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase">Total Reb</div>
            <div className="font-bold text-base text-white">{rebounds}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlayerCard;
