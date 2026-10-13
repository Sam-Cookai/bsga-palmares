# BSGA Palmarès

**Version 0.49** — voir [CHANGELOG.md](./CHANGELOG.md) pour le détail des évolutions entre versions.

Application autonome (HTML/JS) pour consulter, filtrer, visualiser, importer et
exporter les résultats d'athlétisme du club BSGA (Bussy Saint-Georges Athlétisme), saison 2026 et suivantes.

## Mentions légales

© Kevin Marq Product — Tous droits réservés. Cette application et son code
source sont la propriété de leur auteur. Toute reproduction, distribution,
modification ou revente de cette application, en tout ou partie, sans
autorisation écrite préalable, est interdite.

## Installation

Aucune installation n'est nécessaire. Gardez les 4 éléments suivants ensemble,
dans le même dossier :

```
index.html
app.js
data.js
```

Les librairies graphiques et d'export (Chart.js, jsPDF, SheetJS, PDF.js) sont
chargées automatiquement depuis un CDN — une connexion internet est donc
nécessaire au premier chargement (et pour l'export PDF/Excel). Aucun dossier
`lib/` n'est à gérer.

Double-cliquez sur `index.html` pour ouvrir l'application dans votre navigateur
(Chrome, Edge ou Firefox recommandés).

## Où sont stockées les données ?

Les résultats sont gardés dans le stockage local de votre navigateur
(`localStorage`), attaché à ce fichier `index.html` précis. Cela signifie :

- Les données restent présentes d'une session à l'autre, sur le même
  ordinateur et le même navigateur.
- Si vous changez d'ordinateur, ouvrez l'app dans un autre navigateur, ou videz
  le cache de votre navigateur, **les données ne vous suivront pas
  automatiquement**.

**C'est pourquoi l'onglet "Base de données" propose d'exporter un fichier
`donnees.json`** : pensez à le télécharger régulièrement pour avoir une vraie
sauvegarde sur votre disque, que vous pourrez recharger plus tard (sur cet
ordinateur ou un autre) via le bouton "Charger un fichier JSON".

## Importer de nouveaux résultats

Dans l'onglet "Importer des résultats", plusieurs façons d'apporter de
nouvelles données :

1. **Déposer le fichier HTML complet de la page athle.fr (recommandé)** —
   sur la page de résultats athle.fr, faites Ctrl+S ("Enregistrer la page
   sous..." → format "Page web, HTML uniquement" ou "Page complète"), puis
   déposez le fichier `.html` obtenu dans la zone d'import. C'est le seul
   format qui contient la **vraie catégorie d'âge officielle FFA** de chaque
   athlète (Benjamin, Minime, Cadet, Junior, Espoir, Senior, Master/Vétéran).
2. **Copier-coller le texte** d'une page de bilans athle.fr (fonctionne
   toujours, mais ne contient que Place/Performance/Nom — pas la catégorie,
   qui restera "Non déterminée").
3. **Déposer un fichier Excel/CSV** avec les colonnes : `annee`, `sexe`,
   `groupe`, `epreuve`, `place`, `performance`, `nom`, et optionnellement
   `categorie`.
4. **Déposer un PDF** (export "Bilans FFA"). ⚠️ Pour des raisons de sécurité
   du navigateur, la lecture directe du PDF peut ne pas fonctionner quand le
   fichier est ouvert directement en double-clic (protocole `file://`). Si le
   PDF est refusé, utilisez l'option 2 (copier-coller), qui fonctionne dans
   tous les cas. Si vous voulez que l'import PDF direct fonctionne aussi, lancez
   l'app via un petit serveur local au lieu de double-cliquer sur le fichier :
   - Ouvrez un terminal dans le dossier de l'application
   - Tapez : `python3 -m http.server 8000`
   - Ouvrez votre navigateur à l'adresse `http://localhost:8000`

Dans tous les cas, **seuls les résultats absents de la base sont ajoutés** :
l'application détecte automatiquement les doublons (même athlète, même année,
même épreuve, même performance) et ne les ajoute pas deux fois.

### Pourquoi certains résultats affichent "Non déterminée" en catégorie ?

La catégorie d'âge (Benjamin, Minime, Master...) ne peut pas être déduite de
façon fiable à partir du nom de l'épreuve : un même poids d'engin ou une même
hauteur de haies peut correspondre soit à un jeune, soit à un vétéran qui
concourt avec un engin allégé selon sa tranche d'âge (règlement FFA sur les
épreuves aménagées). L'application ne devine donc jamais la catégorie : elle
n'affiche que celle réellement fournie par athle.fr (présente uniquement dans
l'export HTML complet, pas dans le PDF ni dans le simple copier-coller).

## Fonctionnalités

- **Tableau de bord** : vue d'ensemble (KPIs, résultats par discipline,
  répartition des podiums, top contributeurs), filtrable par année, exportable
  en PDF.
- **Explorer les résultats** : table complète avec filtres combinables (année,
  sexe, discipline, épreuve, catégorie, nom, podium), tri par colonne (y
  compris un tri numérique correct des performances), export Excel et PDF de
  la vue filtrée.
- **Fiches athlètes** : historique complet par athlète, graphique par
  discipline, export PDF de la fiche.
- **Base de données** : statistiques globales, export/import JSON,
  réinitialisation.

## Sauvegarde recommandée

Avant toute opération importante (gros import, réinitialisation), exportez une
sauvegarde JSON depuis l'onglet "Base de données" → "Télécharger
donnees.json".
