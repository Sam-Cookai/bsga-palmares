/* ===========================================================
   BSGA Palmarès
   ===========================================================
   © Kevin Marq Product — Tous droits réservés.
   Toute reproduction, distribution ou revente de cette application,
   en tout ou partie, sans autorisation écrite préalable est interdite.
   =========================================================== */

const APP_VERSION = "0.8";
const STORAGE_KEY = "club077108_resultats_v1";

let DB = [];          // tableau de records {id, annee, sexe, club, groupe, epreuve, place, performance, nom}
let NEXT_ID = 1;
let pendingImport = []; // résultats analysés en attente de validation (page import)

/* ---------------- Stockage local (localStorage) ---------------- */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) { console.warn("Lecture storage impossible", e); }
  return null;
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DB));
  } catch (e) {
    console.warn("Sauvegarde storage impossible", e);
  }
}

function ensureCategorie(r) {
  if (!r.categorie) r.categorie = guessCategorie(r.epreuve);
  return r;
}

function initDB() {
  const stored = loadFromStorage();
  if (stored) {
    DB = stored.map(ensureCategorie);
  } else {
    DB = SEED_DATA.map(r => ensureCategorie({...r}));
    saveToStorage();
  }
  NEXT_ID = DB.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1;
}

/* ---------------- Toasts ---------------- */
function toast(msg, type = "") {
  const wrap = document.getElementById("toast-wrap");
  const it = document.createElement("div");
  it.className = "toast" + (type ? " " + type : "");
  it.textContent = msg;
  wrap.appendChild(it);
  setTimeout(() => { it.style.opacity = "0"; it.style.transition = "opacity .3s"; }, 3200);
  setTimeout(() => it.remove(), 3600);
}

/* ---------------- Modal de confirmation ---------------- */
function confirmAction(title, text, onConfirm) {
  const overlay = document.getElementById("confirmModal");
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalText").textContent = text;
  overlay.classList.add("open");
  const btnOk = document.getElementById("modalConfirm");
  const btnCancel = document.getElementById("modalCancel");
  const cleanup = () => {
    overlay.classList.remove("open");
    btnOk.onclick = null;
    btnCancel.onclick = null;
  };
  btnOk.onclick = () => { cleanup(); onConfirm(); };
  btnCancel.onclick = cleanup;
}

