#!/usr/bin/env python3
"""
Script de conversion des tables de cotation FFA (PDF → JSON)
Usage : python3 convertir_cotation.py mon_fichier.pdf BEM
Les catégories disponibles : BEM, BEF, MIM, MIF, CAM, CAF, JUM, JUF
Le fichier JSON généré peut être importé dans BSGA Palmarès (Base de données → Tables de cotation).
"""

import sys, json

COLS = ['pts','50m','1000m','50mHaies','Hauteur','Perche','Longueur',
        'TripleSaut','Poids3kg','Disque1kg','Marteau3kg','Javelot500g',
        '2000mMarche','4x60m','4x60mMixte']

def convert(pdf_path, cat_code):
    try:
        import pdfplumber
    except ImportError:
        print("Installez pdfplumber : pip install pdfplumber")
        sys.exit(1)
    with pdfplumber.open(pdf_path) as pdf:
        text = pdf.pages[0].extract_text()
    rows = []
    for line in text.split('\n'):
        parts = line.strip().split()
        if not parts or not parts[0].isdigit(): continue
        first = int(parts[0])
        if first < 1 or first > 50 or len(parts) < 15: continue
        row = {'niveau': first}
        for i, col in enumerate(COLS):
            try: row[col] = int(parts[i])
            except: row[col] = None
        rows.append(row)
    rows.sort(key=lambda r: r['niveau'])
    if len(rows) < 40:
        print(f"Erreur : seulement {len(rows)} niveaux trouvés. Vérifiez que le PDF est bien une table de cotation FFA.")
        sys.exit(1)
    out = f"cotation_{cat_code}.json"
    with open(out, 'w') as f:
        json.dump(rows, f)
    print(f"✓ {out} créé ({len(rows)} niveaux). Importez ce fichier dans BSGA Palmarès → Base de données → Tables de cotation.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    convert(sys.argv[1], sys.argv[2].upper())
