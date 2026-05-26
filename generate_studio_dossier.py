#!/usr/bin/env python3
import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.colors import HexColor, white, lightgrey

# Colors matching the VMP Studio Contable Theme (Minimalist Vanguard)
COLOR_DARK_BLUE = HexColor("#0F172A")  # Deep Midnight Navy
COLOR_TEAL = HexColor("#059669")       # Financial Emerald Green
COLOR_EMERALD = HexColor("#10B981")    # Forest Green Accent
COLOR_DARK_TEAL = HexColor("#1E293B")  # Dark Slate Grey
TEXT_COLOR = HexColor("#475569")       # Clean Cool Slate Body Text
BG_LIGHT = HexColor("#F8FAFC")         # Premium soft grey background

# Initialize base styles
styles = getSampleStyleSheet()

# Define Custom Styles
style_normal = ParagraphStyle(
    "DossierNormal",
    parent=styles['Normal'],
    alignment=TA_JUSTIFY,
    fontSize=10,
    leading=15,
    textColor=TEXT_COLOR,
    spaceAfter=8
)

style_bullet = ParagraphStyle(
    "DossierBullet",
    parent=style_normal,
    leftIndent=20,
    firstLineIndent=-10,
    spaceAfter=6
)

style_h1 = ParagraphStyle(
    "DossierH1",
    parent=styles['Heading1'],
    fontSize=20,
    leading=24,
    textColor=COLOR_DARK_TEAL,
    fontName="Helvetica-Bold",
    spaceBefore=18,
    spaceAfter=12,
    keepWithNext=True
)

style_h2 = ParagraphStyle(
    "DossierH2",
    parent=styles['Heading2'],
    fontSize=14,
    leading=18,
    textColor=COLOR_TEAL,
    fontName="Helvetica-Bold",
    spaceBefore=14,
    spaceAfter=8,
    keepWithNext=True
)

style_h3 = ParagraphStyle(
    "DossierH3",
    parent=styles['Heading3'],
    fontSize=11,
    leading=15,
    textColor=COLOR_EMERALD,
    fontName="Helvetica-Bold",
    spaceBefore=10,
    spaceAfter=6,
    keepWithNext=True
)

# Helper to format raw markdown lines
def format_md_line(line):
    # Convert bold **text** to <b>text</b>
    line = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line)
    # Convert italic *text* to <i>text</i>
    line = re.sub(r'\*(.*?)\*', r'<i>\1</i>', line)
    # Replace markdown links [text](url) with just text (since they are printed)
    line = re.sub(r'\[(.*?)\]\(.*?\)', r'<b>\1</b>', line)
    return line.strip()

