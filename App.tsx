
import React, { useState } from 'react';
import { Team, Player, StatKey, PlayerStats } from './types';
import PlayerCard from './components/PlayerCard';
import { calculatePoints } from './utils/calculations';

const INITIAL_STATS: PlayerStats = {
  fgm: 0, fga: 0, threePm: 0, threePa: 0, ftm: 0, fta: 0,
  offReb: 0, defReb: 0, ast: 0, stl: 0, blk: 0, to: 0, foul: 0
};

const App: React.FC = () => {
  const [teamA, setTeamA] = useState<Team>({ name: '隊伍 A', players: [] });
  const [teamB, setTeamB] = useState<Team>({ name: '隊伍 B', players: [] });

  // Form State
  const [newPlayer, setNewPlayer] = useState({ name: '', number: '', team: 'A' });

  // Calculate Team Scores
  const teamAScore = teamA.players.reduce((total, p) => total + calculatePoints(p.stats), 0);
  const teamBScore = teamB.players.reduce((total, p) => total + calculatePoints(p.stats), 0);

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name || !newPlayer.number) return;

    const player: Player = {
      id: crypto.randomUUID(),
      name: newPlayer.name,
      number: newPlayer.number,
      stats: { ...INITIAL_STATS }
    };

    if (newPlayer.team === 'A') {
      if (teamA.players.length >= 13) return alert("隊伍 A 已達 13 人上限");
      setTeamA(prev => ({ ...prev, players: [...prev.players, player] }));
    } else {
      if (teamB.players.length >= 13) return alert("隊伍 B 已達 13 人上限");
      setTeamB(prev => ({ ...prev, players: [...prev.players, player] }));
    }

    setNewPlayer({ ...newPlayer, name: '', number: '' });
  };

  const updateStat = (teamId: 'A' | 'B', playerId: string, key: StatKey, delta: number) => {
    const setTeam = teamId === 'A' ? setTeamA : setTeamB;
    setTeam(prev => ({
      ...prev,
      players: prev.players.map(p => {
        if (p.id !== playerId) return p;
        const newVal = Math.max(0, p.stats[key] + delta);

        // Logical adjustments to keep stats consistent
        const newStats = { ...p.stats, [key]: newVal };

        if (delta > 0) {
          if (key === 'threePm') {
            newStats.fgm = Math.max(newStats.fgm, newStats.threePm);
            newStats.threePa = Math.max(newStats.threePa, newStats.threePm);
            newStats.fga = Math.max(newStats.fga, newStats.fgm);
          } else if (key === 'fgm') {
            newStats.fga = Math.max(newStats.fga, newStats.fgm);
          } else if (key === 'ftm') {
            newStats.fta = Math.max(newStats.fta, newStats.ftm);
          } else if (key === 'threePa') {
            newStats.fga = Math.max(newStats.fga, newStats.threePa);
          }
        }

        return { ...p, stats: newStats };
      })
    }));
  };

  const removePlayer = (teamId: 'A' | 'B', playerId: string) => {
    const setTeam = teamId === 'A' ? setTeamA : setTeamB;
    setTeam(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId)
    }));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        <h1 className="text-2xl font-condensed tracking-tighter text-blue-400 flex items-center gap-2">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v2h-2zm0 4h2v6h-2z" /></svg>
          HOOPS MANAGER <span className="text-white">PRO</span>
        </h1>

        <form onSubmit={addPlayer} className="flex flex-wrap gap-2 items-end bg-slate-800/50 p-2 rounded-lg border border-slate-700">
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-500 uppercase ml-1">姓名</label>
            <input
              type="text"
              placeholder="球員姓名"
              value={newPlayer.name}
              onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex flex-col w-16">
            <label className="text-[10px] text-slate-500 uppercase ml-1">背號</label>
            <input
              type="text"
              placeholder="#"
              value={newPlayer.number}
              onChange={e => setNewPlayer({ ...newPlayer, number: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm text-center"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-500 uppercase ml-1">隊伍</label>
            <select
              value={newPlayer.team}
              onChange={e => setNewPlayer({ ...newPlayer, team: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm h-[34px]"
            >
              <option value="A">隊伍 A</option>
              <option value="B">隊伍 B</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded text-sm transition-colors h-[34px]">
            新增球員
          </button>
        </form>
      </header>

      <main className="w-[98%] max-w-[1920px] mx-auto px-4 sm:px-6 mt-8">
        {/* Score Board Overview */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl flex items-center overflow-hidden shadow-2xl">
            <div className="px-8 py-4 text-center border-r border-slate-800">
              <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">隊伍 A</div>
              <div className="text-5xl font-condensed font-bold text-white leading-none">{teamAScore}</div>
            </div>
            <div className="px-4 py-2 bg-slate-800 text-slate-500 font-bold text-xl italic">VS</div>
            <div className="px-8 py-4 text-center">
              <div className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-1">隊伍 B</div>
              <div className="text-5xl font-condensed font-bold text-white leading-none">{teamBScore}</div>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-2 gap-12">
          {/* Team A Section */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b-2 border-blue-600 pb-2">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-blue-600"></span>
                <h2 className="text-xl font-bold font-condensed">{teamA.name}</h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-blue-900/40 text-blue-400 px-3 py-1 rounded text-lg font-bold font-condensed border border-blue-800/50">
                  總得分: {teamAScore}
                </span>
                <span className="text-slate-500 text-sm font-bold">{teamA.players.length} / 13 球員</span>
              </div>
            </div>
            {teamA.players.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-600">
                請新增球員開始記錄數據
              </div>
            )}
            {teamA.players.map(p => (
              <PlayerCard
                key={p.id}
                player={p}
                onUpdateStat={(id, k, d) => updateStat('A', id, k, d)}
                onRemove={(id) => removePlayer('A', id)}
                accentColor="bg-blue-600"
              />
            ))}
          </section>

          {/* Team B Section */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b-2 border-red-600 pb-2">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-red-600"></span>
                <h2 className="text-xl font-bold font-condensed">{teamB.name}</h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-red-900/40 text-red-400 px-3 py-1 rounded text-lg font-bold font-condensed border border-red-800/50">
                  總得分: {teamBScore}
                </span>
                <span className="text-slate-500 text-sm font-bold">{teamB.players.length} / 13 球員</span>
              </div>
            </div>
            {teamB.players.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-600">
                請新增球員開始記錄數據
              </div>
            )}
            {teamB.players.map(p => (
              <PlayerCard
                key={p.id}
                player={p}
                onUpdateStat={(id, k, d) => updateStat('B', id, k, d)}
                onRemove={(id) => removePlayer('B', id)}
                accentColor="bg-red-600"
              />
            ))}
          </section>
        </div>
      </main>

      {/* Floating Status Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span className="text-xs font-bold text-slate-400">隊伍 A: {teamAScore} 分</span>
        </div>
        <div className="w-px h-4 bg-slate-700"></div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-xs font-bold text-slate-400">隊伍 B: {teamBScore} 分</span>
        </div>
        <div className="w-px h-4 bg-slate-700"></div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest"
        >
          返回頂部
        </button>
      </div>
    </div>
  );
};

export default App;
