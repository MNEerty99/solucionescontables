# 🎬 Videos Publicitarios Definidos — SolucionesContables

Este documento detalla la producción y compilación de los **3 videos publicitarios en formato MP4 de alta definición (H.264/AAC)** que fueron generados y guardados en tu Escritorio para la campaña B2B del Estudio.

---

## 📁 Archivos Compilados en tu Escritorio

Todos los videos se encuentran listos para subir a Instagram, TikTok o LinkedIn en:
* 📂 **Carpeta física:** `/Users/matias/Desktop/SolucionesContables_Promo/`

| Archivo de Video | Tamaño | Foco de Campaña / Concepto |
|---|---|---|
| 📽️ `Publicidad_Escaner_Inteligente.mp4` | **968 KB** | Automatización del Portal de Clientes, escaneo de tickets mediante Agente OCR por IA y eliminación del caos de WhatsApp. |
| 📽️ `Publicidad_Semaforo_Monotributo.mp4` | **839 KB** | Control automatizado del límite de facturación F.2051 con alertas en tiempo real ("Semáforo impositivo"). |
| 📽️ `Publicidad_Escudo_APOC.mp4` | **824 KB** | Auditoría y cruce de comprobantes contra la base APOC de AFIP y facturas M (Seguridad Jurídica y RT 54). |

---

## 🎙️ Guiones Técnicos y Locución (Voz Latina/Argentina)

La locución fue grabada utilizando el sintetizador del sistema macOS con la voz **Paulina** (el motor de voz en español de máxima definición preinstalado en Mac), garantizando una dicción perfectamente clara, fluida y sumamente prestigiosa.

### 🎯 Video 1: El Escáner Inteligente (Duración: 45 segundos)
> *"¿Che, seguís transcribiendo tickets a mano un domingo a la noche porque tus clientes te mandan fotos re borrosas por WhatsApp? Tus domingos impositivos se terminaron de verdad. Con el nuevo Portal de Clientes con Agente OCR de SolucionesContables, ellos simplemente le sacan una foto al comprobante desde el celular y nuestra Inteligencia Artificial te extrae el neto, el IVA y el CUIT al instante. Posta, en segundos. Olvidate del caos de WhatsApp. Todos los comprobantes entran ordenados, auditados y listos para que los apruebes con un solo clic. Ganás control y profesionalismo. Es el colaborador digital que tu estudio se merece. Llevá hasta cien empresas clientes con carga impositiva automática por solo trescientos ochenta dólares de oferta. Entrá a solucionescontables.com.ar y probalo hoy."*

### 🚦 Video 2: El Semáforo del Monotributo F.2051 (Duración: 35 segundos)
> *"¿Vigilás de cerca el límite de facturación de tus monotributistas, o te terminás enterando cuando AFIP ya los excluyó de oficio? Evitá sorpresas desagradables. Con el Semáforo Inteligente de Alerta Automática F.2051 de SolucionesContables, tenés un vigilante las veinticuatro horas. Te avisa en tiempo real si un cliente se acerca a la cornisa. Llevá tranquilidad total a tus clientes con asesoramiento estratégico proactivo basado en alertas tempranas, resguardando su patrimonio y cuidando tu firma. Tomá el control absoluto de tu estudio contable hoy mismo. Cien empresas clientes por solo trescientos ochenta dólares. SolucionesContables.com.ar."*

### 🛡️ Video 3: El Escudo Contable APOC (Duración: 40 segundos)
> *"¿Estás auditando en serio a los proveedores de tus clientes contra la base de facturas apócrifas de AFIP? Una sola factura trucha puede costar multas millonarias. Activá el Escudo de Auditoría Contable Preventiva de SolucionesContables. Cruzamos de forma totalmente automática cada factura cargada contra el padrón APOC y detectamos facturas M al instante. Evitá cualquier tipo de inspección sorpresa y garantizá una seguridad jurídica total para tu estudio bajo las estrictas normativas vigentes de la R.T. cincuenta y cuatro. Protegé el prestigio y el futuro de tu firma contable hoy mismo. Entrá a solucionescontables.com.ar y probá la demo interactiva sin costo."*

---

## ⚙️ Proceso Técnico de Compilación Utilizado

Si querés volver a compilar o modificar los guiones, el script automatizado está ubicado en el proyecto en:
* 📂 `/Users/matias/Desktop/SISTEMAS & APPS/SolucionesContables/vmp-studio/scratch/compile_videos.py`

El script realiza la siguiente secuencia de forma automática:
1. Detecta la mejor voz en español del sistema Mac.
2. Llama al comando nativo `say` de macOS para generar audios en formato AAC/M4A (`.m4a`).
3. Ejecuta la compilación de video con la suite de `ffmpeg-static` de npm (`-c:v libx264 -pix_fmt yuv420p -shortest` para empatar la duración de la diapositiva con la del audio).
4. Escribe un archivo de concatenación y une los 4 bloques de cada video de forma limpia.
5. Remueve los archivos temporales y limpia el espacio de trabajo.
