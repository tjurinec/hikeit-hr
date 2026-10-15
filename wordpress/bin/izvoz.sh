#!/usr/bin/env bash
# Povlači javne podatke s produkcije u import/data (gitignored). Render free plan spava pa prvi zahtjev traje do ~60 s.
set -euo pipefail
cd "$(dirname "$0")/../import/data"
A=${HIKEIT_API:-https://hikeit-backend.onrender.com/api}
curl -sf -m 120 "$A/excursions" -o excursions.json
curl -sf -m 120 "$A/guides" -o guides.json
curl -sf -m 120 "$A/settings" -o settings.json
curl -sf -m 120 "$A/gallery" -o gallery.json
# popis nema content ni imageUrls — dohvati detalje
python3 - "$A" <<'PY'
import json,sys,urllib.request
a=sys.argv[1]; out=[]
for e in json.load(open('excursions.json')):
    out.append(json.load(urllib.request.urlopen(f"{a}/excursions/{e['slug']}",timeout=120)))
json.dump(out,open('excursions-detail.json','w'),ensure_ascii=False,indent=1)
print(len(out),'izleta')
PY
ls -la
