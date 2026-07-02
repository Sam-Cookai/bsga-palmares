# Changelog — BSGA Palmarès

Tant que l'application est en phase d'ajustements, la version reste sur un
format `0.x` : elle s'incrémente à chaque lot de demandes traité. Le passage
à la version `1.0` interviendra une fois l'application jugée stable et
complète.

---

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
