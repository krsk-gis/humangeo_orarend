# Órarend kereső

Egyszerű, statikus weboldal a Szegedi Tudományegyetem Társadalomföldrajz Tanszék
oktatóinak órarendjéhez. Az oktató nevére keresve megjelenik, hogy melyik napon,
mettől-meddig és hol van órája.

Nincs build lépés, nincs backend — tiszta HTML/CSS/JS, bármilyen statikus
webtárhelyről (pl. GitHub Pages) kiszolgálható.

## Fejlesztés

```
python3 -m http.server 8000
```

majd nyisd meg a `http://localhost:8000` címet.

## Adatok frissítése

Az órarendi adatok a `js/data.js` fájlban vannak egy `TEACHERS` tömbként.
Minden oktatóhoz `name` és `lessons` (nap, időpont, tantárgy, terem) tartozik.
Ha az órarend excel-tábla frissül, ez a fájl kézzel vagy egy egyszerű
átalakító szkripttel újragenerálható.

## GitHub Pages

A `.github/workflows/pages.yml` a `main` ágra történő push után automatikusan
kideployolja az oldalt GitHub Pages-re. Ehhez a repó beállításaiban
(Settings → Pages → Source) "GitHub Actions"-t kell választani.