/* ---------------- Normalisation / clé de dédoublonnage ---------------- */
function normStr(s) {
  return (s || "").toString().trim().toUpperCase()
    .replace(/\s+/g, " ")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normEpreuve(e) {
  return normStr(e).replace(/\s*\|\s*VENT\s*:\s*[A-Z]+\s*$/i, "").trim();
}

function normPerf(perf) {
  return normStr(perf)
    .replace(/\(.*?\)/g, "")        // retire (RP), (i), (+0.2), (-1.3)...
    .replace(/''/g, '"')             // double-apostrophe -> guillemet double (equivalents : 11''18 = 11"18)
    .replace(/\s+/g, "");
}

// Un même athlète, dans la même épreuve, la même année, avec la même performance
// (en ignorant les mentions entre parenthèses : (RP), (i), vent...) est considéré
// comme le même résultat, même si la place affichée diffère légèrement.
function recordKey(r) {
  return [
    normStr(r.annee),
    normStr(r.sexe),
    normEpreuve(r.epreuve),
    normStr(r.nom),
    normPerf(r.performance)
  ].join("|");
}

function buildExistingKeySet() {
  const set = new Set();
  DB.forEach(r => set.add(recordKey(r)));
  return set;
}

/* ---------------- Parsing performance -> valeur numerique comparable ---------------- */
function parsePerformance(perfRaw, epreuve) {
  if (!perfRaw) return null;
  let s = perfRaw.toString().trim();

  let m = s.match(/([\d\s]+)\s*pts/i);
  if (m) {
    const val = parseFloat(m[1].replace(/\s/g, ""));
    return isNaN(val) ? null : { value: val, unit: "pts", higherIsBetter: true };
  }

  m = s.match(/^([\d\s]+)\s*m$/);
  if (m && /marche|heure/i.test(epreuve || "")) {
    const val = parseFloat(m[1].replace(/\s/g, ""));
    return isNaN(val) ? null : { value: val, unit: "m", higherIsBetter: true };
  }

  m = s.match(/^(\d+)km(\d+)/i);
  if (m) {
    const val = parseFloat(m[1]) * 1000 + parseFloat(m[2]);
    return { value: val, unit: "m", higherIsBetter: true };
  }

  m = s.match(/^(\d+)m(\d{1,2})\b/);
  if (m) {
    const val = parseFloat(m[1]) + parseFloat(m[2]) / 100;
    return { value: val, unit: "m", higherIsBetter: true };
  }

  m = s.match(/(\d+)h(\d+)'(\d+)/);
  if (m) {
    const val = parseFloat(m[1]) * 3600 + parseFloat(m[2]) * 60 + parseFloat(m[3]);
    return { value: val, unit: "s", higherIsBetter: false };
  }

  m = s.match(/(\d+)'(\d+)(?:''|")(\d+)?/);
  if (m) {
    let val = parseFloat(m[1]) * 60 + parseFloat(m[2]);
    if (m[3]) {
      const dec = m[3].length === 1 ? parseFloat(m[3]) / 10 : parseFloat(m[3]) / 100;
      val += dec;
    }
    return { value: val, unit: "s", higherIsBetter: false };
  }

  m = s.match(/^(\d+)(?:''|")(\d+)?/);
  if (m) {
    let val = parseFloat(m[1]);
    if (m[2]) {
      const dec = m[2].length === 1 ? parseFloat(m[2]) / 10 : parseFloat(m[2]) / 100;
      val += dec;
    }
    return { value: val, unit: "s", higherIsBetter: false };
  }

  return null;
}

/* ---------------- Helpers UI generiques ---------------- */
function uniqueSorted(arr) {
  return [...new Set(arr)].sort((a, b) => a.toString().localeCompare(b.toString(), 'fr'));
}

// Extrait la distance/valeur numérique principale d'un libellé d'épreuve pour un tri logique.
// Exemples : "50m" -> 50, "1 000m" -> 1000, "Disque (1.2 kg)" -> 1.2, "Hauteur" -> Infinity
function epreuveNumericKey(e) {
  const s = (e || "").toLowerCase();
  // Distances piste/route en km : "10 km route" -> 10000, "1/2 marathon" -> 21097
  let m = s.match(/^([\d\s]+)\s*km/);
  if (m) return parseFloat(m[1].replace(/\s/g,'')) * 1000;
  if (/marathon/.test(s) && !/1\/2/.test(s)) return 42195;
  if (/1\/2\s*marathon/.test(s)) return 21097;
  if (/ekiden/.test(s)) return 42195;
  if (/24\s*heure/.test(s)) return 86400;
  if (/1\s*heure/.test(s)) return 3600;
  // Distance en metres : "100m", "1 000m", "50m haies"
  m = s.match(/^(\d[\d\s]*)\s*m\b/);
  if (m) return parseFloat(m[1].replace(/\s/g,''));
  // Relais : "4 x 100m" -> 400
  m = s.match(/^4\s*[xX]\s*([\d\s]+)\s*m/);
  if (m) return parseFloat(m[1].replace(/\s/g,'')) * 4;
  // Lancers/Haies avec poids en kg : "Poids (3 kg)" -> 3, "Disque (1.2 kg)" -> 1.2
  m = s.match(/\((\d+[\.,]?\d*)\s*kg\)/);
  if (m) return parseFloat(m[1].replace(',','.'));
  // Lancers avec poids en g : "Javelot (500 g)" -> 0.5
  m = s.match(/\((\d+)\s*g\)/);
  if (m) return parseFloat(m[1]) / 1000;
  // Hauteur haies en cm : "50m Haies (84)" -> 0.84 comme suffixe
  m = s.match(/\((\d+)\)/);
  if (m) return parseFloat(m[1]);
  // Sauts/épreuves combinées/marche sans valeur numérique -> fin de liste alphabétique
  return Infinity;
}

function sortEpreuves(epreuves) {
  return [...new Set(epreuves)].sort((a, b) => {
    const ka = epreuveNumericKey(a);
    const kb = epreuveNumericKey(b);
    if (ka !== kb) return ka - kb;
    return a.localeCompare(b, 'fr');
  });
}

function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else e.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return e;
}

function placePillClass(place) {
  const p = parseInt(place, 10);
  if (p === 1) return "place-pill p1";
  if (p === 2) return "place-pill p2";
  if (p === 3) return "place-pill p3";
  return "place-pill";
}

/* ===========================================================
   NAVIGATION
   =========================================================== */
function setupNav() {
  // Sélecteurs unifiés : sidebar desktop + bottom nav mobile
  const allNavBtns = () => document.querySelectorAll(".nav-btn, .mobile-nav-btn");

  allNavBtns().forEach(btn => {
    btn.addEventListener("click", () => {
      allNavBtns().forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
      // Activer tous les boutons du même data-page (sidebar + mobile nav)
      document.querySelectorAll(`[data-page="${btn.dataset.page}"]`).forEach(b => b.classList.add("active"));
      document.getElementById("page-" + btn.dataset.page).classList.add("active");
      if (btn.dataset.page === "dashboard") renderDashboard();
      if (btn.dataset.page === "explorer") renderExplorer();
      if (btn.dataset.page === "athletes") renderAthletesList();
      if (btn.dataset.page === "settings") renderSettings();
      // Sur mobile, remonter en haut de page à chaque changement d'écran
      window.scrollTo(0, 0);
    });
  });
}

function updateSidebarCount() {
  // Mettre à jour tous les compteurs (sidebar desktop + header mobile)
  document.querySelectorAll("#sb-count, #sb-count-mobile").forEach(el => {
    el.textContent = DB.length;
  });
}

/* ===========================================================
   DASHBOARD
   =========================================================== */
let chartGroupes, chartPodiums, chartTopAthletes;

function getDashYear() {
  const sel = document.getElementById("dashYear");
  return sel.value;
}

function populateDashYearSelect() {
  const sel = document.getElementById("dashYear");
  const years = uniqueSorted(DB.map(r => r.annee)).reverse();
  sel.innerHTML = '<option value="__all__">Toutes les années</option>' +
    years.map(y => `<option value="${y}">${y}</option>`).join("");
}

function renderDashboard() {
  populateDashYearSelect();
  const year = getDashYear();
  const rows = year === "__all__" ? DB : DB.filter(r => String(r.annee) === String(year));

  // KPI
  const nbResultats = rows.length;
  const nbAthletes = new Set(rows.map(r => normStr(r.nom)).filter(n => n)).size;
  const nbEpreuves = new Set(rows.map(r => r.epreuve)).size;
  const nbPodiums = rows.filter(r => ["1","2","3"].includes(String(r.place))).length;

  const kpiRow = document.getElementById("kpiRow");
  kpiRow.innerHTML = "";
  const kpis = [
    ["Résultats enregistrés", nbResultats, "Toutes disciplines confondues"],
    ["Athlètes actifs", nbAthletes, "Ayant au moins 1 résultat"],
    ["Épreuves différentes", nbEpreuves, "Couvertes sur la période"],
    ["Places de podium", nbPodiums, "1ère, 2e ou 3e place au sein du club"]
  ];
  kpis.forEach(([label, value, foot]) => {
    kpiRow.appendChild(el("div", { class: "kpi-card" }, [
      el("div", { class: "kpi-label" }, label),
      el("div", { class: "kpi-value" }, String(value)),
      el("div", { class: "kpi-foot" }, foot)
    ]));
  });

  // Chart 1 : resultats par groupe (discipline)
  const byGroupe = {};
  rows.forEach(r => { byGroupe[r.groupe] = (byGroupe[r.groupe] || 0) + 1; });
  const groupeLabels = Object.keys(byGroupe).sort((a,b)=>byGroupe[b]-byGroupe[a]);
  const groupeValues = groupeLabels.map(g => byGroupe[g]);

  if (chartGroupes) chartGroupes.destroy();
  chartGroupes = new Chart(document.getElementById("chartGroupes"), {
    type: "bar",
    data: {
      labels: groupeLabels,
      datasets: [{
        data: groupeValues,
        backgroundColor: "#E8411A",
        borderRadius: 4,
        barThickness: 22
      }]
    },
    options: chartBaseOptions({ horizontal: true })
  });

  // Chart 2 : repartition par categorie d'age, en nombre d'athletes distincts
  // (et non en nombre de resultats : un athlete avec 16 resultats ne doit compter
  // qu'une seule fois dans sa categorie, pour refleter l'effectif reel du club).
  const CATEGORIE_ORDER = ["Benjamin", "Minime", "Cadet", "Junior", "Espoir", "Senior", "Master (Vétéran)", "Non déterminée"];
  const CATEGORIE_COLORS = {
    "Benjamin": "#7FB3D5", "Minime": "#5499C7", "Cadet": "#2E86C1",
    "Junior": "#E8411A", "Espoir": "#C9390F", "Senior": "#0D5E8E",
    "Master (Vétéran)": "#D4AF37", "Non déterminée": "#C3D3D8"
  };
  const athleteCategorie = {};
  rows.forEach(r => {
    const n = (r.nom || "").trim();
    if (!n) return; // resultats sans athlete nomme (relais) : exclus du comptage par athlete
    const key = normStr(n);
    if (!athleteCategorie[key]) athleteCategorie[key] = r.categorie || "Non déterminée";
  });
  const byCategorie = {};
  Object.values(athleteCategorie).forEach(c => { byCategorie[c] = (byCategorie[c] || 0) + 1; });
  const categorieLabels = CATEGORIE_ORDER.filter(c => byCategorie[c]);
  const categorieValues = categorieLabels.map(c => byCategorie[c]);
  const categorieColors = categorieLabels.map(c => CATEGORIE_COLORS[c] || "#C3D3D8");

  if (chartPodiums) chartPodiums.destroy();
  chartPodiums = new Chart(document.getElementById("chartPodiums"), {
    type: "doughnut",
    data: {
      labels: categorieLabels,
      datasets: [{
        data: categorieValues,
        backgroundColor: categorieColors,
        borderColor: "#FFFFFF",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: "#16242C", font: { family: "Inter", size: 11 }, padding: 14 } }
      }
    }
  });

  // Chart 3 : top athletes par nombre de participations (une ligne = une participation)
  const byAthlete = {};
  rows.forEach(r => {
    const n = r.nom && r.nom.trim();
    if (!n) return;
    byAthlete[n] = (byAthlete[n] || 0) + 1;
  });
  const topAthletes = Object.entries(byAthlete).sort((a,b) => b[1]-a[1]).slice(0, 15);

  if (chartTopAthletes) chartTopAthletes.destroy();
  chartTopAthletes = new Chart(document.getElementById("chartTopAthletes"), {
    type: "bar",
    data: {
      labels: topAthletes.map(a => a[0]),
      datasets: [{
        data: topAthletes.map(a => a[1]),
        backgroundColor: "#E8411A",
        borderRadius: 4,
        barThickness: 16
      }]
    },
    options: chartBaseOptions({ horizontal: true })
  });

  updateSidebarCount();
}

function chartBaseOptions({ horizontal = false } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#5C7782", font: { family: "Inter", size: 11 } },
        grid: { color: "rgba(13,94,142,0.08)" }
      },
      y: {
        ticks: { color: "#5C7782", font: { family: "Inter", size: 11 } },
        grid: { color: "rgba(13,94,142,0.08)" }
      }
    }
  };
}

