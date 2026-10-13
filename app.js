/* ===========================================================
   BSGA Palmarès
   ===========================================================
   © Kevin Marq Product — Tous droits réservés.
   Toute reproduction, distribution ou revente de cette application,
   en tout ou partie, sans autorisation écrite préalable est interdite.
   =========================================================== */

const APP_VERSION = "0.50";

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

// ── Épreuves du barème World Athletics (cadets → masters, engins seniors) ──
// wa = nom de l'épreuve dans WA_COEFFS ; m / f = libellé selon le sexe (engins, hauteurs de haies).
const WA_EVENTS = [
  { key: "wa_50m",   wa: "50m",   fmt: "SSCC", m: "50m", f: "50m" },
  { key: "wa_60m",   wa: "60m",   fmt: "SSCC", m: "60m", f: "60m" },
  { key: "wa_100m",  wa: "100m",  fmt: "SSCC", m: "100m", f: "100m" },
  { key: "wa_200m",  wa: "200m",  fmt: "SSCC", m: "200m", f: "200m" },
  { key: "wa_200msh",wa: "200m sh", fmt: "SSCC", m: "200m salle", f: "200m salle" },
  { key: "wa_300m",  wa: "300m",  fmt: "SSCC", m: "300m", f: "300m" },
  { key: "wa_400m",  wa: "400m",  fmt: "SSCC", m: "400m", f: "400m" },
  { key: "wa_400msh",wa: "400m sh", fmt: "SSCC", m: "400m salle", f: "400m salle" },
  { key: "wa_50mH",  wa: "50mH",  fmt: "SSCC", m: "50m haies (106)", f: "50m haies (84)" },
  { key: "wa_60mH",  wa: "60mH",  fmt: "SSCC", m: "60m haies (106)", f: "60m haies (84)" },
  { key: "wa_100mH", wa: "100mH", fmt: "SSCC", m: null, f: "100m haies (84)" },
  { key: "wa_110mH", wa: "110mH", fmt: "SSCC", m: "110m haies (106)", f: null },
  { key: "wa_400mH", wa: "400mH", fmt: "SSCC", m: "400m haies (91)", f: "400m haies (76)" },
  { key: "wa_800m",  wa: "800m",  fmt: "MMSSCC", m: "800m", f: "800m" },
  { key: "wa_800msh",wa: "800m sh", fmt: "MMSSCC", m: "800m salle", f: "800m salle" },
  { key: "wa_1000m", wa: "1000m", fmt: "MMSSCC", m: "1000m", f: "1000m" },
  { key: "wa_1500m", wa: "1500m", fmt: "MMSSCC", m: "1500m", f: "1500m" },
  { key: "wa_1500msh",wa: "1500m sh", fmt: "MMSSCC", m: "1500m salle", f: "1500m salle" },
  { key: "wa_mile",  wa: "Mile",  fmt: "MMSSCC", m: "Mile", f: "Mile" },
  { key: "wa_3000m", wa: "3000m", fmt: "MMSSCC", m: "3000m", f: "3000m" },
  { key: "wa_3000msh",wa: "3000m sh", fmt: "MMSSCC", m: "3000m salle", f: "3000m salle" },
  { key: "wa_5000m", wa: "5000m", fmt: "MMSSCC", m: "5000m", f: "5000m" },
  { key: "wa_10000m",wa: "10000m",fmt: "MMSSCC", m: "10 000m", f: "10 000m" },
  { key: "wa_2000sc",wa: "2000m SC", fmt: "MMSSCC", m: "2000m steeple (91)", f: "2000m steeple (76)" },
  { key: "wa_3000sc",wa: "3000m SC", fmt: "MMSSCC", m: "3000m steeple (91)", f: "3000m steeple (76)" },
  { key: "wa_r5k",   wa: "Road 5 km", fmt: "HMMSS", m: "5 km route", f: "5 km route" },
  { key: "wa_r10k",  wa: "Road 10 km", fmt: "HMMSS", m: "10 km route", f: "10 km route" },
  { key: "wa_rhm",   wa: "Road HM", fmt: "HMMSS", m: "Semi-marathon", f: "Semi-marathon" },
  { key: "wa_rmar",  wa: "Road Marathon", fmt: "HMMSS", m: "Marathon", f: "Marathon" },
  { key: "wa_3000w", wa: "3000mW", fmt: "MMSSCC", m: "3000m marche", f: "3000m marche" },
  { key: "wa_5000w", wa: "5000mW", fmt: "MMSSCC", m: "5000m marche", f: "5000m marche" },
  { key: "wa_r10kw", wa: "Road 10kmW", fmt: "HMMSS", m: "10 km marche", f: "10 km marche" },
  { key: "wa_r20kw", wa: "Road 20kmW", fmt: "HMMSS", m: "20 km marche", f: "20 km marche" },
  { key: "wa_HJ",    wa: "HJ", fmt: "CM", m: "Hauteur", f: "Hauteur" },
  { key: "wa_PV",    wa: "PV", fmt: "CM", m: "Perche", f: "Perche" },
  { key: "wa_LJ",    wa: "LJ", fmt: "CM", m: "Longueur", f: "Longueur" },
  { key: "wa_TJ",    wa: "TJ", fmt: "CM", m: "Triple saut", f: "Triple saut" },
  { key: "wa_SP",    wa: "SP", fmt: "CM", m: "Poids 7.26kg", f: "Poids 4kg" },
  { key: "wa_DT",    wa: "DT", fmt: "CM", m: "Disque 2kg", f: "Disque 1kg" },
  { key: "wa_HT",    wa: "HT", fmt: "CM", m: "Marteau 7.26kg", f: "Marteau 4kg" },
  { key: "wa_JT",    wa: "JT", fmt: "CM", m: "Javelot 800g", f: "Javelot 600g" },
];
WA_EVENTS.forEach(e => COTATION_COLS.push({ key: e.key, label: e.m || e.f, fmt: e.fmt, sens: e.fmt === "CM" ? "distance" : "vitesse", wa: e.wa }));

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

// Les noms d'épreuves d'athle.fr varient (« 50m - salle », « 50m haies (65)-salle »,
// « 1 000m piste courte », « Longueur | Vent : VR »…) : on compare sur un nom normalisé.
function normEpForCotation(e) {
  return String(e || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s*\|\s*vent\s*:.*$/, "")
    .replace(/\s*-\s*salle\s*$/, "")
    .replace(/\s+piste courte\s*$/, "")
    .replace(/\s+/g, " ").trim();
}
const COTATION_EPREUVE_MAP_NORM = {};
Object.keys(COTATION_EPREUVE_MAP).forEach(k => { COTATION_EPREUVE_MAP_NORM[normEpForCotation(k)] = COTATION_EPREUVE_MAP[k]; });
function cotationColFor(epreuve) {
  return COTATION_EPREUVE_MAP[epreuve] || COTATION_EPREUVE_MAP_NORM[normEpForCotation(epreuve)] || null;
}

const STORAGE_KEY = "club077108_resultats_v1";

let DB = [];          // tableau de records {id, annee, sexe, club, groupe, epreuve, place, performance, nom}
let NEXT_ID = 1;
let pendingImport = []; // résultats analysés en attente de validation (page import)

/* ---------------- Catégories d'âge FFA ----------------
   Barème officiel (athle.fr, « Les catégories d'âge en 2027 ») : âge atteint dans
   l'année de fin de saison. Masters subdivisés par tranches de 5 ans :
   M0 35-39 ans, M1 40-44 … M9 80-84, M10 85 ans et plus. */
function catFamily(label) {
  const s = String(label || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/baby/.test(s)) return "Baby Athlé";
  if (/eveil|ecole/.test(s)) return "Éveil Athlétique";
  if (/poussin/.test(s)) return "Poussins";
  if (/benjamin/.test(s)) return "Benjamins";
  if (/minime/.test(s)) return "Minimes";
  if (/cadet/.test(s)) return "Cadets";
  if (/junior/.test(s)) return "Juniors";
  if (/espoir/.test(s)) return "Espoirs";
  if (/senior/.test(s)) return "Seniors";
  if (/master|veteran/.test(s)) return "Masters";
  return "Non déterminée";
}
const CAT_FAMILY_ORDER = ["Baby Athlé", "Éveil Athlétique", "Poussins", "Benjamins", "Minimes", "Cadets", "Juniors", "Espoirs", "Seniors", "Masters", "Non déterminée"];
function masterSubCode(age) {
  if (!(age >= 35)) return null;
  return "M" + Math.min(10, Math.floor((age - 35) / 5));
}
function masterSubRange(code) {
  const k = parseInt(String(code).replace(/\D/g, ""), 10);
  if (isNaN(k)) return "";
  return k >= 10 ? "85 ans et plus" : `${35 + 5 * k}-${39 + 5 * k} ans`;
}
// Catégorie affichée d'un résultat (au moment du résultat) : « Master M2 » quand
// l'année de naissance est connue, libellés alignés sur la FFA.
function catLabel(r) {
  const base = (r && r.categorie) || "Non déterminée";
  const fam = catFamily(base);
  if (fam === "Masters") {
    const age = (parseInt(r.annee, 10) || 0) - (parseInt(r.anneeNaissance, 10) || 0);
    const sub = r.anneeNaissance ? masterSubCode(age) : null;
    return sub ? "Master " + sub : "Master";
  }
  if (fam === "Éveil Athlétique") return "Éveil Athlétique";
  return base;
}
function catSortKey(label) {
  const fam = catFamily(label);
  let k = CAT_FAMILY_ORDER.indexOf(fam) * 100;
  const m = String(label).match(/\bM(\d+)\b/);
  if (fam === "Masters") k += m ? 1 + parseInt(m[1], 10) : 0;
  if (/(ine|ette)$/i.test(String(label))) k += 0.5;
  return k;
}
function sortCategories(list) { return [...list].sort((a, b) => catSortKey(a) - catSortKey(b) || String(a).localeCompare(String(b), "fr")); }
const ALL_MASTERS_OPTION = "Masters (toutes tranches)";

/* ---------------- Stockage local (localStorage) ---------------- */
// Stockage compact : on n'écrit pas les champs qui se recalculent (club du BSGA,
// discipline déduite de l'épreuve) pour rester sous la limite de stockage des
// navigateurs (~5 Mo) avec plus de 10 000 résultats.
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map(r => {
          if (!r.club) r.club = "077108";
          if (!r.groupe) r.groupe = guessGroupe(r.epreuve || "");
          return r;
        });
      }
    }
  } catch (e) { console.warn("Lecture storage impossible", e); }
  return null;
}

