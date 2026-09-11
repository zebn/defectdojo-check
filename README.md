# DefectDojo Check

Aplicación web estática para comprobar capacidades básicas del navegador sin Docker, backend ni dependencias externas.

## Ejecutar

Abre `index.html` directamente en el navegador. También puedes servir la carpeta con cualquier servidor estático local.

## Qué comprueba

- Navegador activo.
- JavaScript disponible.
- `localStorage` disponible.
- Alta y eliminación de hallazgos de prueba persistidos en el navegador.

Los datos son únicamente locales y no se envían a ningún servicio.

## GitHub Actions y DefectDojo

El workflow `.github/workflows/codeql.yml` analiza `app.js` con CodeQL en cada
push y pull request. En cada `push` y ejecución programada también importa el
SARIF en DefectDojo.

Configura estos secrets en **Settings > Secrets and variables > Actions**:

- `DEFECTDOJO_URL`: URL base de DefectDojo, por ejemplo `https://defectdojo.example.com`.
- `DEFECTDOJO_API_KEY`: API key de una cuenta con permisos para importar scans.
- `DEFECTDOJO_ENGAGEMENT_ID`: ID del engagement destino ya creado en DefectDojo.

El workflow no envía resultados de pull requests a DefectDojo; solo los analiza
en GitHub para evitar importar resultados incompletos o duplicados.