document.addEventListener("change", (e) => {
  if (e.target.id === "dashYear") renderDashboard();
});

document.getElementById("exportDashPdf").addEventListener("click", () => exportDashboardPdf());

/* ===========================================================
   EXPLORER — filtres, tri, table
   =========================================================== */
let explorerSort = { key: "annee", dir: "desc" };
let explorerFilters = { annee: [], sexe: [], groupe: [], epreuve: [], categorie: [], nom: "", podium: "" };

function populateExplorerFilters() {
  setMultiOptions("f-annee", uniqueSorted(DB.map(r => r.annee)).reverse());
  setMultiOptions("f-sexe", uniqueSorted(DB.map(r => r.sexe)));
  setMultiOptions("f-groupe", uniqueSorted(DB.map(r => r.groupe)));
  setMultiOptions("f-categorie", uniqueSorted(DB.map(r => r.categorie || "Non déterminée")));
  refreshEpreuveOptions();
}

function setMultiOptions(id, values) {
  const sel = document.getElementById(id);
  const previouslySelected = new Set(Array.from(sel.selectedOptions || []).map(o => o.value));
  sel.innerHTML = values.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
  Array.from(sel.options).forEach(o => { if (previouslySelected.has(o.value)) o.selected = true; });
}

function refreshEpreuveOptions() {
  const groupeSel = document.getElementById("f-groupe");
  const selectedGroupes = Array.from(groupeSel.selectedOptions).map(o => o.value);
  const pool = selectedGroupes.length ? DB.filter(r => selectedGroupes.includes(r.groupe)) : DB;
  setMultiOptions("f-epreuve", sortEpreuves(pool.map(r => r.epreuve)));
}

