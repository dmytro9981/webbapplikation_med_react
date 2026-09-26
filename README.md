# The Pantry

The Pantry är en app för recept. Här kan man söka efter mat och lägga till egna recept. Recepten hämtas från [TheMealDB](https://www.themealdb.com/api.php).

## Kom igång

För att köra projektet behöver man Node.js 20.19 eller senare, eller version 22.12 eller senare. Sedan kör man de här kommandona i terminalen:

```bash
npm install
npm run dev
```

Länken som visas i terminalen öppnar appen. Koden kan kontrolleras med `npm run lint` och bygget testas med `npm run build`.

## Så fungerar appen

På startsidan kan man söka efter recept och välja ett för att läsa mer. Man kan också lägga in ett eget recept. Formuläret säger till om något obligatoriskt fält saknas. Recept man lägger till finns kvar även när sidan stängs eller laddas om.

Varje recept har en egen sida, och man kan gå mellan sidorna utan att hela sidan laddas om. Appen visar när recepten hämtas, och om något går fel kan man försöka igen.

## Mappar

- `src/components` innehåller till exempel receptlistan och formuläret.
- `src/pages` innehåller startsidan och receptsidan.
- `src/context` håller reda på egna recept och sparar dem i `localStorage`.
- `src/lib` innehåller koden som hämtar recept från TheMealDB.
