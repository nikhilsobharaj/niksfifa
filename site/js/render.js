import { CONFIG } from "./config.js";
import { computePayouts, FIRST_SCORER_NO_GOAL, isFirstScorerMatch, getParticipantsForMatch } from "./compute.js";
import { getRoundLabel, shouldShowRoundHeading } from "./constants.js";
import {
  formatRs,
  getFixtureLabelHtml,
  getTeamLabelHtml,
  createParticipantLabel,
  getParticipantFanCountry,
  getTeamFlagBackgroundUrl
} from "./utils.js";

const TABLE_LABELS = {
  match: "Match",
  contest: "Contest",
  result: "Result",
  winners: "Winners",
  pool: "Pool",
  payout: "Payout",
  contestant: "Contestant",
  fan: "Fan country",
  correct: "Correct",
  won: "Total won",
  net: "Net"
};

function formatFirstScorerResult(value) {
  if (!value) return "Pending";
  if (value === FIRST_SCORER_NO_GOAL) return FIRST_SCORER_NO_GOAL;
  return getTeamLabelHtml(value);
}

function buildFirstScorerOptions(home, away) {
  return `
    <option value="">—</option>
    <option value="${home}">${home}</option>
    <option value="${away}">${away}</option>
    <option value="${FIRST_SCORER_NO_GOAL}">${FIRST_SCORER_NO_GOAL}</option>
  `;
}

export function renderSummary(state, elements) {
  const fixtures = state.fixtures || [];
  const { betPerMatch, betFirstScorer, stakePerParticipant, totalPool, matchStats, firstScorerMatchCount } = computePayouts(state);
  const done = matchStats.filter(m => m.result !== "Pending").length;
  const totalContests = matchStats.length;

  if (elements.betSummary) {
    const parts = [`${formatRs(betPerMatch)} per match (winner)`];
    if (firstScorerMatchCount > 0) {
      parts.push(`${formatRs(betFirstScorer)} first scorer (match ${89}+)`);
    }
    parts.push(`${fixtures.length} matches · ${formatRs(stakePerParticipant)} average stake`);
    elements.betSummary.textContent = parts.join(" · ");
  }
  if (elements.kpiParticipants) elements.kpiParticipants.textContent = state.participants.length;
  if (elements.kpiPool) {
    elements.kpiPool.textContent = formatRs(totalPool);
  }
  if (elements.kpiDone) elements.kpiDone.textContent = `${done}/${totalContests}`;
  if (elements.netStakeHeader) {
    elements.netStakeHeader.textContent = `Net (varies by participant)`;
  }
}

export function renderParticipantsChips(state, container, { editable = false, onRemove } = {}) {
  if (!container) return;
  container.innerHTML = "";

  state.participants.forEach(name => {
    const card = document.createElement("div");
    card.className = "participant-card";

    const fanCountry = getParticipantFanCountry(name, state.participantMeta);
    const fanFlagBg = fanCountry ? getTeamFlagBackgroundUrl(fanCountry) : "";
    if (fanFlagBg) {
      card.classList.add("fan-bg");
      card.style.setProperty("--fan-bg", `url('${fanFlagBg}')`);
      card.style.backgroundImage = `linear-gradient(rgba(7,16,24,0.75), rgba(7,16,24,0.85)), url('${fanFlagBg}')`;
      card.style.backgroundSize = "cover";
      card.title = `${name} · ${fanCountry} fan`;
    }

    card.appendChild(createParticipantLabel(name, state.participantMeta, "xs"));

    if (editable && onRemove) {
      const btn = document.createElement("button");
      btn.className = "remove-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", `Remove ${name}`);
      btn.textContent = "×";
      btn.addEventListener("click", () => onRemove(name));
      card.appendChild(btn);
    }

    container.appendChild(card);
  });
}

