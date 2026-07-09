export const TEAM_FLAG_CODES = {
  "South Africa": "za",
  "Canada": "ca",
  "Brazil": "br",
  "Japan": "jp",
  "Germany": "de",
  "Paraguay": "py",
  "Netherlands": "nl",
  "Morocco": "ma",
  "Ivory Coast": "ci",
  "Norway": "no",
  "France": "fr",
  "Sweden": "se",
  "Mexico": "mx",
  "Ecuador": "ec",
  "England": "gb-eng",
  "DR Congo": "cd",
  "Belgium": "be",
  "Senegal": "sn",
  "United States": "us",
  "Bosnia and Herzegovina": "ba",
  "Spain": "es",
  "Austria": "at",
  "Portugal": "pt",
  "Croatia": "hr",
  "Switzerland": "ch",
  "Algeria": "dz",
  "Australia": "au",
  "Egypt": "eg",
  "Argentina": "ar",
  "Cape Verde": "cv",
  "Colombia": "co",
  "Ghana": "gh"
};

// Complete tournament fixtures (32 Round of 32 + 8 Round of 16 + 4 Quarterfinals = 44 matches)
export const DEFAULT_FIXTURES = [
  // ===== ROUND OF 32 (Match IDs 73-88) =====
  { id: 73, timeIST: "29 Jun, 12:30 AM IST", home: "South Africa", away: "Canada" },
  { id: 76, timeIST: "29 Jun, 10:30 PM IST", home: "Brazil", away: "Japan" },
  { id: 74, timeIST: "30 Jun, 2:00 AM IST", home: "Germany", away: "Paraguay" },
  { id: 75, timeIST: "30 Jun, 6:30 AM IST", home: "Netherlands", away: "Morocco" },
  { id: 78, timeIST: "30 Jun, 10:30 PM IST", home: "Ivory Coast", away: "Norway" },
  { id: 77, timeIST: "1 Jul, 2:30 AM IST", home: "France", away: "Sweden" },
  { id: 79, timeIST: "1 Jul, 6:30 AM IST", home: "Mexico", away: "Ecuador" },
  { id: 80, timeIST: "1 Jul, 9:30 PM IST", home: "England", away: "DR Congo" },
  { id: 82, timeIST: "2 Jul, 1:30 AM IST", home: "Belgium", away: "Senegal" },
  { id: 81, timeIST: "2 Jul, 5:30 AM IST", home: "United States", away: "Bosnia and Herzegovina" },
  { id: 84, timeIST: "3 Jul, 12:30 AM IST", home: "Spain", away: "Austria" },
  { id: 83, timeIST: "3 Jul, 4:30 AM IST", home: "Portugal", away: "Croatia" },
  { id: 85, timeIST: "3 Jul, 8:30 AM IST", home: "Switzerland", away: "Algeria" },
  { id: 88, timeIST: "3 Jul, 11:30 PM IST", home: "Australia", away: "Egypt" },
  { id: 86, timeIST: "4 Jul, 3:30 AM IST", home: "Argentina", away: "Cape Verde" },
  { id: 87, timeIST: "4 Jul, 7:00 AM IST", home: "Colombia", away: "Ghana" },
  
  // ===== ROUND OF 16 (Match IDs 89-96) =====
  { id: 90, timeIST: "4 Jul, 10:30 PM IST", home: "Canada", away: "Morocco" },
  { id: 89, timeIST: "5 Jul, 2:30 AM IST", home: "Paraguay", away: "France" },
  { id: 91, timeIST: "6 Jul, 1:30 AM IST", home: "Brazil", away: "Norway" },
  { id: 92, timeIST: "6 Jul, 5:30 AM IST", home: "Mexico", away: "England" },
  { id: 93, timeIST: "7 Jul, 12:30 AM IST", home: "Portugal", away: "Spain" },
  { id: 94, timeIST: "7 Jul, 5:30 AM IST", home: "United States", away: "Belgium" },
  { id: 95, timeIST: "7 Jul, 9:30 PM IST", home: "Argentina", away: "Egypt" },
  { id: 96, timeIST: "8 Jul, 1:30 AM IST", home: "Switzerland", away: "Colombia" },
  
  // ===== QUARTERFINALS / ROUND OF 8 (Match IDs 97-100) =====
  { id: 97, timeIST: "9 Jul, 12:30 AM IST", home: "France", away: "Brazil" },
  { id: 98, timeIST: "9 Jul, 4:30 AM IST", home: "England", away: "Belgium" },
  { id: 99, timeIST: "10 Jul, 12:30 AM IST", home: "Spain", away: "United States" },
  { id: 100, timeIST: "10 Jul, 4:30 AM IST", home: "Argentina", away: "Switzerland" }
];

