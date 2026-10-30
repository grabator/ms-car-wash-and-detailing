# M&S Car Wash & Detailing

Online cjenovnik za M&S Car Wash & Detailing. Otvara se skeniranjem QR koda sa vizit karte i cjenovnika na zidu, pa je napravljen prvo za mobitel.

**Live:** https://mscarwashdetailing.com (stara adresa https://ms-car-wash-and-detailing.grabafaceit.workers.dev i dalje radi; `canonical` u `index.html` kaže Googleu da je glavna nova domena)

## Šta je unutra

- Svijetli izgled: veliki naslov CAR WASH, fotografija sa karticama, usluge sa slikama
- Cijene: praonica (malo auto, SUV, kombi, vanjsko, unutrašnje), detaljno i dubinsko pranje, dodatne usluge
- Paketi Bronze (250), Silver (500), Gold (700) i Platinum (1.300 KM) sa sadržajem; obična pranja i dodatne usluge su samo cjenovnik, a detaljno pranje i paketi idu u upit (uz termin)
- Upit: kupac dodirne usluge i pošalje gotovu poruku na WhatsApp (ili je kopira za Viber)
- Pozovi, WhatsApp, Viber i Instagram jednim dodirom, donja traka na mobitelu

Fotografije su u `assets/img/foto/` (iz odobrenog primjera dizajna). Kad stignu prave slike M&S, zamijeniti ih istim imenima.

## Izmjene

- **Cijene i sadržaj paketa:** u `index.html` (tražite "KM"). Usluga u upitu se uzima iz `data-s` atributa iste stavke.
- **Telefon:** `index.html` i `PHONE` u `js/app.js`.

## Štampa i Instagram (`stampa/`)

| Fajl | Za šta | Veličina |
|---|---|---|
| `kartica-prednja.pdf`, `kartica-zadnja.pdf` | vizit karta, za štampariju | 85x55 mm + 3 mm prepust (91x61 mm) |
| `cjenovnik-zid.pdf` | poster za kancelariju | 70x100 cm (PNG 7000x10000) |
| `pano/pano-svijetli.pdf`, `pano/pano-tamni.pdf` | pano za kancelariju, dvije verzije | 72x80 cm (PNG 8504x9449, 300 dpi) |
| `naljepnica-qr.pdf` | QR naljepnica za vrata, kasu, čekaonicu | 10x10 cm + 2 mm prepust |
| `instagram/ig-*.png` | 5 objava (karusel), redom | 2160x2700 (4:5) |
| `instagram/story-*.png` | storyji (otvorenje, cjenovnik, kontakt, radno vrijeme) | 2160x3840 (9:16) |
| `instagram/paketi/ig-paket-*.png`, `story-paket-*.png` | objava i story za svaki paket (Bronze, Silver, Gold, Platinum) | 2160x2700 i 2160x3840 |
| `za-kasnije/` | kartica vjernosti (svako 6. pranje gratis) | 85x55 mm + 3 mm |

Izvor dizajna je `stampa/izvor/design.html` (cijene na vrhu skripte); nakon izmjene: `node stampa/izvor/render.cjs` (treba Playwright i Python sa Pillow).
QR kod (`qr.svg`) vodi na https://mscarwashdetailing.com; ako se promijeni domena, napravite novi `qr.svg`.

## Pokretanje lokalno

```
node serve.mjs
```

Pa otvorite http://localhost:8080.

Napravio [Ahmed Grabus (Graba)](https://graba-portofolio.grabafaceit.workers.dev)
