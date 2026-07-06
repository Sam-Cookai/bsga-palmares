# Changelog — BSGA Palmarès

Tant que l'application est en phase d'ajustements, la version reste sur un
format `0.x` : elle s'incrémente à chaque lot de demandes traité. Le passage
à la version `1.0` interviendra une fois l'application jugée stable et
complète.

---

## Version 0.25

- **Correction du service worker (mode hors-ligne / PWA)** : le nom du
  cache était resté figé sur `"bsga-palmares-v0.14"` depuis plusieurs
  versions (jamais mis à jour). Conséquence probable : un navigateur
  ayant déjà ouvert l'app une fois pouvait continuer à servir
  indéfiniment l'ancienne version en cache, même après une mise à jour
  des fichiers sur GitHub — jusqu'à un vidage manuel du cache. Le nom
  du cache est désormais aligné sur `APP_VERSION` à chaque publication,
  et la stratégie de chargement passe en "réseau d'abord" pour les
  fichiers de l'app (HTML/JS/JSON) — seules les librairies tierces
  (`lib/*`, qui ne changent jamais) restent en cache-d'abord. Les mises
  à jour sont donc visibles immédiatement dès qu'une connexion est
  disponible ; le cache ne sert plus que de secours hors-ligne.

## Version 0.24

- **Correction du vrai bug de décalage de colonnes dans l'Explorer** :
  une édition précédente (ajout des infobulles sur Discipline/Épreuve/
  Catégorie) avait accidentellement supprimé la cellule "Place" du
  rendu de chaque ligne. Résultat : toutes les colonnes à partir de
  "Place" étaient décalées d'un cran (la Performance apparaissait sous
  "Place", l'Athlète sous "Performance", etc.) — ce n'était pas un
  problème de largeur de colonnes comme supposé en v0.23, mais une
  vraie cellule manquante. La ligne a été restaurée ; les 9 colonnes
  correspondent maintenant strictement aux 9 cellules rendues.

## Version 0.23

- **Correction du calibrage des colonnes (Explorer + fiche athlète)** :
  les pourcentages choisis en v0.17 étaient trop justes pour certains
  intitulés courts mais en majuscules (PLACE, NIVEAU FFA, ANNÉE, SEXE),
  qui se retrouvaient tronqués ("PLAC…") sur des largeurs d'écran
  courantes. Ces colonnes ont désormais une largeur fixe en pixels
  (suffisante pour leur contenu, qui ne varie pas), et les colonnes à
  texte variable (Discipline, Épreuve, Catégorie, Performance, Athlète)
  se partagent le reste en pourcentage. Une largeur minimale de tableau
  a aussi été ajoutée : sur un écran très étroit, le tableau défile
  horizontalement plutôt que d'écraser les colonnes.

## Version 0.22

- **Revu du badge "Niveau moyen FFA"** (v0.21 corrigeait un vrai bug mais
  en mélangeant les catégories dans une même moyenne, ce qui n'a pas de
  sens entre deux barèmes différents) : le badge affiche maintenant la
  moyenne de la **catégorie et de l'année en cours uniquement** (la plus
  récente), avec l'année précisée entre parenthèses — ex. "20.2/50 ·
  Niveau moyen FFA (2026, 10 épr.)". Les résultats d'une catégorie d'âge
  précédente (ex. Benjamin 2025) ne sont plus mélangés à ceux de la
  catégorie actuelle ; ils restent consultables via le sélecteur de
  catégorie du panneau détaillé plus bas sur la fiche.

## Version 0.21

- **Correction d'un bug important sur le badge "Niveau moyen FFA"**
  (en haut de la fiche athlète) : pour un athlète ayant changé de
  catégorie d'âge d'une saison à l'autre (ex. Benjamin en 2025 puis
  Minime en 2026), seule la catégorie du résultat le plus récent était
  prise en compte — tous les résultats de l'ancienne catégorie étaient
  silencieusement ignorés (leurs épreuves n'existant pas dans l'autre
  table de cotation). Chaque résultat est désormais coté avec la table
  de SA PROPRE catégorie au moment où il a été réalisé. Exemple concret
  (Noam Colin, Benjamin 2025 → Minime 2026) : 19 épreuves cotées prises
  en compte au lieu de 10-11, moyenne recalculée de 19.5/50 à 24.8/50.

## Version 0.20

- **Correction du radar de cotation (fiche athlète)** : le libellé de
  l'axe "Marche" n'apparaissait pas (rogné en bas du graphique, la zone
  allouée au graphique étant trop compacte pour les 6 axes), ce qui
  pouvait donner l'impression que les valeurs ne correspondaient pas
  aux bonnes disciplines. Zone du graphique agrandie et marge interne
  ajoutée pour que les 6 libellés (Sprint, Haies, Demi-fond, Marche,
  Saut, Lancé) restent toujours visibles.

