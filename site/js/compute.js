import { CONFIG } from "./config.js";
import { FIRST_SCORER_NO_GOAL, isFirstScorerMatch, getParticipantsForMatch } from "./constants.js";

export function getBetPerMatch(state) {
  const value = Number(state.betPerMatch);
  if (!Number.isFinite(value) || value <= 0) return CONFIG.DEFAULT_BET_PER_MATCH;
  return Math.floor(value);
}

export function getBetFirstScorerPerMatch(state) {
  const value = Number(state.betFirstScorerPerMatch);
  if (!Number.isFinite(value) || value <= 0) return CONFIG.DEFAULT_BET_FIRST_SCORER;
  return Math.floor(value);
}

function computeMatchPayout({ participants, bet, result, predictions, getPrediction }) {
  const pool = participants.length * bet;
  let winners = [];
  let payoutPerWinner = 0;

  if (result) {
    winners = participants.filter(name => getPrediction(name) === result);
    payoutPerWinner = winners.length ? pool / winners.length : 0;
  }

  return { pool, result, winners, payoutPerWinner };
}

function getRoundForMatch(matchId) {
  const id = Number(matchId);
  if (id < 89) return "round32";
  if (id < 97) return "round16";
  if (id < 101) return "quarterfinals";
  return "";
}

export function computePayouts(state) {
  const fixtures = state.fixtures || [];
  const betPerMatch = getBetPerMatch(state);
  const betFirstScorer = getBetFirstScorerPerMatch(state);
  const firstScorerFixtures = fixtures.filter(f => isFirstScorerMatch(f.id));

  // Calculate stakes per participant based on their participation window
  const round32Fixtures = fixtures.filter(f => Number(f.id) < 89);
  const round16Fixtures = fixtures.filter(f => Number(f.id) >= 89);

  const winnerStake32 = betPerMatch * round32Fixtures.length;
  const winnerStake16 = betPerMatch * round16Fixtures.length;
  const firstScorerStake = betFirstScorer * firstScorerFixtures.length;

  const participantStats = {};
  state.participants.forEach(name => {
    const isLateJoiner = getParticipantsForMatch(state.participants, 73).indexOf(name) === -1;
    const stakePerParticipant = isLateJoiner
      ? winnerStake16 + firstScorerStake
      : winnerStake32 + firstScorerStake;

    participantStats[name] = {
      name,
      correct: 0,
      won: 0,
      net: -stakePerParticipant,
      round32: 0,
      round16: 0,
      quarterfinals: 0
    };
  });

  const matchStats = [];

  fixtures.forEach(f => {
    const matchId = Number(f.id);
    const activeParticipants = getParticipantsForMatch(state.participants, matchId);
    const match = state.matches.find(m => m.id === f.id) || { result: "", predictions: {} };
    const round = getRoundForMatch(matchId);

    const { pool, result, winners, payoutPerWinner } = computeMatchPayout({
      participants: activeParticipants,
      bet: betPerMatch,
      result: match.result || "",
      predictions: match.predictions,
      getPrediction: name => match.predictions?.[name] || ""
    });

    if (result) {
      winners.forEach(name => {
        participantStats[name].correct += 1;
        participantStats[name].won += payoutPerWinner;
        participantStats[name].net += payoutPerWinner;
        if (round) {
          participantStats[name][round] += payoutPerWinner;
        }
      });
    }

    matchStats.push({
      id: f.id,
      home: f.home,
      away: f.away,
      contestType: "winner",
      contestLabel: "Winner",
      result: result || "Pending",
      winners,
      pool,
      payoutPerWinner
    });
  });

  firstScorerFixtures.forEach(f => {
    const matchId = Number(f.id);
    const activeParticipants = getParticipantsForMatch(state.participants, matchId);
    const match = state.matches.find(m => m.id === f.id) || {
      firstScorerResult: "",
      firstScorerPredictions: {}
    };
    const round = getRoundForMatch(matchId);
    
    const { pool, result, winners, payoutPerWinner } = computeMatchPayout({
      participants: activeParticipants,
      bet: betFirstScorer,
      result: match.firstScorerResult || "",
      predictions: match.firstScorerPredictions,
      getPrediction: name => match.firstScorerPredictions?.[name] || ""
    });

    if (result) {
      winners.forEach(name => {
        participantStats[name].correct += 1;
        participantStats[name].won += payoutPerWinner;
        participantStats[name].net += payoutPerWinner;
        if (round) {
          participantStats[name][round] += payoutPerWinner;
        }
      });
    }

    matchStats.push({
      id: f.id,
      home: f.home,
      away: f.away,
      contestType: "firstScorer",
      contestLabel: "First Scorer",
      result: result || "Pending",
      winners,
      pool,
      payoutPerWinner
    });
  });

  // Total pool = sum of individual stakes (which vary by participant)
  const totalPool = Object.values(participantStats).reduce((sum, p) => sum - p.net, 0);

  // Use average stake per participant for display purposes
  const avgStakePerParticipant = state.participants.length > 0
    ? totalPool / state.participants.length
    : 0;

  return {
    betPerMatch,
    betFirstScorer,
    stakePerParticipant: avgStakePerParticipant,
    totalPool,
    firstScorerMatchCount: firstScorerFixtures.length,
    matchStats,
    participantStats: Object.values(participantStats).sort((a, b) => b.won - a.won)
  };
}

export function getMatchState(state, id) {
  return state.matches.find(m => m.id === id);
}

export function getMatchDef(state, id) {
  return state.fixtures.find(f => f.id === id);
}

export { FIRST_SCORER_NO_GOAL, isFirstScorerMatch, getParticipantsForMatch };