export const DEFAULT_PARTICIPANT_META = {
  "Nikhil Sobharaj": {
    photo: "https://drive.google.com/file/d/1r4lJEJui2LSQkZGHFc_zMvk1FrIllCAZ/view?usp=drivesdk",
    fanCountry: "Portugal"
  },
  "Anuranjan VP": {
    photo: "https://drive.google.com/file/d/14ahRdI5X_Hnu188TbXZ0qPTYWuUXbADt/view?usp=drivesdk",
    fanCountry: "Brazil"
  },
  "Abdul Salim": {
    photo: "https://drive.google.com/file/d/1I90z-fpnzn_b8hqEVUmTek6hNwvZ2JN5/view?usp=drivesdk",
    fanCountry: "France"
  },
  "Fajer Yousufali": {
    photo: "https://drive.google.com/file/d/1AccF1sFUH7EDPKo4vft0GUaBjMkNzzjx/view?usp=drivesdk",
    fanCountry: "Argentina"
  },
  "Freddy TV": {
    photo: "https://drive.google.com/file/d/1fsPkyCpuCpJB6nouEko4WxX6ufdXFDhR/view?usp=drivesdk",
    fanCountry: "Argentina"
  },
  "George Jose": {
    photo: "https://drive.google.com/file/d/1fWmba9o_rYVcHnGorndr--sGOCFzVn99/view?usp=drivesdk",
    fanCountry: "Croatia"
  },
  "Jojo Varghese": {
    photo: "https://drive.google.com/file/d/1a-DAALipex-L1seE5JPli5lbNiVhJQQF/view?usp=drivesdk",
    fanCountry: "Argentina"
  },
  "Jomy Jose": {
    photo: "https://drive.google.com/file/d/1sWM9XE7aOe4POTvPxwZ5jQl2s30GjFo5/view?usp=drivesdk",
    fanCountry: "Brazil"
  },
  "Jubil James": {
    photo: "https://drive.google.com/file/d/1lRnurDKWs-W_aixXmTMF06y4Hp_UWatY/view?usp=drivesdk",
    fanCountry: "England"
  },
  "Prince K Lonappan": {
    photo: "https://drive.google.com/file/d/1492UREqi2uLc1UUS3crk5jBLIAUpR6nR/view?usp=drivesdk",
    fanCountry: "Belgium"
  },
  "Sijo Joseph K": {
    photo: "https://drive.google.com/file/d/1ppFgeLjW2P_oXc1zpj67B4Ij_R6D4k49/view?usp=drivesdk",
    fanCountry: "Brazil"
  },
  "Sunil Paul": {
    photo: "https://drive.google.com/file/d/11zaCRSsAekQzvdEZcb4jD_Q_9IUzRU9D/view?usp=drivesdk",
    fanCountry: "Germany"
  }
};

export const DEFAULT_PARTICIPANTS = Object.keys(DEFAULT_PARTICIPANT_META);

// First Scorer contests enabled from match 89 onwards (Round of 16)
export const FIRST_SCORER_MIN_MATCH_ID = 89;
export const FIRST_SCORER_NO_GOAL = "No Goal";

// Fajer Yousufali joins from Round of 16 (match 89 onwards)
export const LATE_JOINER_MIN_MATCH_ID = 89;
export const LATE_JOINER_NAME = "Fajer Yousufali";

export function isFirstScorerMatch(matchId) {
  return Number(matchId) >= FIRST_SCORER_MIN_MATCH_ID;
}

export function getParticipantsForMatch(allParticipants, matchId) {
  const id = Number(matchId);
  if (id < LATE_JOINER_MIN_MATCH_ID) {
    // Round of 32: exclude late joiner
    return allParticipants.filter(p => p !== LATE_JOINER_NAME);
  }
  // Round of 16 and beyond: include all participants
  return allParticipants;
}

export function getRoundLabel(matchId) {
  const id = Number(matchId);
  if (id < 89) return "🔹 Round of 32";
  if (id < 97) return "🔸 Round of 16";
  if (id < 101) return "🏅 Quarterfinals (Round of 8)";
  return "";
}

export function shouldShowRoundHeading(currentMatchId, prevMatchId) {
  const currentRound = getRoundLabel(currentMatchId);
  const prevRound = prevMatchId ? getRoundLabel(prevMatchId) : "";
  return currentRound && currentRound !== prevRound;
}