## Version 0.19

- **Sélecteur de catégorie sur la fiche athlète**, juste sous le filtre
  Année dans le panneau "Niveaux de cotation FFA" : utile pour les
  athlètes qui changent de catégorie d'âge d'une saison à l'autre
  (ex. Benjamin → Minime). Par défaut, la catégorie la plus récente est
  sélectionnée. Changer de catégorie recalcule le score moyen, le radar
  et le détail par discipline avec la bonne table de cotation, la bonne
  comparaison catégorie, et ne propose dans le filtre Année que les
  années où l'athlète a effectivement concouru dans cette catégorie.

## Version 0.18

- **Graphique radar "Niveaux de cotation FFA" sur la fiche athlète**,
  en remplacement des barres par épreuve : toile d'araignée à 6 axes
  (Sprint, Haies, Demi-fond, Marche, Saut, Lancé). Sur chaque axe, la
  valeur est le meilleur niveau FFA (1-50) obtenu sur n'importe quelle
  épreuve du groupe, avec 3 séries superposées : l'athlète (bleu),
  la meilleure performance du club tous licenciés confondus (or,
  pointillés, marqueur triangle), et la meilleure performance de sa
  catégorie BEM/BEF/MIM/MIF (orange, pointillés, marqueur carré). Le
  badge "Niveau moyen / 50 (n épreuve(s) cotée(s))" est conservé
  au-dessus du graphique.
- **Détail par discipline au clic** : cliquer sur une puce
  (Sprint/Haies/Demi-fond/Marche/Saut/Lancé) sous le radar affiche le
  détail des épreuves de ce groupe pour l'athlète, sous forme de barres
  plates (performance, niveau/50, repères club et catégorie sur la
  barre). 👑 devant la performance si l'athlète détient le record du
  club sur cette épreuve, 🏆 s'il détient seulement le record de sa
  catégorie.
- Les comparaisons club/catégorie sont toujours calculées sur
  l'ensemble de la base (repères fixes), indépendamment du filtre année
  qui ne s'applique qu'à la ligne de l'athlète.

## Version 0.17

