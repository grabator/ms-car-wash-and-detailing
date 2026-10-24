# M&S Car Wash & Detailing

Online cjenovnik za M&S Car Wash & Detailing. Otvara se skeniranjem QR koda sa vizit karte i cjenovnika na zidu, pa je napravljen prvo za mobitel.

**Live:** https://ms-car-wash-and-detailing.grabafaceit.workers.dev

## Šta je unutra

- Cjenovnik: auto praonica, detaljno pranje i paketi njege (Bronze, Silver, Gold)
- Pozovi, WhatsApp, Viber i Instagram jednim dodirom, donja traka na mobitelu
- Kartica vjernosti: svako 6. pranje gratis
- Upit: kupac dodirne usluge i pošalje gotovu poruku na WhatsApp (ili je kopira za Viber)

## Izmjene

- **Cijene:** u `index.html` (tražite "KM"). Usluga u upitu se uzima iz `data-s` atributa iste stavke.
- **Telefon:** `index.html` i `PHONE` u `js/app.js`.

## Štampa (`stampa/`)

- `kartica-prednja.pdf`, `kartica-zadnja.pdf`: vizit karta 85x55 mm + 3 mm prepust (91x61 mm)
- `vjernost-prednja.pdf`, `vjernost-zadnja.pdf`: kartica vjernosti, isti format
- `cjenovnik-zid.pdf`: cjenovnik za zid, 70x100 cm, vektorski
- `ig-*.png`: objave za Instagram (1080x1350)

Izvor dizajna je u `stampa/izvor/design.html`; nakon izmjene: `node stampa/izvor/render.cjs` (treba Playwright).
QR kod vodi na adresu iznad; ako se promijeni domena, napravite novi `qr.svg`.

## Pokretanje lokalno

```
node serve.mjs
```

Pa otvorite http://localhost:8080.

Napravio [Ahmed Grabus (Graba)](https://graba-portofolio.grabafaceit.workers.dev)