# Parsing a markdown file into Flowables
def parse_markdown_to_story(filepath):
    story_elements = []
    
    if not os.path.exists(filepath):
        print(f"Warning: File {filepath} not found.")
        return story_elements
        
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    in_table = False
    table_rows = []
    
    for line in lines:
        raw_line = line.strip()
        
        # Skip alert block lines like > [!NOTE] or similar
        if raw_line.startswith(">") and any(x in raw_line for x in ["[!", "NOTE", "IMPORTANT", "TIP", "WARNING"]):
            continue
        elif raw_line.startswith(">"):
            # Turn quote lines into standard paragraphs with block style
            quote_text = format_md_line(raw_line[1:])
            style_quote = ParagraphStyle(
                "QuoteStyle",
                parent=style_normal,
                leftIndent=15,
                textColor=HexColor("#475569"),
                fontName="Helvetica-Oblique",
                spaceBefore=6,
                spaceAfter=10
            )
            story_elements.append(Paragraph(quote_text, style_quote))
            continue
            
        # Parse Table Markdown Lines
        if raw_line.startswith("|"):
            in_table = True
            # Split items and ignore first/last elements as they are blank in table margins
            cols = [format_md_line(c) for c in raw_line.split("|")[1:-1]]
            
            # Skip delimiter rows (e.g. |:---|:---|)
            if all(set(c).issubset({'-', ':', ' '}) for c in cols):
                continue
                
            table_rows.append(cols)
            continue
        else:
            if in_table:
                # Table ended, build reportlab table
                if table_rows:
                    col_count = len(table_rows[0])
                    # Adjust column widths based on size
                    col_widths = [110] + [90] * (col_count - 1) if col_count > 1 else [500]
                    
                    # Convert cell text into Paragraph flowables to wrap correctly
                    style_th = ParagraphStyle("TH", parent=style_normal, fontName="Helvetica-Bold", fontSize=9, leading=12, alignment=TA_LEFT)
                    style_td = ParagraphStyle("TD", parent=style_normal, fontSize=8.5, leading=11, alignment=TA_LEFT)
                    
                    formatted_rows = []
                    for r_idx, row in enumerate(table_rows):
                        formatted_row = []
                        for col in row:
                            cell_style = style_th if r_idx == 0 else style_td
                            formatted_row.append(Paragraph(col, cell_style))
                        formatted_rows.append(formatted_row)
                        
                    t = Table(formatted_rows, colWidths=col_widths)
                    t.setStyle(TableStyle([
                        ('BACKGROUND', (0,0), (-1,0), COLOR_DARK_BLUE),
                        ('TEXTCOLOR', (0,0), (-1,0), white),
                        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                        ('TOPPADDING', (0,0), (-1,-1), 8),
                        ('LEFTPADDING', (0,0), (-1,-1), 8),
                        ('RIGHTPADDING', (0,0), (-1,-1), 8),
                        ('GRID', (0,0), (-1,-1), 0.5, HexColor("#CBD5E1")),
                        ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, BG_LIGHT]),
                        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ]))
                    t.hAlign = 'LEFT'
                    story_elements.append(t)
                    story_elements.append(Spacer(1, 10))
                table_rows = []
                in_table = False

        if not raw_line:
            continue
            
        # Parse Headers
        if raw_line.startswith("# "):
            text = format_md_line(raw_line[2:])
            story_elements.append(Paragraph(text, style_h1))
        elif raw_line.startswith("## "):
            text = format_md_line(raw_line[3:])
            story_elements.append(Paragraph(text, style_h2))
        elif raw_line.startswith("### "):
            text = format_md_line(raw_line[4:])
            story_elements.append(Paragraph(text, style_h3))
        # Parse Bullets
        elif raw_line.startswith("- ") or raw_line.startswith("* "):
            text = format_md_line(raw_line[2:])
            story_elements.append(Paragraph(f"<bullet>•</bullet>{text}", style_bullet))
        elif raw_line.startswith("1. ") or raw_line.startswith("2. ") or raw_line.startswith("3. ") or raw_line.startswith("4. ") or raw_line.startswith("5. "):
            text = format_md_line(raw_line[3:])
            story_elements.append(Paragraph(f"<bullet>{raw_line[:2]}</bullet>{text}", style_bullet))
        # Parse regular Paragraphs
        else:
            text = format_md_line(raw_line)
            story_elements.append(Paragraph(text, style_normal))
            
    return story_elements