function escapeHtml(s) {
  return (s == null ? "" : s.toString()).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

function readExplorerFilters() {
  explorerFilters.annee = Array.from(document.getElementById("f-annee").selectedOptions).map(o => o.value);
  explorerFilters.sexe = Array.from(document.getElementById("f-sexe").selectedOptions).map(o => o.value);
  explorerFilters.groupe = Array.from(document.getElementById("f-groupe").selectedOptions).map(o => o.value);
  explorerFilters.epreuve = Array.from(document.getElementById("f-epreuve").selectedOptions).map(o => o.value);
  explorerFilters.categorie = Array.from(document.getElementById("f-categorie").selectedOptions).map(o => o.value);
  explorerFilters.nom = document.getElementById("f-nom").value.trim();
  explorerFilters.podium = document.getElementById("f-podium").value;
}

function applyExplorerFilters() {
  let rows = DB;
  const f = explorerFilters;
  if (f.annee.length) rows = rows.filter(r => f.annee.includes(String(r.annee)));
  if (f.sexe.length) rows = rows.filter(r => f.sexe.includes(String(r.sexe)));
  if (f.groupe.length) rows = rows.filter(r => f.groupe.includes(r.groupe));
  if (f.epreuve.length) rows = rows.filter(r => f.epreuve.includes(r.epreuve));
  if (f.categorie.length) rows = rows.filter(r => f.categorie.includes(r.categorie || "Non déterminée"));
  if (f.nom) {
    const q = normStr(f.nom);
    rows = rows.filter(r => normStr(r.nom).includes(q));
  }
  if (f.podium === "1") rows = rows.filter(r => String(r.place) === "1");
  if (f.podium === "podium") rows = rows.filter(r => ["1","2","3"].includes(String(r.place)));
  return rows;
}

function hasActiveExplorerFilters() {
  const f = explorerFilters;
  return f.annee.length > 0 || f.sexe.length > 0 || f.groupe.length > 0 ||
         f.epreuve.length > 0 || f.categorie.length > 0 || !!f.nom || !!f.podium;
}

// Quand au moins un filtre est actif, la place affichée ne doit plus être celle
// d'origine (calculée par athle.fr sur l'ensemble du club, toutes catégories/années
// confondues) mais reflèter le classement réel au sein du sous-ensemble filtré,
// épreuve par épreuve (mélanger des épreuves différentes dans un même classement
// n'aurait pas de sens). Le classement se fait sur la performance réelle, pas sur
// la place d'origine ni sur l'ordre d'affichage du tableau.
function withRecomputedPlaces(rows) {
  if (!hasActiveExplorerFilters()) return rows.map(r => ({ ...r, _displayPlace: r.place, _placeRecomputed: false, _isRecord: false }));

  const sexeActif = explorerFilters.sexe.length > 0;
  const categorieActif = explorerFilters.categorie.length > 0;

  const byEpreuveKey = {};
  rows.forEach(r => {
    const parts = [normEpreuve(r.epreuve)];
    if (sexeActif) parts.push(normStr(r.sexe));
    if (categorieActif) parts.push(normStr(r.categorie || "Non determinee"));
    const key = parts.join("|");
    if (!byEpreuveKey[key]) byEpreuveKey[key] = [];
    byEpreuveKey[key].push(r);
  });

  const withPlace = [];
  Object.values(byEpreuveKey).forEach(group => {
    const ranked = [...group].sort((a, b) => {
      const pa = parsePerformance(a.performance, a.epreuve);
      const pb = parsePerformance(b.performance, b.epreuve);
      if (pa && pb) {
        const better = pa.higherIsBetter ? (pb.value - pa.value) : (pa.value - pb.value);
        if (better !== 0) return better;
        return 0;
      }
      if (pa && !pb) return -1;
      if (!pa && pb) return 1;
      return 0;
    });

    // Ne garder que la MEILLEURE performance de chaque athlete dans le classement.
    const bestByAthlete = new Map();
    ranked.forEach(r => {
      const key = normStr(r.nom);
      if (!key) return;
      const p = parsePerformance(r.performance, r.epreuve);
      if (!bestByAthlete.has(key)) {
        bestByAthlete.set(key, { r, p });
      } else {
        const ex = bestByAthlete.get(key);
        if (p && ex.p) {
          const isBetter = p.higherIsBetter ? p.value > ex.p.value : p.value < ex.p.value;
          if (isBetter) bestByAthlete.set(key, { r, p });
        }
      }
    });
    const bestIds = new Set([...bestByAthlete.values()].map(({ r }) => r.id));

    let rank = 0;
    let lastValue = null;
    ranked.forEach(r => {
      const p = parsePerformance(r.performance, r.epreuve);
      if (!bestIds.has(r.id)) {
        r._displayPlace = "·";
        r._placeRecomputed = true;
        r._isRecord = false;
      } else if (!p) {
        r._displayPlace = "-";
        r._placeRecomputed = true;
        r._isRecord = false;
      } else {
        if (lastValue === null || p.value !== lastValue) { rank++; lastValue = p.value; }
        r._displayPlace = String(rank);
        r._placeRecomputed = true;
        r._isRecord = false;
      }
      withPlace.push(r);
    });
  });

  const byId = new Map(withPlace.map(r => [r.id, r]));
  return rows.map(r => byId.get(r.id) || { ...r, _displayPlace: r.place, _placeRecomputed: false, _isRecord: false });
}

function computeClubRecords() {
  const records = new Map();
  DB.forEach(r => {
    const p = parsePerformance(r.performance, r.epreuve);
    if (!p) return;
    const key = normEpreuve(r.epreuve) + "|" + normStr(r.categorie || "Non determinee");
    if (!records.has(key)) {
      records.set(key, { value: p.value, higherIsBetter: p.higherIsBetter, ids: new Set([r.id]) });
    } else {
      const cur = records.get(key);
      const isBetter = p.higherIsBetter ? p.value > cur.value : p.value < cur.value;
      if (isBetter) { records.set(key, { value: p.value, higherIsBetter: p.higherIsBetter, ids: new Set([r.id]) }); }
      else if (p.value === cur.value) { cur.ids.add(r.id); }
    }
  });
  return records;
}

function sortRows(rows) {
  const { key, dir } = explorerSort;
  const sorted = [...rows].sort((a, b) => {
    let va = a[key], vb = b[key];
    if (key === "place") {
      va = parseInt(a._displayPlace != null ? a._displayPlace : a.place) || 9999;
      vb = parseInt(b._displayPlace != null ? b._displayPlace : b.place) || 9999;
    }
    if (key === "annee") { va = parseInt(va) || 0; vb = parseInt(vb) || 0; }
    if (key === "performance") {
      const pa = parsePerformance(a.performance, a.epreuve);
      const pb = parsePerformance(b.performance, b.epreuve);
      // Les deux valeurs sont comparables seulement si elles partagent la même unité
      // (temps vs distance vs points) ; sinon on retombe sur l'ordre alphabétique brut.
      if (pa && pb && pa.unit === pb.unit) {
        va = pa.value; vb = pb.value;
      } else if (pa && !pb) {
        return dir === "asc" ? -1 : 1;
      } else if (!pa && pb) {
        return dir === "asc" ? 1 : -1;
      }
    }
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    if (va < vb) return dir === "asc" ? -1 : 1;
    if (va > vb) return dir === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}

function renderActiveChips() {
  const wrap = document.getElementById("activeChips");
  wrap.innerHTML = "";
  const f = explorerFilters;
  const addChip = (label, onRemove) => {
    const chip = el("div", { class: "chip" }, [label, el("button", {}, "×")]);
    chip.querySelector("button").addEventListener("click", onRemove);
    wrap.appendChild(chip);
  };
  f.annee.forEach(v => addChip("Année: " + v, () => toggleMultiValue("f-annee", v)));
  f.sexe.forEach(v => addChip("Sexe: " + v, () => toggleMultiValue("f-sexe", v)));
  f.groupe.forEach(v => addChip("Discipline: " + v, () => toggleMultiValue("f-groupe", v)));
  f.epreuve.forEach(v => addChip("Épreuve: " + v, () => toggleMultiValue("f-epreuve", v)));
  f.categorie.forEach(v => addChip("Catégorie: " + v, () => toggleMultiValue("f-categorie", v)));
  if (f.nom) addChip("Nom: " + f.nom, () => { document.getElementById("f-nom").value = ""; onExplorerFilterChange(); });
  if (f.podium) addChip(f.podium === "1" ? "1ère place" : "Top 3", () => { document.getElementById("f-podium").value = ""; onExplorerFilterChange(); });
}

function toggleMultiValue(selectId, value) {
  const sel = document.getElementById(selectId);
  Array.from(sel.options).forEach(o => { if (o.value === value) o.selected = false; });
  onExplorerFilterChange();
}

function onExplorerFilterChange() {
  if (document.getElementById("f-groupe")) refreshEpreuveOptions();
  readExplorerFilters();
  renderActiveChips();
  renderExplorerTable();
  updatePlaceRecomputedNote();
}

function renderExplorer() {
  populateExplorerFilters();
  readExplorerFilters();
  renderActiveChips();
  renderExplorerTable();
  updatePlaceRecomputedNote();
}

function updatePlaceRecomputedNote() {
  const note = document.getElementById("placeRecomputedNote");
  if (note) note.style.display = hasActiveExplorerFilters() ? "block" : "none";
}

function renderExplorerTable() {
  const rows = sortRows(withRecomputedPlaces(applyExplorerFilters()));
  document.getElementById("explorerCount").textContent = rows.length;
  const tbody = document.getElementById("explorerBody");
  tbody.innerHTML = "";

  if (!rows.length) {
    const tr = el("tr", {}, el("td", { colspan: "8" }, el("div", { class: "empty-state" }, "Aucun résultat ne correspond à ces filtres")));
    tbody.appendChild(tr);
    return;
  }

  // Calcul des records du club sur l'ensemble de la base (toutes années/sexe/catégories)
  const clubRecords = computeClubRecords();

  const frag = document.createDocumentFragment();
  rows.forEach(r => {
    const displayPlace = r._displayPlace != null ? r._displayPlace : r.place;
    const recordKey = normEpreuve(r.epreuve) + "|" + normStr(r.categorie || "Non determinee");
    const rec = clubRecords.get(recordKey);
    const isRecord = rec && rec.ids.has(r.id);

    const trStyle = isRecord ? "background:linear-gradient(90deg,#FFFAE8 0%,#FFF3CC 60%,#FFFAE8 100%);" : "";
    const tr = el("tr", { style: trStyle }, [
      el("td", {}, String(r.annee)),
      el("td", {}, el("span", { class: "tag-pill" }, r.sexe)),
      el("td", {}, r.groupe),
      el("td", {}, r.epreuve),
      el("td", {}, r.categorie || "Non déterminée"),
      el("td", {}, el("span", { class: placePillClass(displayPlace) }, String(displayPlace))),
      el("td", { class: "perf-cell" + (isRecord ? " perf-record" : "") },
        isRecord ? "🏆 " + r.performance : r.performance
      ),
      el("td", {}, r.nom)
    ]);
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
}

["f-annee","f-sexe","f-groupe","f-epreuve","f-categorie","f-podium"].forEach(id => {
  document.addEventListener("change", (e) => { if (e.target.id === id) onExplorerFilterChange(); });
});
document.getElementById("f-nom").addEventListener("input", () => onExplorerFilterChange());

document.getElementById("resetFilters").addEventListener("click", () => {
  ["f-annee","f-sexe","f-groupe","f-epreuve","f-categorie"].forEach(id => {
    Array.from(document.getElementById(id).options).forEach(o => o.selected = false);
  });
  document.getElementById("f-nom").value = "";
  document.getElementById("f-podium").value = "";
  onExplorerFilterChange();
});

document.querySelectorAll("#explorerTable thead th").forEach(th => {
  th.addEventListener("click", () => {
    const key = th.dataset.key;
    if (explorerSort.key === key) {
      explorerSort.dir = explorerSort.dir === "asc" ? "desc" : "asc";
    } else {
      explorerSort = { key, dir: "asc" };
    }
    document.querySelectorAll("#explorerTable thead th .arrow").forEach(a => a.textContent = "▾");
    th.querySelector(".arrow").textContent = explorerSort.dir === "asc" ? "▴" : "▾";
    renderExplorerTable();
  });
});

/* ===========================================================
   FICHES ATHLETES
   =========================================================== */
let selectedAthlete = null;
let chartAthlete = null;

function getAthletesAggregated() {
  const map = {};
  DB.forEach(r => {
    const n = (r.nom || "").trim();
    if (!n) return;
    if (!map[n]) map[n] = [];
    map[n].push(r);
  });
  return map;
}

function renderAthletesList(filterText = "") {
  const map = getAthletesAggregated();
  const names = Object.keys(map).sort((a,b) => a.localeCompare(b, 'fr'));
  const q = normStr(filterText);
  const filtered = q ? names.filter(n => normStr(n).includes(q)) : names;

  const tbody = document.getElementById("athleteList");
  tbody.innerHTML = "";
  filtered.forEach(name => {
    const tr = el("tr", { style: "cursor:pointer;" }, [
      el("td", {}, name),
      el("td", {}, String(map[name].length))
    ]);
    tr.addEventListener("click", () => selectAthlete(name));
    if (selectedAthlete === name) tr.style.background = "rgba(244,163,0,0.10)";
    tbody.appendChild(tr);
  });

  if (!filtered.length) {
    tbody.appendChild(el("tr", {}, el("td", { colspan: "2" }, el("div", { class: "empty-state" }, "Aucun athlète trouvé"))));
  }
}

document.getElementById("athleteSearch").addEventListener("input", (e) => renderAthletesList(e.target.value));

function selectAthlete(name) {
  selectedAthlete = name;
  renderAthletesList(document.getElementById("athleteSearch").value);

  const map = getAthletesAggregated();
  const rows = (map[name] || []).slice().sort((a,b) => (b.annee - a.annee) || a.epreuve.localeCompare(b.epreuve, 'fr'));

  document.getElementById("athleteCardTitle").textContent = name;
  const body = document.getElementById("athleteCardBody");

  const years = uniqueSorted(rows.map(r => r.annee));
  const groupes = uniqueSorted(rows.map(r => r.groupe));
  const podiums = rows.filter(r => ["1","2","3"].includes(String(r.place))).length;

  body.innerHTML = "";
  const statGrid = el("div", { style: "display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:14px;" }, [
    statBox(rows.length, "Résultats"),
    statBox(podiums, "Podiums"),
    statBox(groupes.length, "Disciplines")
  ]);
  body.appendChild(statGrid);
  body.appendChild(el("div", { class: "legend-note" }, "Actif sur : " + years.join(", ")));

  document.getElementById("athleteChartPanel").style.display = "block";
  document.getElementById("athleteTablePanel").style.display = "block";

  // Chart: meilleure performance par discipline (nombre de resultats par discipline ici, simple et clair)
  const byGroupe = {};
  rows.forEach(r => { byGroupe[r.groupe] = (byGroupe[r.groupe] || 0) + 1; });
  const labels = Object.keys(byGroupe);
  const values = labels.map(g => byGroupe[g]);

  if (chartAthlete) chartAthlete.destroy();
  // Le panel vient de passer de display:none à display:block : on attend le prochain
  // frame pour que le canvas ait ses dimensions definitives avant que Chart.js les lise,
  // sinon le graphique peut se dessiner avec une hauteur nulle.
  requestAnimationFrame(() => {
    chartAthlete = new Chart(document.getElementById("chartAthlete"), {
      type: "bar",
      data: { labels, datasets: [{ data: values, backgroundColor: "#E8411A", borderRadius: 4, barThickness: 26 }] },
      options: chartBaseOptions({ horizontal: false })
    });
  });

  // Table detail
  const tbody = document.getElementById("athleteTableBody");
  tbody.innerHTML = "";
  rows.forEach(r => {
    tbody.appendChild(el("tr", {}, [
      el("td", {}, String(r.annee)),
      el("td", {}, r.groupe),
      el("td", {}, r.epreuve),
      el("td", {}, r.categorie || "Non déterminée"),
      el("td", {}, el("span", { class: placePillClass(r.place) }, String(r.place))),
      el("td", { class: "perf-cell" }, r.performance)
    ]));
  });
}

function statBox(value, label) {
  return el("div", { style: "background:#F4F8FA; border:1px solid var(--line); border-radius:8px; padding:10px 12px; text-align:center;" }, [
    el("div", { style: "font-family:var(--font-mono); font-size:20px; font-weight:700; color:var(--navy);" }, String(value)),
    el("div", { style: "font-size:10.5px; color:var(--grey); text-transform:uppercase; letter-spacing:0.4px; margin-top:2px;" }, label)
  ]);
}

document.getElementById("exportAthletePdf").addEventListener("click", () => {
  if (!selectedAthlete) { toast("Sélectionnez d'abord un athlète", "error"); return; }
  exportAthletePdf(selectedAthlete);
});

/* ===========================================================
   IMPORT — détection du format, parsing, dédoublonnage
   =========================================================== */

// Devine le groupe (famille de discipline) a partir du nom d'epreuve, comme pour la base initiale
function guessGroupe(epreuve) {
  const e = epreuve.toLowerCase();
  if (/marche/.test(e)) return "Marche";
  if (/^4 ?x|relais/.test(e)) return "Relais";
  if (/pts|thlon|heptathlon|decathlon|triathlon|tetra|penta|octathlon/.test(e)) return "Epreuves combinees";
  if (/haies|steeple/.test(e)) return "Haies / Steeple";
  if (/hauteur|perche|longueur|triple saut/.test(e)) return "Sauts";
  if (/poids|disque|marteau|javelot/.test(e)) return "Lancers";
  if (/^(50m|60m|80m|100m|120m|150m|200m|300m|400m)\b/.test(e)) return "Sprint";
  if (/^(50m|60m)\b/.test(e)) return "Sprint";
  if (/800m|1 ?000m|1 ?500m|2 ?000m|3 ?000m|5 ?km|10 ?000m|10 ?km|20 ?km|marathon|heure|ekiden/.test(e)) return "Demi-fond / Fond";
  return "Autre";
}

/* ---------- Catégorie d'âge : "Non déterminée" par défaut ----------
   IMPORTANT : on a constaté que le poids d'un engin ou la hauteur d'une haie NE PERMET PAS
   de déduire la catégorie d'âge de façon fiable. Les vétérans (Masters) peuvent concourir
   avec des engins allégés identiques à ceux des jeunes (ex: Disque 1.0kg peut être lancé
   par un Benjamin OU par un Master/Vétéran selon sa tranche d'âge) : voir réglementation FFA
   sur les épreuves aménagées par tranche d'âge. Une déduction par épreuve serait donc
   structurellement risquée et a déjà produit un classement erroné (Benjamin au lieu de
   Vétéran). La seule source fiable est la catégorie officielle fournie par athle.fr
   (visible dans l'export HTML complet de la page, colonne "Infos" du type "MAM/62").
   Cette fonction ne devine donc plus rien : elle retourne "Non déterminée" sauf si
   l'information a été fournie explicitement par la source d'import (colonne categorie). */
function guessCategorie(epreuve) {
  return "Non déterminée";
}

/* ---------- Parsing du texte brut "colle" au format bilans athle.fr ---------- */
// Format attendu (repete) :
// 2026 | 100m | M | Vent : VR
// Place Performance Nom
// 1   11''18 (+0.2)   VALERY Alexandre
function parsePastedText(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length);
  const results = [];
  const errors = [];
  let currentEpreuve = null, currentAnnee = null, currentSexe = null;

  const headerRe = /^(\d{4})\s*\|\s*([^\|]+?)\s*\|\s*([MF])(\s*\|.*)?$/i;

  for (const line of lines) {
    const hMatch = line.match(headerRe);
    if (hMatch) {
      currentAnnee = parseInt(hMatch[1], 10);
      currentEpreuve = hMatch[2].trim();
      currentSexe = hMatch[3].toUpperCase();
      continue;
    }
    if (/^place\s+performance\s+nom/i.test(line)) continue;
    if (/résultats?$/i.test(line) || /FFA.*Cache|n.autorise pas/i.test(line)) continue;
    if (!currentEpreuve) continue;

    // ligne typique : "1   11''18 (+0.2)   VALERY Alexandre" ou "-   8''14 (-1.5) (RP)   BOUDJEMAI Adem"
    const rowMatch = line.match(/^(\d+|-)\s+(.+?)\s{1,}([A-ZÀ-Ý][A-ZÀ-Ýa-zà-ÿ'\-]*(?:\s+[A-ZÀ-Ýa-zà-ÿ'\-\.]+)*)\s*$/);
    if (rowMatch) {
      const place = rowMatch[1];
      // Separer performance du nom : la performance se termine typiquement par des parentheses ou des chiffres,
      // le nom commence par une suite de mots. On utilise une regex plus precise :
      const full = line.replace(/^(\d+|-)\s+/, "");
      const perfNameMatch = full.match(/^([\d\s'":h''m\.\,\-\+\(\)kKgmM]+(?:\([^)]*\)\s*)*)\s+([A-ZÀ-Ý].*)$/);
      let perf, nom;
      if (perfNameMatch) {
        perf = perfNameMatch[1].trim();
        nom = perfNameMatch[2].trim();
      } else {
        perf = rowMatch[2].trim();
        nom = rowMatch[3].trim();
      }
      results.push({
        annee: currentAnnee,
        sexe: currentSexe,
        club: "077108",
        groupe: guessGroupe(currentEpreuve),
        epreuve: currentEpreuve,
        place: place,
        performance: perf,
        nom: nom
      });
    } else {
      errors.push(line);
    }
  }
  return { results, errors };
}

/* ---------- Parsing PDF (extraction texte puis meme logique que paste) ---------- */
async function parsePdfFile(file) {
  toast("Lecture du PDF en cours...", "");
  try {
    const arrayBuffer = await file.arrayBuffer();
    const text = await extractPdfText(arrayBuffer);
    return parsePastedText(text);
  } catch (e) {
    console.error(e);
    return { results: [], errors: [
      "Lecture du PDF impossible dans ce mode d'ouverture du fichier (restriction de sécurité du navigateur en ouverture directe). " +
      "Solution simple : ouvrez le PDF, sélectionnez tout le texte de la page de résultats (Ctrl+A puis Ctrl+C), " +
      "et collez-le dans la zone de texte à droite, puis cliquez sur \"Analyser ce texte\"."
    ] };
  }
}

// Mini extracteur de texte PDF (suffisant pour des PDF texte simples, sans dependances).
async function extractPdfText(arrayBuffer) {
  if (!window.pdfjsLib) {
    await loadPdfJs();
  }
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let lastY = null;
    let line = "";
    content.items.forEach(item => {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
        fullText += line + "\n";
        line = "";
      }
      line += item.str + " ";
      lastY = item.transform[5];
    });
    fullText += line + "\n";
  }
  return fullText;
}

function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(); return; }
    const timeout = setTimeout(() => reject(new Error("pdf.js n'a pas pu être chargé (module local manquant)")), 8000);
    window.addEventListener("pdfjs-ready", () => { clearTimeout(timeout); resolve(); }, { once: true });
  });
}

