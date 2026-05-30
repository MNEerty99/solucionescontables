import os
import subprocess
import asyncio
from PIL import Image, ImageDraw, ImageFont

# Set up output directories on the Desktop
desktop_base = "/Users/matias/Desktop/SolucionesContables_Promo"
os.makedirs(desktop_base, exist_ok=True)

# Path to the local ffmpeg binary
ffmpeg_path = "./node_modules/ffmpeg-static/ffmpeg"
if not os.path.exists(ffmpeg_path):
    print("Error: ffmpeg binary not found in node_modules! Please install ffmpeg-static first.")
    exit(1)

# Base background images from public folder
bg_images = {
    1: "./public/corporate_bg_obelisco.png",   # Wide office with Obelisco
    2: "./public/corporate_bg_2.jpg",           # Boardroom mahogany at sunset
    3: "./public/corporate_bg_3.jpg",           # Night office screen canary wharf
    4: "./public/accounting_firm.png"           # Accounting Desk Canon calculator
}

# Define standard macOS system fonts
font_title_path = "/System/Library/Fonts/Supplemental/Georgia.ttf"
font_body_path = "/System/Library/Fonts/Supplemental/Arial.ttf"
font_bold_path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

try:
    font_title = lambda size: ImageFont.truetype(font_title_path, size)
    font_body = lambda size: ImageFont.truetype(font_body_path, size)
    font_bold = lambda size: ImageFont.truetype(font_bold_path, size)
except IOError:
    font_title = lambda size: ImageFont.load_default()
    font_body = lambda size: ImageFont.load_default()
    font_bold = lambda size: ImageFont.load_default()

# Theme Colors (Premium Gold and Navy)
GOLD = (212, 175, 55, 255)      # Rich Gold
WHITE = (255, 255, 255, 255)    # White
LIGHT_SLATE = (203, 213, 225, 255) # Slate-300
EMERALD = (16, 185, 129, 255)   # Emerald Green
RED = (239, 68, 68, 255)        # Soft Red

