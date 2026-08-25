# MD Actas · Entrega-Recepción Veracruz

App de campo para levantar el **acta de entrega-recepción** de los bienes del contrato SPC-UA-RMySG-11-2026. Funciona **sin internet**; solo el envío a Drive necesita señal.

## Archivos

| Archivo | Función |
|---|---|
| `index.html` | Lista de actas + crear nueva |
| `acta.html` | Datos de la entrega + partidas (bienes) |
| `evidencias.html` | Fotos por etapa + observaciones + firmas + envío |
| `app.js` | **Configuración** y toda la lógica |
| `estilos.css` | Estilos |
| `sw.js`, `manifest.json`, `icon-*.png` | Instalación en el teléfono |
| `Codigo.gs` | Backend de Apps Script (**no va al repo**) |

## Configuración

Todo en las primeras líneas de **`app.js`**:

Los IDs ya vienen puestos (carpeta ENTREGA EQUIPAMIENTO y hoja ENTREGAS EQUIPAMIENTO).
**Solo falta pegar la URL /exec del Apps Script en `SURL`.**

```js
const SURL     = 'URL_DEL_APPS_SCRIPT';   // <- lo unico que falta
const DRIVE_ID = '1hq6L9Kcq5-fEvt2wVh1zje3pRczlGPub';
const SHEET_ID = '1fuSRfW_1-sqmEindo0jpYfQE3uxEr2_A_U6hl-J-xHY';
const CONTRATO = 'SPC-UA-RMySG-11-2026';
const PROYECTO_NOM = 'Sistema Regional de Alerta Temprana Multirriesgo Veracruz Norte (SAT-VN)';
const DEPENDENCIA  = 'Secretaria de Proteccion Civil del Estado de Veracruz';
```

El logo ya viene incrustado.

En Apps Script: pega `Codigo.gs`, pon los IDs, ejecuta `testScript` para autorizar, y **Implementar → Nueva implementación → Aplicación web** (Ejecutar como: Yo · Acceso: Cualquier usuario). Guardar no basta.

## Flujo

**1. Crear** — proyecto, sitio, fecha y **modalidad de fotos**:
- *Por partida*: cada equipo lleva su propio antes / durante / después
- *Generales*: un solo bloque de las tres etapas para todo el sitio

**2. Datos y partidas** — domicilio, fecha y hora, GPS (llena la dirección sola), quién entrega, quién recibe con su identificación, testigos. Y una partida por cada bien: concepto, cantidad, unidad, identificador o serie, y estado **Conforme** o **Con observaciones**.

**3. Evidencias y firmas** — fotos en las tres etapas, cada una con su **pie de imagen**. Observaciones generales y firma con el dedo de ambas partes.

**4. Enviar** — genera el acta y sube todo.

## Lo que se genera

**Acta en PDF** con redacción formal automática que cita el contrato y las cláusulas aplicables, tabla de bienes, firmas al calce, y una hoja por fotografía con su pie de imagen agrupada por partida y etapa.

**Acta en Word** editable, por si necesitan ajustar el texto antes de entregarla.

**Registro en Sheets**: hoja `Actas` (una fila por acta) y hoja `Partidas` (una fila por bien entregado).

```
📁 ACT-VER-001 - Poste Zacamulpan
   📄 Acta_ACT-VER-001.pdf
   📄 Acta_ACT-VER-001.doc
   📁 FOTOS
```

## Por qué el acta dice lo que dice

Tres cláusulas del contrato guiaron el diseño:

- **Quinta** — la entrega debe ser "a entera satisfacción de LA SECRETARÍA". El acta lo hace constar.
- **Novena** — si detectan incumplimiento, hacen observaciones y el proveedor corrige. Por eso cada partida tiene estado y observaciones, y el texto las menciona.
- **Décima Sexta** — pena de tres al millar por día de atraso. La fecha, hora, GPS y fotos firmadas son la prueba de cuándo se entregó.

## Instalar en el teléfono

Abrir con internet una vez → botón **Instalar en el teléfono** (o menú ⋮ → Instalar aplicación). Después funciona en modo avión.

Al subir cambios, sube el número en la primera línea de `sw.js` (`mdk-actas-v1` → `v2`).

## Errores comunes

| Síntoma | Solución |
|---|---|
| Folio marcado "prov." | Normal sin señal; se corrige al enviar con internet |
| No abre sin internet | Falta instalarla desde el navegador con señal |
| Sube pero no aparece en Sheets | Falta **nueva implementación** del Apps Script |
| Faltan fotos en Drive | Usa el botón ☁️ de la tarjeta para reenviar |
| Nombres con "(1)" al subir al repo | Renómbralos; deben reemplazar, no duplicar |
