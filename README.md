# M&S Car Wash & Detailing

Online cjenovnik za M&S Car Wash & Detailing. Otvara se skeniranjem QR koda sa vizit karte i cjenovnika na zidu, pa je napravljen prvo za mobitel.

**Live:** https://ms-car-wash-and-detailing.grabafaceit.workers.dev

## Šta je unutra

- Svijetli izgled: veliki naslov CAR WASH, fotografija sa karticama, usluge sa slikama
- Cijene: praonica (malo auto, SUV, kombi, vanjsko, unutrašnje), detaljno i dubinsko pranje, dodatne usluge
- Paketi Bronze, Silver i Gold sa sadržajem
- Upit: kupac dodirne usluge i pošalje gotovu poruku na WhatsApp (ili je kopira za Viber)
- Pozovi, WhatsApp, Viber i Instagram jednim dodirom, donja traka na mobitelu

Fotografije su u `assets/img/foto/` (iz odobrenog primjera dizajna). Kad stignu prave slike M&S, zamijeniti ih istim imenima.

## Izmjene

- **Cijene i sadržaj paketa:** u `index.html` (tražite "KM"). Usluga u upitu se uzima iz `data-s` atributa iste stavke.
- **Telefon:** `index.html` i `PHONE` u `js/app.js`.

## Štampa (`stampa/`)

- `kartica-prednja.pdf`, `kartica-zadnja.pdf`: vizit karta 85x55 mm + 3 mm prepust (91x61 mm). PNG verzije su oko 900 dpi.
- `cjenovnik-zid.pdf`: cjenovnik za kancelariju, 70x100 cm. `cjenovnik-zid.png` je 7000x10000 px (oko 254 dpi).
- `ig-*.png`: objave za Instagram (1080x1350), redom: uvod, praonica, detaljno, paketi, kontakt
- `za-kasnije/`: kartica vjernosti (svako 6. pranje gratis), za kad akcija krene

Izvor dizajna je u `stampa/izvor/design.html`; nakon izmjene: `node stampa/izvor/render.cjs` (treba Playwright i Python sa Pillow).
QR kod vodi na adresu iznad; ako se promijeni domena, napravite novi `qr.svg`.

## Pokretanje lokalno

```
node serve.mjs
```

Pa otvorite http://localhost:8080.

Napravio [Ahmed Grabus (Graba)](https://graba-portofolio.grabafaceit.workers.dev)
