import os
from PIL import Image, ImageDraw, ImageFont

# Set up output directories on the Desktop
desktop_base = "/Users/matias/Desktop/SolucionesContables_Promo"
os.makedirs(desktop_base, exist_ok=True)

# Define directories for each concept
concepts = {
    "Concepto1_Escaner": os.path.join(desktop_base, "Concepto1_Escaner"),
    "Concepto2_Semaforo": os.path.join(desktop_base, "Concepto2_Semaforo"),
    "Concepto3_Auditoria": os.path.join(desktop_base, "Concepto3_Auditoria")
}

for path in concepts.values():
    os.makedirs(path, exist_ok=True)

# Define standard macOS system fonts
font_title_path = "/System/Library/Fonts/Supplemental/Georgia.ttf"
font_body_path = "/System/Library/Fonts/Supplemental/Arial.ttf"

# Fallback to default if not found
try:
    font_title = lambda size: ImageFont.truetype(font_title_path, size)
    font_body = lambda size: ImageFont.truetype(font_body_path, size)
    font_bold = lambda size: ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", size)
except IOError:
    font_title = lambda size: ImageFont.load_default()
    font_body = lambda size: ImageFont.load_default()
    font_bold = lambda size: ImageFont.load_default()

# Theme Colors
NAVY = (15, 23, 42)      # #0F172A
GOLD = (212, 175, 55)    # Gold
EMERALD = (5, 150, 105)  # #059669
SLATE = (71, 85, 105)    # #475569
WHITE = (255, 255, 255)
LIGHT_SLATE = (241, 245, 249)

