/* ===========================================================
   BSGA Palmarès
   ===========================================================
   © Kevin Marq Product — Tous droits réservés.
   Toute reproduction, distribution ou revente de cette application,
   en tout ou partie, sans autorisation écrite préalable est interdite.
   =========================================================== */

const APP_VERSION = "0.26";

const COTATION_STORAGE_PREFIX = "bsga_cotation_v1_";

// Catégories supportées — extensible
const COTATION_CATS = {
  BEM: { label: "Benjamin Masculin", categorie: "Benjamin",    sexe: "M" },
  BEF: { label: "Benjamine Féminine", categorie: "Benjamine",  sexe: "F" },
  MIM: { label: "Minime Masculin",    categorie: "Minime",     sexe: "M" },
  MIF: { label: "Minime Féminine",    categorie: "Minime",     sexe: "F" },
  CAM: { label: "Cadet Masculin",     categorie: "Cadet",      sexe: "M" },
  CAF: { label: "Cadette Féminine",   categorie: "Cadette",    sexe: "F" },
  JUM: { label: "Junior Masculin",    categorie: "Junior",     sexe: "M" },
  JUF: { label: "Junior Féminine",    categorie: "Junior",     sexe: "F" },
};

// Épreuves de la table, dans l'ordre des colonnes du PDF
const COTATION_COLS = [
  { key: "pts",          label: "Points",       fmt: "pts"    },
  { key: "50m",          label: "50m",          fmt: "SSCC",  sens: "vitesse"   },
  { key: "80m",          label: "80m",          fmt: "SSCC",  sens: "vitesse"   },
  { key: "120m",         label: "120m",         fmt: "SSCC",  sens: "vitesse"   },
  { key: "1000m",        label: "1000m",        fmt: "MMSSCC",sens: "vitesse"   },
  { key: "2000m",        label: "2000m",        fmt: "MMSSCC",sens: "vitesse"   },
  { key: "50mHaies",     label: "50m H.",       fmt: "SSCC",  sens: "vitesse"   },
  { key: "50mHaies84",   label: "50m H. (84)",  fmt: "SSCC",  sens: "vitesse"   },
  { key: "50mHaies76",   label: "50m H. (76)",  fmt: "SSCC",  sens: "vitesse"   },
  { key: "80mHaies84",   label: "80m H. (84)",  fmt: "SSCC",  sens: "vitesse"   },
  { key: "80mHaies76",   label: "80m H. (76)",  fmt: "SSCC",  sens: "vitesse"   },
  { key: "100mHaies84",  label: "100m H. (84)", fmt: "SSCC",  sens: "vitesse"   },
  { key: "200mHaies76",  label: "200m H. (76)", fmt: "SSCC",  sens: "vitesse"   },
  { key: "Hauteur",      label: "Hauteur",      fmt: "CM",    sens: "distance"  },
  { key: "Perche",       label: "Perche",       fmt: "CM",    sens: "distance"  },
  { key: "Longueur",     label: "Longueur",     fmt: "CM",    sens: "distance"  },
  { key: "TripleSaut",   label: "Triple Saut",  fmt: "CM",    sens: "distance"  },
  { key: "Poids3kg",     label: "Poids 3kg",    fmt: "CM",    sens: "distance"  },
  { key: "Poids4kg",     label: "Poids 4kg",    fmt: "CM",    sens: "distance"  },
  { key: "Disque1kg",    label: "Disque 1kg",   fmt: "CM",    sens: "distance"  },
  { key: "Disque1_25kg", label: "Disque 1.25kg",fmt: "CM",    sens: "distance"  },
  { key: "Disque0_8kg",  label: "Disque 0.8kg", fmt: "CM",    sens: "distance"  },
  { key: "Marteau3kg",   label: "Marteau 3kg",  fmt: "CM",    sens: "distance"  },
  { key: "Marteau4kg",   label: "Marteau 4kg",  fmt: "CM",    sens: "distance"  },
  { key: "Javelot500g",  label: "Javelot 500g", fmt: "CM",    sens: "distance"  },
  { key: "Javelot600g",  label: "Javelot 600g", fmt: "CM",    sens: "distance"  },
  { key: "2000mMarche",  label: "2000m M.",     fmt: "MMSSCC",sens: "vitesse"   },
  { key: "3000mMarche",  label: "3000m M.",     fmt: "MMSSCC",sens: "vitesse"   },
  { key: "4x60m",        label: "4x60m",        fmt: "SSCC",  sens: "vitesse"   },
  { key: "4x60mMixte",   label: "4x60m Mixte",  fmt: "SSCC",  sens: "vitesse"   },
];

// Mapping épreuve du club → colonne de cotation
const COTATION_EPREUVE_MAP = {
  "50m":                         "50m",
  "80m":                         "80m",
  "80m | Vent : VR":             "80m",
  "120m":                        "120m",
  "120m | Vent : VR":            "120m",
  "50m Haies (65)":              "50mHaies",
  "50m Haies (65) | Vent : VR":  "50mHaies",
  "50m Haies (84)":              "50mHaies84",
  "50m Haies (84) | Vent : VR":  "50mHaies84",
  "50m Haies (76)":              "50mHaies76",
  "50m Haies (76) | Vent : VR":  "50mHaies76",
  "80m Haies (84)":              "80mHaies84",
  "80m Haies (84) | Vent : VR":  "80mHaies84",
  "80m Haies (76)":              "80mHaies76",
  "80m Haies (76) | Vent : VR":  "80mHaies76",
  "100m Haies (84)":             "100mHaies84",
  "100m Haies (84) | Vent : VR": "100mHaies84",
  "200m Haies (76)":             "200mHaies76",
  "200m Haies (76) | Vent : VR": "200mHaies76",
  "1 000m":                      "1000m",
  "1 000m Piste Courte":         "1000m",
  "2 000m":                      "2000m",
  "Hauteur":                     "Hauteur",
  "Perche":                      "Perche",
  "Longueur":                    "Longueur",
  "Longueur | Vent : VR":        "Longueur",
  "Triple saut":                 "TripleSaut",
  "Triple saut | Vent : VR":     "TripleSaut",
  "Poids (3 kg)":                "Poids3kg",
  "Poids (2 kg)":                "Poids3kg",
  "Poids (4 kg)":                "Poids4kg",
  "Disque (1.0 kg)":             "Disque1kg",
  "Disque (0.6 kg)":             "Disque1kg",
  "Disque (1.25 kg)":            "Disque1_25kg",
  "Disque (1.2 kg)":             "Disque1_25kg",
  "Disque (0.8 kg)":             "Disque0_8kg",
  "Marteau (3 kg)":              "Marteau3kg",
  "Marteau (2 kg)":              "Marteau3kg",
  "Marteau (4 kg)":              "Marteau4kg",
  "Javelot (500 g)":             "Javelot500g",
  "Javelot (400 g)":             "Javelot500g",
  "Javelot (600 g)":             "Javelot600g",
  "2 000m Marche":               "2000mMarche",
  "3 000m Marche":               "3000mMarche",
  "3 000m Marche Piste Courte":  "3000mMarche",
  "4 X 60m":                     "4x60m",
};

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

