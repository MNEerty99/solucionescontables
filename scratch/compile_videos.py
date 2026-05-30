import os
import subprocess

# Output Base Directory
desktop_base = "/Users/matias/Desktop/SolucionesContables_Promo"
os.makedirs(desktop_base, exist_ok=True)

# Path to the local ffmpeg binary
ffmpeg_path = "./node_modules/ffmpeg-static/ffmpeg"
if not os.path.exists(ffmpeg_path):
    print("Error: ffmpeg binary not found in node_modules! Please install ffmpeg-static first.")
    exit(1)

# Voiceover scripts with Argentine Spanish vocabulary
campaigns = {
    "Concepto1_Escaner": {
        "out_name": "Publicidad_Escaner_Inteligente.mp4",
        "frames_dir": os.path.join(desktop_base, "Concepto1_Escaner"),
        "script": [
            "Che, ¿seguís transcribiendo tickets a mano un domingo a la noche porque tus clientes te mandan fotos re borrosas por WhatsApp? Tus domingos impositivos se terminaron de verdad.",
            "Con el nuevo Portal de Clientes con Agente OCR de SolucionesContables, ellos simplemente le sacan una foto al comprobante desde el celular y nuestra Inteligencia Artificial te extrae el neto, el IVA y el CUIT al instante. Posta, en segundos.",
            "Olvidate del caos de WhatsApp. Todos los comprobantes entran ordenados, auditados y listos para que los apruebes con un solo clic. Ganás control y profesionalismo.",
            "Es el colaborador digital que tu estudio se merece. Llevá hasta cien empresas clientes con carga impositiva automática por solo trescientos ochenta dólares de oferta. Entrá a solucionescontables.com.ar y probalo hoy."
        ]
      },
    "Concepto2_Semaforo": {
        "out_name": "Publicidad_Semaforo_Monotributo.mp4",
        "frames_dir": os.path.join(desktop_base, "Concepto2_Semaforo"),
        "script": [
            "¿Vigilás de cerca el límite de facturación de tus monotributistas, o te terminás enterando cuando AFIP ya los excluyó de oficio? Evitá sorpresas desagradables.",
            "Con el Semáforo Inteligente de Alerta Automática F.2051 de SolucionesContables, tenés un vigilante las veinticuatro horas. Te avisa en tiempo real si un cliente se acerca a la cornisa.",
            "Llevá tranquilidad total a tus clientes con asesoramiento estratégico proactivo basado en alertas tempranas, resguardando su patrimonio y cuidando tu firma.",
            "Tomá el control absoluto de tu estudio contable hoy mismo. Cien empresas clientes por solo trescientos ochenta dólares. SolucionesContables.com.ar."
        ]
      },
    "Concepto3_Auditoria": {
        "out_name": "Publicidad_Escudo_APOC.mp4",
        "frames_dir": os.path.join(desktop_base, "Concepto3_Auditoria"),
        "script": [
            "¿Estás auditando en serio a los proveedores de tus clientes contra la base de facturas apócrifas de AFIP? Una sola factura trucha puede costar multas millonarias.",
            "Activá el Escudo de Auditoría Contable Preventiva de SolucionesContables. Cruzamos de forma totalmente automática cada factura cargada contra el padrón APOC y detectamos facturas M al instante.",
            "Evitá cualquier tipo de inspección sorpresa y garantizá una seguridad jurídica total para tu estudio bajo las estrictas normativas vigentes de la R.T. cincuenta y cuatro.",
            "Protegé el prestigio y el futuro de tu firma contable hoy mismo. Entrá a solucionescontables.com.ar y probá la demo interactiva sin costo."
        ]
      }
}

# Detect the best Spanish voice available on macOS
def detect_voice():
    try:
        res = subprocess.run(["say", "-v", "?"], capture_output=True, text=True)
        voices = res.stdout.lower()
        if "diego" in voices:
            return "Diego"
        elif "isabela" in voices:
            return "Isabela"
        elif "paulina" in voices:
            return "Paulina"
        elif "mónica" in voices:
            return "Mónica"
        elif "soledad" in voices:
            return "Soledad"
        else:
            # Fallback to standard Spanish
            return "Diego"
    except Exception:
        return "Diego"

selected_voice = detect_voice()
print(f"Using voice for synthesis: {selected_voice}")

# Temporary scratch space for compiling segments
scratch_dir = "./scratch/temp_video"
os.makedirs(scratch_dir, exist_ok=True)

# Build each B2B campaign video
for comp_key, comp_data in campaigns.items():
    print(f"\n--- Compilando Video: {comp_key} ---")
    segments = []
    
    # Compile each frame segment
    for idx, script_text in enumerate(comp_data["script"]):
        frame_num = idx + 1
        frame_img = os.path.join(comp_data["frames_dir"], f"frame_{frame_num}.png")
        
        if not os.path.exists(frame_img):
            print(f"Error: Frame image not found: {frame_img}")
            continue
            
        # Segment Temp Paths
        segment_audio = os.path.join(scratch_dir, f"{comp_key}_audio_{frame_num}.m4a")
        segment_video = os.path.join(scratch_dir, f"{comp_key}_segment_{frame_num}.mp4")
        
        # 1. Synthesize Speech audio using macOS native TTS
        print(f"  [1/3] Sintetizando Audio para Escena {frame_num}...")
        subprocess.run([
            "say",
            "-v", selected_voice,
            "-o", segment_audio,
            script_text
        ])
        
        # 2. Compile image + audio into a synchronized B2B B-roll MP4 segment using ffmpeg
        print(f"  [2/3] Compilando Video Segmento {frame_num}...")
        # We loop the static image, encode with H.264, and stop when the audio track ends (-shortest)
        subprocess.run([
            ffmpeg_path,
            "-loop", "1",
            "-i", frame_img,
            "-i", segment_audio,
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-c:a", "aac",
            "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-shortest",
            segment_video,
            "-y"
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        segments.append(segment_video)
        
    if not segments:
        print(f"Error: No segments were generated for {comp_key}.")
        continue
        
    # 3. Concatenate all generated MP4 segments into the final video file
    print(f"  [3/3] Concatenando segmentos en el video final...")
    concat_file_path = os.path.join(scratch_dir, f"concat_{comp_key}.txt")
    with open(concat_file_path, "w") as f:
        for seg in segments:
            # write as: file '/absolute/path/to/segment.mp4'
            abs_path = os.path.abspath(seg)
            f.write(f"file '{abs_path}'\n")
            
    final_out_path = os.path.join(desktop_base, comp_data["out_name"])
    
    subprocess.run([
        ffmpeg_path,
        "-f", "concat",
        "-safe", "0",
        "-i", concat_file_path,
        "-c", "copy",
        final_out_path,
        "-y"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print(f"✓ ¡Video compilado con éxito! Guardado en: {final_out_path}")

# Cleanup all temporary wav, mp4, and txt segment files in scratch space
print("\n--- Limpiando archivos temporales ---")
for file_name in os.listdir(scratch_dir):
    file_path = os.path.join(scratch_dir, file_name)
    try:
        if os.path.isfile(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Error removing temporary file {file_path}: {e}")

try:
    os.rmdir(scratch_dir)
except Exception:
    pass

print("\n🚀 ¡PROCESO DE PRODUCCIÓN DE VIDEOS COMPLETADO CON ÉXITO!")
print("Todos los videos en formato MP4 están disponibles en la carpeta de tu Escritorio.")