- **Correction du bug de largeur de colonnes (Explorer + fiche athlète)** :
  la colonne "Niveau FFA" épinglée introduite en v0.16 masquait en fait la
  fin des noms/prénoms des athlètes (et d'autres textes longs) en les
  recouvrant. Remplacé par une largeur de colonnes fixe et proportionnée
  (`table-layout:fixed` + largeurs définies par colonne) sur les tableaux
  Explorer et "Détail des performances" : toutes les colonnes, dont
  "Niveau FFA", sont désormais toujours entièrement visibles et ne se
  chevauchent plus.
- **Troncature propre en cas de texte trop long** : si un texte (épreuve,
  discipline, catégorie...) ne tient pas dans sa colonne sur un écran
  étroit, il est tronqué proprement avec "…" plutôt que d'être coupé
  brutalement ou masqué ; le texte complet reste disponible au survol
  (infobulle).
- Le fond légèrement bleuté des lignes "meilleure performance
  personnelle" (⭐) est conservé à l'identique.

## Version 0.16

- **Colonne "Niveau FFA" épinglée à droite dans l'Explorer** : le tableau
  de résultats compte beaucoup de colonnes à largeur fixe (pas de retour
  à la ligne), ce qui pouvait pousser la colonne "Niveau FFA" hors de la
  zone visible sans qu'un défilement horizontal soit évident. Elle est
  désormais épinglée ("sticky") sur le bord droit du tableau : elle
  reste toujours visible, même en faisant défiler les autres colonnes.
- **Colonne "Niveau FFA" ajoutée au tableau "Détail des performances"
  de la fiche athlète**, avec le même badge coloré et la même règle
  d'affichage ("-" hors Benjamin/Minime ou épreuve non cotable).

## Version 0.15

- **Tables de cotation BEM/BEF/MIM/MIF intégrées directement dans l'app** :
  plus besoin d'importer manuellement les 4 tables — elles sont désormais
  embarquées dans un nouveau fichier `cotation_defaults.js`, chargé au
  démarrage. Le niveau FFA (Explorer, fiche athlète, tableau de bord) est
  donc disponible immédiatement pour Benjamin/Benjamine/Minime/Minime,
  sans configuration préalable.
- **Import personnalisé toujours possible** : dans Base de données >
  Tables de cotation, chaque catégorie affiche désormais si elle utilise
  la table "Intégrée par défaut" ou une table "Personnalisée" (importée
  par l'utilisateur). Un import (PDF ou JSON) prend toujours le pas sur
  la valeur intégrée ; un bouton "↺ Version intégrée" permet de revenir
  à la table par défaut à tout moment pour BEM/BEF/MIM/MIF. Les
  catégories sans table intégrée (Cadet, Junior...) fonctionnent comme
  avant (import requis).
- **Mode hors-ligne (PWA)** : le nouveau fichier `cotation_defaults.js`
  est ajouté au cache du service worker.

## Version 0.14

- **Niveau FFA moyen dans l'Explorer** : ajout d'un badge "Niveau FFA moyen"
  à côté du compteur de résultats, au-dessus du tableau. Il se recalcule
  en direct selon les filtres actifs (année, sexe, épreuve, catégorie...),
  ne porte que sur les résultats réellement cotables, et affiche entre
  parenthèses le nombre de résultats pris en compte. Se masque
  automatiquement si aucun résultat filtré n'est cotable.
- **Harmonisation du format des performances chronométrées** : certaines
  performances utilisaient `''` (deux apostrophes) à la place de `"` pour
  séparer secondes et centièmes (ex. `2'39''95`). Toutes les valeurs du
  champ performance ont été harmonisées vers `"` (ex. `2'39"95`) pour un
  affichage cohérent dans le tableau de l'Explorer.
- **Base de données remplacée à deux reprises** avec des exports plus
  récents fournis par l'utilisateur (1378 puis 1381 résultats), avec
  ré-application systématique de l'harmonisation ci-dessus et nettoyage
  des champs techniques temporaires (`_displayPlace`, `_placeRecomputed`,
  `_isRecord`) qui n'ont pas leur place dans les données stockées
  (ils sont recalculés à chaque affichage).
- **Suivi de version** : la version de l'application (`APP_VERSION` dans
  `app.js`, `README.md`) est désormais incrémentée systématiquement à
  chaque lot de modifications, avec une entrée correspondante ajoutée
  ici dans le CHANGELOG.

## Version 0.13

- **Tables de cotation Minimes (MIM/MIF) ajoutées** : conversion des barèmes
  officiels FFA Minime Masculin et Minime Féminin en JSON (récupérés
  directement depuis athle.fr), sur le même modèle que BEM/BEF. Toutes
  les tables de cotation (`cotation_BEM.json`, `cotation_BEF.json`,
  `cotation_MIM.json`, `cotation_MIF.json`) sont désormais regroupées
  dans un dossier `cotations/` à la racine du zip.
- **Table BEF complétée** : les colonnes `2000m Marche`, `4x60m` et
  `4x60m Mixte`, absentes de la première conversion (OCR peu fiable sur
  ces colonnes), ont été récupérées depuis le texte natif du PDF officiel
  et vérifiées (progression cohérente sur les 50 niveaux).
- **Nouvelle colonne "Niveau FFA" dans l'Explorer** : chaque résultat
  affiche désormais son niveau de cotation (1-50, badge coloré) calculé
  à partir de l'épreuve, la performance et la catégorie. Uniquement pour
  les catégories Benjamin/Benjamine et Minime/Minime ; "-" sinon (autre
  catégorie, épreuve non cotable, ou table non chargée). Colonne triable
  comme les autres.
- **Épreuves Minimes reconnues dans le moteur de cotation** : `COTATION_COLS`
  et `COTATION_EPREUVE_MAP` couvrent maintenant 80m, 120m, 2000m, les haies
  spécifiques Minime (50m/80m/100m/200m selon hauteur), les lancers plus
  lourds (Poids 4kg, Disque 1.25kg, Marteau 4kg, Javelot 600g) et le
  3000m Marche. Les vues "barres de cotation" (fiche athlète) et
  "synthèse club" (tableau de bord) n'affichent que les épreuves
  pertinentes pour la catégorie consultée, sans ajouter de barres vides
  inutiles pour les Benjamins.
- **Corrections de bugs de cotation découvertes en testant sur les
  résultats réels** (799 résultats Benjamin/Minime) :
  - format de temps `2'39''95` (double apostrophe) non reconnu par le
    calcul de niveau sur les épreuves chronométrées longues (1000m,
    2000m, 3000m Marche) — corrigé ;
  - épreuves de lancer Benjamine (Poids 2kg, Disque 0.6kg, Marteau 2kg,
    Javelot 400g) jamais reliées à une colonne de cotation — corrigé ;
  - "Triple saut" sans mention de vent jamais reconnu — corrigé.
  - Résultat : 581 des 799 résultats Benjamin/Minime obtiennent
    désormais un niveau FFA calculé (contre 0 avant cette version). Les
    résultats restants sans niveau correspondent à des épreuves
    combinées (Tétrathlon, Pentathlon, Heptathlon, Octathlon, Triathlon
    — barème à points propre), au 5km Route, à un relais spécial, ou à
    des performances sous le niveau 1 du barème.

## Version 0.12

- **Cotations FFA intégrées dans BSGA Palmarès** : nouvelle section
  "Tables de cotation FFA" dans la page Base de données, permettant
  d'importer les tables de cotation par catégorie (BEM, BEF, MIM, MIF,
  extensible à CAM, CAF, JUM, JUF...) via PDF (sur GitHub Pages) ou
  fichier JSON pré-calculé (en mode local). Un script Python
  `convertir_cotation.py` est fourni dans le zip pour générer les JSON
  depuis les PDF.