// Ordre de priorité par type d'engin de lancer — garantit Disque < Javelot < Marteau < Poids
// (sinon l'ordre alphabétique Disque/Javelot/Marteau/Poids serait correct mais on préfère
//  un ordre explicitement fixé pour la lisibilité)
const LANCER_TYPE_ORDER = { "disque": 1, "javelot": 2, "marteau": 3, "poids": 4 };

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
    const la = a.toLowerCase().split(/[^a-z]/)[0]; // premier mot = type
    const lb = b.toLowerCase().split(/[^a-z]/)[0];
    const ta = LANCER_TYPE_ORDER[la] || 0;
    const tb = LANCER_TYPE_ORDER[lb] || 0;
    // Si les deux sont des lancers de types différents : ordre par type fixe
    if (ta && tb && ta !== tb) return ta - tb;
    // Sinon : ordre numérique normal (distance/poids)
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
  return sel ? sel.value : "__all__";
}

function getDashSexe() {
  const sel = document.getElementById("dashSexe");
  return sel ? sel.value : "__all__";
}

function populateDashYearSelect() {
  const sel = document.getElementById("dashYear");
  const years = uniqueSorted(DB.map(r => r.annee)).reverse();
  sel.innerHTML = '<option value="__all__">Toutes les années</option>' +
    years.map(y => `<option value="${y}">${y}</option>`).join("");
}

function renderDashboard() {
  const yearBefore = getDashYear(); // lire AVANT de repeupler
  populateDashYearSelect();
  // Restaurer la valeur sélectionnée après reconstruction du select
  const sel = document.getElementById("dashYear");
  if (yearBefore && [...sel.options].some(o => o.value === yearBefore)) sel.value = yearBefore;
  const year = getDashYear();
  const sexe = getDashSexe();
  let rows = year === "__all__" ? DB : DB.filter(r => String(r.annee) === String(year));
  if (sexe !== "__all__") rows = rows.filter(r => r.sexe === sexe);

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
  if (e.target.id === "dashSexe") renderDashboard();
});

document.getElementById("exportDashPdf").addEventListener("click", () => exportDashboardPdf());

/* ===========================================================
   EXPLORER — filtres, tri, table
   =========================================================== */
let explorerSort = { key: "annee", dir: "desc" };
let explorerFilters = { annee: [], sexe: [], groupe: [], epreuve: [], categorie: [], nom: "", podium: "", record: "" };

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
  explorerFilters.record = document.getElementById("f-record") ? document.getElementById("f-record").value : "";
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
  if (f.record) {
    const clubRecords = computeClubRecords();
    const clubRecordsAbs = computeClubRecordsAbsolute();
    rows = rows.filter(r => {
      const recKey = normEpreuve(r.epreuve) + "|" + normStr(r.categorie || "Non determinee");
      const isRecordAbs = clubRecordsAbs.has(normEpreuve(r.epreuve)) && clubRecordsAbs.get(normEpreuve(r.epreuve)).ids.has(r.id);
      const isRecord = clubRecords.has(recKey) && clubRecords.get(recKey).ids.has(r.id);
      if (f.record === "abs") return isRecordAbs;
      if (f.record === "cat") return isRecord && !isRecordAbs;
      if (f.record === "both") return isRecordAbs || isRecord;
      return true;
    });
  }
  return rows;
}

