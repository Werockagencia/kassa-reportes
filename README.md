# Kassa Apartamentos · Reportes quincenales y creativos

Cliente: **KASSA Apartamentos**, Calle 129 # 57-22, Colina Campestre, Bogotá · Agencia: We Rock
Meta Ads: cuenta `129819239812443` · Business `733023785166742`

## Cadencia: cada 15 días
| Corte | Período | Carpeta |
|---|---|---|
| 9 sep 2026 | May 1 – Sep 9 | `reportes/2026-09-09/` |
| 24 sep 2026 | Sep 1 – Sep 24 | `reportes/2026-09-24/` |
| 9 oct 2026 | Sep 25 – Oct 8 | `reportes/2026-10-09/` |
| **24 oct 2026** | Oct 9 – Oct 23 | `reportes/2026-10-24/` (siguiente) |

## Proceso de cada corte
1. **Exportar desde Ads Manager** (nivel campaña, rango de la quincena) y guardar en `data/AAAA-MM-DD_campanas.csv`.
   Columnas: Resultados, Alcance, Frecuencia, Costo por resultado, Importe gastado, Impresiones, CPM, Clics en el enlace, CTR (enlace), Clics (todos).
   Con desglose por **Plataforma** y por **Edad/Sexo**, un CSV por desglose.
2. **Descargar los leads** del formulario (Centro de clientes potenciales) en `data/AAAA-MM-DD_leads.csv` para leer ingresos +/- $12M, vivienda o inversión, e IG o FB.
3. Agregar la fila de la quincena a `data/historico_quincenas.csv`.
4. Copiar `reportes/<último>/index.html` a la nueva carpeta, actualizar las cifras y exportar el PDF:
   ```bash
   "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --no-pdf-header-footer --allow-file-access-from-files --virtual-time-budget=8000 --print-to-pdf="reportes/<fecha>/Kassa_Reporte_<fecha>.pdf" "file:///<ruta>/reportes/<fecha>/index.html"
   ```

## Estrategias activas
- **E1 · Kassa | Lead Ads | Estrategia 1**: carrusel de 5 tarjetas con renders (no se cambia).
- **E2 · Kassa | Lead Ads | Estrategia 2**: video, más 4 creativos nuevos desde oct 2026 → ver `creativos/E2-nuevos/ESTRATEGIA_E2.md`.

## Estructura
```
assets/fotos-web/      fotos originales de kassaapartamentos.com (3000px) y kassa129.com
creativos/E2-nuevos/   src/creativos.html → png/ (finales) · preview/ (miniaturas para el reporte)
data/                  histórico y exports de Meta
reportes/AAAA-MM-DD/   index.html + PDF de cada corte
scripts/               render-creativos.sh (HTML → PNG + reel mp4)
```