- **Fiche athlète enrichie** : pour les athlètes dont la catégorie a une
  table de cotation chargée, une section "Niveaux de cotation FFA" apparaît
  en bas de la fiche avec des barres de niveau colorées (violet 1-9 initiation
  → rouge → orange → bleu → vert 40-50 élite), filtrables par année.
- **Tableau de bord enrichi** : nouveau panel "Niveaux de cotation FFA —
  Vue synthétique du club" sous le top participations, avec histogramme
  de distribution des niveaux par épreuve, filtrable par catégorie et
  par année. Tooltip affichant les noms des athlètes au survol.

## Version 0.11

- **Base de données mise à jour** : 1374 résultats couvrant 2025 et 2026,
  Hommes et Femmes, avec les vraies catégories FFA officielles.
- **Filtre Hommes / Femmes sur le tableau de bord** : nouveau sélecteur
  "Hommes + Femmes / Hommes / Femmes" à côté du filtre année, qui filtre
  tous les KPIs, graphiques et top participations en temps réel.
- **Filtre Records du club dans l'Explorer** : le filtre "Podium uniquement"
  est remplacé par un filtre "Records du club" avec trois options —
  👑 Records absolus (toutes catégories), 🏆 Records par catégorie d'âge,
  ou les deux combinés. Le filtre "Podium uniquement" est conservé en
  complément.

## Version 0.9

- **Fiche athlète enrichie** : le tableau des performances affiche désormais
  deux distinctions visuelles : ⭐ (fond bleu clair) pour la meilleure
  performance de l'athlète sur chaque épreuve toutes saisons confondues,
  et 🏆 (fond doré) pour les records du club. Une notice explicative est
  affichée au-dessus du tableau.
- **Clic sur un athlète depuis l'Explorer** : la cellule "Athlète" est
  maintenant cliquable (lien souligné bleu, survol orange) et redirige
  directement vers la fiche de l'athlète en question.
- **Tri des lancers par type puis par poids** : dans le menu déroulant
  des épreuves, les lancers sont maintenant regroupés par type dans un
  ordre fixe (Disque → Javelot → Marteau → Poids), puis triés par poids
  croissant à l'intérieur de chaque type.
- **Correction du filtre année sur le tableau de bord** : sélectionner
  une année dans le sélecteur du dashboard mettait à jour les KPI et
  les graphiques lors du premier appel mais les réinitialisait
  immédiatement après (bug de recréation du select). Corrigé.

## Version 0.8

- **Application responsive mobile** : l'app fonctionne désormais sur
  téléphone et tablette. Sur mobile (< 768px), la sidebar disparaît et
  est remplacée par une barre de navigation fixée en bas de l'écran avec
  des icônes (Tableau / Explorer / Athlètes / Importer / Base), un header
  compact avec logo et compteur de résultats en haut. Le layout passe en
  colonne unique, les grilles de filtres en 2 colonnes, les graphiques et
  tableaux s'adaptent à la largeur de l'écran. Le desktop reste identique
  à la version précédente.
- Renommage de l'application en **BSGA Palmarès** (v0.7, inclus dans ce
  livrable avec le bump en 0.8).

## Version 0.7

- **Meilleure performance par athlète dans le classement multi-années** :
  lorsque plusieurs saisons sont affichées, un athlète présent à la fois en
  2025 et 2026 sur la même épreuve ne compte plus qu'une fois dans le
  classement (sa meilleure performance). Ses autres résultats restent
  visibles dans le tableau mais reçoivent le marqueur `·` à la place d'un
  rang numérique.
- **Tri des épreuves par distance croissante** dans le menu déroulant : le
  sélecteur d'épreuves est désormais ordonné par valeur numérique (50m,
  60m, 80m… 1000m… Marathon ; Javelot 400g, 500g, 600g… etc.) plutôt que
  par ordre alphabétique.