export function renderFixtures(state, container, {
  editable = false,
  onResultChange,
  onPredictionChange,
  onFirstScorerResultChange,
  onFirstScorerPredictionChange
} = {}) {
  if (!container) return;
  container.innerHTML = "";

  const fixtures = state.fixtures || [];
  let prevMatchId = null;

  fixtures.forEach(f => {
    const matchId = Number(f.id);
    const activeParticipants = getParticipantsForMatch(state.participants, matchId);
    const match = state.matches.find(m => m.id === f.id) || {
      result: "",
      predictions: {},
      firstScorerResult: "",
      firstScorerPredictions: {}
    };

    // Add round heading if round changed
    if (shouldShowRoundHeading(matchId, prevMatchId)) {
      const heading = document.createElement("div");
      heading.className = "round-heading";
      heading.innerHTML = `<h3>${getRoundLabel(matchId)}</h3>`;
      container.appendChild(heading);
    }

    const hasResult = Boolean(match.result);
    const details = document.createElement("details");
    details.className = "fixture";
    details.dataset.matchId = String(f.id);

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <div class="fixture-header">
        <span class="match-badge">#${f.id}</span>
        <span class="match-time">${f.timeIST || "TBD"}</span>
        <span class="summary-chevron" aria-hidden="true">▼</span>
      </div>
      <div class="fixture-teams">${getFixtureLabelHtml(f.home, f.away)}</div>
      <span class="fixture-result-pill ${hasResult ? "done" : "pending"}">
        ${hasResult ? "✓ " : ""}${hasResult ? getTeamLabelHtml(match.result) : "Awaiting result"}
      </span>
    `;
    details.appendChild(summary);

    const body = document.createElement("div");
    body.className = "fixture-body";

    const resultBlock = document.createElement("div");
    resultBlock.className = "result-block";
    resultBlock.innerHTML = `<label>Match result</label>`;

    if (editable) {
      const resultSelect = document.createElement("select");
      resultSelect.innerHTML = `
        <option value="">Pending</option>
        <option value="${f.home}">${f.home}</option>
        <option value="${f.away}">${f.away}</option>
      `;
      resultSelect.value = match.result || "";
      resultSelect.addEventListener("change", (e) => onResultChange?.(f.id, e.target.value));
      resultBlock.appendChild(resultSelect);
    } else {
      const resultValue = document.createElement("div");
      resultValue.className = "readonly-value";
      resultValue.innerHTML = match.result ? getTeamLabelHtml(match.result) : "Pending";
      resultBlock.appendChild(resultValue);
    }
    body.appendChild(resultBlock);

    const predList = document.createElement("div");
    predList.className = "prediction-list";

    activeParticipants.forEach(name => {
      const prediction = match.predictions[name] || "";
      const row = document.createElement("div");
      row.className = "prediction-row";
      if (match.result && prediction === match.result) row.classList.add("correct-pick");

      const nameSide = document.createElement("div");
      nameSide.appendChild(createParticipantLabel(name, state.participantMeta, "sm", "inline"));
      row.appendChild(nameSide);

      const predSide = document.createElement("div");
      predSide.className = "pred-side";

      if (editable) {
        const predSelect = document.createElement("select");
        predSelect.innerHTML = `
          <option value="">—</option>
          <option value="${f.home}">${f.home}</option>
          <option value="${f.away}">${f.away}</option>
        `;
        predSelect.value = prediction;
        predSelect.addEventListener("change", (e) => onPredictionChange?.(f.id, name, e.target.value));
        predSide.appendChild(predSelect);
      } else {
        const predValue = document.createElement("span");
        predValue.className = "readonly-value";
        predValue.innerHTML = prediction ? getTeamLabelHtml(prediction) : "—";
        predSide.appendChild(predValue);
      }

      row.appendChild(predSide);
      predList.appendChild(row);
    });

    body.appendChild(predList);

    if (isFirstScorerMatch(f.id)) {
      const firstScorerBlock = document.createElement("div");
      firstScorerBlock.className = "result-block first-scorer-block";
      firstScorerBlock.innerHTML = `<label>Who will score first?</label>`;

      if (editable) {
        const fsResultSelect = document.createElement("select");
        fsResultSelect.innerHTML = `
          <option value="">Pending</option>
          <option value="${f.home}">${f.home}</option>
          <option value="${f.away}">${f.away}</option>
          <option value="${FIRST_SCORER_NO_GOAL}">${FIRST_SCORER_NO_GOAL}</option>
        `;
        fsResultSelect.value = match.firstScorerResult || "";
        fsResultSelect.addEventListener("change", (e) => onFirstScorerResultChange?.(f.id, e.target.value));
        firstScorerBlock.appendChild(fsResultSelect);
      } else {
        const fsResultValue = document.createElement("div");
        fsResultValue.className = "readonly-value";
        fsResultValue.innerHTML = formatFirstScorerResult(match.firstScorerResult);
        firstScorerBlock.appendChild(fsResultValue);
      }
      body.appendChild(firstScorerBlock);

      const fsPredList = document.createElement("div");
      fsPredList.className = "prediction-list first-scorer-list";

      activeParticipants.forEach(name => {
        const fsPrediction = match.firstScorerPredictions?.[name] || "";
        const row = document.createElement("div");
        row.className = "prediction-row";
        if (match.firstScorerResult && fsPrediction === match.firstScorerResult) {
          row.classList.add("correct-pick");
        }

        const nameSide = document.createElement("div");
        nameSide.appendChild(createParticipantLabel(name, state.participantMeta, "sm", "inline"));
        row.appendChild(nameSide);

        const predSide = document.createElement("div");
        predSide.className = "pred-side";

        if (editable) {
          const fsPredSelect = document.createElement("select");
          fsPredSelect.innerHTML = buildFirstScorerOptions(f.home, f.away);
          fsPredSelect.value = fsPrediction;
          fsPredSelect.addEventListener("change", (e) => onFirstScorerPredictionChange?.(f.id, name, e.target.value));
          predSide.appendChild(fsPredSelect);
        } else {
          const fsPredValue = document.createElement("span");
          fsPredValue.className = "readonly-value";
          fsPredValue.innerHTML = fsPrediction ? formatFirstScorerResult(fsPrediction) : "—";
          predSide.appendChild(fsPredValue);
        }

        row.appendChild(predSide);
        fsPredList.appendChild(row);
      });

      body.appendChild(fsPredList);
    }

    details.appendChild(body);
    container.appendChild(details);
    prevMatchId = matchId;
  });
}

function setCell(td, label, content) {
  td.setAttribute("data-label", label);
  if (typeof content === "string") td.innerHTML = content;
  else td.appendChild(content);
}

export function renderPayoutTables(state, elements) {
  const { matchStats, participantStats } = computePayouts(state);

  renderSummary(state, {
    ...elements,
    netStakeHeader: elements.netStakeHeader
  });

  const matchBody = elements.matchPayoutBody;
  if (matchBody) {
    matchBody.innerHTML = "";
    matchStats.forEach(m => {
      const tr = document.createElement("tr");

      const matchTd = document.createElement("td");
      setCell(matchTd, TABLE_LABELS.match, `#${m.id} · ${getFixtureLabelHtml(m.home, m.away)}`);

      const contestTd = document.createElement("td");
      contestTd.setAttribute("data-label", TABLE_LABELS.contest);
      contestTd.textContent = m.contestLabel;

      const resultTd = document.createElement("td");
      const resultContent = m.contestType === "firstScorer"
        ? formatFirstScorerResult(m.result === "Pending" ? "" : m.result)
        : (m.result === "Pending" ? "Pending" : getTeamLabelHtml(m.result));
      setCell(resultTd, TABLE_LABELS.result, resultContent);

      const winnersTd = document.createElement("td");
      winnersTd.setAttribute("data-label", TABLE_LABELS.winners);
      winnersTd.textContent = m.winners.length ? m.winners.join(", ") : "—";

      const poolTd = document.createElement("td");
      poolTd.setAttribute("data-label", TABLE_LABELS.pool);
      poolTd.textContent = formatRs(m.pool);

      const payoutTd = document.createElement("td");
      payoutTd.setAttribute("data-label", TABLE_LABELS.payout);
      payoutTd.textContent = m.result === "Pending" ? "—" : formatRs(m.payoutPerWinner);

      tr.appendChild(matchTd);
      tr.appendChild(contestTd);
      tr.appendChild(resultTd);
      tr.appendChild(winnersTd);
      tr.appendChild(poolTd);
      tr.appendChild(payoutTd);

      if (m.result !== "Pending" && m.winners.length === 0) tr.className = "warn";
      if (m.result !== "Pending" && m.winners.length > 0) tr.className = "ok";
      matchBody.appendChild(tr);
    });
  }

  const contestantBody = elements.contestantBody;
  if (contestantBody) {
    contestantBody.innerHTML = "";
    participantStats.forEach(p => {
      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.setAttribute("data-label", TABLE_LABELS.contestant);
      nameTd.appendChild(createParticipantLabel(p.name, state.participantMeta, "sm", "inline"));

      const fanCountryTd = document.createElement("td");
      fanCountryTd.className = "col-fan";
      const fanCountry = getParticipantFanCountry(p.name, state.participantMeta);
      setCell(fanCountryTd, TABLE_LABELS.fan, fanCountry ? getTeamLabelHtml(fanCountry) : "—");

      const correctTd = document.createElement("td");
      correctTd.setAttribute("data-label", TABLE_LABELS.correct);
      correctTd.textContent = p.correct;

      const wonTd = document.createElement("td");
      wonTd.setAttribute("data-label", TABLE_LABELS.won);
      wonTd.textContent = formatRs(p.won);

      const netTd = document.createElement("td");
      netTd.setAttribute("data-label", TABLE_LABELS.net);
      netTd.textContent = formatRs(p.net);
      if (p.net > 0) netTd.style.color = "var(--accent)";
      if (p.net < 0) netTd.style.color = "var(--danger)";

      tr.appendChild(nameTd);
      tr.appendChild(fanCountryTd);
      tr.appendChild(correctTd);
      tr.appendChild(wonTd);
      tr.appendChild(netTd);
      contestantBody.appendChild(tr);
    });
  }
}

export function renderMatchList(state, container, { onRemove } = {}) {
  if (!container) return;
  container.innerHTML = "";

  (state.fixtures || []).forEach(f => {
    const item = document.createElement("div");
    item.className = "match-item";

    const info = document.createElement("div");
    info.className = "match-info";
    info.innerHTML = `
      <strong>Match #${f.id}</strong>
      <div style="margin-top:4px">${getFixtureLabelHtml(f.home, f.away)}</div>
      <div class="small">${f.timeIST || "No time set"}</div>
    `;
    item.appendChild(info);

    if (onRemove) {
      const btn = document.createElement("button");
      btn.className = "btn-danger btn-sm";
      btn.type = "button";
      btn.textContent = "Remove";
      btn.addEventListener("click", () => onRemove(f.id));
      item.appendChild(btn);
    }

    container.appendChild(item);
  });
}

export function getDataSourceLabel() {
  if (!CONFIG.DATA_API_URL) return "Local data";
  if (CONFIG.DATA_API_URL.includes("script.google.com")) return "Google Drive";
  return "Netlify";
}