let STORAGE_FAILED = false;
function saveToStorage() {
  try {
    const compact = DB.map(r => {
      const o = {};
      Object.keys(r).forEach(k => {
        if (k.startsWith("_") || r[k] === undefined || r[k] === "") return;
        if (k === "club" && r.club === "077108") return;
        if (k === "groupe" && r.groupe === guessGroupe(r.epreuve || "")) return;
        o[k] = r[k];
      });
      return o;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
    STORAGE_FAILED = false;
    return true;
  } catch (e) {
    console.warn("Sauvegarde storage impossible", e);
    if (!STORAGE_FAILED && typeof toast === "function") {
      setTimeout(() => toast("Attention : l'espace de stockage du navigateur est plein, les derniers ajouts ne seront pas conservés après fermeture. Exportez la base (page Base de données).", "error"), 500);
    }
    STORAGE_FAILED = true;
    return false;
  }
}

function ensureCategorie(r) {
  if (!r.categorie) r.categorie = guessCategorie(r.epreuve);
  return r;
}

/* ---------------- Base publiée en ligne (data.js) ----------------
   data.js contient la base "officielle" publiée sur GitHub, avec un numéro de
   version (SEED_VERSION). Au démarrage, si cette version n'a pas encore été
   intégrée sur cet appareil, on AJOUTE les résultats qui manquent (rien n'est
   supprimé ni écrasé) et on complète les dates de naissance inconnues. */
const SEED_APPLIED_KEY = "bsga_seed_version_appliquee";
let SEED_MERGE_REPORT = null;

function getSeedVersion() { return typeof SEED_VERSION !== "undefined" ? String(SEED_VERSION) : ""; }
function getSeedBirthdates() { return typeof SEED_BIRTHDATES !== "undefined" && SEED_BIRTHDATES ? SEED_BIRTHDATES : {}; }

function mergeSeedBirthdates() {
  const seedB = getSeedBirthdates();
  const local = loadBirthdates();
  let added = 0;
  Object.keys(seedB).forEach(nom => { if (!local[nom] && seedB[nom]) { local[nom] = seedB[nom]; added++; } });
  if (added) { try { localStorage.setItem(BIRTHDATES_KEY, JSON.stringify(local)); } catch (e) { console.error(e); } }
  return added;
}

/* ---------- Fusion d'une liste de résultats dans la base ----------
   - même résultat (année, sexe, épreuve, athlète, performance) : on le complète
     avec les informations de la source (place, chrono, date, lieu, catégorie FFA) ;
   - même performance mais épreuve renommée par athle.fr (ex. "50m" → "50m - salle",
     "200m" → "200m piste courte") : on adopte le nouveau nom au lieu de créer un doublon ;
   - sinon : nouveau résultat ajouté. Rien n'est jamais supprimé. */
function looseKey(r) {
  return [normStr(r.annee), normStr(r.sexe), normStr(r.nom), normPerf(r.performance)].join("|");
}
function isRenamedEpreuve(oldEp, newEp) {
  const a = normEpreuve(oldEp), b = normEpreuve(newEp);
  if (!a || !b || a === b || !b.startsWith(a)) return false;
  return /^\s*-?\s*(SALLE|PISTE COURTE)\b/.test(b.slice(a.length));
}
function refreshRecordFrom(t, n) {
  if (n.place !== undefined && n.place !== "") t.place = String(n.place);
  ["chrono", "date", "lieu", "anneeNaissance"].forEach(f => { if (n[f]) t[f] = n[f]; });
  if (n.categorie && n.categorie !== "Non déterminée") t.categorie = n.categorie;
}
// Supprime les doublons stricts (même année, sexe, épreuve, athlète et performance),
// en gardant l'exemplaire le plus complet (avec date/lieu/chrono). Modifie le tableau.
function removeExactDuplicates(arr) {
  const score = r => (r.date ? 2 : 0) + (r.lieu ? 1 : 0) + (r.chrono ? 1 : 0);
  const best = new Map();
  arr.forEach((r, i) => {
    const k = recordKey(r);
    const cur = best.get(k);
    if (cur === undefined || score(r) > score(arr[cur])) best.set(k, i);
  });
  const keep = new Set(best.values());
  const before = arr.length;
  const kept = arr.filter((r, i) => keep.has(i));
  arr.length = 0;
  kept.forEach(r => arr.push(r));
  return before - arr.length;
}

function mergeRecordsInto(target, incoming) {
  const inByKey = new Map();
  incoming.forEach(r => { const k = recordKey(r); if (!inByKey.has(k)) inByKey.set(k, r); });
  const loose = new Map();
  inByKey.forEach((r, k) => { const lk = looseKey(r); if (!loose.has(lk)) loose.set(lk, []); loose.get(lk).push({ r, k }); });
  const used = new Set();
  const stats = { refreshed: 0, renamed: 0, added: 0 };
  target.forEach(t => {
    const k = recordKey(t);
    const n = inByKey.get(k);
    if (n && !used.has(k)) { used.add(k); refreshRecordFrom(t, n); stats.refreshed++; return; }
    const m = (loose.get(looseKey(t)) || []).find(c => !used.has(c.k) && isRenamedEpreuve(t.epreuve, c.r.epreuve));
    if (m) {
      used.add(m.k);
      t.epreuve = m.r.epreuve;
      if (m.r.groupe) t.groupe = m.r.groupe;
      refreshRecordFrom(t, m.r);
      stats.renamed++;
    }
  });
  inByKey.forEach((n, k) => {
    if (used.has(k)) return;
    target.push(ensureCategorie({ ...n, id: NEXT_ID++ }));
    stats.added++;
  });
  return stats;
}

function initDB() {
  const stored = loadFromStorage();
  const seedVersion = getSeedVersion();
  let applied = "";
  try { applied = localStorage.getItem(SEED_APPLIED_KEY) || ""; } catch (e) {}

  if (stored) {
    DB = stored.map(ensureCategorie);
    NEXT_ID = DB.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1;
    if (seedVersion && seedVersion !== applied) {
      const st = mergeRecordsInto(DB, SEED_DATA);
      removeExactDuplicates(DB);
      const added = st.added;
      const bAdded = mergeSeedBirthdates();
      const saved = saveToStorage();
      SEED_MERGE_REPORT = { version: seedVersion, added, birthdates: bAdded, renamed: st.renamed };
      // Si l'enregistrement a échoué, on refera la fusion au prochain démarrage.
      if (saved) { try { localStorage.setItem(SEED_APPLIED_KEY, seedVersion); } catch (e) {} }
    }
  } else {
    DB = SEED_DATA.map(r => ensureCategorie({...r}));
    NEXT_ID = DB.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1;
    mergeSeedBirthdates();
    if (saveToStorage() && seedVersion) { try { localStorage.setItem(SEED_APPLIED_KEY, seedVersion); } catch (e) {} }
  }
}

// Génère le fichier data.js à publier sur GitHub (base actuelle + dates de naissance).
function buildDataJsForPublication() {
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  const version = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const records = [...DB]
    .sort((a, b) => (a.annee - b.annee) || String(a.sexe).localeCompare(String(b.sexe)) || String(a.epreuve).localeCompare(String(b.epreuve), "fr") || String(a.nom).localeCompare(String(b.nom), "fr"))
    .map((r, i) => {
      const o = { ...r, id: i + 1 };
      Object.keys(o).forEach(k => { if (k.startsWith("_") || o[k] === undefined) delete o[k]; });
      return o;
    });
  const years = uniqueSorted(records.map(r => r.annee));
  const birthdates = loadBirthdates();
  const lines = [
    "// Base BSGA Palmarès publiée — générée par l'application le " + now.toLocaleString("fr-FR") + ".",
    "// " + records.length + " résultats (" + years.join(", ") + "), " + Object.keys(birthdates).length + " dates de naissance.",
    "// Ce fichier remplace data.js sur GitHub : chaque appareil y ajoutera automatiquement les résultats qui lui manquent.",
    "// © Kevin Marq Product — Tous droits réservés.",
    "const SEED_VERSION = " + JSON.stringify(version) + ";",
    "const SEED_LAST_IMPORT = " + JSON.stringify(getLastImport() || null) + ";",
    "const SEED_BIRTHDATES = " + JSON.stringify(birthdates, null, 1) + ";",
    "const SEED_DATA = [",
    records.map(r => "  " + JSON.stringify(r)).join(",\n"),
    "];",
    ""
  ];
  return { content: lines.join("\n"), count: records.length, birthdates: Object.keys(birthdates).length, version };
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

/* ---------- Chronométrage électrique / manuel ----------
   athle.fr indique pour chaque course "E" (électrique) ou "M" (manuel).
   Pour les résultats plus anciens sans cette information, on la déduit du format :
   un temps au centième (7''76) est électrique, un temps au dixième (7''6) est manuel.
   Les deux ne sont pas comparables : classements, records et meilleures performances
   sont donc établis séparément pour les temps manuels. */
function getChronoType(r) {
  const c = String(r.chrono || "").trim().toUpperCase();
  if (c === "E" || c === "M") return c;
  const perf = String(r.performance || "").replace(/\(.*?\)/g, "").trim();
  const m = perf.match(/(?:''|"|″)\s*(\d+)\s*$/);
  if (!m) return null;
  if (m[1].length >= 2) return "E";
  if (m[1].length === 1) return "M";
  return null;
}
// Classement séparé (par défaut) : les temps manuels forment leur propre classement.
// Mode "combiné" (filtre Chronométrage) : électrique et manuel dans un même classement.
function epKeySeparate(r) {
  return normEpreuve(r.epreuve) + (getChronoType(r) === "M" ? "#manuel" : "");
}
function isChronoCombined() {
  return typeof explorerFilters !== "undefined" && explorerFilters.chrono === "C";
}
function epKey(r) {
  return isChronoCombined() ? normEpreuve(r.epreuve) : epKeySeparate(r);
}
function chronoBadge(r) {
  const t = getChronoType(r);
  if (t === "M") return el("span", { class: "chrono-badge man", title: "Chronométrage manuel" }, "manuel");
  if (t === "E") return el("span", { class: "chrono-badge elec", title: "Chronométrage électrique" }, "élec.");
  return "";
}
function chronoLabel(r) {
  const t = getChronoType(r);
  return t === "M" ? "Manuel" : t === "E" ? "Électrique" : "";
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
      if (btn.dataset.page === "cotation") renderCotationPage();
      // Sur mobile, remonter en haut de page à chaque changement d'écran
      window.scrollTo(0, 0);
    });
  });
}

/* ---------- Date du dernier import de résultats ----------
   Mémorisée sur l'appareil à chaque validation d'import, et publiée dans data.js
   (SEED_LAST_IMPORT) : on affiche la plus récente des deux. */
const LAST_IMPORT_KEY = "bsga_dernier_import";
function getLastImport() {
  let local = null;
  try { local = JSON.parse(localStorage.getItem(LAST_IMPORT_KEY) || "null"); } catch (e) {}
  const seed = (typeof SEED_LAST_IMPORT !== "undefined" && SEED_LAST_IMPORT) ? SEED_LAST_IMPORT : null;
  if (local && seed) return String(local.date) >= String(seed.date) ? local : seed;
  return local || seed;
}
function setLastImport(count, years) {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  const iso = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  try { localStorage.setItem(LAST_IMPORT_KEY, JSON.stringify({ date: iso, count, years })); } catch (e) {}
}
function formatImportDate(info, withTime) {
  if (!info || !info.date) return "jamais";
  const [d, t] = String(info.date).split("T");
  const [y, m, j] = d.split("-");
  return `${j}/${m}/${y}` + (withTime && t ? ` à ${t.slice(0,5).replace(":", "h")}` : "");
}
// Date de la performance la plus récente de la base (champ "date" au format JJ/MM/AA)
function getLatestResultDate() {
  let best = null, bestKey = "";
  DB.forEach(r => {
    const m = String(r.date || "").match(/^(\d{2})\/(\d{2})\/(\d{2,4})$/);
    if (!m) return;
    const y = m[3].length === 2 ? "20" + m[3] : m[3];
    const key = y + m[2] + m[1];
    if (key > bestKey) { bestKey = key; best = `${m[1]}/${m[2]}/${y}`; }
  });
  return best;
}

function updateSidebarCount() {
  // Mettre à jour tous les compteurs (sidebar desktop + header mobile)
  document.querySelectorAll("#sb-count, #sb-count-mobile").forEach(el => {
    el.textContent = DB.length;
  });
  const info = getLastImport();
  const latest = getLatestResultDate();
  const sb = document.getElementById("sb-last-import");
  if (sb) sb.textContent = "Dernier import : " + formatImportDate(info, false);
  const imp = document.getElementById("importLastImport");
  if (imp) {
    imp.innerHTML = "";
    const parts = [el("span", {}, "Dernier import des résultats : "), el("b", {}, formatImportDate(info, true))];
    if (info && info.count) {
      const ys = info.years || [];
      parts.push(el("span", {}, ` · ${info.count} résultat${info.count > 1 ? "s" : ""} ajouté${info.count > 1 ? "s" : ""}` +
        (ys.length ? ` (${ys.length > 3 ? ys[0] + "–" + ys[ys.length - 1] : ys.join(", ")})` : "")));
    }
    if (latest) parts.push(el("span", {}, " · résultats jusqu'au "), el("b", {}, latest));
    parts.forEach(p => imp.appendChild(p));
  }
  const dash = document.getElementById("dashLastImport");
  if (dash) {
    dash.textContent = "Dernier import des résultats : " + formatImportDate(info, true) +
      (latest ? ` · résultats jusqu'au ${latest}` : "");
  }
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
  // Familles de catégories (garçons et filles ensemble : Benjamins = benjamins + benjamines)
  const CATEGORIE_ORDER = CAT_FAMILY_ORDER;
  const CATEGORIE_COLORS = {
    "Baby Athlé": "#D6E6EE", "Éveil Athlétique": "#BBD6E4", "Poussins": "#A3CBE0",
    "Benjamins": "#7FB3D5", "Minimes": "#5499C7", "Cadets": "#2E86C1",
    "Juniors": "#E8411A", "Espoirs": "#C9390F", "Seniors": "#0D5E8E",
    "Masters": "#D4AF37", "Non déterminée": "#C3D3D8"
  };
  const athleteCategorie = {};
  rows.forEach(r => {
    const n = (r.nom || "").trim();
    if (!n) return; // resultats sans athlete nomme (relais) : exclus du comptage par athlete
    const key = normStr(n);
    if (!athleteCategorie[key]) athleteCategorie[key] = catFamily(r.categorie);
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
let explorerFilters = { annee: [], sexe: [], groupe: [], epreuve: [], categorie: [], nom: "", podium: "", record: "", chrono: "" };

function populateExplorerFilters() {
  setMultiOptions("f-annee", uniqueSorted(DB.map(r => r.annee)).reverse());
  syncYearChips("f-annee");
  setMultiOptions("f-sexe", uniqueSorted(DB.map(r => r.sexe)));
  setMultiOptions("f-groupe", uniqueSorted(DB.map(r => r.groupe)));
  const catValues = sortCategories([...new Set(DB.map(catLabel))]);
  if (catValues.some(c => /^Master M/.test(c))) catValues.splice(catValues.findIndex(c => catFamily(c) === "Masters"), 0, ALL_MASTERS_OPTION);
  setMultiOptions("f-categorie", catValues);
  refreshEpreuveOptions();
}

/* Pastilles d'années (choix multiple) reliées à un <select multiple> caché, qui reste
   la source des valeurs pour le reste du code. Aucune pastille = toutes les années. */
function yearsLabel(years) {
  const ys = years.map(Number).sort((a, b) => a - b);
  if (!ys.length) return "Toutes années";
  const contiguous = ys.every((y, i) => i === 0 || y === ys[i - 1] + 1);
  if (ys.length >= 3 && contiguous) return `${ys[0]}–${ys[ys.length - 1]}`;
  return ys.join(", ");
}
function syncYearChips(selectId) {
  const sel = document.getElementById(selectId);
  const box = document.getElementById(selectId + "-chips");
  if (!sel || !box) return;
  const values = Array.from(sel.options).map(o => o.value);
  const chosen = new Set(Array.from(sel.selectedOptions).map(o => o.value));
  // (re)construction si la liste des années a changé
  if (box.dataset.values !== values.join(",")) {
    box.dataset.values = values.join(",");
    box.innerHTML = "";
    const all = el("button", { type: "button", class: "cot-chip year-chip", "data-v": "" }, box.dataset.allLabel || "Toutes");
    all.addEventListener("click", () => {
      Array.from(sel.options).forEach(o => { o.selected = false; });
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    });
    box.appendChild(all);
    values.forEach(v => {
      const b = el("button", { type: "button", class: "cot-chip year-chip", "data-v": v }, v);
      b.addEventListener("click", () => {
        const o = Array.from(sel.options).find(x => x.value === v);
        if (o) o.selected = !o.selected;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      });
      box.appendChild(b);
    });
  }
  box.querySelectorAll(".year-chip").forEach(b => {
    const v = b.dataset.v;
    const on = v === "" ? chosen.size === 0 : chosen.has(v);
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
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
  explorerFilters.chrono = document.getElementById("f-chrono") ? document.getElementById("f-chrono").value : "";
}

function applyExplorerFilters() {
  let rows = DB;
  const f = explorerFilters;
  if (f.annee.length) rows = rows.filter(r => f.annee.includes(String(r.annee)));
  if (f.sexe.length) rows = rows.filter(r => f.sexe.includes(String(r.sexe)));
  if (f.groupe.length) rows = rows.filter(r => f.groupe.includes(r.groupe));
  if (f.epreuve.length) rows = rows.filter(r => f.epreuve.includes(r.epreuve));
  if (f.categorie.length) rows = rows.filter(r => f.categorie.includes(catLabel(r)) ||
    (f.categorie.includes(ALL_MASTERS_OPTION) && catFamily(r.categorie) === "Masters"));
  if (f.nom) {
    const q = normStr(f.nom);
    rows = rows.filter(r => normStr(r.nom).includes(q));
  }
  if (f.chrono === "E") rows = rows.filter(r => getChronoType(r) === "E");
  if (f.chrono === "M") rows = rows.filter(r => getChronoType(r) === "M");
  if (f.podium === "1") rows = rows.filter(r => String(r.place) === "1");
  if (f.podium === "podium") rows = rows.filter(r => ["1","2","3"].includes(String(r.place)));
  if (f.record) {
    const clubRecords = computeClubRecords();
    const clubRecordsAbs = computeClubRecordsAbsolute();
    rows = rows.filter(r => {
      const recKey = epKey(r) + "|" + normStr(catLabel(r));
      const isRecordAbs = clubRecordsAbs.has(epKey(r)) && clubRecordsAbs.get(epKey(r)).ids.has(r.id);
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
         f.epreuve.length > 0 || f.categorie.length > 0 || !!f.nom || !!f.podium || !!f.record || !!f.chrono;
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
    const parts = [epKey(r)];
    if (sexeActif) parts.push(normStr(r.sexe));
    if (categorieActif) parts.push(normStr(catLabel(r)));
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
    const key = epKey(r) + "|" + normStr(catLabel(r));
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
    const key = epKey(r);
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
  if (f.chrono) addChip({ M: "⏱ Manuel uniquement", E: "⏱ Électrique uniquement", C: "⏱ Électrique + manuel combinés" }[f.chrono] || f.chrono, () => { document.getElementById("f-chrono").value = ""; onExplorerFilterChange(); });
  if (f.podium) addChip(f.podium === "1" ? "1ère place" : "Top 3", () => { document.getElementById("f-podium").value = ""; onExplorerFilterChange(); });
}

function toggleMultiValue(selectId, value) {
  const sel = document.getElementById(selectId);
  Array.from(sel.options).forEach(o => { if (o.value === value) o.selected = false; });
  onExplorerFilterChange();
}

function onExplorerFilterChange() {
  syncYearChips("f-annee");
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
    const recordKey = epKey(r) + "|" + normStr(catLabel(r));
    const rec = clubRecords.get(recordKey);
    const recAbs = clubRecordsAbs.get(epKey(r));
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
      el("td", { title: catLabel(r) + (/^Master M/.test(catLabel(r)) ? " — " + masterSubRange(catLabel(r).slice(7)) : "") }, catLabel(r)),
      el("td", {}, el("span", { class: placePillClass(displayPlace) }, String(displayPlace))),
      el("td", { class: perfClass }, [perfPrefix + r.performance, chronoBadge(r)]),
      nomCell,
      niveauCell
    ]);
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
}

["f-annee","f-sexe","f-groupe","f-epreuve","f-categorie","f-podium","f-record","f-chrono"].forEach(id => {
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
  const chrSel = document.getElementById("f-chrono"); if (chrSel) chrSel.value = "";
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
    if (cotationColFor(r.epreuve) !== colKey) continue;
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

// ── Dates de naissance & catégorie d'âge FFA en cours ──
// Saison sportive : du 1er septembre au 31 août inclus.
// La catégorie FFA se détermine sur l'année civile de fin de saison
// (ex. saison 2025-2026, du 01/09/2025 au 31/08/2026 → référence 2026),
// par différence avec l'année de naissance.
const BIRTHDATES_KEY = "bsga_birthdates";

function loadBirthdates() {
  try { return JSON.parse(localStorage.getItem(BIRTHDATES_KEY) || "{}"); } catch(e) { return {}; }
}
function saveBirthdateFor(nom, dateStr) {
  const all = loadBirthdates();
  if (dateStr) all[nom] = dateStr; else delete all[nom];
  try { localStorage.setItem(BIRTHDATES_KEY, JSON.stringify(all)); } catch(e) { console.error(e); }
  if (typeof ghMarkPending === "function") ghMarkPending(0);
}

// Année de référence de la saison en cours : jusqu'au 31 août inclus on reste
// dans la saison qui se termine cette année ; à partir du 1er septembre on passe
// à la saison suivante.
function getCurrentSeasonRefYear(d) {
  d = d || new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1; // 1-12
  return m >= 9 ? y + 1 : y;
}
function getCurrentSeasonLabel(d) {
  const ref = getCurrentSeasonRefYear(d);
  return `${ref - 1}-${ref}`;
}

// Barème d'âge FFA (catégories basées sur l'année de naissance)
// Âge atteint dans l'année de fin de saison (diff = année de réf. − année de naissance).
// Barème FFA vérifié sur les codes athle.fr des saisons 2022 à 2027 :
// U12 Poussin 10-11 · U14 Benjamin 12-13 · U16 Minime 14-15 · U18 Cadet 16-17 ·
// U20 Junior 18-19 · U23 Espoir 20-22 · Senior 23-34 · Master 35+.
function categorieFromAgeDiff(diff, sexe) {
  if (diff <= 6) return "Baby Athlé";
  if (diff <= 9) return "Éveil Athlétique";
  if (diff <= 11) return sexe === "F" ? "Poussine" : "Poussin";
  if (diff <= 13) return sexe === "F" ? "Benjamine" : "Benjamin";
  if (diff <= 15) return "Minime";
  if (diff <= 17) return sexe === "F" ? "Cadette" : "Cadet";
  if (diff <= 19) return "Junior";
  if (diff <= 22) return "Espoir";
  if (diff <= 34) return "Senior";
  return "Master " + masterSubCode(diff);
}

function computeCategorieFromBirthdate(dateStr, sexe) {
  if (!dateStr) return null;
  const birthYear = parseInt(String(dateStr).slice(0, 4), 10);
  if (!birthYear || isNaN(birthYear)) return null;
  const diff = getCurrentSeasonRefYear() - birthYear;
  if (diff < 0) return null;
  return categorieFromAgeDiff(diff, sexe);
}

// Catégorie "en cours" : calculée depuis la date de naissance si connue,
// sinon dernière catégorie connue dans les résultats importés.
// Année de naissance connue par les résultats FFA (champ anneeNaissance)
function getAthleteBirthYear(rows) {
  const count = {};
  (rows || []).forEach(r => { const y = parseInt(r.anneeNaissance, 10); if (y) count[y] = (count[y] || 0) + 1; });
  const years = Object.keys(count);
  if (!years.length) return null;
  years.sort((a, b) => count[b] - count[a]);
  return { year: parseInt(years[0], 10), ambiguous: years.length > 1, all: years.map(Number).sort() };
}

// Texte de la date de naissance d'un athlète : date saisie si elle existe,
// sinon année de naissance donnée par la FFA.
function formatAthleteBirth(nom, rows) {
  const d = loadBirthdates()[nom];
  if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) { const [y, m, j] = d.split("-"); return `${j}/${m}/${y}`; }
  const by = getAthleteBirthYear(rows);
  if (by) return `${by.year}` + (by.ambiguous ? ` (années trouvées : ${by.all.join(", ")})` : "");
  return "inconnue";
}

function getCurrentCategorieForAthlete(nom, rows) {
  const dateStr = loadBirthdates()[nom];
  const sexe = rows && rows.length ? rows[0].sexe : null;
  if (dateStr) {
    const cat = computeCategorieFromBirthdate(dateStr, sexe);
    if (cat) return { label: cat, computed: true, source: "date", year: parseInt(dateStr.slice(0, 4), 10) };
  }
  const by = getAthleteBirthYear(rows);
  if (by) {
    const cat = computeCategorieFromBirthdate(String(by.year), sexe);
    if (cat) return { label: cat, computed: true, source: "ffa", year: by.year, ambiguous: by.ambiguous };
  }
  const sorted = rows ? [...rows].sort((a, b) => b.annee - a.annee) : [];
  const fallback = sorted.length ? catLabel(sorted[0]) : null;
  return { label: fallback || "Non déterminée", computed: false };
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
    const cat = getCurrentCategorieForAthlete(name, map[name]);
    const catCell = cat.computed
      ? el("td", { title: (cat.source === "ffa" ? "Calculée depuis l'année de naissance FFA" : "Calculée depuis la date de naissance saisie") + " (saison " + getCurrentSeasonLabel() + ")" }, cat.label)
      : el("td", { style: "color:var(--grey-dim);font-style:italic;", title: "Année de naissance inconnue — dernière catégorie connue" }, cat.label);
    const tr = el("tr", { style: "cursor:pointer;" }, [
      el("td", {}, name),
      el("td", {}, String(map[name].length)),
      el("td", { style: "font-family:var(--font-mono);color:var(--grey);" }, cat.year ? String(cat.year) : "—"),
      catCell
    ]);
    tr.addEventListener("click", () => selectAthlete(name));
    if (selectedAthlete === name) tr.style.background = "rgba(244,163,0,0.10)";
    tbody.appendChild(tr);
  });

  if (!filtered.length) {
    tbody.appendChild(el("tr", {}, el("td", { colspan: "4" }, el("div", { class: "empty-state" }, "Aucun athlète trouvé"))));
  }
}

document.getElementById("athleteSearch").addEventListener("input", (e) => renderAthletesList(e.target.value));

function selectAthlete(name) {
  selectedAthlete = name;
  renderAthletesList(document.getElementById("athleteSearch").value);
  // Sur téléphone, la fiche est sous la liste : on l'amène à l'écran
  if (window.innerWidth <= 900 && document.getElementById("page-athletes").classList.contains("active")) {
    setTimeout(() => { const c = document.getElementById("athleteCardPanel"); if (c) c.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
  }

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

  // ── Date de naissance & catégorie FFA en cours ──
  const savedBirthdate = loadBirthdates()[name] || "";
  const birthdateInput = el("input", { type: "date", value: savedBirthdate, id: "athleteBirthdateInput",
    style: "border:1px solid var(--line-strong);border-radius:5px;padding:4px 8px;font-size:12px;color:var(--ink);background:#fff;" });
  const catBadge = el("span", { id: "athleteCurrentCatBadge" });
  const saveBtn = el("button", { class: "btn small", style: "font-size:11px;padding:4px 10px;" }, "Enregistrer");
  const birthInfo = el("span", { id: "athleteBirthYearInfo" });
  const refreshCatBadge = () => {
    const cat = getCurrentCategorieForAthlete(name, rows);
    const range = /^Master M\d+/.test(cat.label) ? " (" + masterSubRange(cat.label.slice(7)) + ")" : "";
    catBadge.textContent = cat.label + range + (cat.computed ? "" : " (estimée)");
    birthInfo.textContent = formatAthleteBirth(name, rows);
    catBadge.style.cssText = cat.computed
      ? "font-weight:700;color:var(--navy);"
      : "font-weight:700;color:var(--grey-dim);font-style:italic;";
  };
  saveBtn.addEventListener("click", () => {
    saveBirthdateFor(name, birthdateInput.value);
    refreshCatBadge();
    renderAthletesList(document.getElementById("athleteSearch").value);
    toast("Date de naissance enregistrée", "success");
  });
  refreshCatBadge();
  body.appendChild(el("div", { style: "display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0 2px;font-size:12.5px;color:var(--grey);" }, [
    el("span", {}, "Date de naissance :"), el("b", { style: "color:var(--ink);" }, birthInfo)
  ]));
  body.appendChild(el("div", { style: "display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:2px 0 4px;font-size:12.5px;color:var(--grey);" }, [
    el("span", {}, "Catégorie " + getCurrentSeasonLabel() + " :"), catBadge
  ]));
  // Saisie manuelle seulement si la FFA ne donne pas l'année de naissance
  if (!getAthleteBirthYear(rows)) {
    body.appendChild(el("div", { style: "display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:2px 0 4px;font-size:11.5px;color:var(--grey-dim);" }, [
      "Saisir la date de naissance :", birthdateInput, saveBtn
    ]));
  }

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
    const key = epKey(r);
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
    el("span", {}, "👑 = Record absolu du club toutes catégories confondues"),
    el("span", {}, "« manuel » = chrono manuel, classé à part des chronos électriques")
  ]);
  document.getElementById("athleteTablePanel").insertBefore(notice,
    document.getElementById("athleteTablePanel").querySelector(".table-wrap"));

  // Table detail avec distinctions
  const tbody = document.getElementById("athleteTableBody");
  tbody.innerHTML = "";
  rows.forEach(r => {
    const recKey = epKey(r) + "|" + normStr(catLabel(r));
    const rec = clubRecords.get(recKey);
    const recAbs = clubRecordsAbs.get(epKey(r));
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
      el("td", { title: catLabel(r) + (/^Master M/.test(catLabel(r)) ? " — " + masterSubRange(catLabel(r).slice(7)) : "") }, catLabel(r)),
      el("td", {}, el("span", { class: placePillClass(r.place) }, String(r.place))),
      el("td", { class: perfClass }, [perfPrefix + r.performance, chronoBadge(r),
        // niveau répété dans la case Performance, affiché seulement sur téléphone
        niveauFFA ? el("span", { class: "niv-inline", style: `background:${lvlColorCotation(niveauFFA)}` }, "niv. " + niveauFFA) : ""]),
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
  BBM: "Baby Athlé", BBF: "Baby Athlé", EAM: "Éveil Athlétique", EAF: "Éveil Athlétique",
  POM: "Poussin", POF: "Poussine", BEM: "Benjamin", BEF: "Benjamine",
  MIM: "Minime", MIF: "Minime", CAM: "Cadet", CAF: "Cadette",
  JUM: "Junior", JUF: "Junior", ESM: "Espoir", ESF: "Espoir",
  SEM: "Senior", SEF: "Senior", MAM: "Master", MAF: "Master"
};

// Année de naissance contenue dans le code « Infos » d'athle.fr : MIF/13 → 2013,
// MAM/62 → 1962. Le siècle est choisi pour que l'athlète soit né avant la saison.
function birthYearFromCode(code, saison) {
  const m = String(code || "").match(/\/\s*(\d{2})\s*$/);
  if (!m) return null;
  let y = 2000 + parseInt(m[1], 10);
  const ref = parseInt(saison, 10) || new Date().getFullYear();
  if (y > ref) y -= 100;
  return y;
}

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
        const doc = new DOMParser().parseFromString(e.target.result, "text/html");
        const ex = ffaExtractFromDocument(doc, "");
        if (!ex.rows.length) {
          resolve({ results: [], errors: ["Aucune ligne de résultat reconnue dans ce fichier HTML."] });
          return;
        }
        const results = normalizeImportedRecords(ex.rows);
        if (ex.pages.length > 1) {
          toast(`Ce fichier ne contient qu'une page sur ${ex.pages.length} : utilisez plutôt le bouton « Envoyer au Palmarès BSGA » pour tout récupérer`, "");
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
        resolve({ results: normalizeImportedRecords(data), errors: [] });
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
      el("td", { class: "perf-cell" }, [r.performance, chronoBadge(r)]),
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
      performance: r.performance, nom: r.nom, categorie: r.categorie || guessCategorie(r.epreuve),
      ...(r.anneeNaissance ? { anneeNaissance: r.anneeNaissance } : {}),
      ...(r.chrono ? { chrono: r.chrono } : {}),
      ...(r.date ? { date: r.date } : {}),
      ...(r.lieu ? { lieu: r.lieu } : {})
    });
  });
  saveToStorage();
  setLastImport(toAdd.length, [...new Set(toAdd.map(r => r.annee))].sort());
  ghMarkPending(toAdd.length);
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

/* ===========================================================
   RÉCUPÉRATION AUTOMATIQUE DEPUIS ATHLE.FR
   Le site de la FFA bloque toute lecture directe depuis une autre page.
   On passe donc par un "favori-bouton" (bookmarklet) exécuté SUR la page
   athle.fr : il lit le tableau des bilans (même structure que l'export HTML)
   et renvoie les lignes à l'application (fenêtre d'origine) par postMessage.
   Si la fenêtre d'origine n'est plus joignable, il télécharge un .json.
   =========================================================== */
const FFA_CLUB_CODE = "077108";

function buildFfaBilansUrl(annee) {
  return "https://www.athle.fr/bases/liste.aspx?frmpostback=true&frmbase=bilans&frmmode=2&frmespace=0"
    + "&frmannee=" + encodeURIComponent(annee)
    + "&frmepreuve=&frmlicence=&frmnom=&frmprenom=&frmclub=" + FFA_CLUB_CODE + "&frmligue=&frmdepartement=";
}

/* Lecture d'une page de bilans athle.fr (document HTML déjà chargé).
   Utilisée à la fois par le favori-bouton (exécuté sur athle.fr) et par l'import
   d'un fichier .html enregistré. Gère :
   - la présentation actuelle (2026) : une ligne par résultat avec les colonnes
     Nom | Epreuve | Performance | Infos (catégorie, ex. BEF/13) | Chrono | Date | Lieu,
     et une liste de pages (data-url) ;
   - l'ancienne présentation : en-têtes "2026 | 100m | M" puis Place | Performance | Nom ...
   ATTENTION : cette fonction est recopiée telle quelle dans le favori-bouton.
   Pas de commentaire "//" à l'intérieur (le code est mis sur une seule ligne). */
function ffaExtractFromDocument(doc, pageUrl) {
  var clean = function (t) { return (t || "").replace(/ /g, " ").replace(/\s+/g, " ").trim(); };
  var rows = [], pages = [], annee = null;
  var m = String(pageUrl || "").match(/frmannee=(\d{4})/);
  if (m) annee = parseInt(m[1], 10);
  var mh = doc.querySelector(".mainheaders");
  if (mh) { var ms = clean(mh.textContent).match(/Saison\s*:\s*(\d{4})/i); if (ms) annee = parseInt(ms[1], 10); }
  [].forEach.call(doc.querySelectorAll("#optionsPagination [data-url], .select-options [data-url]"), function (o) {
    var u = o.getAttribute("data-url");
    if (u && /liste\.aspx/i.test(u) && pages.indexOf(u) < 0) pages.push(u);
  });
  var tables = doc.querySelectorAll("table");
  for (var ti = 0; ti < tables.length; ti++) {
    var table = tables[ti];
    if (table.classList && table.classList.contains("detail-inner-table")) continue;
    var trs = [].filter.call(table.querySelectorAll("tr"), function (tr) { return tr.closest("table") === table; });
    var idx = null, H = /^(\d{4})\s*\|\s*(.+?)\s*\|\s*([MF])\s*(?:\|.*)?$/i, cur = null;
    trs.forEach(function (tr) {
      var cells = [].slice.call(tr.cells || []);
      var ths = cells.filter(function (c) { return c.tagName === "TH"; });
      if (ths.length >= 3) {
        var names = ths.map(function (c) { return clean(c.textContent).toLowerCase(); });
        var f = function (k) { return names.indexOf(k); };
        if (f("nom") >= 0 && f("performance") >= 0 && (f("epreuve") >= 0 || f("épreuve") >= 0)) {
          idx = { nom: f("nom"), epreuve: f("epreuve") >= 0 ? f("epreuve") : f("épreuve"), perf: f("performance"),
                  infos: f("infos"), chrono: f("chrono"), date: f("date"), lieu: f("lieu") };
        }
        return;
      }
      var hd = tr.querySelector("div.headers");
      if (hd) { var mm = clean(hd.textContent).match(H); if (mm) cur = { annee: parseInt(mm[1], 10), epreuve: mm[2].trim(), sexe: mm[3].toUpperCase() }; return; }
      var c = cells.map(function (td) { return clean(td.textContent); });
      if (idx && c.length > idx.perf && c[idx.nom] && c[idx.perf]) {
        var code = idx.infos >= 0 ? c[idx.infos] : "";
        var sx = null, mc = code.match(/^[A-Z]{2}([MF])\b/);
        if (mc) sx = mc[1];
        if (!sx) { var a = idx.infos >= 0 && cells[idx.infos].querySelector("a"); var ma = a && (a.getAttribute("href") || "").match(/frmsexe=([MF])/); if (ma) sx = ma[1]; }
        rows.push({ annee: annee, sexe: sx, epreuve: c[idx.epreuve], place: "", performance: c[idx.perf], nom: c[idx.nom],
                    codeCategorie: code, chrono: idx.chrono >= 0 ? c[idx.chrono] : "", date: idx.date >= 0 ? c[idx.date] : "",
                    lieu: idx.lieu >= 0 ? c[idx.lieu] : "" });
      } else if (!idx && cur && c.length >= 7 && /^(\d+|-)$/.test(c[0])) {
        rows.push({ annee: cur.annee, sexe: cur.sexe, epreuve: cur.epreuve, place: c[0], performance: c[1], nom: c[2], codeCategorie: c[6] });
      }
    });
    if (rows.length) break;
  }
  return { annee: annee, rows: rows, pages: pages };
}

/* Code du favori-bouton : lit la page affichée puis récupère, sur athle.fr,
   toutes les pages de chaque année demandée (même site, donc autorisé),
   ne garde que les sexes demandés et envoie tout à l'application.
   Les années et sexes voulus sont transmis par le nom de l'onglet ouvert
   par l'application : "bsga|2025,2026|F,M". */
function ffaBookmarkletSource() {
  return "(async function(){" +
    "var X=" + ffaExtractFromDocument.toString() + ";" +
    String.raw`
if(window.__bsgaBusy){alert('Palmarès BSGA : récupération déjà en cours, patientez…');return;}
window.__bsgaBusy=true;
var box=document.createElement('div');
box.style.cssText='position:fixed;z-index:2147483647;left:50%;top:20px;transform:translateX(-50%);background:#0D5E8E;color:#fff;font:600 15px/1.4 system-ui,sans-serif;padding:14px 22px;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.35);max-width:90vw;text-align:center;';
document.body.appendChild(box);
var say=function(t){box.textContent='Palmarès BSGA : '+t;};
try{
var first=X(document,location.href);
var parseYears=function(t){var out=[];String(t||'').split(/[,;\s]+/).forEach(function(p){var m=p.match(/^(\d{4})(?:-(\d{4}))?$/);if(!m)return;var a=+m[1],b=m[2]?+m[2]:a;if(b<a){var t2=a;a=b;b=t2;}for(var y=a;y<=b;y++)if(out.indexOf(y)<0)out.push(y);});return out.sort();};
var cfgTxt=null,mn=String(window.name||'').match(/^bsga\|([\d,]+)\|([MF,]+)$/);
if(mn)cfgTxt=mn[1]+'|'+mn[2];
if(!cfgTxt){var mh=decodeURIComponent(location.hash||'').match(/bsga=([\d,]+)\|([MF,]+)/);if(mh)cfgTxt=mh[1]+'|'+mh[2];}
if(!cfgTxt){try{var ss=sessionStorage.getItem('bsga_cfg');if(ss)cfgTxt=ss;}catch(x){}}
var years,sexes;
if(cfgTxt){var cp=cfgTxt.split('|');years=parseYears(cp[0]);sexes=cp[1].split(',');}
else{
  var ans=prompt('Palmarès BSGA — quelles années récupérer ?\n(ex. 2026, ou 2024,2026, ou 2015-2027)',String(first.annee||new Date().getFullYear()));
  if(ans===null){say('annulé.');return;}
  years=parseYears(ans);
  var sx=prompt('Palmarès BSGA — quels sexes ?\nF = femmes, M = hommes, FM = les deux','FM');
  if(sx===null){say('annulé.');return;}
  sexes=['F','M'].filter(function(c){return String(sx).toUpperCase().indexOf(c)>=0;});
}
if(!years.length){years=[first.annee||new Date().getFullYear()];}
if(!sexes.length){sexes=['F','M'];}
try{sessionStorage.setItem('bsga_cfg',years.join(',')+'|'+sexes.join(','));}catch(x){}
var posOf=function(u){return new URL(u,location.href).searchParams.get('frmposition')||'0';};
var urlFor=function(y,pos){var u=new URL(location.href);u.searchParams.set('frmannee',String(y));u.searchParams.set('frmposition',String(pos));u.hash='';return u.href;};
var load=async function(u){await new Promise(function(ok){setTimeout(ok,350);});var r=await fetch(u,{credentials:'include'});if(!r.ok)throw new Error('page inaccessible ('+r.status+')');return new DOMParser().parseFromString(await r.text(),'text/html');};
var all=[],perYear={},nPages=0,curYear=first.annee,curPos=posOf(location.href);
for(var yi=0;yi<years.length;yi++){
  var y=years[yi];perYear[y]=0;
  say('année '+y+', page 1…');
  var ex0=(y===curYear&&curPos==='0')?first:X(await load(urlFor(y,0)),urlFor(y,0));
  var seen={'0':1},pages=[ex0];nPages++;
  var others=ex0.pages.filter(function(u){var p=posOf(u);if(seen[p])return false;seen[p]=1;return true;});
  for(var pi=0;pi<others.length;pi++){
    say('année '+y+', page '+(pi+2)+'/'+(others.length+1)+'…');
    var pos=posOf(others[pi]);
    pages.push((y===curYear&&pos===curPos)?first:X(await load(urlFor(y,pos)),urlFor(y,pos)));nPages++;
  }
  pages.forEach(function(ex){ex.rows.forEach(function(row){row.annee=y;if(sexes.indexOf(row.sexe)>=0){all.push(row);perYear[y]++;}});});
}
var detail=years.map(function(y){return y+' : '+perYear[y];}).join(' · ');
var sx=sexes.length>1?'femmes et hommes':(sexes[0]==='F'?'femmes':'hommes');
if(!all.length){say('aucun résultat trouvé.');alert('Palmarès BSGA : aucun résultat trouvé ('+sx+', '+detail+').\nVérifiez que vous êtes sur la liste des bilans du club sur athle.fr.');return;}
var msg={type:'bsga-palmares-import',version:4,source:location.href,years:years,sexes:sexes,results:all},sent=false;
try{if(window.opener&&!window.opener.closed){window.opener.postMessage(msg,'*');sent=true;}}catch(x){}
var resume=all.length+' résultats '+sx+' ('+detail+', '+nPages+' page'+(nPages>1?'s':'')+')';
if(sent){say(resume+' envoyés ✔');alert('Palmarès BSGA : '+resume+' envoyés à l\'application.\nRevenez sur l\'onglet du Palmarès pour vérifier et valider.');return;}
var blob=new Blob([JSON.stringify(all)],{type:'application/json'}),u=URL.createObjectURL(blob),l=document.createElement('a');
l.href=u;l.download='bsga_athle_'+years.join('-')+'.json';document.body.appendChild(l);l.click();setTimeout(function(){URL.revokeObjectURL(u);l.remove();},2000);
say(resume+' enregistrés dans '+l.download);
alert('Palmarès BSGA : '+resume+' enregistrés dans le fichier '+l.download+'.\nDéposez ce fichier dans la page « Importer des résultats » de l\'application.');
}catch(err){say('erreur.');alert('Palmarès BSGA : erreur pendant la récupération ('+err.message+').');}
finally{window.__bsgaBusy=false;setTimeout(function(){box.remove();},6000);}
})();`;
}

function ffaBookmarkletHref() {
  return "javascript:" + encodeURIComponent(ffaBookmarkletSource().replace(/\r?\n/g, " "));
}

// Calcule la place (classement interne au club) quand la source ne la donne pas :
// par année + sexe + épreuve, meilleure perf de chaque athlète classée, autres perfs "-".
function computeMissingPlaces(results) {
  const groups = {};
  results.forEach(r => {
    if (r.place && r.place !== "") return;
    const k = [r.annee, r.sexe, epKeySeparate(r)].join("|");
    (groups[k] = groups[k] || []).push(r);
  });
  Object.values(groups).forEach(g => {
    const best = new Map();
    g.forEach(r => {
      const p = parsePerformance(r.performance, r.epreuve);
      const key = normStr(r.nom);
      const ex = best.get(key);
      if (!ex) { best.set(key, { r, p }); return; }
      if (p && (!ex.p || (p.higherIsBetter ? p.value > ex.p.value : p.value < ex.p.value))) best.set(key, { r, p });
    });
    const ranked = [...best.values()].filter(x => x.p).sort((a, b) => a.p.higherIsBetter ? b.p.value - a.p.value : a.p.value - b.p.value);
    let rank = 0, last = null, shown = 0;
    ranked.forEach(x => { shown++; if (last === null || x.p.value !== last) { rank = shown; last = x.p.value; } x.r.place = String(rank); });
    g.forEach(r => { if (!r.place) r.place = "-"; });
  });
  return results;
}

// Normalise une liste de résultats venant du bouton athle.fr ou d'un JSON collé.
function normalizeImportedRecords(data) {
  const list = (Array.isArray(data) ? data : []).map(r => ({
    annee: parseInt(r.annee, 10),
    sexe: String(r.sexe || ((String(r.codeCategorie || "").match(/^[A-Z]{2}([MF])/) || [])[1]) || "M").toUpperCase(),
    club: r.club || FFA_CLUB_CODE,
    groupe: r.groupe || guessGroupe(r.epreuve || ""),
    epreuve: r.epreuve,
    place: r.place == null ? "" : String(r.place),
    performance: r.performance,
    nom: r.nom,
    categorie: r.categorie || (r.codeCategorie ? decodeCategorieFFA(r.codeCategorie) : guessCategorie(r.epreuve || "")),
    ...((r.anneeNaissance || birthYearFromCode(r.codeCategorie, r.annee)) ? { anneeNaissance: parseInt(r.anneeNaissance, 10) || birthYearFromCode(r.codeCategorie, r.annee) } : {}),
    ...(r.date ? { date: r.date } : {}),
    ...(r.lieu ? { lieu: r.lieu } : {}),
    ...(r.chrono ? { chrono: r.chrono } : {})
  })).filter(r => r.annee && r.epreuve && r.nom && r.performance);
  list.forEach(r => { if (r.place === "undefined" || r.place === "null") r.place = ""; });
  return computeMissingPlaces(list);
}

function showImportPage() {
  document.querySelectorAll(".nav-btn, .mobile-nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll('[data-page="import"]').forEach(b => b.classList.add("active"));
  document.getElementById("page-import").classList.add("active");
}

let ffaLastRequest = null;

function setupFfaAutoImport() {
  const link = document.getElementById("ffaBookmarklet");
  if (!link) return;
  link.setAttribute("href", ffaBookmarkletHref());
  link.addEventListener("click", (e) => {
    e.preventDefault();
    toast("Faites glisser ce bouton dans la barre de favoris (ne pas cliquer ici)", "");
  });

  document.getElementById("ffaCopyBookmarklet").addEventListener("click", async (e) => {
    e.preventDefault();
    const code = ffaBookmarkletHref();
    try { await navigator.clipboard.writeText(code); toast("Code du bouton copié", "success"); }
    catch (err) {
      const ta = document.getElementById("pasteArea");
      ta.value = code; ta.focus(); ta.select();
      toast("Copie automatique impossible : le code est sélectionné dans la zone de texte, copiez-le", "error");
    }
  });

  // Années proposées : de 2015 à l'année de la saison en cours (cases à cocher)
  const yearsBox = document.getElementById("ffaYears");
  const ref = getCurrentSeasonRefYear();
  const defaultYear = Math.min(ref, new Date().getFullYear());
  for (let y = ref; y >= 2015; y--) {
    const cb = el("input", { type: "checkbox", value: String(y) });
    if (y === defaultYear) cb.checked = true;
    yearsBox.appendChild(el("label", { class: "ffa-check" }, [cb, el("span", {}, String(y))]));
  }
  const getChecked = (id) => [...document.querySelectorAll(`#${id} input:checked`)].map(i => i.value);

  document.getElementById("ffaOpenBtn").addEventListener("click", () => {
    const years = getChecked("ffaYears").map(Number).sort((a, b) => a - b);
    const sexes = getChecked("ffaSexes");
    if (!years.length) { toast("Cochez au moins une année", "error"); return; }
    if (!sexes.length) { toast("Cochez au moins un sexe", "error"); return; }
    // La configuration voyage dans le nom de l'onglet ET dans l'adresse (#bsga=...),
    // car certains navigateurs effacent le nom d'onglet en changeant de site.
    const cfg = years.join(",") + "|" + sexes.join(",");
    ffaLastRequest = { years, sexes };
    const w = window.open(buildFfaBilansUrl(years[years.length - 1]) + "#bsga=" + cfg, "bsga|" + cfg);
    if (!w) toast("Le navigateur a bloqué l'ouverture : autorisez les fenêtres pop-up pour cette page", "error");
    else {
      const st = document.getElementById("ffaStatus");
      st.style.display = "block";
      st.style.background = "#EEF3F5"; st.style.color = "var(--grey)";
      const sx = sexes.length > 1 ? "femmes et hommes" : (sexes[0] === "F" ? "femmes" : "hommes");
      st.textContent = `En attente des résultats (${years.join(", ")} — ${sx})… cliquez sur le favori « 📥 Envoyer au Palmarès BSGA » dans l'onglet athle.fr.`;
    }
  });

  window.addEventListener("message", (e) => {
    const d = e.data;
    if (!d || d.type !== "bsga-palmares-import" || !Array.isArray(d.results)) return;
    let host = "";
    try { host = new URL(e.origin).hostname; } catch (err) {}
    if (!/(^|\.)athle\.fr$/i.test(host)) return; // n'accepter que les pages athle.fr
    const results = normalizeImportedRecords(d.results);
    showImportPage();
    window.focus();
    const st = document.getElementById("ffaStatus");
    st.style.display = "block";
    if (!results.length) {
      st.style.background = "#FCE6DE"; st.style.color = "#9A2A0E";
      st.textContent = "Résultats reçus, mais aucune ligne exploitable.";
      return;
    }
    st.style.background = "#E6F4EA"; st.style.color = "#1E6B34";
    const nMan = results.filter(r => getChronoType(r) === "M").length;
    const gotYears = d.years || [...new Set(results.map(r => r.annee))].sort();
    let txt = `${results.length} résultats reçus depuis athle.fr (${gotYears.join(", ")}), dont ${nMan} au chrono manuel — vérifiez ci-dessous puis validez l'ajout.`;
    if (!d.version || d.version < 4) {
      txt = "⚠️ Votre favori « Envoyer au Palmarès BSGA » est une ancienne version : supprimez-le et refaites glisser le nouveau bouton (étape 1) pour pouvoir récupérer plusieurs années. " + txt;
      st.style.background = "#FFF4E0"; st.style.color = "#7A4F00";
    } else if (ffaLastRequest) {
      const missing = ffaLastRequest.years.filter(y => !gotYears.map(Number).includes(Number(y)));
      if (missing.length) {
        txt += ` (Années demandées mais non reçues : ${missing.join(", ")} — le favori vous a peut-être demandé les années à la main.)`;
      }
    }
    st.textContent = txt;
    setStep(1);
    processParsedResults(results, 0);
    const diff = document.getElementById("diffPanel");
    if (diff) diff.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
setupFfaAutoImport();

document.getElementById("parsePasteBtn").addEventListener("click", () => {
  const text = document.getElementById("pasteArea").value;
  if (!text.trim()) { toast("Collez d'abord du texte à analyser", "error"); return; }
  // Liste JSON collée (ex. contenu d'un fichier produit par le bouton athle.fr)
  if (/^\s*\[/.test(text)) {
    try {
      const results = normalizeImportedRecords(JSON.parse(text));
      if (results.length) { processParsedResults(results, 0); return; }
    } catch (err) { /* sinon on retombe sur l'analyse texte */ }
  }
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
    Catégorie: catLabel(r),
    Place: r._displayPlace != null ? r._displayPlace : r.place, Performance: r.performance, Chrono: chronoLabel(r), Athlète: r.nom
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
    body: rows.map(r => [r.annee, r.sexe, r.groupe, r.epreuve, catLabel(r), r._displayPlace != null ? r._displayPlace : r.place, r.performance + (getChronoType(r) === "M" ? " (man.)" : ""), r.nom]),
    styles: { fontSize: 8, font: "helvetica" },
    headStyles: { fillColor: [10,51,73], textColor: [232,65,26] },
    alternateRowStyles: { fillColor: [245,245,245] }
  });
  doc.save(`BSGA_resultats_${dateStamp()}.pdf`);
  toast("Export PDF généré", "success");
}

// Meilleure performance (RP) de l'athlète par épreuve (chronos manuels à part).
function athletePersonalBests(rows) {
  const best = new Map();
  rows.forEach(r => {
    const p = parsePerformance(r.performance, r.epreuve);
    if (!p) return;
    const k = epKeySeparate(r);
    const cur = best.get(k);
    if (!cur || (p.higherIsBetter ? p.value > cur.p.value : p.value < cur.p.value)) best.set(k, { r, p });
  });
  const groupOrder = ["Sprint", "Haies / Steeple", "Demi-fond / Fond", "Marche", "Sauts", "Lancers", "Epreuves combinees", "Relais", "Autre"];
  const order = new Map(sortEpreuves([...new Set(rows.map(r => r.epreuve))]).map((e, i) => [e, i]));
  return [...best.values()].map(x => x.r).sort((a, b) =>
    ((groupOrder.indexOf(a.groupe) + 1 || 99) - (groupOrder.indexOf(b.groupe) + 1 || 99)) ||
    ((order.get(a.epreuve) ?? 999) - (order.get(b.epreuve) ?? 999)));
}

// Graphique toile d'araignée (une couleur par année) dessiné hors écran pour le PDF.
function buildAthleteRadarImage(rows) {
  const years = uniqueSorted(rows.map(r => r.annee));
  const series = years.map(y => {
    const rs = rows.filter(r => r.annee === y);
    return { y, vals: RADAR_GROUPS.map(g => bestNiveauForGroup(rs, g.db) || 0) };
  }).filter(s => s.vals.some(v => v > 0));
  if (!series.length || typeof Chart === "undefined") return null;
  const palette = ["#C3D3D8", "#9AAEB6", "#7FB3D5", "#2E86C1", "#0D5E8E", "#E8411A"];
  const colors = series.map((_, i) => palette[Math.max(0, palette.length - series.length + i)] || palette[i % palette.length]);
  const canvas = document.createElement("canvas");
  canvas.width = 900; canvas.height = 760;
  canvas.style.cssText = "position:fixed;left:-10000px;top:0;width:900px;height:760px;";
  document.body.appendChild(canvas);
  let img = null;
  try {
    const chart = new Chart(canvas.getContext("2d"), {
      type: "radar",
      data: {
        labels: RADAR_GROUPS.map(g => g.label),
        datasets: series.map((s, i) => ({
          label: String(s.y), data: s.vals,
          borderColor: colors[i], backgroundColor: colors[i] + (i === series.length - 1 ? "33" : "14"),
          borderWidth: i === series.length - 1 ? 4 : 2.5, pointRadius: 4, pointBackgroundColor: colors[i]
        }))
      },
      options: {
        responsive: false, animation: false, devicePixelRatio: 2,
        plugins: { legend: { position: "bottom", labels: { font: { size: 18 }, boxWidth: 24, padding: 18 } } },
        scales: { r: { min: 0, max: 50, ticks: { stepSize: 10, font: { size: 14 }, backdropColor: "transparent" },
                       pointLabels: { font: { size: 20, weight: "bold" } } } }
      }
    });
    img = canvas.toDataURL("image/png", 1.0);
    chart.destroy();
  } catch (e) { console.error(e); }
  canvas.remove();
  return img ? { img, series } : null;
}

function exportAthletePdf(name) {
  const map = getAthletesAggregated();
  const rows = (map[name] || []).slice().sort((a,b) => (b.annee - a.annee) || a.epreuve.localeCompare(b.epreuve, 'fr'));
  if (!rows.length) { toast("Aucun résultat pour cet athlète", "error"); return; }
  const doc = new jspdf.jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const navy = [10, 51, 73], orange = [232, 65, 26];
  const cat = getCurrentCategorieForAthlete(name, rows);
  const catTxt = cat.label + (/^Master M\d+/.test(cat.label) ? " (" + masterSubRange(cat.label.slice(7)) + ")" : "");
  pdfHeader(doc, name, `Fiche athlète — BSGA — Né·e : ${formatAthleteBirth(name, rows)} — Catégorie ${getCurrentSeasonLabel()} : ${catTxt}`);
  const sectionTitle = (txt, y) => {
    doc.setFontSize(12); doc.setTextColor(...navy); doc.text(txt, 14, y);
    doc.setDrawColor(...orange); doc.setLineWidth(0.6); doc.line(14, y + 1.8, 60, y + 1.8);
    return y + 6;
  };

  // 1) Records personnels par épreuve
  let y = sectionTitle("Records personnels (RP) par épreuve", 36);
  const pbs = athletePersonalBests(rows);
  const withNiv = pbs.some(r => getNiveauFFAForRow(r)); // colonne utile seulement si l'athlète a des perfs cotées
  doc.autoTable({
    startY: y,
    head: [["Discipline", "Épreuve", "RP", "Année", "Catégorie", "Date · Lieu", ...(withNiv ? ["Niv. FFA"] : [])]],
    body: pbs.map(r => [r.groupe, r.epreuve, r.performance + (getChronoType(r) === "M" ? " (man.)" : ""), r.annee, catLabel(r),
      [r.date, r.lieu].filter(Boolean).join(" · ") || "-", ...(withNiv ? [getNiveauFFAForRow(r) || "-"] : [])]),
    styles: { fontSize: 8.5, font: "helvetica", cellPadding: 1.6 },
    headStyles: { fillColor: navy, textColor: orange },
    columnStyles: { 2: { fontStyle: "bold" }, 6: { halign: "center" } },
    alternateRowStyles: { fillColor: [245,245,245] }
  });

  // 2) Synthèse + évolution des niveaux FFA (toile d'araignée par année)
  doc.addPage();
  y = sectionTitle("Synthèse", 18);
  const years = uniqueSorted(rows.map(r => r.annee));
  const podiums = rows.filter(r => ["1","2","3"].includes(String(r.place))).length;
  const groupes = uniqueSorted(rows.map(r => r.groupe));
  const niveaux = rows.map(getNiveauFFAForRow).filter(Boolean);
  const lines = [
    `Résultats : ${rows.length}   ·   Podiums (top 3 club) : ${podiums}   ·   Disciplines : ${groupes.length}`,
    `Saisons : ${years.join(", ")}`,
    `Épreuves pratiquées : ${uniqueSorted(rows.map(r => r.epreuve)).length}   ·   Records personnels : ${pbs.length}`,
    niveaux.length ? `Niveau FFA moyen : ${(niveaux.reduce((a, b) => a + b, 0) / niveaux.length).toFixed(1)}/50 (${niveaux.length} résultats cotés)` : "Niveau FFA : non applicable (tables de cotation benjamins et minimes uniquement)"
  ];
  doc.setFontSize(10); doc.setTextColor(40);
  lines.forEach(t => { doc.text(t, 14, y); y += 6; });

  y = sectionTitle("Évolution des niveaux FFA par année", y + 4);
  const radar = buildAthleteRadarImage(rows);
  if (radar) {
    const w = 150, h = w * 760 / 900;
    doc.addImage(radar.img, "PNG", (pageW - w) / 2, y, w, h);
    y += h + 4;
    doc.autoTable({
      startY: y,
      head: [["Année", ...RADAR_GROUPS.map(g => g.label)]],
      body: radar.series.map(s => [s.y, ...s.vals.map(v => v || "-")]),
      styles: { fontSize: 8.5, font: "helvetica", halign: "center", cellPadding: 1.4 },
      headStyles: { fillColor: navy, textColor: orange },
      alternateRowStyles: { fillColor: [245,245,245] }
    });
  } else {
    doc.setFontSize(9.5); doc.setTextColor(120);
    doc.text("Aucun résultat coté : les tables de cotation FFA concernent les benjamins et les minimes.", 14, y + 2);
  }

  // 3) Liste complète des résultats
  doc.addPage();
  y = sectionTitle(`Tous les résultats (${rows.length})`, 18);
  doc.autoTable({
    startY: y,
    head: [["Année","Discipline","Épreuve","Catégorie","Place","Performance"]],
    body: rows.map(r => [r.annee, r.groupe, r.epreuve, catLabel(r), r.place, r.performance]),
    styles: { fontSize: 9, font: "helvetica" },
    headStyles: { fillColor: navy, textColor: orange },
    alternateRowStyles: { fillColor: [245,245,245] }
  });

  // Pied de page : numéros de page
  const n = doc.internal.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150);
    doc.text(`BSGA Palmarès — ${name} — page ${i}/${n}`, pageW / 2, doc.internal.pageSize.getHeight() - 6, { align: "center" });
  }
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
    ["Épreuves distinctes", nbEpreuves, ""],
    ["Dernier import", formatImportDate(getLastImport(), false), (() => {
      const i = getLastImport(); const latest = getLatestResultDate();
      const parts = [];
      if (i && i.count) parts.push(`${i.count} résultats` + (i.years && i.years.length ? ` (${i.years.length > 3 ? i.years[0] + "–" + i.years[i.years.length-1] : i.years.join(", ")})` : ""));
      if (latest) parts.push(`perf. la plus récente : ${latest}`);
      return parts.join(" · ");
    })()]
  ].forEach(([label, val, foot]) => {
    row.appendChild(el("div", { class: "kpi-card" }, [
      el("div", { class: "kpi-label" }, label),
      el("div", { class: "kpi-value" + (/\//.test(String(val)) ? " kpi-date" : "") }, String(val)),
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

document.getElementById("publishDataJsBtn").addEventListener("click", () => {
  const out = buildDataJsForPublication();
  const blob = new Blob([out.content], { type: "text/javascript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.js";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000);
  const info = document.getElementById("publishInfo");
  if (info) {
    info.style.display = "block";
    const bd = out.birthdates > 1 ? `${out.birthdates} dates de naissance` : `${out.birthdates} date de naissance`;
    info.textContent = `data.js généré : ${out.count} résultats et ${bd} (version ${out.version.replace("T", " à ")}). Déposez-le maintenant sur GitHub à la place de l'ancien.`;
    info.style.background = "#E6F4EA"; info.style.color = "#1E6B34";
  }
  toast("Fichier data.js téléchargé", "success");
});

/* ===========================================================
   PUBLICATION AUTOMATIQUE SUR GITHUB
   Envoie data.js sur le dépôt via l'API GitHub (blob → arbre → commit → branche),
   avec une clé d'accès « fine-grained » limitée au dépôt (Contents : lecture/écriture).
   La clé est conservée uniquement dans le navigateur de l'appareil.
   =========================================================== */
const GH_CFG_KEY = "bsga_github_publication";
const GH_PENDING_KEY = "bsga_modifs_non_publiees";
const GH_LASTPUB_KEY = "bsga_derniere_publication";

function ghLoadCfg() { try { return JSON.parse(localStorage.getItem(GH_CFG_KEY) || "null"); } catch (e) { return null; } }
function ghSaveCfg(cfg) { try { cfg ? localStorage.setItem(GH_CFG_KEY, JSON.stringify(cfg)) : localStorage.removeItem(GH_CFG_KEY); } catch (e) {} }
function ghMarkPending(n) {
  try {
    const cur = JSON.parse(localStorage.getItem(GH_PENDING_KEY) || "null") || { count: 0 };
    localStorage.setItem(GH_PENDING_KEY, JSON.stringify({ count: cur.count + (n || 0), since: cur.since || new Date().toISOString() }));
  } catch (e) {}
  renderGhPublishUI();
}
function ghPending() { try { return JSON.parse(localStorage.getItem(GH_PENDING_KEY) || "null"); } catch (e) { return null; } }

function ghToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
async function ghApi(cfg, method, path, body) {
  const res = await fetch("https://api.github.com/repos/" + cfg.repo + path, {
    method,
    headers: { "Authorization": "Bearer " + cfg.token, "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28",
               ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  let data = null;
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) {
    const msg = (data && data.message) || res.statusText;
    const hint = res.status === 401 ? "clé invalide ou expirée"
      : res.status === 403 ? "la clé n'a pas le droit d'écrire (Contents : Read and write)"
      : res.status === 404 ? "dépôt ou branche introuvable, ou clé sans accès à ce dépôt"
      : res.status === 409 || res.status === 422 ? "conflit : réessayez dans un instant" : "";
    const err = new Error(`${res.status} ${msg}${hint ? " — " + hint : ""}`);
    err.status = res.status;
    throw err;
  }
  return data;
}
async function ghTest(cfg) {
  const repo = await ghApi(cfg, "GET", "");
  if (repo.permissions && repo.permissions.push === false) throw new Error("la clé n'a pas le droit d'écrire sur ce dépôt");
  await ghApi(cfg, "GET", "/git/ref/heads/" + encodeURIComponent(cfg.branch));
  return repo;
}
async function ghPublishDataJs(cfg, onStep) {
  const out = buildDataJsForPublication();
  onStep && onStep("Préparation…");
  const ref = await ghApi(cfg, "GET", "/git/ref/heads/" + encodeURIComponent(cfg.branch));
  const parentSha = ref.object.sha;
  const parent = await ghApi(cfg, "GET", "/git/commits/" + parentSha);
  onStep && onStep(`Envoi de ${out.count} résultats…`);
  const blob = await ghApi(cfg, "POST", "/git/blobs", { content: ghToBase64(out.content), encoding: "base64" });
  const tree = await ghApi(cfg, "POST", "/git/trees", { base_tree: parent.tree.sha, tree: [{ path: "data.js", mode: "100644", type: "blob", sha: blob.sha }] });
  const commit = await ghApi(cfg, "POST", "/git/commits", {
    message: `Mise à jour de la base : ${out.count} résultats (BSGA Palmarès)`, tree: tree.sha, parents: [parentSha]
  });
  onStep && onStep("Validation…");
  await ghApi(cfg, "PATCH", "/git/refs/heads/" + encodeURIComponent(cfg.branch), { sha: commit.sha });
  // cet appareil a déjà toutes ces données : inutile de les re-fusionner au prochain chargement
  try { localStorage.setItem(SEED_APPLIED_KEY, out.version); } catch (e) {}
  try { localStorage.setItem(GH_LASTPUB_KEY, JSON.stringify({ date: new Date().toISOString(), count: out.count, commit: commit.sha })); } catch (e) {}
  try { localStorage.removeItem(GH_PENDING_KEY); } catch (e) {}
  return { out, commit };
}

function ghPublishNow(btn) {
  const cfg = ghLoadCfg();
  if (!cfg) { showGhSettings(); return; }
  const info = document.getElementById("publishInfo");
  const say = (t, ok) => {
    if (info) { info.style.display = "block"; info.textContent = t;
      info.style.background = ok === false ? "#FCE6DE" : ok ? "#E6F4EA" : "#EEF3F5"; info.style.color = ok === false ? "#9A2A0E" : ok ? "#1E6B34" : "var(--grey)"; }
  };
  const btns = [btn, document.getElementById("ghPublishBtn")].filter(Boolean);
  btns.forEach(b => { b.disabled = true; });
  ghPublishDataJs(cfg, t => say("Publication : " + t))
    .then(({ out }) => {
      say(`Publié sur GitHub : ${out.count} résultats. Le site en ligne sera à jour d'ici 1 à 2 minutes.`, true);
      toast("Base publiée sur GitHub", "success");
    })
    .catch(e => { say("Échec de la publication : " + e.message, false); toast("Échec de la publication sur GitHub", "error"); })
    .finally(() => { btns.forEach(b => { b.disabled = false; }); renderGhPublishUI(); });
}

function showGhSettings() {
  document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll('[data-page="settings"]').forEach(b => b.classList.add("active"));
  document.getElementById("page-settings").classList.add("active");
  renderSettings();
  const p = document.getElementById("publishPanel");
  if (p) p.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderGhPublishUI(editing) {
  const cfg = ghLoadCfg();
  const pend = ghPending();
  let last = null; try { last = JSON.parse(localStorage.getItem(GH_LASTPUB_KEY) || "null"); } catch (e) {}
  const setup = document.getElementById("ghSetup"), conf = document.getElementById("ghConfigured");
  if (setup && conf) {
    const showSetup = !cfg || editing === true;
    setup.style.display = showSetup ? "block" : "none";
    conf.style.display = showSetup ? "none" : "block";
    document.getElementById("ghCancelBtn").style.display = cfg && showSetup ? "" : "none";
    document.getElementById("ghForgetBtn").style.display = cfg && showSetup ? "" : "none";
    if (cfg && showSetup) {
      document.getElementById("ghRepo").value = cfg.repo; document.getElementById("ghBranch").value = cfg.branch;
      document.getElementById("ghToken").value = ""; document.getElementById("ghToken").placeholder = "clé enregistrée (laisser vide pour la garder)";
    }
    if (cfg) {
      const line = document.getElementById("ghStatusLine");
      line.innerHTML = "";
      line.appendChild(el("div", {}, ["Connecté au dépôt ", el("b", {}, cfg.repo), ` (branche ${cfg.branch}).`]));
      line.appendChild(el("div", {}, last ? ["Dernière publication : ", el("b", {}, new Date(last.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })), ` (${last.count} résultats).`] : "Aucune publication depuis cet appareil."));
    }
  }
  // bandeaux « modifications non publiées »
  ["ghPendingBanner", "ghPendingImport"].forEach(id => {
    const b = document.getElementById(id);
    if (!b) return;
    b.innerHTML = "";
    if (!pend) { b.style.display = "none"; return; }
    b.style.display = "flex";
    b.appendChild(el("span", {}, `⚠️ Modifications non publiées sur cet appareil${pend.count ? ` (${pend.count} résultat${pend.count > 1 ? "s" : ""} ajouté${pend.count > 1 ? "s" : ""})` : ""} : les autres appareils ne les voient pas encore.`));
    const btn = el("button", { class: "btn primary small" }, cfg ? "Publier sur GitHub" : "Configurer la publication");
    btn.addEventListener("click", () => cfg ? ghPublishNow(btn) : showGhSettings());
    b.appendChild(btn);
  });
}

(function setupGhPublish() {
  const save = document.getElementById("ghSaveBtn");
  if (!save) return;
  save.addEventListener("click", () => {
    const old = ghLoadCfg();
    const cfg = {
      repo: document.getElementById("ghRepo").value.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, ""),
      branch: document.getElementById("ghBranch").value.trim() || "main",
      token: document.getElementById("ghToken").value.trim() || (old && old.token) || ""
    };
    const info = document.getElementById("publishInfo");
    const say = (t, ok) => { info.style.display = "block"; info.textContent = t;
      info.style.background = ok === false ? "#FCE6DE" : ok ? "#E6F4EA" : "#EEF3F5"; info.style.color = ok === false ? "#9A2A0E" : ok ? "#1E6B34" : "var(--grey)"; };
    if (!/^[\w.-]+\/[\w.-]+$/.test(cfg.repo)) { say("Dépôt invalide : écrivez « compte/dépôt », ex. Sam-Cookai/bsga-palmares.", false); return; }
    if (!cfg.token) { say("Collez la clé d'accès GitHub.", false); return; }
    save.disabled = true; say("Test de la connexion…");
    ghTest(cfg).then(() => {
      ghSaveCfg(cfg); say("Connexion réussie : vous pouvez publier.", true); renderGhPublishUI();
    }).catch(e => say("Connexion impossible : " + e.message, false)).finally(() => { save.disabled = false; });
  });
  document.getElementById("ghPublishBtn").addEventListener("click", (e) => ghPublishNow(e.currentTarget));
  document.getElementById("ghEditBtn").addEventListener("click", () => renderGhPublishUI(true));
  document.getElementById("ghCancelBtn").addEventListener("click", () => renderGhPublishUI());
  document.getElementById("ghForgetBtn").addEventListener("click", () => {
    confirmAction("Oublier la clé GitHub ?", "La connexion à GitHub sera supprimée de cet appareil. Pensez aussi à révoquer la clé sur github.com si vous ne l'utilisez plus.", () => {
      ghSaveCfg(null); renderGhPublishUI(); toast("Clé GitHub supprimée de cet appareil", "success");
    });
  });
  renderGhPublishUI();
})();

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

  if (SEED_MERGE_REPORT && (SEED_MERGE_REPORT.added || SEED_MERGE_REPORT.birthdates)) {
    const parts = [];
    const n = SEED_MERGE_REPORT.added, b = SEED_MERGE_REPORT.birthdates;
    if (n) parts.push(n > 1 ? `${n} nouveaux résultats` : "1 nouveau résultat");
    if (b) parts.push(b > 1 ? `${b} dates de naissance` : "1 date de naissance");
    toast("Base en ligne mise à jour : " + parts.join(" et ") + (n + b > 1 ? " ajoutés" : " ajouté"), "success");
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
/* ── Barème World Athletics : points = a·x² + b·x + c (x en s ou en m) ── */
function isWaCat(code) { return code === "WAM" || code === "WAF"; }
function waCoef(code, waEvent) {
  if (typeof WA_COEFFS === "undefined") return null;
  const g = WA_COEFFS[code === "WAF" ? "women" : "men"];
  return g ? g[waEvent] || null : null;
}
// Valeur codée de la table → x (secondes ou mètres)
function waX(v, fmt) {
  if (fmt === "SSCC") return v / 100;
  if (fmt === "MMSSCC") return Math.floor(v / 10000) * 60 + (v % 10000) / 100;
  if (fmt === "HMMSS") return Math.floor(v / 10000) * 3600 + Math.floor((v % 10000) / 100) * 60 + (v % 100);
  if (fmt === "CM") return v / 100;
  return null;
}
// x → valeur codée ; un temps est arrondi vers le bas, une distance vers le haut
// (la marque affichée suffit pour obtenir les points du palier)
function waEncode(x, fmt) {
  if (fmt === "SSCC") return Math.floor(x * 100 + 1e-6);
  if (fmt === "MMSSCC") { const h = Math.floor(x * 100 + 1e-6); return Math.floor(h / 6000) * 10000 + (h % 6000); }
  if (fmt === "HMMSS") { const t = Math.floor(x + 1e-6); return Math.floor(t / 3600) * 10000 + Math.floor((t % 3600) / 60) * 100 + (t % 60); }
  if (fmt === "CM") return Math.ceil(x * 100 - 1e-6);
  return null;
}
function waPoints(x, coef) {
  if (!coef || x === null || !(x > 0)) return 0;
  const [a, b, c, lowerBetter] = coef;
  const vertex = -b / (2 * a);
  if (lowerBetter ? x >= vertex : x <= vertex) return 0;
  return Math.max(0, Math.min(1400, Math.floor(a * x * x + b * x + c + 1e-9)));
}
function waMarkFor(points, coef) {
  const [a, b, c, lowerBetter] = coef;
  const disc = b * b - 4 * a * (c - points);
  if (disc < 0) return null;
  const roots = [(-b - Math.sqrt(disc)) / (2 * a), (-b + Math.sqrt(disc)) / (2 * a)];
  const ok = roots.filter(x => x > 0 && (lowerBetter ? 2 * a * x + b < 0 : 2 * a * x + b > 0));
  return ok.length ? ok[0] : null;
}
const WA_STEP = 50;
const _waTables = {};
function buildWaTable(code) {
  if (_waTables[code]) return _waTables[code];
  const rows = [];
  for (let P = WA_STEP; P <= 1400; P += WA_STEP) {
    const row = { niveau: P, pts: P };
    WA_EVENTS.forEach(e => {
      if (!(code === "WAF" ? e.f : e.m)) return;
      const coef = waCoef(code, e.wa);
      if (!coef) return;
      const x = waMarkFor(P, coef);
      if (x !== null) row[e.key] = waEncode(x, e.fmt);
    });
    rows.push(row);
  }
  _waTables[code] = rows;
  return rows;
}
function waPointsForValue(code, colKey, val) {
  const col = COTATION_COLS.find(c => c.key === colKey);
  if (!col || !col.wa) return 0;
  return waPoints(waX(val, col.fmt), waCoef(code, col.wa));
}
function waColor(points) { return points > 0 ? lvlColorCotation(Math.max(1, Math.round(points / 1400 * 50))) : "#9AAEB6"; }

function loadCotationTable(catCode) {
  if (isWaCat(catCode)) return buildWaTable(catCode);
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
    const m = s.match(/^(\d+)m(\d+)?/i);
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
  const colKey = cotationColFor(r.epreuve);
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

/* ===========================================================
   PAGE « TABLES DE COTATION »
   Affiche les tables BEM / BEF / MIM / MIF et situe une performance saisie.
   Encodage des tables : SSCC = secondes*100 + centièmes (7"45 → 745),
   MMSSCC = min*10000 + s*100 + centièmes (3'15"90 → 31590), CM = centimètres.
   =========================================================== */
const COT_PAGE_CATS = ["BEM", "BEF", "MIM", "MIF", "WAM", "WAF"];

// Nom réel de l'épreuve selon la catégorie : une même colonne de table correspond à
// des engins / hauteurs de haies différents (ex. colonne « Poids 3kg » = poids de
// 2 kg chez les benjamines). Vérifié sur les résultats du club importés d'athle.fr.
const COT_COL_LABELS_BY_CAT = {
  BEM: { "50mHaies": "50m haies (65)", Poids3kg: "Poids 3kg", Disque1kg: "Disque 1kg", Marteau3kg: "Marteau 3kg", Javelot500g: "Javelot 500g", "2000mMarche": "2000m marche" },
  BEF: { "50mHaies": "50m haies (65)", Poids3kg: "Poids 2kg", Disque1kg: "Disque 0.6kg", Marteau3kg: "Marteau 2kg", Javelot500g: "Javelot 400g", "2000mMarche": "2000m marche" },
  MIM: { "50mHaies84": "50m haies (84)", "80mHaies84": "80m haies (84)", "100mHaies84": "100m haies (84)", "200mHaies76": "200m haies (76)", Poids4kg: "Poids 4kg", Disque1_25kg: "Disque 1.2kg", Marteau4kg: "Marteau 4kg", Javelot600g: "Javelot 600g", "3000mMarche": "3000m marche" },
  MIF: { "50mHaies76": "50m haies (76)", "80mHaies76": "80m haies (76)", "200mHaies76": "200m haies (76)", Poids3kg: "Poids 3kg", Disque0_8kg: "Disque 0.8kg", Marteau3kg: "Marteau 3kg", Javelot500g: "Javelot 500g", "3000mMarche": "3000m marche" }
};
function cotColLabel(colKey, cat) {
  if (isWaCat(cat)) {
    const e = WA_EVENTS.find(x => x.key === colKey);
    if (e) return (cat === "WAF" ? e.f : e.m) || e.m || e.f;
  }
  const byCat = COT_COL_LABELS_BY_CAT[cat] || {};
  if (byCat[colKey]) return byCat[colKey];
  const col = COTATION_COLS.find(c => c.key === colKey);
  return col ? col.label : colKey;
}
const COT_PAGE_LABELS = { BEM: "Benjamin", BEF: "Benjamine", MIM: "Minime garçon", MIF: "Minime fille",
  WAM: "Hommes (cadets → masters)", WAF: "Femmes (cadettes → masters)" };
const COT_PREF_KEY = "bsga_cotation_page";
let cotState = { cat: "BEM", col: "50m", perf: "" };

function pad2(n) { return String(n).padStart(2, "0"); }
function formatCotValue(v, fmt) {
  if (v === null || v === undefined || v === "") return "";
  v = Number(v);
  if (fmt === "CM") return `${Math.floor(v / 100)}m${pad2(v % 100)}`;
  if (fmt === "SSCC") return `${Math.floor(v / 100)}"${pad2(v % 100)}`;
  if (fmt === "MMSSCC") return `${Math.floor(v / 10000)}'${pad2(Math.floor((v % 10000) / 100))}"${pad2(v % 100)}`;
  if (fmt === "HMMSS") {
    const h = Math.floor(v / 10000), m = Math.floor((v % 10000) / 100), sec = v % 100;
    return h ? `${h}h${pad2(m)}'${pad2(sec)}"` : `${m}'${pad2(sec)}"`;
  }
  return String(v);
}
// Valeur → unité linéaire (centièmes ou cm) pour calculer des écarts
function cotUnits(v, fmt) {
  if (fmt === "MMSSCC") return Math.floor(v / 10000) * 6000 + (v % 10000);
  if (fmt === "HMMSS") return (Math.floor(v / 10000) * 3600 + Math.floor((v % 10000) / 100) * 60 + (v % 100)) * 100;
  return v;
}
function formatCotGap(units, fmt) {
  units = Math.abs(units);
  if (fmt === "CM") return units >= 100 ? `${Math.floor(units / 100)}m${pad2(units % 100)}` : `${units} cm`;
  const sec = Math.floor(units / 100), cc = units % 100;
  if (sec >= 60) return `${Math.floor(sec / 60)}'${pad2(sec % 60)}"${pad2(cc)}`;
  return `${sec}"${pad2(cc)}`;
}
// Centièmes ou centimètres saisis : "5" → 50, "45" → 45
function cotFrac(t) { return t ? parseInt((t + "0").slice(0, 2), 10) : 0; }

// Lit une performance saisie librement et la convertit dans l'encodage de la table.
function parseUserPerf(str, fmt) {
  let s = String(str || "").trim().toLowerCase()
    .replace(/,/g, ".").replace(/[″“”]/g, '"').replace(/[’‘´`]/g, "'").replace(/''/g, '"')
    .replace(/\s+/g, "").replace(/\(.*?\)/g, "");
  if (!s) return null;
  let m;
  if (fmt === "HMMSS") {
    let h = 0, mi = 0, se = 0;
    if ((m = s.match(/^(\d+)h(\d{1,2})(?:['m:"](\d{1,2}))?"?$/))) { h = +m[1]; mi = +m[2]; se = +(m[3] || 0); }
    else if ((m = s.match(/^(\d+):(\d{1,2}):(\d{1,2})$/))) { h = +m[1]; mi = +m[2]; se = +m[3]; }
    else if ((m = s.match(/^(\d+)['m:](\d{1,2})"?$/))) { mi = +m[1]; se = +m[2]; }
    else return null;
    if (se >= 60) return null;
    const t = h * 3600 + mi * 60 + se;
    return Math.floor(t / 3600) * 10000 + Math.floor((t % 3600) / 60) * 100 + (t % 60);
  }
  if (fmt === "CM") {
    if ((m = s.match(/^(\d+)m(\d{0,2})$/))) return parseInt(m[1], 10) * 100 + cotFrac(m[2]);
    if ((m = s.match(/^(\d+)\.(\d{1,2})m?$/))) return parseInt(m[1], 10) * 100 + cotFrac(m[2]);
    if ((m = s.match(/^(\d+)(cm)?$/))) {
      const n = parseInt(m[1], 10);
      return (m[2] || n >= 100) ? n : n * 100;
    }
    return null;
  }
  // temps : minutes éventuelles, secondes, centièmes
  let min = 0, sec = null, cc = 0;
  if ((m = s.match(/^(\d+)[':h](\d{1,2})(?:[".:](\d{1,2}))?"?$/))) { min = +m[1]; sec = +m[2]; cc = cotFrac(m[3]); }
  else if ((m = s.match(/^(\d+)(?:[".](\d{1,2}))?"?$/))) { sec = +m[1]; cc = cotFrac(m[2]); }
  if (sec === null) return null;
  if (min > 0 && sec >= 60) return null;
  const totalSec = min * 60 + sec;
  if (fmt === "SSCC") return totalSec * 100 + cc;
  if (fmt === "MMSSCC") return Math.floor(totalSec / 60) * 10000 + (totalSec % 60) * 100 + cc;
  return null;
}

function niveauFromValue(val, colKey, table) {
  const col = COTATION_COLS.find(c => c.key === colKey);
  if (!col || val === null || !table) return null;
  let best = null;
  for (const row of table) {
    const vt = row[colKey];
    if (vt === null || vt === undefined) continue;
    if (col.sens === "vitesse" && val <= vt) best = row.niveau;
    if (col.sens === "distance" && val >= vt) best = row.niveau;
  }
  return best;
}
// Repère les colonnes incohérentes d'une table : un niveau supérieur doit toujours
// demander une performance égale ou meilleure (signe d'une table mal lue / décalée).
function cotTableAnomalies(table) {
  if (!table || !table.length) return [];
  const out = [];
  const sorted = [...table].sort((a, b) => a.niveau - b.niveau);
  COTATION_COLS.forEach(col => {
    if (col.key === "pts" || !col.sens) return;
    let prev = null, bad = [];
    sorted.forEach(r => {
      const v = r[col.key];
      if (v === null || v === undefined) return;
      if (prev !== null && (col.sens === "vitesse" ? v > prev.v : v < prev.v)) bad.push(r.niveau);
      prev = { v, n: r.niveau };
    });
    if (bad.length) out.push({ col: cotColLabel(col.key, cotState.cat), niveaux: bad });
  });
  return out;
}

function cotColumnsOf(table) {
  return COTATION_COLS.filter(c => c.key !== "pts" && table.some(r => r[c.key] !== null && r[c.key] !== undefined));
}
function cotThreshold(table, colKey, niveau) {
  const row = table.find(r => r.niveau === niveau);
  return row && row[colKey] != null ? row[colKey] : null;
}
const COT_FORMAT_HINT = {
  SSCC: 'ex. 7"45 · 7.45 · 7,45 · 7"4 (manuel)',
  MMSSCC: "ex. 3'15\"90 · 3'15 · 3:15.9",
  CM: "ex. 4m52 · 4.52 · 452 (cm)",
  HMMSS: "ex. 41'05 · 1h52'08 · 1:52:08"
};

function loadCotPrefs() {
  try { const p = JSON.parse(localStorage.getItem(COT_PREF_KEY) || "null"); if (p) cotState = { ...cotState, ...p, perf: "" }; } catch (e) {}
}
function saveCotPrefs() {
  try { localStorage.setItem(COT_PREF_KEY, JSON.stringify({ cat: cotState.cat, col: cotState.col })); } catch (e) {}
}

/* ---------- Saisie de la performance en cases séparées ----------
   Sur téléphone, le clavier numérique n'a ni ' ni " : on saisit donc minutes,
   secondes et centièmes (ou mètres et centimètres) dans des cases distinctes,
   les symboles étant affichés entre les cases. */
const COT_PERF_FIELDS = {
  SSCC:   [{ k: "s", label: "sec", ph: "7", max: 2, sep: '"' }, { k: "c", label: "1/100", ph: "45", max: 2, sep: "" }],
  MMSSCC: [{ k: "m", label: "min", ph: "3", max: 2, sep: "'" }, { k: "s", label: "sec", ph: "15", max: 2, sep: '"' }, { k: "c", label: "1/100", ph: "90", max: 2, sep: "" }],
  CM:     [{ k: "m", label: "m", ph: "4", max: 2, sep: "m" }, { k: "c", label: "cm", ph: "52", max: 2, sep: "" }],
  HMMSS:  [{ k: "h", label: "h", ph: "0", max: 1, sep: "h" }, { k: "m", label: "min", ph: "41", max: 2, sep: "'" }, { k: "s", label: "sec", ph: "05", max: 2, sep: '"' }]
};
const COT_PERF_HELP = {
  SSCC: 'Tapez les chiffres à la suite, sans symbole : 7 4 5 → 7"45. La case suivante est choisie automatiquement. Chrono manuel 7"4 : tapez 7 4.',
  MMSSCC: "Tapez les chiffres à la suite, sans symbole : 3 1 5 9 0 → 3'15\"90. La case suivante est choisie automatiquement.",
  CM: "Tapez les chiffres à la suite, sans symbole : 4 5 2 → 4m52. La case suivante est choisie automatiquement.",
  HMMSS: "Heures, minutes puis secondes, à la suite : 0 4 1 0 5 → 41'05\" ; 1 5 2 0 8 → 1h52'08\"."
};

// Valeur maximale plausible d'une case pour l'épreuve choisie (d'après la table, +50 %).
// Sert à passer automatiquement à la case suivante : au 50m, après « 7 » aucun temps
// de 70 s n'est possible, donc « 7 4 5 » tapé d'affilée donne bien 7"45.
function cotFieldLimit(k) {
  const col = COTATION_COLS.find(c => c.key === cotState.col);
  const table = loadCotationTable(cotState.cat);
  if (!col || !table) return 99;
  const vals = table.map(r => r[col.key]).filter(v => v !== null && v !== undefined);
  if (!vals.length) return 99;
  const maxV = Math.max(...vals);
  if (col.fmt === "SSCC" && k === "s") return Math.ceil(maxV / 100 * 1.5);
  if (col.fmt === "MMSSCC" && k === "m") return Math.ceil(cotUnits(maxV, "MMSSCC") / 100 * 1.5 / 60);
  if (col.fmt === "MMSSCC" && k === "s") return 59;
  if (col.fmt === "CM" && k === "m") return Math.ceil(maxV / 100 * 1.5);
  if (col.fmt === "HMMSS" && k === "h") return 9;
  if (col.fmt === "HMMSS" && (k === "m" || k === "s")) return 59;
  return 99;
}

function cotPerfInputs() { return [...document.querySelectorAll("#cotPerfFields input")]; }
function clearCotPerfFields() { cotPerfInputs().forEach(i => { i.value = ""; }); }

// Construit la performance au format athle.fr à partir des cases (ex. 3'15"90)
function composeCotPerf(fmt) {
  const v = {};
  cotPerfInputs().forEach(i => { v[i.dataset.k] = i.value.trim(); });
  if (!Object.values(v).some(x => x)) return "";
  if (fmt === "SSCC") return `${v.s || 0}"${v.c || ""}`;
  if (fmt === "MMSSCC") return `${v.m || 0}'${v.s || 0}"${v.c || ""}`;
  if (fmt === "CM") return `${v.m || 0}m${v.c || ""}`;
  if (fmt === "HMMSS") return `${v.h || 0}h${pad2(v.m || 0)}'${pad2(v.s || 0)}"`;
  return "";
}
// Remplit les cases à partir d'une valeur de table (utile si l'on colle "7"45")
function fillCotPerfFromValue(val, fmt) {
  const ins = {}; cotPerfInputs().forEach(i => { ins[i.dataset.k] = i; });
  if (fmt === "CM") { ins.m.value = Math.floor(val / 100); ins.c.value = pad2(val % 100); }
  if (fmt === "SSCC") { ins.s.value = Math.floor(val / 100); ins.c.value = pad2(val % 100); }
  if (fmt === "MMSSCC") { ins.m.value = Math.floor(val / 10000); ins.s.value = pad2(Math.floor((val % 10000) / 100)); ins.c.value = pad2(val % 100); }
  if (fmt === "HMMSS") { ins.h.value = Math.floor(val / 10000); ins.m.value = pad2(Math.floor((val % 10000) / 100)); ins.s.value = pad2(val % 100); }
}

function onCotPerfChange() {
  const col = COTATION_COLS.find(c => c.key === cotState.col);
  cotState.perf = col ? composeCotPerf(col.fmt) : "";
  updateCotResult();
  highlightCotTable(true);
}

function renderCotPerfFields(fmt) {
  const box = document.getElementById("cotPerfFields");
  if (!box || box.dataset.fmt === fmt) return;
  const keep = box.dataset.fmt ? null : cotState.perf; // première construction
  box.dataset.fmt = fmt;
  box.innerHTML = "";
  const spec = COT_PERF_FIELDS[fmt];
  spec.forEach((f, idx) => {
    const inp = el("input", {
      type: "text", inputmode: idx < spec.length - 1 ? "decimal" : "numeric", maxlength: String(f.max + 1),
      autocomplete: "off", "data-k": f.k, placeholder: f.ph, "aria-label": f.label,
      class: "cot-pf-input" + (f.k === "c" ? " is-frac" : "")
    });
    inp.addEventListener("input", () => {
      const raw = inp.value;
      // Valeur collée complète (ex. 7"45, 3'15"90, 4m52) : on la répartit dans les cases
      if (/[^0-9]/.test(raw)) {
        const v = parseUserPerf(raw, fmt);
        if (v !== null && /[^0-9.,]/.test(raw)) { fillCotPerfFromValue(v, fmt); onCotPerfChange(); return; }
        // séparateur tapé (virgule, point, espace…) : on passe à la case suivante
        inp.value = raw.replace(/[^0-9]/g, "");
        const next = cotPerfInputs()[idx + 1];
        if (next) { next.focus(); next.select(); }
        onCotPerfChange();
        return;
      }
      if (raw.length > f.max) inp.value = raw.slice(0, f.max);
      const full = inp.value.length >= f.max;
      const noMoreDigit = inp.value.length > 0 && Number(inp.value) * 10 > cotFieldLimit(f.k);
      if ((full || noMoreDigit) && idx < spec.length - 1) {
        const next = cotPerfInputs()[idx + 1];
        if (next) { next.focus(); next.select(); }
      }
      onCotPerfChange();
    });
    inp.addEventListener("keydown", (e) => {
      // Retour arrière dans une case vide : on revient à la case précédente
      if (e.key === "Backspace" && !inp.value && idx > 0) {
        const prev = cotPerfInputs()[idx - 1];
        if (prev) { e.preventDefault(); prev.focus(); }
      }
    });
    inp.addEventListener("focus", () => inp.select());
    box.appendChild(el("span", { class: "cot-pf-cell" }, [inp, el("span", { class: "cot-pf-label" }, f.label)]));
    if (f.sep) box.appendChild(el("span", { class: "cot-pf-sep", "aria-hidden": "true" }, f.sep));
  });
  const help = document.getElementById("cotPerfHelp");
  if (help) help.textContent = COT_PERF_HELP[fmt];
  if (keep) { const v = parseUserPerf(keep, fmt); if (v !== null) fillCotPerfFromValue(v, fmt); }
  cotState.perf = composeCotPerf(fmt);
}

// Clic sur une valeur de la table : l'épreuve et la performance sont reportées dans
// « Situer une performance » (le seuil exact de ce niveau), puis le résultat est affiché.
function pickCotCell(colKey, niveau) {
  const table = loadCotationTable(cotState.cat);
  const col = COTATION_COLS.find(c => c.key === colKey);
  if (!table || !col) return;
  const v = cotThreshold(table, colKey, niveau);
  if (v === null || v === undefined) return;
  if (colKey !== cotState.col) setCotCol(colKey);
  renderCotPerfFields(col.fmt);
  fillCotPerfFromValue(v, col.fmt);
  onCotPerfChange();
  const panel = document.getElementById("cotResult");
  if (panel) {
    const r = panel.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      panel.closest(".panel").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

// Change de table (catégorie) : tout est recalculé avec la nouvelle table.
function setCotCat(code) {
  if (!COT_PAGE_CATS.includes(code)) return;
  const prevLabel = cotColLabel(cotState.col, cotState.cat);
  const prevFmt = (COTATION_COLS.find(c => c.key === cotState.col) || {}).fmt;
  cotState.cat = code;
  const t = loadCotationTable(code);
  if (t && !cotColumnsOf(t).some(c => c.key === cotState.col)) {
    const same = cotColumnsOf(t).find(c => cotColLabel(c.key, code).toLowerCase() === String(prevLabel).toLowerCase())
      || cotColumnsOf(t).find(c => cotColLabel(c.key, code).toLowerCase().split(" ")[0] === String(prevLabel).toLowerCase().split(" ")[0]);
    if (same) {
      if (same.fmt !== prevFmt) { cotState.perf = ""; clearCotPerfFields(); }
      cotState.col = same.key;
    }
  }
  saveCotPrefs();
  renderCotationPage();
}

// Change d'épreuve ; la performance saisie est effacée si l'unité change (temps ↔ distance).
function setCotCol(key) {
  const fmtOf = k => (COTATION_COLS.find(c => c.key === k) || {}).fmt;
  if (fmtOf(key) !== fmtOf(cotState.col)) {
    cotState.perf = "";
    clearCotPerfFields();
  }
  cotState.col = key;
  saveCotPrefs();
  renderCotationPage();
}

let cotInitDone = false;
function renderCotationPage() {
  if (!cotInitDone) {
    cotInitDone = true;
    loadCotPrefs();
    // Vrais boutons (et non des boutons radio cachés) : le clic est pris en compte
    // de la même façon dans tous les navigateurs, y compris Safari sur iPhone.
    const chips = document.getElementById("cotCats");
    chips.setAttribute("role", "radiogroup");
    chips.setAttribute("aria-label", "Table de cotation");
    COT_PAGE_CATS.forEach(code => {
      if (code === "BEM") chips.appendChild(el("span", { class: "cot-chip-group" }, "FFA · niveaux 1 à 50"));
      if (code === "WAM") chips.appendChild(el("span", { class: "cot-chip-group" }, "World Athletics · points 0 à 1400"));
      const btn = el("button", { type: "button", class: "cot-chip", role: "radio", "data-cat": code }, COT_PAGE_LABELS[code]);
      btn.addEventListener("click", () => setCotCat(code));
      btn.addEventListener("keydown", (e) => {
        const i = COT_PAGE_CATS.indexOf(code);
        let j = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % COT_PAGE_CATS.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i + COT_PAGE_CATS.length - 1) % COT_PAGE_CATS.length;
        if (j === null) return;
        e.preventDefault();
        setCotCat(COT_PAGE_CATS[j]);
        const next = chips.querySelector(`[data-cat="${COT_PAGE_CATS[j]}"]`);
        if (next) next.focus();
      });
      chips.appendChild(btn);
    });
    document.getElementById("cotEpreuve").addEventListener("change", (e) => setCotCol(e.target.value));
    document.getElementById("cotTableWrap").addEventListener("click", (e) => {
      const td = e.target.closest("td");
      const tr = td && td.closest("tr[data-niv]");
      if (!tr) return;
      // clic sur la colonne Niveau : on garde l'épreuve choisie
      pickCotCell(td.dataset.col || cotState.col, parseInt(tr.dataset.niv, 10));
    });

  }
  // État visuel des boutons de catégorie
  document.querySelectorAll("#cotCats .cot-chip").forEach(b => {
    const on = b.dataset.cat === cotState.cat;
    b.classList.toggle("on", on);
    b.setAttribute("aria-checked", on ? "true" : "false");
    b.tabIndex = on ? 0 : -1;
  });
  const table = loadCotationTable(cotState.cat);
  const cols = table ? cotColumnsOf(table) : [];
  if (!cols.find(c => c.key === cotState.col)) cotState.col = cols.length ? cols[0].key : "";
  const sel = document.getElementById("cotEpreuve");
  sel.innerHTML = "";
  cols.forEach(c => sel.appendChild(el("option", { value: c.key }, cotColLabel(c.key, cotState.cat))));
  sel.value = cotState.col;
  const col = cols.find(c => c.key === cotState.col);
  if (col) renderCotPerfFields(col.fmt);
  document.getElementById("cotTableTitle").textContent = "Table de cotation — " + COT_PAGE_LABELS[cotState.cat] +
    (isWaCat(cotState.cat) ? " · points World Athletics" : "");
  document.getElementById("cotTableSource").textContent = isWaCat(cotState.cat)
    ? "Barème World Athletics 2025 (calculé, ±1 point) · paliers de 50 points"
    : hasCustomCotationTable(cotState.cat) ? "Table personnalisée importée (page Base de données)" : "Table FFA intégrée";
  renderCotWarning(table);
  renderCotTable(table, cols);
  updateCotResult();
  highlightCotTable(false);
}

function renderCotWarning(table) {
  const box = document.getElementById("cotTableWarn");
  if (!box) return;
  box.innerHTML = "";
  const custom = hasCustomCotationTable(cotState.cat);
  const anomalies = cotTableAnomalies(table);
  if (!custom && !anomalies.length) { box.style.display = "none"; return; }
  box.style.display = "block";
  const parts = [];
  if (anomalies.length) {
    parts.push(el("div", {}, [el("b", {}, "⚠️ Valeurs incohérentes dans cette table : "),
      anomalies.slice(0, 6).map(a => `${a.col} (niveau${a.niveaux.length > 1 ? "x" : ""} ${a.niveaux.join(", ")})`).join(" · ") +
      (anomalies.length > 6 ? ` … et ${anomalies.length - 6} autre(s) épreuve(s)` : "") +
      ". Un niveau plus élevé devrait toujours demander une meilleure performance : la table a probablement été mal lue (colonnes décalées)."]));
  }
  if (custom) {
    const btn = el("button", { class: "btn small", style: "margin-top:8px;" }, "Revenir à la table FFA intégrée");
    btn.addEventListener("click", () => {
      confirmAction("Revenir à la table intégrée ?", `La table personnalisée ${COT_PAGE_LABELS[cotState.cat]} importée sur cet appareil sera supprimée et la table FFA intégrée sera utilisée partout dans l'application.`, () => {
        deleteCotationTable(cotState.cat);
        toast("Table FFA intégrée rétablie", "success");
        renderCotationPage();
      });
    });
    parts.push(el("div", {}, [anomalies.length ? "" : "Cette catégorie utilise une table personnalisée importée sur cet appareil. ", btn]));
  }
  parts.forEach(p => box.appendChild(p));
  box.className = "cot-warn-box" + (anomalies.length ? " is-bad" : "");
}

function renderCotTable(table, cols) {
  const wrap = document.getElementById("cotTableWrap");
  wrap.innerHTML = "";
  if (!table) { wrap.appendChild(el("div", { class: "empty-state" }, "Aucune table disponible pour cette catégorie.")); return; }
  const thead = el("thead", {}, el("tr", {}, [
    el("th", { class: "cot-niv" }, isWaCat(cotState.cat) ? "Points" : "Niveau"),
    ...cols.map(c => {
      const th = el("th", { "data-col": c.key, title: "Choisir cette épreuve" }, cotColLabel(c.key, cotState.cat));
      th.addEventListener("click", () => setCotCol(c.key));
      return th;
    })
  ]));
  const rows = [...table].sort((a, b) => b.niveau - a.niveau);
  const tbody = el("tbody", {}, rows.map(r => el("tr", { "data-niv": String(r.niveau) }, [
    el("td", { class: "cot-niv" }, el("span", { class: "cot-niv-pill", style: `background:${isWaCat(cotState.cat) ? waColor(r.niveau) : lvlColorCotation(r.niveau)}` }, String(r.niveau))),
    ...cols.map(c => el("td", r[c.key] != null
      ? { "data-col": c.key, class: "cot-cell", title: `Situer ${formatCotValue(r[c.key], c.fmt)} (${isWaCat(cotState.cat) ? r.niveau + " points" : "niveau " + r.niveau})` }
      : { "data-col": c.key }, formatCotValue(r[c.key], c.fmt)))
  ])));
  wrap.appendChild(el("table", { class: "cot-table" }, [thead, tbody]));
}

function highlightCotTable(scroll) {
  const wrap = document.getElementById("cotTableWrap");
  wrap.querySelectorAll(".cot-col-sel").forEach(n => n.classList.remove("cot-col-sel"));
  wrap.querySelectorAll(".cot-row-hit").forEach(n => n.classList.remove("cot-row-hit"));
  wrap.querySelectorAll(".cot-cell-hit").forEach(n => n.classList.remove("cot-cell-hit"));
  wrap.querySelectorAll(`[data-col="${cotState.col}"]`).forEach(n => n.classList.add("cot-col-sel"));
  const r = cotState._result;
  const niv = r && r.niveau ? r.niveau : null;
  if (niv) {
    const tr = wrap.querySelector(`tr[data-niv="${niv}"]`);
    if (tr) {
      tr.classList.add("cot-row-hit");
      const td = tr.querySelector(`td[data-col="${cotState.col}"]`);
      if (td) td.classList.add("cot-cell-hit");
      if (scroll) {
        const top = tr.offsetTop - wrap.clientHeight / 2 + tr.offsetHeight;
        wrap.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }
  }
  const th = wrap.querySelector(`th[data-col="${cotState.col}"]`);
  if (th && scroll !== null) {
    const left = th.offsetLeft - wrap.clientWidth / 2 + th.offsetWidth / 2;
    if (left > 0 || wrap.scrollLeft > 0) wrap.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }
}

function updateCotResult() {
  const box = document.getElementById("cotResult");
  const table = loadCotationTable(cotState.cat);
  const col = COTATION_COLS.find(c => c.key === cotState.col);
  cotState._result = null;
  box.innerHTML = "";
  if (!table || !col) return;
  const raw = cotState.perf.trim();
  if (!raw) {
    box.appendChild(el("div", { class: "cot-hint" }, "Saisissez une performance pour la situer dans la table."));
    box.appendChild(renderCotGauge(null));
    return;
  }
  const val = parseUserPerf(raw, col.fmt);
  if (val === null) {
    box.appendChild(el("div", { class: "cot-hint cot-warn" }, "Format non reconnu — " + COT_FORMAT_HINT[col.fmt]));
    box.appendChild(renderCotGauge(null));
    return;
  }
  if (isWaCat(cotState.cat)) { renderWaResult(box, table, col, val); return; }
  const niveau = niveauFromValue(val, col.key, table);
  cotState._result = { niveau, val };
  const shown = formatCotValue(val, col.fmt);
  const better = col.sens === "vitesse" ? "plus rapide" : (["Hauteur", "Perche"].includes(col.key) ? "plus haut" : "plus loin");
  const lines = [];
  if (!niveau) {
    const t1 = cotThreshold(table, col.key, 1);
    box.appendChild(el("div", { class: "cot-big" }, [
      el("span", { class: "cot-big-pill", style: "background:#9AAEB6" }, "< 1"),
      el("div", {}, [el("div", { class: "cot-big-title" }, `${shown} en ${cotColLabel(col.key, cotState.cat)} : sous le niveau 1`),
        el("div", { class: "cot-big-sub" }, COT_PAGE_LABELS[cotState.cat])])
    ]));
    if (t1 !== null) lines.push(`Niveau 1 à ${formatCotValue(t1, col.fmt)} — il manque ${formatCotGap(cotUnits(t1, col.fmt) - cotUnits(val, col.fmt), col.fmt)}.`);
  } else {
    const cur = cotThreshold(table, col.key, niveau);
    box.appendChild(el("div", { class: "cot-big" }, [
      el("span", { class: "cot-big-pill", style: `background:${lvlColorCotation(niveau)}` }, String(niveau)),
      el("div", {}, [el("div", { class: "cot-big-title" }, `${shown} en ${cotColLabel(col.key, cotState.cat)} : niveau ${niveau}/50`),
        el("div", { class: "cot-big-sub" }, `${COT_PAGE_LABELS[cotState.cat]} · seuil du niveau ${niveau} : ${formatCotValue(cur, col.fmt)}`)])
    ]));
    if (niveau < 50) {
      const nx = cotThreshold(table, col.key, niveau + 1);
      if (nx !== null) lines.push(`Niveau ${niveau + 1} à ${formatCotValue(nx, col.fmt)} — il faut ${formatCotGap(Math.abs(cotUnits(nx, col.fmt) - cotUnits(val, col.fmt)), col.fmt)} de ${col.sens === "vitesse" ? "moins" : "plus"}.`);
      const goal = Math.min(50, (Math.floor(niveau / 10) + 1) * 10);
      if (goal > niveau + 1) {
        const g = cotThreshold(table, col.key, goal);
        if (g !== null) lines.push(`Niveau ${goal} à ${formatCotValue(g, col.fmt)} — encore ${formatCotGap(Math.abs(cotUnits(g, col.fmt) - cotUnits(val, col.fmt)), col.fmt)} ${better}.`);
      }
    } else {
      lines.push("Niveau maximum de la table.");
    }
  }
  if (lines.length) box.appendChild(el("ul", { class: "cot-lines" }, lines.map(t => el("li", {}, t))));
  box.appendChild(renderCotGauge(niveau));
  // Même performance dans les autres tables
  const realName = cotColLabel(col.key, cotState.cat);
  const others = COT_PAGE_CATS.filter(c => c !== cotState.cat && !isWaCat(c)).map(code => {
    const t = loadCotationTable(code);
    if (!t) return null;
    const other = cotColumnsOf(t).find(c => cotColLabel(c.key, code) === realName);
    if (!other) return null;
    const n = niveauFromValue(val, other.key, t);
    return el("span", { class: "cot-other" }, [COT_PAGE_LABELS[code] + " : ",
      el("b", { style: `color:${n ? lvlColorCotation(n) : "var(--grey-dim)"}` }, n ? `niveau ${n}` : "< 1")]);
  }).filter(Boolean);
  if (others.length) box.appendChild(el("div", { class: "cot-others" }, [el("span", { class: "cot-others-label" }, "Même épreuve dans les autres tables :"), ...others]));
}

function renderWaResult(box, table, col, val) {
  const code = cotState.cat;
  const pts = waPointsForValue(code, col.key, val);
  const palier = pts >= WA_STEP ? Math.floor(pts / WA_STEP) * WA_STEP : null;
  cotState._result = { niveau: palier, val, points: pts };
  const shown = formatCotValue(val, col.fmt);
  const label = cotColLabel(col.key, code);
  const better = col.sens === "vitesse" ? "plus rapide" : (["wa_HJ", "wa_PV"].includes(col.key) ? "plus haut" : "plus loin");
  const coef = waCoef(code, col.wa);
  box.appendChild(el("div", { class: "cot-big" }, [
    el("span", { class: "cot-big-pill wa", style: `background:${waColor(pts)}` }, String(pts)),
    el("div", {}, [el("div", { class: "cot-big-title" }, `${shown} en ${label} : ${pts} points`),
      el("div", { class: "cot-big-sub" }, `${COT_PAGE_LABELS[code]} · barème World Athletics 2025`)])
  ]));
  const lines = [];
  const target = (P, prefix) => {
    if (P > 1400 || !coef) return;
    const x = waMarkFor(P, coef);
    if (x === null) return;
    const v = waEncode(x, col.fmt);
    const gap = Math.abs(cotUnits(v, col.fmt) - cotUnits(val, col.fmt));
    lines.push(`${prefix} ${P} points à ${formatCotValue(v, col.fmt)} — encore ${formatCotGap(gap, col.fmt)} ${better}.`);
  };
  if (pts >= 1400) lines.push("Maximum du barème (1400 points).");
  else {
    target(Math.max(WA_STEP, (Math.floor(pts / WA_STEP) + 1) * WA_STEP), "Palier de");
    const hundred = (Math.floor(pts / 100) + 1) * 100;
    if (hundred % WA_STEP === 0 && hundred > (Math.floor(pts / WA_STEP) + 1) * WA_STEP) target(hundred, "Palier de");
    const ref = [500, 700, 900, 1000, 1100, 1200].find(p => p > pts + 100);
    if (ref) target(ref, "Repère :");
  }
  box.appendChild(el("ul", { class: "cot-lines" }, lines.map(t => el("li", {}, t))));
  // jauge 0 → 1400 par paliers de 50
  const g = el("div", { class: "cot-gauge", title: `${pts} points` });
  for (let P = WA_STEP; P <= 1400; P += WA_STEP) {
    const cell = el("span", { style: `background:${waColor(P)};opacity:${pts >= P ? 1 : 0.18}` });
    if (palier === P) cell.className = "on";
    g.appendChild(cell);
  }
  box.appendChild(el("div", { class: "cot-gauge-wrap" }, [g, el("div", { class: "cot-gauge-axis" }, ["0", "350", "700", "1050", "1400"].map(t => el("span", {}, t)))]));
  // même épreuve dans l'autre table WA (épreuves identiques seulement : même engin, même hauteur)
  const other = code === "WAM" ? "WAF" : "WAM";
  const oc = WA_EVENTS.find(e => e.key === col.key);
  if (oc && (other === "WAF" ? oc.f : oc.m) === label) {
    const op = waPointsForValue(other, col.key, val);
    box.appendChild(el("div", { class: "cot-others" }, [el("span", { class: "cot-others-label" }, "Même épreuve dans l'autre table :"),
      el("span", { class: "cot-other" }, [COT_PAGE_LABELS[other] + " : ", el("b", { style: `color:${waColor(op)}` }, `${op} points`)])]));
  }
  box.appendChild(el("div", { class: "cot-hint", style: "margin:10px 0 0;font-size:11.5px;" },
    "Barème identique pour tous les âges, avec les engins et hauteurs de haies seniors : pour un cadet ou un junior, il ne s'applique qu'aux épreuves courues ou lancées avec ces mêmes engins."));
}

function renderCotGauge(niveau) {
  const g = el("div", { class: "cot-gauge", title: niveau ? `Niveau ${niveau}/50` : "" });
  for (let i = 1; i <= 50; i++) {
    const cell = el("span", { style: `background:${lvlColorCotation(i)};opacity:${niveau && i <= niveau ? 1 : 0.18}` });
    if (niveau === i) cell.className = "on";
    g.appendChild(cell);
  }
  return el("div", { class: "cot-gauge-wrap" }, [g, el("div", { class: "cot-gauge-axis" }, ["1", "10", "20", "30", "40", "50"].map(t => el("span", {}, t)))]);
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
      const colKey = cotationColFor(r.epreuve);
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
    const colKey = cotationColFor(r.epreuve);
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
  const keepYears = new Set(Array.from(anneeSel.selectedOptions || []).map(o => o.value));
  anneeSel.innerHTML = years.map(y => `<option value="${y}"${keepYears.has(String(y)) ? " selected" : ""}>${y}</option>`).join("");
  if (!anneeSel._init) {
    anneeSel.addEventListener("change", () => { syncYearChips("dashCotAnnee"); renderCotSynth(); });
    anneeSel._init = true;
  }
  syncYearChips("dashCotAnnee");
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
  // Années choisies (aucune = toutes années, meilleure performance)
  const selYears = Array.from(anneeSel.selectedOptions || []).map(o => o.value);
  const annee = selYears.length ? yearsLabel(selYears) : "best";
  const sexeFilter = sexeSel ? sexeSel.value : "all";
  const showBoth = selYears.length > 0;

  const codeM = pairCode + "M";
  const codeF = pairCode + "F";
  const tableM = loadCotationTable(codeM);
  const tableF = loadCotationTable(codeF);
  // Chaque athlète est coté avec la table de SON sexe (les tables garçons et filles
  // sont différentes). Les colonnes affichées réunissent celles des deux tables.
  const table = tableM || tableF;
  if (!table) return;
  const tableForSexe = (sexe) => (sexe === "F" ? tableF : tableM) || table;
  const hasCol = (t, k) => !!t && t.length && t.some(r => r[k] !== null && r[k] !== undefined);

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
    if (anneeFilter !== "best") rows = rows.filter(r => anneeFilter.includes(String(r.annee)));
    return rows;
  };

  const athletesAll  = getAthletes("best", sexeFilter);
  const athletesYear = getAthletes(showBoth ? selYears : "best", sexeFilter);

  // Détruire les anciens graphiques
  Object.values(dashCotCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  dashCotCharts = {};
  grid.innerHTML = "";

  const cols = COTATION_COLS.filter(c => c.key !== "pts" && c.key !== "4x60mMixte" && c.sens
    && ((sexeFilter !== "F" && hasCol(tableM, c.key)) || (sexeFilter !== "M" && hasCol(tableF, c.key))));

  // Nom réel de l'épreuve : garçons, filles, ou les deux s'ils diffèrent
  const synthColLabel = (key) => {
    const lm = cotColLabel(key, codeM), lf = cotColLabel(key, codeF);
    const inM = hasCol(tableM, key), inF = hasCol(tableF, key);
    if (inM && !inF) return lm;
    if (inF && !inM) return lf;
    if (sexeFilter === "M" || lm === lf) return sexeFilter === "F" ? lf : lm;
    if (sexeFilter === "F") return lf;
    const w = lm.split(" ")[0];
    return lf.startsWith(w + " ") ? `${lm} G · ${lf.slice(w.length + 1)} F` : `${lm} G · ${lf} F`;
  };

  cols.forEach(col => {
    // Distribution "toutes années" (fond grisé quand annee filtrée)
    const buildColDist = (athletes) => {
      const noms = [...new Set(athletes.map(r => r.nom))];
      const dist = {};
      for (const nom of noms) {
        const perfsNom = athletes.filter(r => r.nom === nom && cotationColFor(r.epreuve) === col.key);
        if (!perfsNom.length) continue;
        let best = null;
        for (const r of perfsNom) {
          const val = perfToTableValue(r.performance, col.key);
          if (!val) continue;
          if (!best || (col.sens === "vitesse" ? val < best.val : val > best.val))
            best = { val, perf: r.performance, nom, sexe: r.sexe };
        }
        if (!best) continue;
        const niv = getNiveauCotation(best.perf, col.key, tableForSexe(best.sexe));
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
        <span>${synthColLabel(col.key)} ${avgBadge}</span>
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