function hasActiveExplorerFilters() {
  const f = explorerFilters;
  return f.annee.length > 0 || f.sexe.length > 0 || f.groupe.length > 0 ||
         f.epreuve.length > 0 || f.categorie.length > 0 || !!f.nom || !!f.podium || !!f.record;
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

// Record absolu par épreuve — toutes catégories et tous sexes confondus.
// Une performance est un record absolu si aucune autre performance dans toute la base
// n'est meilleure sur cette même épreuve (indépendamment de la catégorie ou du sexe).
function computeClubRecordsAbsolute() {
  const records = new Map();
  DB.forEach(r => {
    const p = parsePerformance(r.performance, r.epreuve);
    if (!p) return;
    const key = normEpreuve(r.epreuve);
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
    if (key === "niveauFFA") {
      va = getNiveauFFAForRow(a) || 0;
      vb = getNiveauFFAForRow(b) || 0;
    }
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
  if (f.record) { const rl = {"abs":"👑 Records absolus","cat":"🏆 Records catégorie","both":"👑+🏆 Tous records"}; addChip(rl[f.record]||f.record, () => { const el=document.getElementById("f-record"); if(el) el.value=""; onExplorerFilterChange(); }); }
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
  renderDashCotation(DB);
}

function updatePlaceRecomputedNote() {
  const note = document.getElementById("placeRecomputedNote");
  if (note) note.style.display = hasActiveExplorerFilters() ? "block" : "none";
}

function renderExplorerTable() {
  const rows = sortRows(withRecomputedPlaces(applyExplorerFilters()));
  document.getElementById("explorerCount").textContent = rows.length;
  updateExplorerNiveauMoyen(rows);
  const tbody = document.getElementById("explorerBody");
  tbody.innerHTML = "";

  if (!rows.length) {
    const tr = el("tr", {}, el("td", { colspan: "9" }, el("div", { class: "empty-state" }, "Aucun résultat ne correspond à ces filtres")));
    tbody.appendChild(tr);
    return;
  }

  // Calcul des records du club : par catégorie (🏆) et absolu toutes catégories (👑)
  const clubRecords = computeClubRecords();
  const clubRecordsAbs = computeClubRecordsAbsolute();

  const frag = document.createDocumentFragment();
  rows.forEach(r => {
    const displayPlace = r._displayPlace != null ? r._displayPlace : r.place;
    const recordKey = normEpreuve(r.epreuve) + "|" + normStr(r.categorie || "Non determinee");
    const rec = clubRecords.get(recordKey);
    const recAbs = clubRecordsAbs.get(normEpreuve(r.epreuve));
    const isRecordAbs = recAbs && recAbs.ids.has(r.id);
    const isRecord = rec && rec.ids.has(r.id);

    // Priorité d'affichage : absolu (👑) > catégorie (🏆) > normal
    let rowStyle = "";
    let perfPrefix = "";
    let perfClass = "perf-cell";
    if (isRecordAbs) {
      rowStyle = "background:linear-gradient(90deg,#FFF5E0 0%,#FFE99A 60%,#FFF5E0 100%);";
      perfPrefix = "👑 ";
      perfClass = "perf-cell perf-record-abs";
    } else if (isRecord) {
      rowStyle = "background:linear-gradient(90deg,#FFFAE8 0%,#FFF3CC 60%,#FFFAE8 100%);";
      perfPrefix = "🏆 ";
      perfClass = "perf-cell perf-record";
    }

    const nomCell = el("td", { class: "athlete-link", title: "Voir la fiche de " + r.nom }, r.nom);
    nomCell.addEventListener("click", () => goToAthlete(r.nom));

    const niveauFFA = getNiveauFFAForRow(r);
    const niveauCell = niveauFFA
      ? el("td", { style: "text-align:center;" }, el("span", {
          style: `display:inline-block;min-width:26px;padding:2px 8px;border-radius:8px;font-weight:800;font-family:var(--font-mono);font-size:12.5px;color:#fff;background:${lvlColorCotation(niveauFFA)};`
        }, String(niveauFFA)))
      : el("td", { style: "text-align:center;color:var(--grey-dim);" }, "-");

    const tr = el("tr", { style: rowStyle }, [
      el("td", {}, String(r.annee)),
      el("td", {}, el("span", { class: "tag-pill" }, r.sexe)),
      el("td", { title: r.groupe }, r.groupe),
      el("td", { title: r.epreuve }, r.epreuve),
      el("td", { title: r.categorie || "Non déterminée" }, r.categorie || "Non déterminée"),
      el("td", {}, el("span", { class: placePillClass(displayPlace) }, String(displayPlace))),
      el("td", { class: perfClass }, perfPrefix + r.performance),
      nomCell,
      niveauCell
    ]);
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
}

["f-annee","f-sexe","f-groupe","f-epreuve","f-categorie","f-podium","f-record"].forEach(id => {
  document.addEventListener("change", (e) => { if (e.target.id === id) onExplorerFilterChange(); });
});
document.getElementById("f-nom").addEventListener("input", () => onExplorerFilterChange());

document.getElementById("resetFilters").addEventListener("click", () => {
  ["f-annee","f-sexe","f-groupe","f-epreuve","f-categorie"].forEach(id => {
    Array.from(document.getElementById(id).options).forEach(o => o.selected = false);
  });
  document.getElementById("f-nom").value = "";
  document.getElementById("f-podium").value = "";
  const recSel = document.getElementById("f-record"); if (recSel) recSel.value = "";
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
let athleteCotRadarChart = null;

// Regroupement des épreuves DB (`groupe`) vers les 6 grandes disciplines du radar de cotation.
// "Epreuves combinees", "Relais" et "Autre" sont exclues (pas de cotation FFA par épreuve individuelle).
const RADAR_GROUPS = [
  { db: "Sprint",           label: "Sprint" },
  { db: "Haies / Steeple",  label: "Haies" },
  { db: "Demi-fond / Fond", label: "Demi-fond" },
  { db: "Marche",           label: "Marche" },
  { db: "Sauts",            label: "Saut" },
  { db: "Lancers",          label: "Lancé" },
];

// Mapping colonne de cotation (COTATION_COLS.key) -> groupe DB, pour le détail par discipline.
const GROUP_OF_COLKEY = {
  "50m": "Sprint", "80m": "Sprint", "120m": "Sprint",
  "50mHaies": "Haies / Steeple", "50mHaies84": "Haies / Steeple", "50mHaies76": "Haies / Steeple",
  "80mHaies84": "Haies / Steeple", "80mHaies76": "Haies / Steeple",
  "100mHaies84": "Haies / Steeple", "200mHaies76": "Haies / Steeple",
  "1000m": "Demi-fond / Fond", "2000m": "Demi-fond / Fond",
  "2000mMarche": "Marche", "3000mMarche": "Marche",
  "Hauteur": "Sauts", "Perche": "Sauts", "Longueur": "Sauts", "TripleSaut": "Sauts",
  "Poids3kg": "Lancers", "Poids4kg": "Lancers",
  "Disque1kg": "Lancers", "Disque1_25kg": "Lancers", "Disque0_8kg": "Lancers",
  "Marteau3kg": "Lancers", "Marteau4kg": "Lancers",
  "Javelot500g": "Lancers", "Javelot600g": "Lancers",
};

// Meilleur niveau FFA (1-50) obtenu dans un groupe de disciplines, sur un ensemble de résultats donné.
function bestNiveauForGroup(rows, groupeDb) {
  let best = 0;
  for (const r of rows) {
    if (r.groupe !== groupeDb) continue;
    const n = getNiveauFFAForRow(r);
    if (n && n > best) best = n;
  }
  return best;
}

// Meilleur niveau FFA obtenu sur une colonne de cotation précise (une épreuve), sur un ensemble de résultats.
function bestForColKeyAcross(rows, colKey) {
  let best = 0;
  for (const r of rows) {
    if (COTATION_EPREUVE_MAP[r.epreuve] !== colKey) continue;
    const n = getNiveauFFAForRow(r);
    if (n && n > best) best = n;
  }
  return best;
}


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

function goToAthlete(name) {
  // Naviguer vers la page Fiches athlètes et ouvrir directement la fiche de cet athlète
  document.querySelectorAll(".nav-btn, .mobile-nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll('[data-page="athletes"]').forEach(b => b.classList.add("active"));
  document.getElementById("page-athletes").classList.add("active");
  window.scrollTo(0, 0);
  renderAthletesList();
  // Pré-remplir la recherche et sélectionner directement l'athlète
  const searchInput = document.getElementById("athleteSearch");
  if (searchInput) {
    searchInput.value = name;
    renderAthletesList(name);
  }
  selectAthlete(name);
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

  // Badge de niveau moyen cotation FFA (si table disponible)
  renderAthleteCotationBadge(rows);

  // Calcul des records du club pour marquer les perfs de l'athlète
  const clubRecords = computeClubRecords();
  const clubRecordsAbs = computeClubRecordsAbsolute();

  // Meilleure performance de l'athlète par épreuve (toutes années confondues)
  const bestByEpreuve = new Map();
  rows.forEach(r => {
    const p = parsePerformance(r.performance, r.epreuve);
    if (!p) return;
    const key = normEpreuve(r.epreuve);
    if (!bestByEpreuve.has(key)) {
      bestByEpreuve.set(key, { r, p });
    } else {
      const ex = bestByEpreuve.get(key);
      const isBetter = p.higherIsBetter ? p.value > ex.p.value : p.value < ex.p.value;
      if (isBetter) bestByEpreuve.set(key, { r, p });
    }
  });
  const bestIds = new Set([...bestByEpreuve.values()].map(({ r }) => r.id));

  document.getElementById("athleteChartPanel").style.display = "block";
  document.getElementById("athleteTablePanel").style.display = "block";

  const byGroupe = {};
  rows.forEach(r => { byGroupe[r.groupe] = (byGroupe[r.groupe] || 0) + 1; });
  const labels = Object.keys(byGroupe);
  const values = labels.map(g => byGroupe[g]);

  if (chartAthlete) chartAthlete.destroy();
  requestAnimationFrame(() => {
    chartAthlete = new Chart(document.getElementById("chartAthlete"), {
      type: "bar",
      data: { labels, datasets: [{ data: values, backgroundColor: "#E8411A", borderRadius: 4, barThickness: 26 }] },
      options: chartBaseOptions({ horizontal: false })
    });
  });

  // Notice explicative des distinctions (retirer l'ancienne si elle existe)
  const oldNotice = document.getElementById("athleteTablePanel").querySelector(".legend-note");
  if (oldNotice) oldNotice.remove();
  const notice = el("div", { class: "legend-note", style: "margin-bottom:10px; display:flex; gap:16px; flex-wrap:wrap;" }, [
    el("span", {}, "⭐ = Meilleure performance personnelle (toutes saisons)"),
    el("span", {}, "🏆 = Record du club dans sa catégorie d'âge"),
    el("span", {}, "👑 = Record absolu du club toutes catégories confondues")
  ]);
  document.getElementById("athleteTablePanel").insertBefore(notice,
    document.getElementById("athleteTablePanel").querySelector(".table-wrap"));

  // Table detail avec distinctions
  const tbody = document.getElementById("athleteTableBody");
  tbody.innerHTML = "";
  rows.forEach(r => {
    const recKey = normEpreuve(r.epreuve) + "|" + normStr(r.categorie || "Non determinee");
    const rec = clubRecords.get(recKey);
    const recAbs = clubRecordsAbs.get(normEpreuve(r.epreuve));
    const isRecordAbs = recAbs && recAbs.ids.has(r.id);
    const isRecord = rec && rec.ids.has(r.id);
    const isBest = bestIds.has(r.id);

    let rowStyle = "";
    let perfPrefix = "";
    let perfClass = "perf-cell";
    if (isRecordAbs) {
      rowStyle = "background:linear-gradient(90deg,#FFF5E0 0%,#FFE99A 60%,#FFF5E0 100%);";
      perfPrefix = "👑 ";
      perfClass = "perf-cell perf-record-abs";
    } else if (isRecord) {
      rowStyle = "background:linear-gradient(90deg,#FFFAE8 0%,#FFF3CC 60%,#FFFAE8 100%);";
      perfPrefix = "🏆 ";
      perfClass = "perf-cell perf-record";
    } else if (isBest) {
      rowStyle = "background:#F0F7FF;";
      perfPrefix = "⭐ ";
      perfClass = "perf-cell perf-best";
    }

    const niveauFFA = getNiveauFFAForRow(r);
    const niveauCell = niveauFFA
      ? el("td", { style: "text-align:center;" }, el("span", {
          style: `display:inline-block;min-width:26px;padding:2px 8px;border-radius:8px;font-weight:800;font-family:var(--font-mono);font-size:12.5px;color:#fff;background:${lvlColorCotation(niveauFFA)};`
        }, String(niveauFFA)))
      : el("td", { style: "text-align:center;color:var(--grey-dim);" }, "-");

    tbody.appendChild(el("tr", { style: rowStyle }, [
      el("td", {}, String(r.annee)),
      el("td", { title: r.groupe }, r.groupe),
      el("td", { title: r.epreuve }, r.epreuve),
      el("td", { title: r.categorie || "Non déterminée" }, r.categorie || "Non déterminée"),
      el("td", {}, el("span", { class: placePillClass(r.place) }, String(r.place))),
      el("td", { class: perfClass }, perfPrefix + r.performance),
      niveauCell
    ]));
  });

  // Section cotation FFA (si table disponible pour cette catégorie)
  renderAthleteCotation(rows);
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
  const sexe = getDashSexe();
  let rows = year === "__all__" ? DB : DB.filter(r => String(r.annee) === String(year));
  if (sexe !== "__all__") rows = rows.filter(r => r.sexe === sexe);
  const sexeLabel = sexe === "M" ? " · Hommes" : sexe === "F" ? " · Femmes" : "";
  const doc = new jspdf.jsPDF();
  pdfHeader(doc, "Tableau de bord", `Saison ${year === "__all__" ? "toutes années" : year}${sexeLabel} — BSGA`);

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
  renderCotationSettings();
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

  // La version et le titre sont fixés en premier : même si le rendu du tableau
  // de bord échoue plus bas (ex. librairie manquante), la version reste visible.
  const versionEl = document.getElementById("appVersion");
  if (versionEl) versionEl.textContent = APP_VERSION;
  const versionMobileEl = document.getElementById("appVersionMobile");
  if (versionMobileEl) versionMobileEl.textContent = APP_VERSION;
  document.title = `BSGA Palmarès (v${APP_VERSION})`;

  try {
    renderDashboard();
  } catch (e) {
    console.error("Erreur au rendu du tableau de bord :", e);
  }

  // Enregistrement du Service Worker pour le mode PWA (hors-ligne)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

init();

/* ============================================================
   MODULE COTATION FFA
   Tables de cotation par catégorie (BEM, BEF, MIM, MIF, ...)
   stockées en localStorage. Parsing PDF via PDF.js (déjà présent).
   ============================================================ */


/* ── Stockage des tables de cotation ── */
function saveCotationTable(catCode, table) {
  try {
    localStorage.setItem(COTATION_STORAGE_PREFIX + catCode, JSON.stringify(table));
  } catch(e) { console.error("Erreur sauvegarde cotation:", e); }
}
// Renvoie la table personnalisée (localStorage) si elle existe, sinon la table intégrée
// par défaut (COTATION_DEFAULTS), sinon null.
function loadCotationTable(catCode) {
  try {
    const raw = localStorage.getItem(COTATION_STORAGE_PREFIX + catCode);
    if (raw) return JSON.parse(raw);
  } catch(e) { /* ignore, on retombe sur la valeur par défaut */ }
  return (typeof COTATION_DEFAULTS !== "undefined" && COTATION_DEFAULTS[catCode]) || null;
}
// Indique si une table personnalisée (import PDF/JSON) a été enregistrée pour cette catégorie,
// par opposition à la table intégrée par défaut.
function hasCustomCotationTable(catCode) {
  return !!localStorage.getItem(COTATION_STORAGE_PREFIX + catCode);
}
function hasDefaultCotationTable(catCode) {
  return typeof COTATION_DEFAULTS !== "undefined" && !!COTATION_DEFAULTS[catCode];
}
function deleteCotationTable(catCode) {
  localStorage.removeItem(COTATION_STORAGE_PREFIX + catCode);
}

/* ── Parseur de la table de cotation (texte extrait du PDF) ── */
function parseCotationText(text) {
  const rows = [];
  const lines = text.split("\n").map(l => l.trim()).filter(l => l);
  for (const line of lines) {
    const parts = line.split(/\s+/);
    // Une ligne valide : premier token = entier 1-50, dernier token = même entier
    const first = parseInt(parts[0]);
    const last  = parseInt(parts[parts.length - 1]);
    if (isNaN(first) || first < 1 || first > 50) continue;
    if (parts.length < 15) continue; // au moins 15 colonnes
    const row = { niveau: first };
    COTATION_COLS.forEach((col, i) => {
      const v = parseInt(parts[i]);
      row[col.key] = isNaN(v) ? null : v;
    });
    rows.push(row);
  }
  rows.sort((a, b) => a.niveau - b.niveau);
  return rows.length >= 40 ? rows : null; // au moins 40 lignes pour être valide
}

async function parseCotationPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const text = await extractPdfText(arrayBuffer);
  return parseCotationText(text);
}

/* ── Calcul du niveau d'une performance ── */
function padCents(s) { return s.length === 1 ? s + "0" : s.slice(0, 2); }

function perfToTableValue(perfStr, colKey) {
  const col = COTATION_COLS.find(c => c.key === colKey);
  if (!col) return null;
  const s = perfStr.replace(/\s*\([^)]*\)/g, "").trim();
  if (col.fmt === "CM") {
    const m = s.match(/^(\d+)m(\d+)?/);
    if (m) return parseInt(m[1]) * 100 + parseInt(m[2] || "0");
    return null;
  }
  if (col.fmt === "SSCC") {
    const m = s.match(/^(\d+)[\"''`]{1,2}(\d+)/);
    if (m) return parseInt(m[1]) * 100 + parseInt(padCents(m[2]));
    return null;
  }
  if (col.fmt === "MMSSCC") {
    const m = s.match(/^(\d+)['`](\d+)[\"''`]{1,2}(\d+)/);
    if (m) return parseInt(m[1]) * 10000 + parseInt(m[2]) * 100 + parseInt(padCents(m[3]));
    return null;
  }
  return null;
}

function getNiveauCotation(perfStr, colKey, table) {
  if (!table || !perfStr || !colKey) return null;
  const col = COTATION_COLS.find(c => c.key === colKey);
  if (!col || col.fmt === "pts") return null;
  const val = perfToTableValue(perfStr, colKey);
  if (val === null) return null;
  let best = null;
  for (const row of table) {
    const vt = row[colKey];
    if (vt === null || vt === undefined) continue;
    if (col.sens === "vitesse"  && val <= vt) best = row.niveau;
    if (col.sens === "distance" && val >= vt) best = row.niveau;
  }
  return best;
}

// Codes de catégorie pour lesquels le niveau FFA est affiché dans le tableau Explorer
// (uniquement Benjamin/Benjamine et Minime/Minime, comme demandé)
const NIVEAU_FFA_EXPLORER_CATS = ["BEM", "BEF", "MIM", "MIF"];

// Calcule le niveau FFA (1-50) d'un résultat pour la colonne "Niveau FFA" de l'Explorer.
// Renvoie null si la catégorie n'est pas Benjamin/Minime, si aucune table n'est chargée,
// ou si l'épreuve/performance ne peut pas être cotée.
function getNiveauFFAForRow(r) {
  const catCode = getCatCodeForRecord(r);
  if (!catCode || !NIVEAU_FFA_EXPLORER_CATS.includes(catCode)) return null;
  const table = loadCotationTable(catCode);
  if (!table) return null;
  const colKey = COTATION_EPREUVE_MAP[r.epreuve];
  if (!colKey) return null;
  return getNiveauCotation(r.performance, colKey, table);
}

// Met à jour le badge "Niveau FFA moyen" au-dessus du tableau Explorer,
// calculé sur les résultats actuellement filtrés/affichés (Benjamin/Minime cotés uniquement).
function updateExplorerNiveauMoyen(rows) {
  const wrap = document.getElementById("explorerNiveauMoyenWrap");
  const badge = document.getElementById("explorerNiveauMoyen");
  const countEl = document.getElementById("explorerNiveauMoyenCount");
  if (!wrap || !badge || !countEl) return;

  const niveaux = rows.map(getNiveauFFAForRow).filter(n => n != null);
  if (!niveaux.length) {
    wrap.style.display = "none";
    return;
  }
  const avg = (niveaux.reduce((a, b) => a + b, 0) / niveaux.length).toFixed(1);
  badge.textContent = avg + "/50";
  badge.style.background = lvlColorCotation(Math.round(parseFloat(avg)));
  countEl.textContent = `(sur ${niveaux.length} résultat${niveaux.length > 1 ? "s" : ""} coté${niveaux.length > 1 ? "s" : ""})`;
  wrap.style.display = "inline-flex";
}

function lvlColorCotation(n) {
  if (!n) return "#ccc";
  if (n >= 40) return "#1a9e6a";
  if (n >= 30) return "#2e8bc1";
  if (n >= 20) return "#e8a020";
  if (n >= 10) return "#e8411a";
  return "#7B5EA7";
}

function getCatCodeForRecord(r) {
  const cat = (r.categorie || "").toLowerCase();
  const s = r.sexe;
  if (cat === "benjamin"  && s === "M") return "BEM";
  if (cat === "benjamine" && s === "F") return "BEF";
  if (cat === "minime"    && s === "M") return "MIM";
  if (cat === "minime"    && s === "F") return "MIF";
  if (cat === "cadet"     && s === "M") return "CAM";
  if (cat === "cadette"   && s === "F") return "CAF";
  if (cat === "junior"    && s === "M") return "JUM";
  if (cat === "junior"    && s === "F") return "JUF";
  return null;
}

/* ── Rendu de la section Tables de cotation (page Base de données) ── */
function renderCotationSettings() {
  const container = document.getElementById("cotationTablesList");
  if (!container) return;
  container.innerHTML = `<div class="cotation-grid">${
    Object.entries(COTATION_CATS).map(([code, info]) => {
      const table = loadCotationTable(code);
      const isCustom = hasCustomCotationTable(code);
      const isDefault = hasDefaultCotationTable(code);
      const loaded = !!table;

      let statusHtml;
      if (isCustom) statusHtml = `✓ Personnalisée — ${table.length} niveaux chargés`;
      else if (isDefault) statusHtml = `✓ Intégrée par défaut — ${table.length} niveaux`;
      else statusHtml = "○ Non importée";

      const importLabel = loaded ? "Remplacer (PDF ou JSON)" : "Importer (PDF ou JSON)";
      // Bouton de suppression : "Revenir à la version intégrée" si une table par défaut existe,
      // sinon "Supprimer" (catégories sans table intégrée, ex. Cadet/Junior).
      let delBtnHtml = "";
      if (isCustom) {
        delBtnHtml = isDefault
          ? `<button class="btn small" style="font-size:11px;" data-del="${code}" title="Revenir à la table FFA intégrée par défaut">↺ Version intégrée</button>`
          : `<button class="btn small danger" style="font-size:11px;" data-del="${code}">Supprimer</button>`;
      }

      return `<div class="cotation-cat-card">
        <div class="cotation-cat-name">${code} — ${info.label}</div>
        <div class="cotation-cat-status ${loaded ? 'loaded' : 'empty'}">
          ${statusHtml}
        </div>
        <div class="cotation-cat-actions">
          <label class="btn small" style="cursor:pointer;font-size:11px;">
            ${importLabel}
            <input type="file" accept=".pdf,.json" style="display:none" data-cat="${code}">
          </label>
          ${delBtnHtml}
        </div>
      </div>`;
    }).join('')
  }</div>
  <div class="legend-note" style="margin-top:10px;">
    💡 <strong>Conseils d'import :</strong>
    Sur GitHub Pages (URL https://) : importez directement le PDF.
    En ouverture locale (double-clic) : utilisez un fichier JSON généré depuis le PDF avec le script fourni dans le README.
  </div>`;

  // Listeners upload
  container.querySelectorAll('input[type=file][data-cat]').forEach(input => {
    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const code = input.dataset.cat;

      // JSON pré-calculé (toujours fonctionnel)
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        try {
          const table = JSON.parse(text);
          if (!Array.isArray(table) || table.length < 40 || !table[0].niveau) {
            toast(`Format JSON non reconnu — utilisez le script de conversion fourni`, "error"); return;
          }
          saveCotationTable(code, table);
          toast(`Table ${code} importée (${table.length} niveaux)`, "success");
          renderCotationSettings();
          renderDashboard();
        } catch(err) { toast(`JSON invalide : ${err.message}`, "error"); }
        return;
      }

      // PDF — fonctionne sur HTTP, bloqué en file://
      toast(`Lecture de la table ${code}...`, "");
      try {
        if (!window.pdfjsLib) await loadPdfJs();
        const table = await parseCotationPdf(file);
        if (!table) { toast(`Format non reconnu — assurez-vous que c'est bien une table de cotation FFA`, "error"); return; }
        saveCotationTable(code, table);
        toast(`Table ${code} importée (${table.length} niveaux)`, "success");
        renderCotationSettings();
        renderDashboard();
      } catch(err) {
        if (err.message && err.message.includes('pdf')) {
          toast(`Import PDF non disponible en mode local. Utilisez l'import JSON (voir README).`, "error");
        } else {
          toast(`Erreur : ${err.message}`, "error");
        }
      }
    });
  });

  // Listeners suppression
  container.querySelectorAll('button[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.del;
      const revertedToDefault = hasDefaultCotationTable(code);
      deleteCotationTable(code);
      toast(revertedToDefault ? `Table ${code} : retour à la version intégrée` : `Table ${code} supprimée`, "success");
      renderCotationSettings();
      renderDashboard();
    });
  });
}

/* ── Barres de cotation dans la fiche athlète ── */
function renderAthleteCotation(athleteRows) {
  const panel = document.getElementById("athleteCotationPanel");
  const scoreEl = document.getElementById("athleteCotScore");
  const anneeSelect = document.getElementById("athleteCotAnnee");
  const catSelect = document.getElementById("athleteCotCategorie");
  const radarCanvas = document.getElementById("athleteCotRadar");
  const chipsEl = document.getElementById("athleteCotChips");
  const detailEl = document.getElementById("athleteCotDetail");
  if (!panel || !scoreEl || !anneeSelect || !catSelect || !radarCanvas || !chipsEl || !detailEl) return;

  // Catégories cotables réellement présentes dans l'historique de l'athlète
  // (utile s'il a changé de catégorie d'âge d'une année sur l'autre, ex. Benjamin → Minime).
  const catCodesSeen = [...new Set(athleteRows.map(getCatCodeForRecord))].filter(Boolean);
  const availableCats = catCodesSeen.filter(code => loadCotationTable(code));

  if (!availableCats.length) {
    panel.style.display = "none";
    if (athleteCotRadarChart) { athleteCotRadarChart.destroy(); athleteCotRadarChart = null; }
    return;
  }

  panel.style.display = "block";

  // Sélecteur de catégorie — par défaut la plus récente (année la plus haute)
  const mostRecentCat = [...athleteRows]
    .sort((a, b) => b.annee - a.annee)
    .map(getCatCodeForRecord)
    .find(code => availableCats.includes(code));
  const previousSelection = catSelect.value;
  catSelect.innerHTML = availableCats.map(code => {
    const info = COTATION_CATS[code];
    return `<option value="${code}">${code}${info ? " — " + info.label : ""}</option>`;
  }).join("");
  catSelect.value = availableCats.includes(previousSelection) ? previousSelection : mostRecentCat;

  const renderForCategory = () => {
    const catCode = catSelect.value;
    const table = loadCotationTable(catCode);
    const rowsForCat = athleteRows.filter(r => getCatCodeForRecord(r) === catCode);

    // Sélecteur d'année (dépend de la catégorie choisie)
    const annees = [...new Set(rowsForCat.map(r => r.annee))].sort().reverse();
    const previousAnnee = anneeSelect.value;
    anneeSelect.innerHTML = `<option value="best">Meilleure perf. (toutes années)</option>` +
      annees.map(y => `<option value="${y}">${y}</option>`).join("");
    anneeSelect.value = annees.map(String).includes(previousAnnee) ? previousAnnee : "best";

    // Comparaisons club / catégorie : toujours calculées sur l'ensemble de la base
    // (repères fixes), indépendamment du filtre année qui ne joue que sur la ligne de l'athlète.
    const catRows = DB.filter(r => getCatCodeForRecord(r) === catCode);

    const renderAll = () => {
    const selectedAnnee = anneeSelect.value;
    const rows = selectedAnnee === "best"
      ? rowsForCat
      : rowsForCat.filter(r => String(r.annee) === selectedAnnee);

    // Meilleure perf par colonne de cotation (pour cet athlète, sur la sélection d'année)
    const bestByCol = {};
    for (const r of rows) {
      const colKey = COTATION_EPREUVE_MAP[r.epreuve];
      if (!colKey) continue;
      const val = perfToTableValue(r.performance, colKey);

      const col = COTATION_COLS.find(c => c.key === colKey);
      if (!col || !val) continue;
      if (!bestByCol[colKey]) {
        bestByCol[colKey] = { perf: r.performance, epreuve: r.epreuve, val, annee: r.annee };
      } else {
        const isBetter = col.sens === "vitesse" ? val < bestByCol[colKey].val : val > bestByCol[colKey].val;
        if (isBetter) bestByCol[colKey] = { perf: r.performance, epreuve: r.epreuve, val, annee: r.annee };
      }
    }

    // Score moyen sur toutes les épreuves cotées
    const DISPLAY_COLS = COTATION_COLS.filter(c => c.key !== "pts" && c.key !== "4x60mMixte" && c.sens
      && table.length && Object.prototype.hasOwnProperty.call(table[0], c.key));
    const levels = [];
    DISPLAY_COLS.forEach(col => {
      const info = bestByCol[col.key];
      if (!info) return;
      const niv = getNiveauCotation(info.perf, col.key, table);
      if (niv) levels.push(niv);
    });
    const avg = levels.length ? (levels.reduce((a,b) => a+b, 0) / levels.length).toFixed(1) : null;
    const avgColor = avg ? lvlColorCotation(Math.round(parseFloat(avg))) : "#999";

    scoreEl.innerHTML = avg
      ? `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
           <div style="background:#f0f7ff;border:1px solid #c8e0f5;border-radius:10px;padding:8px 18px;text-align:center;">
             <div style="font-size:26px;font-weight:800;color:${avgColor};font-family:var(--font-mono);">${avg}</div>
             <div style="font-size:10px;color:var(--grey);margin-top:1px;">Niveau moyen / 50</div>
           </div>
           <div style="font-size:12px;color:var(--grey);line-height:1.5;">
             Basé sur <strong>${levels.length}</strong> épreuve(s) cotée(s).<br>
             1 = initiation · 50 = élite
           </div>
         </div>`
      : `<p style="color:var(--grey);font-style:italic;font-size:13px;margin-bottom:12px;">Aucune performance cotable pour cette sélection.</p>`;

    // ── Radar par grande discipline ──
    const athleteRadarData = RADAR_GROUPS.map(g => bestNiveauForGroup(rows, g.db));
    const clubRadarData = RADAR_GROUPS.map(g => bestNiveauForGroup(DB, g.db));
    const catRadarData = RADAR_GROUPS.map(g => bestNiveauForGroup(catRows, g.db));

    if (athleteCotRadarChart) athleteCotRadarChart.destroy();
    requestAnimationFrame(() => {
      athleteCotRadarChart = new Chart(radarCanvas, {
        type: "radar",
        data: {
          labels: RADAR_GROUPS.map(g => g.label),
          datasets: [
            {
              label: "Athlète",
              data: athleteRadarData,
              borderColor: "#185FA5",
              backgroundColor: "rgba(24,95,165,0.55)",
              borderWidth: 2.5,
              pointStyle: "circle",
              pointBackgroundColor: "#185FA5",
              pointRadius: 4,
              pointBorderColor: "#fff",
              pointBorderWidth: 1.5,
            },
            {
              label: "Meilleure perf. du club",
              data: clubRadarData,
              borderColor: "#D4AF37",
              backgroundColor: "transparent",
              borderWidth: 2,
              borderDash: [6, 4],
              pointStyle: "triangle",
              pointRadius: 5,
              pointBackgroundColor: "#D4AF37",
            },
            {
              label: "Meilleure perf. catégorie",
              data: catRadarData,
              borderColor: "#d95926",
              backgroundColor: "transparent",
              borderWidth: 1.5,
              borderDash: [2, 3],
              pointStyle: "rect",
              pointRadius: 4,
              pointBackgroundColor: "#d95926",
            },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { top: 4, bottom: 12, left: 4, right: 4 } },
          plugins: { legend: { display: false } },
          scales: {
            r: {
              min: 0, max: 50,
              ticks: { stepSize: 10, color: "#5C7782", backdropColor: "transparent", font: { size: 10 } },
              grid: { color: "rgba(13,94,142,0.12)" },
              angleLines: { color: "rgba(13,94,142,0.12)" },
              pointLabels: { color: "#33414A", font: { family: "Inter", size: 12, weight: "600" } }
            }
          }
        }
      });
    });

    // ── Détail par discipline (au clic sur une puce) ──
    const detailByGroup = {};
    RADAR_GROUPS.forEach(g => {
      const cols = DISPLAY_COLS.filter(c => GROUP_OF_COLKEY[c.key] === g.db);
      const rowsForGroup = [];
      cols.forEach(col => {
        const info = bestByCol[col.key];
        if (!info) return;
        const niveau = getNiveauCotation(info.perf, col.key, table);
        if (!niveau) return;
        const clubBest = bestForColKeyAcross(DB, col.key);
        const catBest = bestForColKeyAcross(catRows, col.key);
        rowsForGroup.push({
          label: info.epreuve.split(" | ")[0],
          perf: info.perf,
          niveau, clubBest, catBest
        });
      });
      detailByGroup[g.label] = rowsForGroup;
    });

    const renderDetail = (label) => {
      const items = detailByGroup[label] || [];
      if (!items.length) {
        detailEl.innerHTML = `<p style="text-align:center;font-size:12.5px;color:var(--grey-dim);font-style:italic;margin:8px 0;">Aucune performance cotable en ${label}.</p>`;
        return;
      }
      detailEl.innerHTML = items.map(it => {
        const color = lvlColorCotation(it.niveau);
        const pct = (it.niveau / 50) * 100;
        const clubPct = (it.clubBest / 50) * 100;
        const catPct = (it.catBest / 50) * 100;
        const icon = it.niveau >= it.clubBest ? "👑 " : (it.niveau >= it.catBest ? "🏆 " : "");
        return `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--line);">
          <div style="width:110px;font-size:12.5px;font-weight:600;color:var(--ink);flex-shrink:0;">${it.label}</div>
          <div style="width:130px;font-size:11.5px;color:var(--grey);flex-shrink:0;">${icon}${it.perf}</div>
          <div style="flex:1;height:6px;background:var(--line-strong);border-radius:3px;position:relative;">
            <div style="width:${pct}%;height:100%;background:${color};border-radius:3px;"></div>
            <div title="Club : ${it.clubBest}" style="position:absolute;left:calc(${clubPct}% - 4px);top:-5px;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:6px solid #D4AF37;"></div>
            <div title="Catégorie : ${it.catBest}" style="position:absolute;left:calc(${catPct}% - 3px);top:8px;width:6px;height:6px;background:#d95926;"></div>
          </div>
          <div style="width:32px;text-align:right;font-size:12.5px;font-weight:700;color:${color};flex-shrink:0;">${it.niveau}</div>
        </div>`;
      }).join("");
    };

    const chipBaseStyle = "font-size:11.5px;padding:4px 11px;border-radius:999px;border:1px solid var(--line-strong);background:#fff;cursor:pointer;color:var(--grey);";
    const chipActiveStyle = "font-size:11.5px;padding:4px 11px;border-radius:999px;border:1px solid #185FA5;background:rgba(24,95,165,0.1);cursor:pointer;color:#185FA5;font-weight:700;";
    chipsEl.innerHTML = "";
    let activeChip = null;
    RADAR_GROUPS.forEach((g, i) => {
      const chip = document.createElement("button");
      chip.textContent = g.label;
      chip.style.cssText = i === 0 ? chipActiveStyle : chipBaseStyle;
      chip.addEventListener("click", () => {
        if (activeChip) activeChip.style.cssText = chipBaseStyle;
        chip.style.cssText = chipActiveStyle;
        activeChip = chip;
        renderDetail(g.label);
      });
      chipsEl.appendChild(chip);
      if (i === 0) activeChip = chip;
    });
    renderDetail(RADAR_GROUPS[0].label);
    };

    anneeSelect.onchange = renderAll;
    renderAll();
  };

  catSelect.onchange = renderForCategory;
  renderForCategory();
}


/* ── Badge cotation dans la fiche athlète (sous les années d'activité) ── */
function renderAthleteCotationBadge(rows) {
  const body = document.getElementById("athleteCardBody");
  if (!body) return;
  if (!rows.length) return;

  // Catégorie et année les plus récentes de l'athlète (ex. Minime 2026, même s'il
  // a aussi des résultats Benjamin 2025 — on ne mélange jamais deux catégories/barèmes
  // différents dans une même moyenne).
  const mostRecentRow = [...rows].sort((a, b) => b.annee - a.annee)[0];
  const currentAnnee = mostRecentRow.annee;
  const currentCatCode = getCatCodeForRecord(mostRecentRow);
  const table = currentCatCode ? loadCotationTable(currentCatCode) : null;
  if (!table) return;

  const rowsCurrent = rows.filter(r => r.annee === currentAnnee && getCatCodeForRecord(r) === currentCatCode);

  const bestByCol = {};
  for (const r of rowsCurrent) {
    const colKey = COTATION_EPREUVE_MAP[r.epreuve];
    if (!colKey) continue;
    const niv = getNiveauFFAForRow(r);
    if (!niv) continue;
    if (!bestByCol[colKey] || niv > bestByCol[colKey]) bestByCol[colKey] = niv;
  }
  const levels = Object.values(bestByCol);
  if (!levels.length) return;

  const avg = (levels.reduce((a,b) => a+b, 0) / levels.length).toFixed(1);
  const color = lvlColorCotation(Math.round(parseFloat(avg)));
  const badge = el("div", {
    style: `display:inline-flex;align-items:center;gap:6px;background:${color}18;
            border:1px solid ${color}44;border-radius:8px;padding:4px 12px;margin-top:8px;`
  }, [
    el("span", { style: `font-size:15px;font-weight:800;color:${color};font-family:var(--font-mono);` }, avg + "/50"),
    el("span", { style: "font-size:11px;color:var(--grey);" }, `Niveau moyen FFA (${currentAnnee}, ${levels.length} épr.)`)
  ]);
  body.appendChild(badge);
}

/* ── Vue synthétique cotation dans le tableau de bord ── */
let dashCotCharts = {};

function renderDashCotation(rowsFiltered) {
  const panel = document.getElementById("dashCotationPanel");
  const catSel = document.getElementById("dashCotCat");
  const anneeSel = document.getElementById("dashCotAnnee");
  const sexeSel = document.getElementById("dashCotSexe");
  const grid = document.getElementById("dashCotGrid");
  if (!panel || !catSel || !grid) return;

  // Construire les paires disponibles (au moins une table M ou F chargée)
  const PAIRS = [
    { code: "BE", label: "Benjamin / Benjamine", catM: "BEM", catF: "BEF" },
    { code: "MI", label: "Minime M / Minime F",  catM: "MIM", catF: "MIF" },
    { code: "CA", label: "Cadet / Cadette",       catM: "CAM", catF: "CAF" },
    { code: "JU", label: "Junior M / Junior F",   catM: "JUM", catF: "JUF" },
  ];
  const availablePairs = PAIRS.filter(p => loadCotationTable(p.catM) || loadCotationTable(p.catF));
  if (!availablePairs.length) { panel.style.display = "none"; return; }
  panel.style.display = "block";

  if (!catSel._populated) {
    catSel.innerHTML = availablePairs.map(p => `<option value="${p.code}">${p.label}</option>`).join("");
    catSel.addEventListener("change", () => renderCotSynth());
    catSel._populated = true;
  }

  const years = [...new Set(DB.map(r => r.annee))].sort().reverse();
  anneeSel.innerHTML = `<option value="best">Toutes années</option>` +
    years.map(y => `<option value="${y}">${y}</option>`).join("");
  if (!anneeSel._init) {
    anneeSel.addEventListener("change", () => renderCotSynth());
    anneeSel._init = true;
  }
  if (sexeSel && !sexeSel._init) {
    sexeSel.addEventListener("change", () => renderCotSynth());
    sexeSel._init = true;
  }

  renderCotSynth();
}

function renderCotSynth() {
  const catSel = document.getElementById("dashCotCat");
  const anneeSel = document.getElementById("dashCotAnnee");
  const sexeSel = document.getElementById("dashCotSexe");
  const grid = document.getElementById("dashCotGrid");
  if (!catSel || !anneeSel || !grid) return;

  const pairCode = catSel.value; // ex: "BE", "MI"
  const code = pairCode; // gardé pour compatibilité variable locale
  const annee = anneeSel.value;
  const sexeFilter = sexeSel ? sexeSel.value : "all";
  const showBoth = (annee !== "best");

  const codeM = pairCode + "M";
  const codeF = pairCode + "F";
  const tableM = loadCotationTable(codeM);
  const tableF = loadCotationTable(codeF);
  // Utiliser la première table disponible (les deux ont la même structure)
  const table = tableM || tableF;
  if (!table) return;

  // Catégorie d'âge (commune M et F)
  const catInfoM = COTATION_CATS[codeM];
  const catInfoF = COTATION_CATS[codeF];
  if (!catInfoM && !catInfoF) return;
  // Catégories d'âge possibles (ex: "Benjamin" et "Benjamine")
  const categorieNames = [
    catInfoM ? catInfoM.categorie.toLowerCase() : null,
    catInfoF ? catInfoF.categorie.toLowerCase() : null,
  ].filter(Boolean);

  // Fonction pour récupérer les athlètes selon le filtre sexe
  const getAthletes = (anneeFilter, sexe) => {
    let rows = DB.filter(r => {
      const cat = (r.categorie || "").toLowerCase();
      const catMatch = categorieNames.includes(cat);
      const sexMatch = sexe === "all" || r.sexe === sexe;
      return catMatch && sexMatch;
    });
    if (anneeFilter !== "best") rows = rows.filter(r => String(r.annee) === anneeFilter);
    return rows;
  };

  const athletesAll  = getAthletes("best", sexeFilter);
  const athletesYear = getAthletes(annee, sexeFilter);

  // Détruire les anciens graphiques
  Object.values(dashCotCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  dashCotCharts = {};
  grid.innerHTML = "";

  const cols = COTATION_COLS.filter(c => c.key !== "pts" && c.key !== "4x60mMixte" && c.sens
    && table.length && Object.prototype.hasOwnProperty.call(table[0], c.key));

  cols.forEach(col => {
    // Distribution "toutes années" (fond grisé quand annee filtrée)
    const buildColDist = (athletes) => {
      const noms = [...new Set(athletes.map(r => r.nom))];
      const dist = {};
      for (const nom of noms) {
        const perfsNom = athletes.filter(r => r.nom === nom && COTATION_EPREUVE_MAP[r.epreuve] === col.key);
        if (!perfsNom.length) continue;
        let best = null;
        for (const r of perfsNom) {
          const val = perfToTableValue(r.performance, col.key);
          if (!val) continue;
          if (!best || (col.sens === "vitesse" ? val < best.val : val > best.val))
            best = { val, perf: r.performance, nom };
        }
        if (!best) continue;
        const niv = getNiveauCotation(best.perf, col.key, table);
        if (!niv) continue;
        if (!dist[niv]) dist[niv] = [];
        dist[niv].push(nom);
      }
      return dist;
    };

    const distAll  = buildColDist(athletesAll);
    const distYear = buildColDist(athletesYear);
    const totalAll  = Object.values(distAll).reduce((a,b) => a+b.length, 0);
    const totalYear = Object.values(distYear).reduce((a,b) => a+b.length, 0);

    if (totalAll === 0) return; // pas de données du tout, on affiche quand même une carte vide

    const labels = Array.from({length:50},(_,i)=>i+1);
    const valsAll  = labels.map(n => (distAll[n]||[]).length);
    const valsYear = labels.map(n => (distYear[n]||[]).length);
    const colors   = labels.map(n => lvlColorCotation(n));

    const activeTotal = showBoth ? totalYear : totalAll;
    const activeDist  = showBoth ? distYear  : distAll;
    const avg = activeTotal > 0
      ? (Object.entries(activeDist).reduce((a,[n,ns]) => a + parseInt(n)*ns.length, 0) / activeTotal).toFixed(1)
      : null;
    const avgColor = avg ? lvlColorCotation(Math.round(parseFloat(avg))) : "#ccc";

    const id = `dashcot_${col.key}`;
    const card = document.createElement("div");
    card.className = "cot-synth-card";

    const avgBadge = avg
      ? `<span style="font-size:11px;font-weight:700;color:${avgColor};background:${avgColor}18;border-radius:5px;padding:1px 6px;">⌀ ${avg}/50</span>`
      : "";

    const legendHtml = showBoth ? `
      <div class="synth-legend" style="margin-top:4px;">
        <span><span class="dot-year" style="background:#ccc;opacity:.6;display:inline-block;width:10px;height:10px;border-radius:2px;"></span> Toutes années (${totalAll})</span>
        <span><span class="dot-year" style="background:var(--bleu);display:inline-block;width:10px;height:10px;border-radius:2px;"></span> ${annee} (${totalYear})</span>
      </div>` : "";

    card.innerHTML = `
      <div class="cot-synth-card-title">
        <span>${col.label} ${avgBadge}</span>
        <span style="font-size:11px;font-weight:400;color:var(--grey)">${showBoth ? totalYear+"/"+totalAll : totalAll} ath.</span>
      </div>
      <div class="cot-synth-chart"><canvas id="${id}"></canvas></div>
      ${legendHtml}`;
    grid.appendChild(card);

    requestAnimationFrame(() => {
      const ctx = document.getElementById(id);
      if (!ctx) return;
      const datasets = [];
      if (showBoth) {
        datasets.push({
          label: "Toutes années",
          data: valsAll,
          backgroundColor: "rgba(180,180,180,0.35)",
          borderColor: "rgba(180,180,180,0.5)",
          borderWidth: 1, borderRadius: 2, barPercentage: 0.85, order: 2
        });
      }
      datasets.push({
        label: annee === "best" ? "Toutes années" : annee,
        data: valsYear,
        backgroundColor: colors,
        borderRadius: 2, barPercentage: 0.85, order: 1
      });

      dashCotCharts[col.key] = new Chart(ctx.getContext("2d"), {
        type: "bar",
        data: { labels, datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: i => `Niveau ${i[0].label}/50`,
                label: i => {
                  const n = i.label;
                  const isAllDs = showBoth && i.datasetIndex === 0;
                  const names = (isAllDs ? distAll[n] : distYear[n]) || [];
                  if (!i.raw) return null;
                  const lbl = isAllDs ? "Toutes années" : (annee === "best" ? "Toutes années" : annee);
                  return [`${lbl} : ${i.raw} athlète(s)`, ...names.map(nm => `· ${nm}`)];
                }
              },
              displayColors: false,
              backgroundColor: "rgba(16,36,52,.92)",
              titleColor: "#fff", bodyColor: "#c8dde8",
              padding: 8, bodyFont: { size: 11 }
            }
          },
          scales: {
            x: {
              title: { display: false },
              ticks: {
                font: { size: 9 }, color: "#aaa",
                maxRotation: 0, autoSkip: false,
                callback: (v, i) => [1,10,20,30,40,50].includes(labels[i]) ? labels[i] : ""
              },
              grid: { display: false }
            },
            y: {
              beginAtZero: true, min: 0,
              ticks: { stepSize: 1, precision: 0, font: { size: 9 }, color: "#aaa" },
              grid: { color: "rgba(13,94,142,.05)" }
            }
          }
        }
      });
    });
  });
}