/* ---------- Parsing Excel / CSV ---------- */
/* ---------- Parsing HTML (page complete athle.fr, contient la vraie categorie FFA) ----------
   Ce format est plus riche que le PDF imprime : en plus de Place/Performance/Nom, chaque ligne
   contient le club, la ligue, le departement et la categorie officielle + annee de naissance
   (ex: "MIM/11" = Minime, ne en 2011 ; "MAM/62" = Master/Veteran, ne en 1962). C'est la seule
   source fiable de categorie : on ne la devine jamais a partir du poids d'un engin ou d'une
   hauteur de haies (voir guessCategorie). */
const CAT_LABELS_FFA = {
  BBM: "Baby Athlé", BBF: "Baby Athlé", EAM: "École d'Athlétisme", EAF: "École d'Athlétisme",
  POM: "Poussin", POF: "Poussine", BEM: "Benjamin", BEF: "Benjamine",
  MIM: "Minime", MIF: "Minime", CAM: "Cadet", CAF: "Cadette",
  JUM: "Junior", JUF: "Junior", ESM: "Espoir", ESF: "Espoir",
  SEM: "Senior", SEF: "Senior", MAM: "Master (Vétéran)", MAF: "Master (Vétéran)"
};

function decodeCategorieFFA(code) {
  if (!code) return "Non déterminée";
  const prefix = code.split("/")[0].trim().toUpperCase();
  return CAT_LABELS_FFA[prefix] || (prefix ? prefix : "Non déterminée");
}

function parseHtmlFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(e.target.result, "text/html");
        const table = doc.querySelector("table");
        if (!table) {
          resolve({ results: [], errors: ["Aucun tableau de résultats trouvé dans ce fichier HTML."] });
          return;
        }
        const rows = Array.from(table.querySelectorAll("tr"));
        const headerRe = /^(\d{4})\s*\|\s*(.+?)\s*\|\s*([MF])\s*(?:\|.*)?$/i;
        const placeRe = /^(\d+|-)$/;

        let currentEpreuve = null, currentAnnee = null, currentSexe = null;
        const results = [];

        rows.forEach(r => {
          const headerDiv = r.querySelector("div.headers");
          if (headerDiv) {
            const m = headerDiv.textContent.trim().match(headerRe);
            if (m) {
              currentAnnee = parseInt(m[1], 10);
              currentEpreuve = m[2].trim();
              currentSexe = m[3].toUpperCase();
            }
            return;
          }
          const tds = Array.from(r.querySelectorAll("td"));
          if (tds.length >= 7 && currentEpreuve) {
            const cells = tds.map(td => td.textContent.trim());
            if (placeRe.test(cells[0])) {
              results.push({
                annee: currentAnnee,
                sexe: currentSexe,
                club: "077108",
                groupe: guessGroupe(currentEpreuve),
                epreuve: currentEpreuve,
                place: cells[0],
                performance: cells[1],
                nom: cells[2],
                categorie: decodeCategorieFFA(cells[6] || "")
              });
            }
          }
        });

        if (!results.length) {
          resolve({ results: [], errors: ["Aucune ligne de résultat reconnue dans ce fichier HTML."] });
          return;
        }
        resolve({ results, errors: [] });
      } catch (err) {
        resolve({ results: [], errors: ["Fichier HTML illisible : " + err.message] });
      }
    };
    reader.readAsText(file, "utf-8");
  });
}

function parseSpreadsheetFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        const results = [];
        const errors = [];
        json.forEach((row, idx) => {
          const norm = {};
          Object.keys(row).forEach(k => norm[k.toString().trim().toLowerCase()] = row[k]);
          const annee = parseInt(norm["annee"] || norm["année"] || norm["year"], 10);
          const sexe = (norm["sexe"] || "M").toString().trim().toUpperCase();
          const epreuve = (norm["epreuve"] || norm["épreuve"] || "").toString().trim();
          const place = (norm["place"] || "").toString().trim();
          const performance = (norm["performance"] || norm["perf"] || "").toString().trim();
          const nom = (norm["nom"] || norm["athlete"] || norm["athlète"] || "").toString().trim();
          const groupe = (norm["groupe"] || norm["discipline"] || guessGroupe(epreuve || "")).toString().trim();
          const categorie = (norm["categorie"] || norm["catégorie"] || guessCategorie(epreuve || "")).toString().trim();
          if (!epreuve || !nom || !performance || !annee) {
            errors.push(`Ligne ${idx + 2} : données manquantes`);
            return;
          }
          results.push({ annee, sexe, club: "077108", groupe, epreuve, place, performance, nom, categorie });
        });
        resolve({ results, errors });
      } catch (err) {
        resolve({ results: [], errors: ["Fichier illisible : " + err.message] });
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

/* ---------- Parsing JSON (export precedent de l'app) ---------- */
function parseJsonFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) {
          resolve({ results: [], errors: ["Le fichier JSON ne contient pas une liste de résultats."] });
          return;
        }
        const results = data.map(r => ({
          annee: parseInt(r.annee, 10),
          sexe: (r.sexe || "M").toUpperCase(),
          club: r.club || "077108",
          groupe: r.groupe || guessGroupe(r.epreuve || ""),
          epreuve: r.epreuve,
          place: String(r.place),
          performance: r.performance,
          nom: r.nom,
          categorie: r.categorie || guessCategorie(r.epreuve || "")
        })).filter(r => r.epreuve && r.nom && r.performance);
        resolve({ results, errors: [] });
      } catch (err) {
        resolve({ results: [], errors: ["JSON invalide : " + err.message] });
      }
    };
    reader.readAsText(file);
  });
}