- **Top participations** : le graphique "Top contributeurs" compte maintenant
  le nombre total de participations enregistrées (toutes épreuves et toutes
  saisons confondues), pas le nombre d'épreuves distinctes. Le titre et la
  note explicative ont été mis à jour en conséquence.
- **Records du club mis en avant** dans "Explorer les résultats" : la
  meilleure performance de toute la base pour chaque couple épreuve +
  catégorie d'âge est identifiée dynamiquement. La ligne correspondante est
  affichée avec un fond doré et un 🏆 devant la performance. Le calcul est
  recalculé à chaque affichage et tient compte de l'ensemble de la base
  (toutes années, tous sexes).

## Version 0.6 (en cours)

- **Correction du classement recalculé** : le classement (colonne Place)
  fusionne désormais Hommes et Femmes, ainsi que toutes les catégories
  d'âge, tant qu'aucun filtre Sexe ou Catégorie n'est explicitement
  sélectionné. Dès qu'un filtre Sexe et/ou Catégorie est actif, le
  classement se recalcule en conséquence (séparé par sexe et/ou par
  catégorie selon les filtres choisis).
- Ajout d'un numéro de version visible dans la barre latérale et du présent
  changelog.
- Ajout de la mention de paternité "Kevin Marq Product" en bas de la barre
  latérale, et des mentions légales/copyright dans le code source et le
  README.

## Version 0.5

- **Correction du classement multi-saisons** : lorsque plusieurs années
  (ex. 2025 et 2026) sont affichées en même temps sans qu'aucune ne soit
  filtrée, le classement recalculé ne se séparait à tort plus par année
  (chaque année avait son propre "1er"). Corrigé : le classement mélange
  désormais toutes les années affichées.

## Version 0.4

- **Recalcul dynamique de la colonne Place** dans "Explorer les résultats" :
  dès qu'un filtre réduit l'ensemble affiché, la place se recalcule sur la
  performance réelle au sein du sous-ensemble filtré (au lieu de garder la
  place d'origine, calculée sur l'ensemble du club toutes catégories
  confondues). Une note s'affiche pour signaler quand ce recalcul est actif.
  Gestion correcte des ex-aequo (même performance = même rang).
- Intégration de la vraie catégorie d'âge officielle FFA pour chaque
  résultat (Benjamin, Minime, Cadet, Junior, Espoir, Senior, Master/Vétéran),
  remplaçant une précédente logique de déduction par poids d'engin qui
  s'est révélée non fiable (un même poids d'engin peut être utilisé par un
  jeune ou par un vétéran).
- Nouveau format d'import recommandé : le fichier HTML complet d'une page
  de bilans athle.fr, qui contient nativement la catégorie officielle
  (contrairement au PDF ou au copier-coller, qui n'ont que Place /
  Performance / Nom).
- Graphique "Répartition par catégorie d'âge" sur le tableau de bord,
  comptant le nombre d'athlètes distincts par catégorie (et non le nombre
  de résultats, pour refléter l'effectif réel du club).
- Pastilles de classement (1ère / 2e / 3e place) recolorées en or, argent et
  bronze.
- Renommage et clarification du graphique de podiums : précise qu'il s'agit
  d'un classement interne au club (entre athlètes du BSGA sur chaque
  épreuve), et non d'un classement face aux autres clubs en compétition.
- Correction du tri de la colonne Performance dans "Explorer les résultats" :
  le tri comparait auparavant les performances comme du texte brut (donnant
  un ordre incohérent), il compare désormais leur valeur réelle (temps,
  distance ou points).

## Version 0.3

- Refonte de la palette graphique aux couleurs officielles du club BSGA
  (bleu pétrole et orange, extraites du logo), avec un fond clair pour
  améliorer la lisibilité des résultats (l'ancienne version, à fond sombre
  avec texte orange, posait des problèmes de lisibilité).
- Intégration du vrai logo BSGA dans la barre latérale.

## Version 0.2

- Ajout des filtres par Épreuve et par Catégorie dans "Explorer les
  résultats" (en complément des filtres déjà existants : Année, Sexe,
  Discipline, Athlète, Podium).

## Version 0.1

- Première version de l'application : tableau de bord, exploration des
  résultats avec filtres et tri, fiches athlètes, import de nouveaux
  résultats (HTML, PDF, Excel/CSV, copier-coller) avec détection
  automatique des doublons, export Excel et PDF, sauvegarde/chargement de
  la base au format JSON.
- Palette initiale provisoire (couleurs génériques, avant l'application de
  la charte BSGA).
