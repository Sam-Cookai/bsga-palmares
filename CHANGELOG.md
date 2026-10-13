# Changelog — BSGA Palmarès

Tant que l'application est en phase d'ajustements, la version reste sur un
format `0.x` : elle s'incrémente à chaque lot de demandes traité. Le passage
à la version `1.0` interviendra une fois l'application jugée stable et
complète.

---

## Version 0.49

- **Publication en un clic sur GitHub** (page Base de données) : après
  un import, « Publier sur GitHub » envoie directement le nouveau
  `data.js` sur le dépôt (API GitHub : blob → arbre → commit → branche),
  sans passer par github.com. Le site en ligne est à jour 1 à 2 minutes
  plus tard sur tous les appareils.
- Connexion à configurer une seule fois sur l'appareil principal, avec
  une clé d'accès « fine-grained » limitée au dépôt (Contents : Read and
  write), testée à l'enregistrement. La clé reste uniquement dans le
  navigateur de l'appareil (jamais dans les fichiers publiés) ; bouton
  « Oublier la clé ».
- Bandeau « Modifications non publiées » sur les pages Importer et Base
  de données après chaque import validé, avec un bouton de publication.
- La publication manuelle (télécharger data.js) reste disponible.

## Version 0.48

- Page « Importer des résultats » : la date du dernier import (avec le
  nombre de résultats ajoutés, les années concernées et la date de la
  performance la plus récente) est affichée en tête du panneau de
  récupération automatique athle.fr, et mise à jour à chaque import.

## Version 0.47