/* ---------- Pipeline commun: analyse -> diff -> affichage ---------- */
function setStep(n) {
  for (let i = 1; i <= 3; i++) {
    const s = document.getElementById("step" + i);
    s.classList.remove("active", "done");
    if (i < n) s.classList.add("done");
    if (i === n) s.classList.add("active");
  }
}

function processParsedResults(results, errorsCount) {
  const existingKeys = buildExistingKeySet();
  const seenInBatch = new Set();
  const annotated = [];
  let newCount = 0, dupCount = 0;

  results.forEach(r => {
    ensureCategorie(r);
    const key = recordKey(r);
    let status;
    if (existingKeys.has(key) || seenInBatch.has(key)) {
      status = "dup";
      dupCount++;
    } else {
      status = "new";
      newCount++;
      seenInBatch.add(key);
    }
    annotated.push({ ...r, _status: status, _key: key });
  });

  pendingImport = annotated;
  renderDiffPanel(annotated, errorsCount || 0, newCount, dupCount);
  setStep(2);
}

function renderDiffPanel(annotated, errCount, newCount, dupCount) {
  document.getElementById("diffPanel").style.display = "block";
  document.getElementById("diffNew").textContent = newCount;
  document.getElementById("diffDup").textContent = dupCount;
  document.getElementById("diffErr").textContent = errCount;

  const tbody = document.getElementById("diffBody");
  tbody.innerHTML = "";
  annotated.forEach(r => {
    const statusBadge = r._status === "new"
      ? el("span", { class: "tag-pill", style: "background:rgba(54,194,129,0.18); color:#36c281;" }, "Nouveau")
      : el("span", { class: "tag-pill", style: "background:#EEF3F5; color:#5C7782;" }, "Déjà présent");
    tbody.appendChild(el("tr", {}, [
      el("td", {}, statusBadge),
      el("td", {}, String(r.annee)),
      el("td", {}, r.sexe),
      el("td", {}, r.groupe),
      el("td", {}, r.epreuve),
      el("td", {}, String(r.place)),
      el("td", { class: "perf-cell" }, r.performance),
      el("td", {}, r.nom)
    ]));
  });

  document.getElementById("confirmImport").disabled = newCount === 0;
}

document.getElementById("confirmImport").addEventListener("click", () => {
  const toAdd = pendingImport.filter(r => r._status === "new");
  if (!toAdd.length) { toast("Aucun nouveau résultat à ajouter", "error"); return; }
  toAdd.forEach(r => {
    DB.push({
      id: NEXT_ID++,
      annee: r.annee, sexe: r.sexe, club: r.club || "077108",
      groupe: r.groupe, epreuve: r.epreuve, place: String(r.place),
      performance: r.performance, nom: r.nom, categorie: r.categorie || guessCategorie(r.epreuve)
    });
  });
  saveToStorage();
  updateSidebarCount();
  toast(`${toAdd.length} nouveaux résultats ajoutés à la base`, "success");
  setStep(3);
  document.getElementById("diffPanel").style.display = "none";
  pendingImport = [];
  document.getElementById("pasteArea").value = "";
  setTimeout(() => setStep(1), 1200);
});

document.getElementById("cancelImport").addEventListener("click", () => {
  pendingImport = [];
  document.getElementById("diffPanel").style.display = "none";
  setStep(1);
});

/* ---------- Hooks UI: dropzone, file input, paste ---------- */
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("drag"); });
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag"));
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("drag");
  if (e.dataTransfer.files.length) handleImportFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener("change", (e) => {
  if (e.target.files.length) handleImportFile(e.target.files[0]);
});

async function handleImportFile(file) {
  setStep(1);
  const name = file.name.toLowerCase();
  let outcome;
  if (name.endsWith(".pdf")) {
    outcome = await parsePdfFile(file);
  } else if (name.endsWith(".html") || name.endsWith(".htm")) {
    outcome = await parseHtmlFile(file);
  } else if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    outcome = await parseSpreadsheetFile(file);
  } else if (name.endsWith(".json")) {
    outcome = await parseJsonFile(file);
  } else {
    toast("Format de fichier non reconnu", "error");
    return;
  }
  if (!outcome.results.length && outcome.errors.length) {
    // Echec total (typiquement PDF illisible en mode file://) : message clair et durable
    toast(outcome.errors[0], "error");
    const pasteLabel = document.querySelector('label[for="pasteArea"]') || document.getElementById("pasteArea").previousElementSibling;
    document.getElementById("pasteArea").focus();
    document.getElementById("pasteArea").style.borderColor = "#E8411A";
    return;
  }
  if (!outcome.results.length && !outcome.errors.length) {
    toast("Aucune donnée trouvée dans ce fichier", "error");
    return;
  }
  processParsedResults(outcome.results, outcome.errors.length);
  if (outcome.errors.length) {
    toast(`${outcome.errors.length} ligne(s) non reconnue(s)`, "error");
  }
}

document.getElementById("parsePasteBtn").addEventListener("click", () => {
  const text = document.getElementById("pasteArea").value;
  if (!text.trim()) { toast("Collez d'abord du texte à analyser", "error"); return; }
  const { results, errors } = parsePastedText(text);
  if (!results.length) { toast("Aucun résultat reconnu dans ce texte", "error"); return; }
  processParsedResults(results, errors.length);
  if (errors.length) toast(`${errors.length} ligne(s) non reconnue(s)`, "error");
});

/* ===========================================================
   EXPORTS — PDF et Excel
   =========================================================== */