def build_consolidated_dossier(pdf_path):
    doc = SimpleDocTemplate(pdf_path, pagesize=A4,
                            rightMargin=45, leftMargin=45,
                            topMargin=54, bottomMargin=54)
    story = []
    
    # 1. --- COVER PAGE ---
    story.append(Spacer(1, 120))
    
    cover_title_style = ParagraphStyle(
        "CoverTitle",
        parent=styles['Heading1'],
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=34,
        textColor=COLOR_DARK_BLUE,
        alignment=TA_CENTER,
        spaceAfter=15
    )
    story.append(Paragraph("SOLUCIONES CONTABLES", cover_title_style))
    
    cover_subtitle_style = ParagraphStyle(
        "CoverSubtitle",
        parent=style_normal,
        fontSize=14,
        leading=18,
        textColor=COLOR_TEAL,
        alignment=TA_CENTER,
        spaceAfter=60
    )
    story.append(Paragraph("Dossier Técnico, Comercial y Legal para Estudios Contables", cover_subtitle_style))
    
    # Ornamental line
    line_table = Table([[""]], colWidths=[350])
    line_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 3, COLOR_TEAL),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    line_table.hAlign = 'CENTER'
    story.append(line_table)
    story.append(Spacer(1, 80))
    
    # Metadata block
    meta_style = ParagraphStyle("Meta", parent=style_normal, alignment=TA_CENTER, fontSize=11, leading=16)
    story.append(Paragraph("<b>Autor:</b> Matias VMP", meta_style))
    story.append(Paragraph("<b>Período Fiscal:</b> Año 2026", meta_style))
    story.append(Paragraph("<b>Localización:</b> Argentina", meta_style))
    
    story.append(Spacer(1, 140))
    story.append(Paragraph("TECNOLOGÍA DE VANGUARDIA EN CIENCIAS ECONÓMICAS", ParagraphStyle("CoverFooter", parent=style_normal, alignment=TA_CENTER, fontSize=9, textColor=HexColor("#64748B"))))
    
    story.append(PageBreak())
    
    # 2. --- CORE DOCUMENTS ---
    docs_to_parse = [
        ("1. BROCHURE DE VENTA", "/Users/matias/.gemini/antigravity/brain/9841eabe-bbdc-4636-8f07-5f4500e3e96b/brochure_comercial.md"),
        ("2. PROPUESTA Y PRESUPUESTO", "/Users/matias/.gemini/antigravity/brain/9841eabe-bbdc-4636-8f07-5f4500e3e96b/propuesta_presupuesto.md"),
        ("3. CONTRATO DE LICENCIA DE SERVICIO (SaaS)", "/Users/matias/.gemini/antigravity/brain/9841eabe-bbdc-4636-8f07-5f4500e3e96b/contrato_servicio.md"),
    ]
    
    for title, filepath in docs_to_parse:
        # Chapter header
        style_ch_title = ParagraphStyle(
            "ChapterTitle",
            parent=styles['Heading2'],
            fontName="Helvetica-Bold",
            fontSize=12,
            textColor=white,
            spaceBefore=0,
            spaceAfter=0
        )
        h_table = Table([[Paragraph(title, style_ch_title)]], colWidths=[505])
        h_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), COLOR_TEAL),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
        ]))
        h_table.hAlign = 'CENTER'
        story.append(h_table)
        story.append(Spacer(1, 15))
        
        # Parse and inject markdown content
        chapter_story = parse_markdown_to_story(filepath)
        story.extend(chapter_story)
        
        # Insert page break between sections
        story.append(PageBreak())
        
    # Remove last empty page break
    if story and isinstance(story[-1], PageBreak):
        story.pop()
        
    # Custom Page Event to add header line & footers
    def on_page_event(canvas, doc):
        canvas.saveState()
        
        # Page borders/headers on all pages after cover
        if doc.page > 1:
            # Header line and text
            canvas.setFont('Helvetica-Bold', 8)
            canvas.setFillColor(COLOR_DARK_BLUE)
            canvas.drawString(45, A4[1] - 40, "Dossier Comercial y Legal — Soluciones Contables")
            
            canvas.setStrokeColor(COLOR_TEAL)
            canvas.setLineWidth(0.8)
            canvas.line(45, A4[1] - 46, A4[0] - 45, A4[1] - 46)
            
            # Footer line and text
            canvas.line(45, 45, A4[0] - 45, 45)
            
            canvas.setFont('Helvetica', 8)
            canvas.setFillColor(HexColor("#64748B"))
            canvas.drawString(45, 30, "Documento de uso confidencial y comercial")
            canvas.drawRightString(A4[0] - 45, 30, f"Página {doc.page}")
            
        canvas.restoreState()
        
    doc.build(story, onFirstPage=on_page_event, onLaterPages=on_page_event)
    print("PDF Successfully generated at:", pdf_path)

if __name__ == "__main__":
    desktop_pdf = "/Users/matias/Desktop/Dossier_Comercial_y_Legal_Soluciones_Contables.pdf"
    build_consolidated_dossier(desktop_pdf)