- **Tables de cotation : barème World Athletics pour les cadets,
  juniors, espoirs, seniors et masters** (tables « Hommes » et
  « Femmes », points 0 à 1400, comme le calculateur jeffchen.dev). Le
  barème World Athletics est le même pour tous les âges, avec les engins
  et hauteurs de haies seniors.
  - 41 épreuves : sprint (dont 200m/400m en salle), haies, demi-fond et
    fond (dont salle et steeple), route (5 km, 10 km, semi, marathon),
    marche, sauts et lancers (engins seniors : poids 7.26kg / 4kg,
    disque 2kg / 1kg, marteau 7.26kg / 4kg, javelot 800g / 600g).
  - Points calculés par la formule du barème 2025 (a·x² + b·x + c) :
    contrôle sur 13 763 marques des tables officielles, écart ≤ 1 point.
    Coefficients du 50m haies et du 110m haies hommes recalculés (ceux
    publiés s'écartaient jusqu'à 34 points).
  - Résultat au point près, paliers suivants (tous les 50 points) et
    repères (ex. 1000 points), jauge 0-1400, comparaison avec l'autre
    sexe pour les épreuves identiques ; table par paliers de 50 points,
    cliquable comme les tables FFA.
  - Saisie heures / minutes / secondes pour la route et la marche
    (ex. 1 5 2 0 8 → 1h52'08").
- En passant d'une table à l'autre, l'épreuve est conservée quand elle
  existe (ex. Longueur benjamine → Longueur femmes WA).

## Version 0.46

- **Tables de cotation : clic direct dans la table.** Un clic sur une
  valeur reporte l'épreuve et la performance (le seuil de ce niveau)
  dans « Situer une performance » et affiche le résultat ; un clic sur
  un niveau reprend l'épreuve déjà choisie. La page remonte vers le
  résultat s'il n'est pas visible.

## Version 0.45

- **Fiche athlète** : la date de naissance (année donnée par la FFA, ou
  date saisie) s'affiche à la place du champ « Date de naissance
  précise », suivie de la catégorie de la saison en cours. La saisie
  manuelle n'apparaît plus que si la FFA ne fournit pas l'année.
- **Export PDF de la fiche athlète** réorganisé :
  1. records personnels (RP) par épreuve, classés par discipline, avec
     l'année, la catégorie au moment de la perf, la date, le lieu et le
     niveau FFA (colonne masquée si aucune perf n'est cotée) ;
  2. synthèse (résultats, podiums, saisons, niveau FFA moyen) et
     graphique en toile d'araignée des niveaux FFA **par année**, pour
     voir l'évolution, avec le tableau des niveaux correspondant ;
  3. liste complète des résultats, comme avant.
  Numéros de page en pied de page.

## Version 0.44

- Explorer : le filtre Année est retiré du panneau « Filtres » (le
  tableau affiche toutes les années). Le choix des années reste
  disponible dans la vue « Niveaux de cotation FFA » plus bas.

## Version 0.43

- **Catégories d'âge alignées sur la FFA** (athle.fr, « Les catégories
  d'âge en 2027 ») : Baby Athlé, **Éveil Athlétique** (7-9 ans, ex.
  « École d'Athlétisme »), Poussins, Benjamins, Minimes, Cadets,
  Juniors, Espoirs, Seniors, Masters. Contrôle sur le barème 2027 :
  28/28 années de naissance testées conformes.
- **Sous-catégories Masters** par tranches de 5 ans : M0 (35-39 ans),
  M1 (40-44) … M9 (80-84), M10 (85 ans et plus), calculées avec l'année
  de naissance (catégorie en cours sur la fiche, ex. « Master M6
  (65-69 ans) », et catégorie au moment de chaque résultat).
- Explorer : filtre Catégorie avec chaque tranche Master et l'option
  « Masters (toutes tranches) » ; catégories triées par âge ; records
  du club « par catégorie » établis par tranche Master.
- **Tableau de bord** : la répartition par catégorie compte maintenant
  aussi les filles (les benjamines, cadettes et poussines étaient
  oubliées) — 694 athlètes sur 694.

## Version 0.42

- **Année de naissance de chaque athlète** tirée de la colonne
  « Infos » d'athle.fr (ex. MIF/13 → née en 2013) : 692 athlètes sur
  694 ont maintenant leur année de naissance (11 282 résultats), sans
  aucun conflit d'homonymie. Elle est conservée à chaque nouvel import.
- La **catégorie de la saison en cours** est calculée automatiquement
  à partir de cette année (plus besoin de saisir la date de naissance ;
  une date précise saisie reste prioritaire). Nouvelle colonne « Né·e »
  dans la liste des athlètes ; année affichée sur la fiche.
- **Correction du barème d'âge FFA** (erreur depuis la v0.28, décalage
  d'un an) : Poussin 10-11 ans, Benjamin 12-13, Minime 14-15, Cadet
  16-17, Junior 18-19, Espoir 20-22, Senior 23-34, Master 35+ (âge
  atteint l'année de fin de saison). Vérifié : 5 245 résultats des
  saisons 2022 à 2027 sur 5 245 ont la même catégorie que celle
  indiquée par la FFA.
- Les appareils déjà utilisés récupèrent les années de naissance
  automatiquement au prochain chargement de la base publiée.

## Version 0.41

- **Tables de cotation : liste des épreuves propre à chaque
  catégorie.** Une même colonne de table correspond à des engins ou
  des hauteurs de haies différents selon la catégorie ; la liste, les
  en-têtes de la table et le texte du résultat affichent maintenant le
  nom réel de l'épreuve (vérifié sur les résultats du club) :
  - Benjamine : Poids 2kg, Disque 0.6kg, Marteau 2kg, Javelot 400g ;
  - Benjamin : Poids 3kg, Disque 1kg, Marteau 3kg, Javelot 500g ;
  - Benjamin·e : 50m haies (65) ; Minime garçon : Disque 1.2kg, haies
    (84) ; Minime fille : haies (76).
- « Même épreuve dans les autres tables » ne compare plus que les
  tables où l'épreuve est réellement la même (même engin, même hauteur
  de haies) : ex. Poids 3kg Benjamin ↔ Poids 3kg Minime fille, mais
  plus Poids 2kg Benjamine ↔ Poids 3kg.
- Vue synthétique de l'Explorer : mêmes noms réels (ex. « Poids 3kg G ·
  2kg F » quand garçons et filles sont affichés ensemble).

## Version 0.40

- **Explorer : sélection de plusieurs années par simple clic.** Le
  filtre Année du tableau et celui de la vue « Niveaux de cotation FFA »
  sont maintenant des pastilles : un clic ajoute ou retire une année,
  « Toutes » efface la sélection (plus besoin de Ctrl+clic).
- Vue synthétique : avec plusieurs années choisies, les graphiques
  comparent la période choisie (ex. « 2023–2025 ») à l'ensemble des
  années ; chaque athlète est compté avec sa meilleure performance sur
  la période.
- Légende des graphiques de la vue synthétique remise à la bonne taille.
- Le fichier tout-en-un porte maintenant le numéro de version dans son
  nom (ex. `BSGA_Palmares_v0.40.html`).

## Version 0.39

- **Tables de cotation : saisie de la performance au clavier
  numérique.** Les caractères ' et " n'existent pas sur le clavier
  numérique des téléphones : la performance se saisit maintenant dans
  des cases séparées (minutes / secondes / centièmes, ou mètres /
  centimètres), les symboles étant affichés entre les cases.
- Les chiffres peuvent être tapés d'affilée : l'application passe
  d'elle-même à la case suivante dès que la suite n'est plus plausible
  pour l'épreuve (ex. 50m : 7 4 5 → 7"45 ; 1000m : 3 1 5 9 0 → 3'15"90 ;
  longueur : 4 5 2 → 4m52). Une virgule fait aussi passer à la case
  suivante, le retour arrière revient à la case précédente, et une
  performance collée en entier (7"45, 4m52…) est répartie dans les cases.

## Version 0.38

- **Page Tables de cotation : changement de catégorie fiabilisé.** Les
  pastilles Benjamin / Benjamine / Minime garçon / Minime fille sont
  maintenant de vrais boutons (et non des boutons radio cachés, dont
  le clic n'était pas toujours transmis, notamment par Safari). Un
  clic recalcule immédiatement le niveau, l'épreuve proposée et la
  table affichée. Navigation possible aux flèches du clavier.

## Version 0.37

- **Correction de la table de cotation Benjamin (intégrée)** : aux
  niveaux 20, 22, 24, 26 et 28, la case Hauteur était vide dans le PDF
  d'origine et toutes les valeurs suivantes avaient glissé d'une
  colonne (la Perche contenait la Longueur, la Longueur le Triple saut,
  etc.). Les valeurs sont remises en place ; la Hauteur reste vide à ces
  niveaux, comme dans le PDF. Exemple : Perche niveau 20 = 1m87 (et non
  3m56).
- Deux valeurs isolées mal lues corrigées d'après l'écart régulier
  entre niveaux : Benjamine 2000m marche niveau 16 (14'32"36) et Minime
  fille 1000m niveau 24 (3'43"82).
- Effet sur la base : 82 niveaux FFA recalculés (surtout benjamins en
  longueur, triple saut, lancers).
- **Vue synthétique des niveaux** (Explorer) : chaque athlète est
  maintenant coté avec la table de son sexe (les filles étaient cotées
  avec la table des garçons) et les épreuves propres aux filles
  apparaissent (50m H. 76, Disque 0.8kg…).
- **Contrôle de cohérence des tables** sur la page Tables de cotation :
  alerte si un niveau supérieur demande une performance moins bonne
  (table mal lue), et bouton « Revenir à la table FFA intégrée » quand
  une table personnalisée a été importée sur l'appareil.

## Version 0.36

- **Nouvelle page « Tables de cotation »** (menu latéral et barre du
  bas sur mobile) : tables FFA Benjamin, Benjamine, Minime garçon et
  Minime fille, niveaux 1 à 50.
  - **Situer une performance** : choisir la table et l'épreuve, saisir
    la performance (formats libres : 7"45, 7.45, 7,45, 3'15"90, 3:15.9,
    4m52, 4.52, 452…). L'application affiche le niveau atteint, le seuil
    de ce niveau, l'écart avec le niveau suivant et avec la dizaine
    suivante, une jauge 1→50, et le niveau qu'aurait la même
    performance dans les trois autres tables.
  - Dans la table, la colonne de l'épreuve et la ligne du niveau
    atteint sont surlignées et la table défile jusqu'à elles ; un clic
    sur un nom d'épreuve la sélectionne.
  - Utilise la table personnalisée si une table a été importée dans
    « Base de données ».
- **Niveaux FFA retrouvés pour les nouveaux noms d'épreuves athle.fr**
  (« 50m - salle », « 50m haies (65) », « 1 000m piste courte »,
  « Longueur - salle »…) : 4 948 résultats benjamins/minimes sont
  désormais cotés, contre 2 519 avant.
- Les performances écrites avec un M majuscule (« 4M38 ») sont cotées.
- Correction d'un léger débordement horizontal sur mobile dû aux
  pastilles à cocher (pages Import et Cotation).

## Version 0.35

- **Base complète 2015 → 2027** : intégration des 11 266 résultats
  récupérés sur athle.fr le 10/10/2026. La base passe de 1 381 à
  11 304 résultats (694 athlètes, 211 épreuves) :
  - 9 991 nouveaux résultats ajoutés ;
  - 966 résultats existants complétés (chrono, date, lieu, catégorie FFA,
    place recalculée sur la liste complète de l'année) ;
  - 309 épreuves en salle renommées selon la nouvelle appellation FFA
    (ex. « 50m » → « 50m - salle »), au lieu de créer des doublons ;
  - 68 doublons stricts hérités de l'ancienne base supprimés ;
  - 38 anciens résultats conservés tels quels (relais, ekiden, et
    quelques performances absentes de la nouvelle liste FFA).
- **Date du dernier import** affichée dans la barre latérale, sur le
  tableau de bord (avec la date de la performance la plus récente) et
  dans la page Base de données. Elle est mise à jour à chaque import
  validé et publiée dans data.js.
- **Filtre Chronométrage** : électrique + manuel classés séparément
  (défaut), électrique + manuel **combinés dans un seul classement**,
  électrique uniquement, ou manuel uniquement.
- Les appareils qui avaient l'ancienne base sont mis à jour
  automatiquement avec les mêmes règles (renommage des épreuves en
  salle, suppression des doublons stricts).
- Stockage local compacté (≈ 2,2 millions de caractères au lieu de 2,6)
  pour rester sous la limite des navigateurs ; message d'alerte si
  l'espace de stockage est plein.
- Correction : la validation d'un import conserve maintenant le chrono,
  la date et le lieu de chaque résultat.

## Version 0.34

- **Correction : sélection de plusieurs années à la récupération
  athle.fr.** Certains navigateurs effacent le nom de l'onglet en
  changeant de site : le favori ne recevait alors pas la liste des
  années et ne récupérait que celle de la page ouverte. Les années et
  sexes choisis sont désormais aussi transmis dans l'adresse
  (`#bsga=...`) ; à défaut, le favori demande lui-même les années
  (ex. « 2015-2027 ») et les sexes.
- L'application signale si le favori utilisé est une ancienne version,
  ou si des années demandées n'ont pas été reçues.
- Courte pause entre chaque page récupérée pour ne pas surcharger
  athle.fr.

## Version 0.33

- **Publication de la base en ligne** (page « Base de données ») : le
  bouton « Générer data.js pour GitHub » crée un fichier `data.js`
  contenant tous les résultats et les dates de naissance de l'appareil,
  avec un numéro de version. Il suffit de le déposer sur GitHub.
- **Mise à jour automatique des appareils** : au démarrage, si une
  nouvelle base publiée est détectée, l'application ajoute les résultats
  qui manquent et complète les dates de naissance inconnues, sans rien
  supprimer ni écraser (les ajouts propres à l'appareil sont conservés).
  Un message indique ce qui a été ajouté.

## Version 0.32

- **Distinction chrono électrique / manuel** : chaque course porte un
  badge « élec. » ou « manuel » (information fournie par athle.fr ; pour
  les résultats plus anciens, déduite du format : centième = électrique,
  dixième = manuel — vérifié identique au marquage FFA sur 250 résultats).
- Les temps manuels sont **classés à part** : places, records du club
  (🏆/👑) et meilleures performances personnelles (⭐) sont établis
  séparément pour le manuel et l'électrique.
- Nouveau filtre « Chronométrage » (Tous / Électrique / Manuel) dans
  l'explorateur ; colonne « Chrono » dans l'export Excel, mention
  « (man.) » dans l'export PDF.
- **Récupération athle.fr : choix des années et des sexes** (cases à
  cocher). Le favori récupère toutes les pages de chaque année cochée et
  ne garde que les sexes demandés, avec un bandeau de progression.
- Colonnes Performance élargies pour afficher les badges.

## Version 0.31

- **Compatibilité avec la nouvelle présentation des bilans athle.fr**
  (une ligne par résultat : Nom, Épreuve, Performance, Infos, Chrono,
  Date, Lieu). L'ancienne présentation reste reconnue.
- **Toutes les pages récupérées d'un coup** : le favori-bouton lit la
  page affichée puis charge automatiquement les autres pages de la liste
  (ex. 4 pages pour 949 résultats en 2026).
- Le sexe est déduit de la catégorie FFA (ex. BEF/13 → F), la catégorie
  est décodée, et la date et le lieu de chaque performance sont conservés.
- La place n'étant plus fournie par athle.fr, elle est recalculée dans
  le club par année, sexe et épreuve (meilleure performance de chaque
  athlète ; ses autres performances sont marquées « - »).
- L'import d'une page enregistrée (.html/.htm) utilise la même lecture.

## Version 0.30

- **Récupération automatique des résultats depuis athle.fr** (page
  « Importer des résultats ») : le site de la FFA bloque toute lecture
  directe, l'import passe donc par un favori-bouton
  « 📥 Envoyer au Palmarès BSGA » à installer une fois dans la barre de
  favoris. Parcours : choisir l'année → « Ouvrir athle.fr » → cliquer
  sur le favori dans l'onglet athle.fr → les résultats (avec la vraie
  catégorie FFA) arrivent directement dans l'application, à l'étape de
  vérification des doublons.
- Si l'application n'est plus ouverte, le favori télécharge un fichier
  `bsga_athle_ANNEE.json` à déposer dans la zone d'import.
- La zone « coller du texte » accepte aussi une liste JSON.
- Seuls les messages provenant d'une page `athle.fr` sont acceptés.

## Version 0.29

- **Version tout-en-un** : nouveau fichier `BSGA_Palmares.html` qui
  regroupe toute l'application (code, données, table de cotation, logo
  et librairies graphiques/export) en un seul fichier. Il suffit de
  l'ouvrir dans un navigateur, sans dossier ni installation.
  L'import de PDF nécessite toujours une connexion internet.
- **Saison sportive** : du 1er septembre au 31 août inclus. Le
  libellé de la saison en cours (ex. 2026-2027) est affiché à côté de
  la catégorie sur la fiche athlète.

## Version 0.28

- **Catégorie d'âge calculée automatiquement à partir de la date de
  naissance** (règles FFA : catégorie déterminée sur l'année de fin de
  saison).
- **Nouveau champ "Date de naissance"** sur la fiche athlète, enregistré
  localement, avec un badge "Catégorie en cours". Sans date, la dernière
  catégorie connue est affichée avec la mention "(estimée)".
- **Colonne "Catégorie"** ajoutée à la liste des athlètes.

## Version 0.27

- **Cause racine trouvée pour les graphiques vides sur GitHub Pages** :
  le dossier `lib/` (Chart.js, jsPDF, jsPDF-autotable, SheetJS, PDF.js)
  n'avait en réalité jamais été déployé à la racine du dépôt — les
  fichiers étaient restés enfouis dans d'anciens dossiers `BSGA_Palmares_v0.8(1)`
  et `(2)` issus de précédents essais d'upload de zip.
- **Passage à un chargement des librairies via CDN** (jsDelivr / cdnjs),
  avec les mêmes versions exactes que celles utilisées jusqu'ici
  (Chart.js 4.5.1, jsPDF 4.2.1, jsPDF-autotable 5.0.8, SheetJS 0.18.5,
  PDF.js 6.1.200). Cela élimine définitivement le besoin d'uploader un
  dossier `lib/` — particulièrement pénible depuis un téléphone — et le
  dossier `lib/` local a été retiré du projet. Une connexion internet
  est donc nécessaire au premier chargement de l'app et pour les
  exports PDF/Excel.
- Service worker et README mis à jour en conséquence.

## Version 0.26

- **Correction d'un plantage silencieux au démarrage** : le numéro de
  version était affiché *après* le rendu du tableau de bord. Si ce
  rendu échoue (ex. la librairie de graphiques `lib/chart.umd.min.js`
  n'a pas été correctement déployée), tout le reste de l'initialisation
  s'arrêtait net — y compris l'affichage de la version — sans aucun
  message d'erreur visible. La version s'affiche désormais en tout
  premier, et une erreur de rendu du tableau de bord est maintenant
  interceptée (loggée dans la console) au lieu de bloquer le reste de
  l'application.
- ⚠️ Si les graphiques du tableau de bord restent vides malgré ça,
  vérifie que le dossier `lib/` a bien été déployé sur GitHub avec tout
  son contenu (`chart.umd.min.js`, `xlsx.full.min.js`,
  `jspdf.umd.min.js`, `jspdf.plugin.autotable.min.js`, etc.) — c'est la
  cause la plus probable.

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