function exportExplorerToExcel() {
  const rows = sortRows(withRecomputedPlaces(applyExplorerFilters()));
  if (!rows.length) { toast("Aucune donnée à exporter avec ces filtres", "error"); return; }
  const data = rows.map(r => ({
    Année: r.annee, Sexe: r.sexe, Discipline: r.groupe, Épreuve: r.epreuve,
    Catégorie: r.categorie || "Non déterminée",
    Place: r._displayPlace != null ? r._displayPlace : r.place, Performance: r.performance, Athlète: r.nom
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [{wch:8},{wch:6},{wch:20},{wch:28},{wch:16},{wch:8},{wch:18},{wch:28}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Résultats filtrés");
  XLSX.writeFile(wb, `BSGA_resultats_${dateStamp()}.xlsx`);
  toast("Export Excel généré", "success");
}

function exportExplorerToPdf() {
  const rows = sortRows(withRecomputedPlaces(applyExplorerFilters()));
  if (!rows.length) { toast("Aucune donnée à exporter avec ces filtres", "error"); return; }
  const doc = new jspdf.jsPDF({ orientation: "landscape" });
  pdfHeader(doc, "Explorer les résultats", `${rows.length} résultat(s) filtré(s)`);
  doc.autoTable({
    startY: 30,
    head: [["Année","Sexe","Discipline","Épreuve","Catégorie","Place","Performance","Athlète"]],
    body: rows.map(r => [r.annee, r.sexe, r.groupe, r.epreuve, r.categorie || "Non déterminée", r._displayPlace != null ? r._displayPlace : r.place, r.performance, r.nom]),
    styles: { fontSize: 8, font: "helvetica" },
    headStyles: { fillColor: [10,51,73], textColor: [232,65,26] },
    alternateRowStyles: { fillColor: [245,245,245] }
  });
  doc.save(`BSGA_resultats_${dateStamp()}.pdf`);
  toast("Export PDF généré", "success");
}

function exportAthletePdf(name) {
  const map = getAthletesAggregated();
  const rows = (map[name] || []).slice().sort((a,b) => (b.annee - a.annee) || a.epreuve.localeCompare(b.epreuve, 'fr'));
  const doc = new jspdf.jsPDF();
  pdfHeader(doc, name, `Fiche athlète — BSGA — ${rows.length} résultat(s)`);
  doc.autoTable({
    startY: 32,
    head: [["Année","Discipline","Épreuve","Catégorie","Place","Performance"]],
    body: rows.map(r => [r.annee, r.groupe, r.epreuve, r.categorie || "Non déterminée", r.place, r.performance]),
    styles: { fontSize: 9, font: "helvetica" },
    headStyles: { fillColor: [10,51,73], textColor: [232,65,26] },
    alternateRowStyles: { fillColor: [245,245,245] }
  });
  doc.save(`Fiche_${name.replace(/\s+/g,"_")}_${dateStamp()}.pdf`);
  toast("Fiche athlète exportée en PDF", "success");
}

function exportDashboardPdf() {
  const year = getDashYear();
  const rows = year === "__all__" ? DB : DB.filter(r => String(r.annee) === String(year));
  const doc = new jspdf.jsPDF();
  pdfHeader(doc, "Tableau de bord", `Saison ${year === "__all__" ? "toutes années" : year} — BSGA`);

  const nbResultats = rows.length;
  const nbAthletes = new Set(rows.map(r => normStr(r.nom)).filter(n=>n)).size;
  const nbEpreuves = new Set(rows.map(r => r.epreuve)).size;
  const nbPodiums = rows.filter(r => ["1","2","3"].includes(String(r.place))).length;

  doc.setFontSize(10);
  doc.setTextColor(40);
  let y = 34;
  [["Résultats enregistrés", nbResultats], ["Athlètes actifs", nbAthletes], ["Épreuves différentes", nbEpreuves], ["Places de podium", nbPodiums]]
    .forEach(([label, val]) => { doc.text(`${label} : ${val}`, 14, y); y += 7; });

  // Capture des graphiques (canvas -> image)
  y += 4;
  try {
    const img1 = document.getElementById("chartGroupes").toDataURL("image/png", 1.0);
    doc.text("Résultats par discipline", 14, y); y += 4;
    doc.addImage(img1, "PNG", 14, y, 180, 70);
    y += 78;
  } catch(e) {}

  doc.addPage();
  y = 20;
  try {
    const img2 = document.getElementById("chartPodiums").toDataURL("image/png", 1.0);
    doc.text("Répartition des athlètes par catégorie d'âge", 14, y); y += 4;
    doc.addImage(img2, "PNG", 14, y, 100, 80);
  } catch(e) {}
  try {
    const img3 = document.getElementById("chartTopAthletes").toDataURL("image/png", 1.0);
    doc.text("Top contributeurs", 14, y + 90); 
    doc.addImage(img3, "PNG", 14, y + 95, 180, 90);
  } catch(e) {}

  doc.save(`BSGA_dashboard_${dateStamp()}.pdf`);
  toast("Tableau de bord exporté en PDF", "success");
}

function pdfHeader(doc, title, subtitle) {
  doc.setFillColor(10, 51, 73);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 22, "F");
  doc.setTextColor(232, 65, 26);
  doc.setFontSize(15);
  doc.text(title, 14, 14);
  doc.setTextColor(120);
  doc.setFontSize(9);
  doc.text(subtitle, 14, 27);
}

function dateStamp() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
}

document.getElementById("exportExplorerExcel").addEventListener("click", exportExplorerToExcel);
document.getElementById("exportExplorerPdf").addEventListener("click", exportExplorerToPdf);

/* ===========================================================
   SETTINGS / BASE DE DONNEES
   =========================================================== */
function renderSettings() {
  const row = document.getElementById("dbStatsRow");
  row.innerHTML = "";
  const nbResultats = DB.length;
  const nbAthletes = new Set(DB.map(r => normStr(r.nom)).filter(n=>n)).size;
  const years = uniqueSorted(DB.map(r => r.annee));
  const nbEpreuves = new Set(DB.map(r => r.epreuve)).size;
  [
    ["Résultats totaux", nbResultats, ""],
    ["Athlètes", nbAthletes, ""],
    ["Saisons couvertes", years.length, years.join(", ")],
    ["Épreuves distinctes", nbEpreuves, ""]
  ].forEach(([label, val, foot]) => {
    row.appendChild(el("div", { class: "kpi-card" }, [
      el("div", { class: "kpi-label" }, label),
      el("div", { class: "kpi-value" }, String(val)),
      el("div", { class: "kpi-foot" }, foot)
    ]));
  });
  updateSidebarCount();
}

document.getElementById("exportJsonBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(DB, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `donnees_BSGA_${dateStamp()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Fichier donnees.json téléchargé", "success");
});

document.getElementById("loadJsonBtn").addEventListener("click", () => {
  document.getElementById("loadJsonInput").click();
});

document.getElementById("loadJsonInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  confirmAction(
    "Remplacer la base actuelle ?",
    `Le contenu de "${file.name}" va remplacer entièrement les ${DB.length} résultats actuellement chargés. Cette action est irréversible (sauf si vous avez une sauvegarde).`,
    async () => {
      const { results, errors } = await parseJsonFile(file);
      if (!results.length) { toast("Fichier JSON invalide ou vide", "error"); return; }
      DB = results.map(r => ({ id: NEXT_ID++, ...r, place: String(r.place) }));
      saveToStorage();
      updateSidebarCount();
      renderSettings();
      toast(`Base remplacée : ${DB.length} résultats chargés`, "success");
    }
  );
  e.target.value = "";
});

document.getElementById("resetDbBtn").addEventListener("click", () => {
  confirmAction(
    "Réinitialiser la base de données ?",
    "Tous les résultats actuellement en mémoire et dans le stockage du navigateur seront définitivement supprimés et remplacés par les données d'origine (saison 2026).",
    () => {
      localStorage.removeItem(STORAGE_KEY);
      DB = SEED_DATA.map(r => ({...r}));
      NEXT_ID = DB.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1;
      saveToStorage();
      updateSidebarCount();
      renderSettings();
      toast("Base de données réinitialisée", "success");
    }
  );
});

/* ===========================================================
   INIT
   =========================================================== */
function init() {
  initDB();
  setupNav();
  updateSidebarCount();
  renderDashboard();
  const versionEl = document.getElementById("appVersion");
  if (versionEl) versionEl.textContent = APP_VERSION;
  const versionMobileEl = document.getElementById("appVersionMobile");
  if (versionMobileEl) versionMobileEl.textContent = APP_VERSION;
  document.title = `BSGA Palmarès (v${APP_VERSION})`;
}

init();