def create_premium_slide(bg_path, title_text, body_text, frame_num, extra_badge=None, screen_preview=None):
    width, height = 1080, 1080
    
    # 1. Load Background Image
    if os.path.exists(bg_path):
        bg = Image.open(bg_path).convert("RGBA")
    else:
        # Fallback to solid dark navy if file not found
        bg = Image.new("RGBA", (width, height), (15, 23, 42, 255))
        
    # Crop and Resize background to fit 1080x1080 square
    bg_w, bg_h = bg.size
    min_dim = min(bg_w, bg_h)
    bg_cropped = bg.crop(((bg_w - min_dim)//2, (bg_h - min_dim)//2, (bg_w + min_dim)//2, (bg_h + min_dim)//2))
    bg_resized = bg_cropped.resize((width, height), Image.Resampling.LANCZOS)
    
    # 2. Add Dark Moody Varnish Layer (Transparent Overlay for Legibility)
    varnish = Image.new("RGBA", (width, height), (9, 13, 22, 140)) # 55% Opacity Dark Blue
    img_blended = Image.alpha_composite(bg_resized, varnish)
    
    # 3. Create a secondary layer for drawing the Frosted Glass Card and Texts
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Draw Centered Glass Card Background (Deep Slate Navy with 80% opacity)
    card_box = [80, 80, width-80, height-80]
    draw.rectangle(card_box, fill=(15, 23, 42, 215)) # 85% opacity dark navy card
    draw.rectangle(card_box, outline=(212, 175, 55, 180), width=3) # Semi-transparent gold border
    draw.rectangle([86, 86, width-86, height-86], outline=(255, 255, 255, 40), width=1) # Outer white hairline
    
    # 4. Brand Watermark at the Top
    draw.text((width // 2, 130), "SOLUCIONES CONTABLES", fill=GOLD, font=font_title(24), anchor="mm")
    draw.line([(width // 2 - 140, 155), (width // 2 + 140, 155)], fill=(212, 175, 55, 120), width=1)
    
    # 5. Extra Badge Overlay
    if extra_badge:
        # draw badge rounded rectangle
        draw.rounded_rectangle([width//2 - 250, 175, width//2 + 250, 215], fill=(5, 150, 105, 220), radius=6)
        draw.text((width // 2, 195), extra_badge, fill=WHITE, font=font_bold(15), anchor="mm")
        
    # 6. Core Title Text (Georgia)
    y_text = 270
    lines = title_text.split("\n")
    for line in lines:
        draw.text((width // 2, y_text), line, fill=WHITE, font=font_title(44), anchor="mm")
        y_text += 55
        
    # 7. High-End Mockup Visual Panels
    if screen_preview == "escaner":
        # Draw a beautiful dark slate glass mockup
        panel_box = [width//2 - 280, 415, width//2 + 280, 715]
        draw.rectangle(panel_box, fill=(30, 41, 59, 230), outline=(5, 150, 105, 200), width=2)
        draw.text((width // 2, 450), "🤖 AGENTE OCR IMPOSITIVO", fill=EMERALD, font=font_bold(18), anchor="mm")
        
        # Scanned elements
        draw.rectangle([width//2 - 240, 485, width//2 + 240, 675], fill=(9, 13, 22, 240))
        draw.text((width//2 - 210, 510), "• CUIT Emisor: 30-70845312-9", fill=WHITE, font=font_body(18))
        draw.text((width//2 - 210, 545), "• Neto Gravado: $45.200,00", fill=WHITE, font=font_body(18))
        draw.text((width//2 - 210, 580), "• IVA (21%): $9.492,00", fill=WHITE, font=font_body(18))
        draw.text((width//2 - 210, 620), "• ESTADO: Validado en AFIP APOC ✓", fill=GOLD, font=font_bold(17))
        
    elif screen_preview == "semaforo":
        panel_box = [width//2 - 280, 415, width//2 + 280, 715]
        draw.rectangle(panel_box, fill=(30, 41, 59, 230), outline=(212, 175, 55, 200), width=2)
        draw.text((width // 2, 450), "🚦 ALERTA SAFE-GUARD (F.2051)", fill=GOLD, font=font_bold(18), anchor="mm")
        
        # Traffic light circles with elegant glowing effect
        draw.ellipse([width//2 - 170, 490, width//2 - 110, 550], fill=(239, 68, 68, 255)) # Glowing Red
        draw.ellipse([width//2 - 30, 490, width//2 + 30, 550], fill=(120, 110, 20, 120)) # Dim Yellow
        draw.ellipse([width//2 + 110, 490, width//2 + 170, 550], fill=(20, 80, 40, 120))  # Dim Green
        
        draw.text((width // 2, 605), "Alerta: Cliente 'Transportes SRL' al 92% de la Cat. H", fill=WHITE, font=font_bold(18), anchor="mm")
        draw.text((width // 2, 650), "Evitá exclusiones de oficio automáticamente", fill=GOLD, font=font_body(16), anchor="mm")
        
    elif screen_preview == "apoc":
        panel_box = [width//2 - 280, 415, width//2 + 280, 715]
        draw.rectangle(panel_box, fill=(30, 41, 59, 230), outline=(239, 68, 68, 200), width=2)
        draw.text((width // 2, 450), "⚠️ AUDITORÍA CONTABLE APOC", fill=RED, font=font_bold(18), anchor="mm")
        
        draw.rectangle([width//2 - 240, 485, width//2 + 240, 675], fill=(254, 242, 242, 240))
        draw.text((width // 2, 530), "DETECCIÓN FACTURA APÓCRIFA", fill=RED, font=font_bold(20), anchor="mm")
        draw.text((width // 2, 580), "CUIT Emisor bajo sospecha penal impositiva", fill=(127, 29, 29, 255), font=font_body(16), anchor="mm")
        draw.text((width // 2, 625), "🔒 Escudo impositivo activado", fill=EMERALD, font=font_bold(17), anchor="mm")
        
    # 8. Body Descriptions (Arial Slate-300)
    y_body = 765
    body_lines = body_text.split("\n")
    for line in body_lines:
        draw.text((width // 2, y_body), line, fill=LIGHT_SLATE, font=font_body(22), anchor="mm")
        y_body += 40
        
    # 9. Slogan & Footer
    draw.text((width // 2, 955), "El colaborador que tu estudio merece.", fill=GOLD, font=font_title(20), anchor="mm")
    draw.text((width // 2, 995), "solucionescontables.com.ar", fill=WHITE, font=font_body(15), anchor="mm")
    
    # Save the composite frame image
    final_img = Image.alpha_composite(img_blended, overlay)
    
    # Create concept dir
    concept_dir = os.path.join(desktop_base, "Conceptos_Premium_Frames")
    os.makedirs(concept_dir, exist_ok=True)
    
    out_path = os.path.join(concept_dir, f"slide_{frame_num}.png")
    final_img.convert("RGB").save(out_path, "PNG")
    return out_path

# Voiceover scripts with Argentine Spanish vocabulary
campaigns = {
    "Publicidad_Escaner_Inteligente_Premium.mp4": {
        "voice": "es-AR-TomasNeural",
        "slides": [
            {"title": "¿Seguís transcribiendo\ntickets a mano?", "body": "Tus domingos impositivos se terminaron de verdad.\nDejá que tus clientes envíen las fotos y el sistema hace el resto.", "badge": "B2B AD CAMPAIGN - VIDEO 1", "bg_id": 1, "preview": None},
            {"title": "Portal de Clientes\ncon Agente OCR", "body": "Tu cliente toma la foto desde el celular.\nEl OCR de IA extrae neto, IVA y CUIT automáticamente.", "badge": "TECNOLOGÍA DIRECTA PARA ESTUDIOS", "bg_id": 4, "preview": "escaner"},
            {"title": "Olvidate del caos\nde WhatsApp", "body": "Los comprobantes entran ordenados, auditados\ny listos para ser aprobados en un solo clic.", "badge": "EFICIENCIA EXTREMA", "bg_id": 3, "preview": None},
            {"title": "El colaborador que\ntu estudio merece.", "body": "Licencia B2B: Carga hasta 100 empresas.\nPromoción lanzamiento: Solo USD 380.", "badge": "SOLUCIONES CONTABLES", "bg_id": 1, "preview": None}
        ],
        "script": [
            "Che, ¿seguís transcribiendo tickets a mano un domingo a la noche porque tus clientes te mandan fotos re borrosas por WhatsApp? Tus domingos impositivos se terminaron de verdad.",
            "Con el nuevo Portal de Clientes con Agente OCR de SolucionesContables, ellos simplemente le sacan una foto al comprobante desde el celular y nuestra Inteligencia Artificial te extrae el neto, el IVA y el CUIT al instante. Posta, en segundos.",
            "Olvidate del caos de WhatsApp. Todos los comprobantes entran ordenados, auditados y listos para que los apruebes con un solo clic. Ganás control y profesionalismo.",
            "Es el colaborador digital que tu estudio se merece. Llevá hasta cien empresas clientes con carga impositiva automática por solo trescientos ochenta dólares de oferta. Entrá a solucionescontables.com.ar y probalo hoy."
        ]
    },
    "Publicidad_Semaforo_Monotributo_Premium.mp4": {
        "voice": "es-AR-ElenaNeural", # Beautiful warm female Argentine voice
        "slides": [
            {"title": "¿Vigilás el límite de\ntus monotributistas?", "body": "Enterarte que un cliente se pasó de categoría\ncuando ya lo excluyó AFIP es el peor escenario.", "badge": "B2B AD CAMPAIGN - VIDEO 2", "bg_id": 2, "preview": None},
            {"title": "Safe-Guard Alerta\nAutomática F.2051", "body": "Un semáforo inteligente que te avisa en tiempo real\ncuando un cliente está por cruzar el límite impositivo.", "badge": "PREVENCIÓN EXCLUSIVA", "bg_id": 4, "preview": "semaforo"},
            {"title": "Tranquilidad total\npara vos y tu cliente", "body": "Asesoramiento estratégico basado en alertas tempranas,\nprotegiendo su patrimonio y tu reputación.", "badge": "CONFIABILIDAD ABSOLUTA", "bg_id": 1, "preview": None},
            {"title": "Tomá el control hoy\nmismo en tu Estudio.", "body": "100 empresas por USD 380.\nEl software definitivo para contadores en Argentina.", "badge": "SOLUCIONES CONTABLES", "bg_id": 2, "preview": None}
        ],
        "script": [
            "¿Vigilás de cerca el límite de facturación de tus monotributistas, o te terminás enterando cuando AFIP ya los excluyó de oficio? Evitá sorpresas desagradables.",
            "Con el Semáforo Inteligente de Alerta Automática F.2051 de SolucionesContables, tenés un vigilante las veinticuatro horas. Te avisa en tiempo real si un cliente se acerca a la cornisa.",
            "Llevá tranquilidad total a tus clientes con asesoramiento estratégico proactivo basado en alertas tempranas, resguardando su patrimonio y cuidando tu firma.",
            "Tomá el control absoluto de tu estudio contable hoy mismo. Cien empresas clientes por solo trescientos ochenta dólares. SolucionesContables.com.ar."
        ]
    },
    "Publicidad_Escudo_APOC_Premium.mp4": {
        "voice": "es-AR-TomasNeural",
        "slides": [
            {"title": "¿Auditas a tus proveedores\ncontra facturas APOC?", "body": "Una factura apócrifa en los libros de tu cliente\npuede costar multas millonarias e inspecciones de AFIP.", "badge": "B2B AD CAMPAIGN - VIDEO 3", "bg_id": 4, "preview": None},
            {"title": "Escudo Contable\ny Auditoría AFIP", "body": "Cruzamos cada comprobante ingresado contra la base APOC\ny controlamos facturas M automáticamente.", "badge": "CUMPLIMIENTO ESTRICTO", "bg_id": 1, "preview": "apoc"},
            {"title": "Seguridad jurídica\npara tu firma contable", "body": "Evitá multas del fisco y garantizá auditorías\n100% limpias bajo normas técnicas y RT 54.", "badge": "ESTÁNDAR DE EXCELENCIA", "bg_id": 2, "preview": None},
            {"title": "Protegés tu estudio\ncomercialmente hoy.", "body": "El asistente de auditoría preventiva definitivo.\nProbá la demo de SolucionesContables.", "badge": "SOLUCIONES CONTABLES", "bg_id": 4, "preview": None}
        ],
        "script": [
            "¿Estás auditando en serio a los proveedores de tus clientes contra la base de facturas apócrifas de AFIP? Una sola factura trucha puede costar multas millonarias.",
            "Activá el Escudo de Auditoría Contable Preventiva de SolucionesContables. Cruzamos de forma totalmente automática cada factura cargada contra el padrón APOC y detectamos facturas M al instante.",
            "Evitá cualquier tipo de inspección sorpresa y garantizá una seguridad jurídica total para tu estudio bajo las estrictas normativas vigentes de la R.T. cincuenta y cuatro.",
            "Protegé el prestigio y el futuro de tu firma contable hoy mismo. Entrá a solucionescontables.com.ar y probá la demo interactiva sin costo."
        ]
    }
}

async def compile_ad(comp_name, comp_data):
    print(f"\n--- INICIANDO PRODUCCIÓN PREMIUM: {comp_name} ---")
    scratch_dir = "./scratch/temp_premium"
    os.makedirs(scratch_dir, exist_ok=True)
    
    segments = []
    
    # 1. Generate premium visual frames and synthesize voiceover audio
    for idx, slide in enumerate(comp_data["slides"]):
        frame_num = idx + 1
        print(f"  [1/3] Creando diapositiva premium {frame_num}...")
        
        bg_path = bg_images[slide["bg_id"]]
        
        # Call Pillow drawing function to composite the luxury slide
        slide_img_path = create_premium_slide(
            bg_path=bg_path,
            title_text=slide["title"],
            body_text=slide["body"],
            frame_num=frame_num,
            extra_badge=slide["badge"],
            screen_preview=slide["preview"]
        )
        
        segment_audio = os.path.join(scratch_dir, f"audio_{frame_num}.m4a")
        segment_video = os.path.join(scratch_dir, f"segment_{frame_num}.mp4")
        
        # 2. Synthesize ultra-realistic neural speech using edge-tts
        script_text = comp_data["script"][idx]
        print(f"  [2/3] Sintetizando locución NEURAL ({comp_data['voice']}) para escena {frame_num}...")
        
        # Run edge-tts CLI tool
        cmd = [
            "edge-tts",
            "--voice", comp_data["voice"],
            "--text", script_text,
            "--write-media", segment_audio
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # 3. Compile segment MP4 using local ffmpeg
        print(f"  [3/3] Ensamblando video segmento {frame_num}...")
        subprocess.run([
            ffmpeg_path,
            "-loop", "1",
            "-i", slide_img_path,
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
        
    # 4. Concatenate segments
    print("  [Concatenando] Armando el video de publicidad premium final...")
    concat_txt_path = os.path.join(scratch_dir, "concat.txt")
    with open(concat_txt_path, "w") as f:
        for seg in segments:
            abs_path = os.path.abspath(seg)
            f.write(f"file '{abs_path}'\n")
            
    final_video_out = os.path.join(desktop_base, comp_name)
    
    subprocess.run([
        ffmpeg_path,
        "-f", "concat",
        "-safe", "0",
        "-i", concat_txt_path,
        "-c", "copy",
        final_video_out,
        "-y"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print(f"✓ ¡Video Premium Creado! {final_video_out}")
    
    # Cleanup segment files
    for file_name in os.listdir(scratch_dir):
        file_path = os.path.join(scratch_dir, file_name)
        if os.path.isfile(file_path):
            os.remove(file_path)
            
    try:
        os.rmdir(scratch_dir)
    except Exception:
        pass

async def main():
    for comp_name, comp_data in campaigns.items():
        await compile_ad(comp_name, comp_data)
        
    print("\n🚀 ¡PROCESO DE PRODUCCIÓN PREMIUM DE ANUNCIOS TERMINADO CON ÉXITO!")
    print("Los 3 videos de locución neuronal argentina y estética glassmorphism premium están en tu Escritorio.")

if __name__ == "__main__":
    asyncio.run(main())
