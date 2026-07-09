import { CONFIG } from "./config.js";
import { FIRST_SCORER_NO_GOAL, isFirstScorerMatch } from "./constants.js";

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

export function computePayouts(state) {
  const fixtures = state.fixtures || [];
  const betPerMatch = getBetPerMatch(state);
  const betFirstScorer = getBetFirstScorerPerMatch(state);
  const firstScorerFixtures = fixtures.filter(f => isFirstScorerMatch(f.id));

  const winnerStake = betPerMatch * fixtures.length;
  const firstScorerStake = betFirstScorer * firstScorerFixtures.length;
  const stakePerParticipant = winnerStake + firstScorerStake;

  const participantStats = Object.fromEntries(
    state.participants.map(name => [name, { name, correct: 0, won: 0, net: -stakePerParticipant }])
  );

  const matchStats = [];

  fixtures.forEach(f => {
    const match = state.matches.find(m => m.id === f.id) || { result: "", predictions: {} };
    const { pool, result, winners, payoutPerWinner } = computeMatchPayout({
      participants: state.participants,
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
    const match = state.matches.find(m => m.id === f.id) || {
      firstScorerResult: "",
      firstScorerPredictions: {}
    };
    const { pool, result, winners, payoutPerWinner } = computeMatchPayout({
      participants: state.participants,
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

  const totalPool = state.participants.length * stakePerParticipant;

  return {
    betPerMatch,
    betFirstScorer,
    stakePerParticipant,
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

export { FIRST_SCORER_NO_GOAL, isFirstScorerMatch };
