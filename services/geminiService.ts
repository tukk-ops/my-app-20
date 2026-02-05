
import { GoogleGenAI } from "@google/genai";
import { Team } from "../types";
import { calculatePoints, calculateTotalRebounds, calculatePercentage } from "../utils/calculations";

export const generateGameReport = async (teamA: Team, teamB: Team) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const formatTeamStats = (team: Team) => {
    return team.players.map(p => {
      const stats = p.stats;
      return `Player #${p.number} ${p.name}: ${calculatePoints(stats)} PTS, ${calculateTotalRebounds(stats)} REB (${stats.offReb} OFF), ${stats.ast} AST, ${stats.stl} STL, ${stats.blk} BLK, ${stats.to} TO, FG% ${calculatePercentage(stats.fgm, stats.fga)}, 3P% ${calculatePercentage(stats.threePm, stats.threePa)}`;
    }).join('\n');
  };

  const prompt = `
    As a professional basketball scout and data analyst, provide a concise but deep game report based on the following statistics for two teams.
    Identify the MVP of the match, key performance trends, and areas for improvement for each team.
    
    TEAM A (${teamA.name}):
    ${formatTeamStats(teamA)}
    
    TEAM B (${teamB.name}):
    ${formatTeamStats(teamB)}
    
    Structure the report in Markdown with headings. Focus on tactical insights.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating report. Please check your connectivity or stats.";
  }
};