def draw_gradient_background(draw, width, height):
    # Smooth gradient from Slate Navy to Midnight Navy
    for y in range(height):
        r = int(15 + (30 - 15) * (1 - y / height))
        g = int(23 + (41 - 23) * (1 - y / height))
        b = int(42 + (59 - 42) * (1 - y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def draw_frame(concept, frame_num, title_text, body_text, extra_badge=None, screen_preview=None):
    # Standard Instagram Square ad frame (1080x1080px)
    width, height = 1080, 1080
    image = Image.new("RGB", (width, height), NAVY)
    draw = ImageDraw.Draw(image)
    
    # 1. Background
    draw_gradient_background(draw, width, height)
    
    # 2. Gold Frame Border
    draw.rectangle([40, 40, width-40, height-40], outline=GOLD, width=3)
    draw.rectangle([46, 46, width-46, height-46], outline=(255, 255, 255, 30), width=1)
    
    # 3. Logo watermark at top
    draw.text((width // 2, 90), "SOLUCIONES CONTABLES", fill=GOLD, font=font_title(24), anchor="mm")
    draw.line([(width // 2 - 120, 115), (width // 2 + 120, 115)], fill=GOLD, width=1)
    
    # 4. Extra badge
    if extra_badge:
        draw.rounded_rectangle([width//2 - 250, 140, width//2 + 250, 185], fill=EMERALD, radius=6)
        draw.text((width // 2, 162), extra_badge, fill=WHITE, font=font_bold(15), anchor="mm")
    
    # 5. Core Title Text (Georgia)
    y_text = 240
    lines = title_text.split("\n")
    for line in lines:
        draw.text((width // 2, y_text), line, fill=WHITE, font=font_title(46), anchor="mm")
        y_text += 60
        
    # 6. Optional image or layout illustration in center
    if screen_preview == "escaner":
        # Draw a mock UI for OCR scanning a ticket
        box = [width//2 - 280, 420, width//2 + 280, 720]
        draw.rectangle(box, fill=(30, 41, 59), outline=EMERALD, width=2)
        draw.text((width // 2, 460), "🤖 AGENTE OCR IMPOSITIVO", fill=EMERALD, font=font_bold(18), anchor="mm")
        draw.rectangle([width//2 - 240, 500, width//2 + 240, 680], fill=(15, 23, 42))
        
        # Scanned text simulation
        draw.text((width//2 - 220, 525), "• CUIT Emisor: 30-70845312-9", fill=WHITE, font=font_body(18))
        draw.text((width//2 - 220, 560), "• Neto Gravado: $45.200,00", fill=WHITE, font=font_body(18))
        draw.text((width//2 - 220, 595), "• IVA (21%): $9.492,00", fill=WHITE, font=font_body(18))
        draw.text((width//2 - 220, 630), "• ESTADO: Validado en AFIP APOC ✓", fill=GOLD, font=font_bold(16))
    
    elif screen_preview == "semaforo":
        # Draw Monotributo Traffic Light mock UI
        box = [width//2 - 280, 420, width//2 + 280, 720]
        draw.rectangle(box, fill=(30, 41, 59), outline=GOLD, width=2)
        draw.text((width // 2, 460), "🚦 ALERTA SAFE-GUARD (F.2051)", fill=GOLD, font=font_bold(18), anchor="mm")
        
        # Traffic light circles
        draw.ellipse([width//2 - 180, 510, width//2 - 120, 570], fill=(220, 38, 38)) # Red
        draw.ellipse([width//2 - 30, 510, width//2 + 30, 570], fill=(120, 110, 20)) # Dim Yellow
        draw.ellipse([width//2 + 120, 510, width//2 + 180, 570], fill=(20, 80, 40))  # Dim Green
        
        draw.text((width // 2, 630), "Alerta: Cliente 'Transportes SRL' al 92% de la Cat. H", fill=WHITE, font=font_bold(18), anchor="mm")
        draw.text((width // 2, 665), "Evitá exclusiones de oficio automáticamente", fill=GOLD, font=font_body(16), anchor="mm")
        
    elif screen_preview == "apoc":
        # Draw APOC auditing tool mockup UI
        box = [width//2 - 280, 420, width//2 + 280, 720]
        draw.rectangle(box, fill=(30, 41, 59), outline=(220, 38, 38), width=2)
        draw.text((width // 2, 460), "⚠️ AUDITORÍA CONTABLE APOC", fill=(220, 38, 38), font=font_bold(18), anchor="mm")
        
        draw.rectangle([width//2 - 240, 500, width//2 + 240, 680], fill=(254, 242, 242))
        draw.text((width // 2, 540), "DETECCIÓN FACTURA APÓCRIFA", fill=(220, 38, 38), font=font_bold(20), anchor="mm")
        draw.text((width // 2, 590), "CUIT Emisor bajo sospecha penal impositiva", fill=(127, 29, 29), font=font_body(16), anchor="mm")
        draw.text((width // 2, 635), "🔒 Escudo impositivo activado", fill=EMERALD, font=font_bold(16), anchor="mm")

    # 7. Body text description (Arial)
    y_body = 770
    body_lines = body_text.split("\n")
    for line in body_lines:
        draw.text((width // 2, y_body), line, fill=LIGHT_SLATE, font=font_body(22), anchor="mm")
        y_body += 40
        
    # 8. Call to Action / Footer at the bottom
    draw.text((width // 2, 980), "El colaborador que tu estudio merece.", fill=GOLD, font=font_title(20), anchor="mm")
    draw.text((width // 2, 1020), "solucionescontables.com.ar", fill=WHITE, font=font_body(15), anchor="mm")
    
    # Save the frame
    file_path = os.path.join(concepts[concept], f"frame_{frame_num}.png")
    image.save(file_path, "PNG")
    print(f"Saved: {file_path}")

# =====================================================================
# GENERATING THE STORYBOARD FRAMES
# =====================================================================

# CONCEPT 1: EL ESCÁNER INTELIGENTE
draw_frame(
    "Concepto1_Escaner", 1,
    "¿Seguís transcribiendo\ntickets a mano?",
    "Tus domingos impositivos se terminaron.\nDejá que tus clientes envíen las fotos y el sistema haga el resto.",
    "B2B AD CAMPAIGN - VIDEO 1"
)
draw_frame(
    "Concepto1_Escaner", 2,
    "Portal de Clientes\ncon Agente OCR",
    "Tu cliente toma la foto desde el celular.\nEl OCR de IA extrae neto, IVA y CUIT automáticamente.",
    "TECNOLOGÍA DIRECTA PARA ESTUDIOS", "escaner"
)
draw_frame(
    "Concepto1_Escaner", 3,
    "Olvidate del caos\nde WhatsApp",
    "Los comprobantes entran ordenados, auditados\ny listos para ser aprobados en un solo clic.",
    "EFICIENCIA EXTREMA"
)
draw_frame(
    "Concepto1_Escaner", 4,
    "El colaborador que\ntu estudio merece.",
    "Licencia B2B: Carga hasta 100 empresas.\nPromoción lanzamiento: Solo USD 380.",
    "SOLUCIONES CONTABLES"
)

# CONCEPT 2: EL SEMÁFORO DEL MONOTRIBUTO
draw_frame(
    "Concepto2_Semaforo", 1,
    "¿Vigilás el límite de\ntus monotributistas?",
    "Enterarte que un cliente se pasó de categoría\ncuando ya lo excluyó AFIP es el peor escenario.",
    "B2B AD CAMPAIGN - VIDEO 2"
)
draw_frame(
    "Concepto2_Semaforo", 2,
    "Safe-Guard Alerta\nAutomática F.2051",
    "Un semáforo inteligente que te avisa en tiempo real\ncuando un cliente está por cruzar el límite impositivo.",
    "PREVENCIÓN EXCLUSIVA", "semaforo"
)
draw_frame(
    "Concepto2_Semaforo", 3,
    "Tranquilidad total\npara vos y tu cliente",
    "Asesoramiento estratégico basado en alertas tempranas,\nprotegiendo su patrimonio y tu reputación.",
    "CONFIABILIDAD ABSOLUTA"
)
draw_frame(
    "Concepto2_Semaforo", 4,
    "Tomá el control hoy\nmismo en tu Estudio.",
    "100 empresas por USD 380.\nEl software definitivo para contadores en Argentina.",
    "SOLUCIONES CONTABLES"
)

# CONCEPT 3: EL CONTROL APOC
draw_frame(
    "Concepto3_Auditoria", 1,
    "¿Auditas a tus proveedores\ncontra facturas APOC?",
    "Una factura apócrifa en los libros de tu cliente\npuede costar multas millonarias e inspecciones de AFIP.",
    "B2B AD CAMPAIGN - VIDEO 3"
)
draw_frame(
    "Concepto3_Auditoria", 2,
    "Escudo Contable\ny Auditoría AFIP",
    "Cruzamos cada comprobante ingresado contra la base APOC\ny controlamos facturas M automáticamente.",
    "CUMPLIMIENTO ESTRICTO", "apoc"
)
draw_frame(
    "Concepto3_Auditoria", 3,
    "Seguridad jurídica\npara tu firma contable",
    "Evitá multas del fisco y garantizá auditorías\n100% limpias bajo normas técnicas y RT 54.",
    "ESTÁNDAR DE EXCELENCIA"
)
draw_frame(
    "Concepto3_Auditoria", 4,
    "Protegé tu estudio\ncomercialmente hoy.",
    "El asistente de auditoría preventiva definitivo.\nProbá la demo de SolucionesContables.",
    "SOLUCIONES CONTABLES"
)

print("Programmatic storyboard generation completed! All concepts saved to Desktop.")
