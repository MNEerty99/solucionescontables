#!/usr/bin/env python3
import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.colors import HexColor, white

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
    "PitchNormal",
    parent=styles['Normal'],
    alignment=TA_LEFT,
    fontSize=10.5,
    leading=16,
    textColor=TEXT_COLOR,
    spaceAfter=8
)

style_bullet = ParagraphStyle(
    "PitchBullet",
    parent=style_normal,
    leftIndent=20,
    firstLineIndent=-10,
    spaceAfter=6
)

style_h1 = ParagraphStyle(
    "PitchH1",
    parent=styles['Heading1'],
    fontSize=22,
    leading=26,
    textColor=COLOR_DARK_BLUE,
    fontName="Helvetica-Bold",
    spaceBefore=22,
    spaceAfter=14,
    keepWithNext=True
)

style_h2 = ParagraphStyle(
    "PitchH2",
    parent=styles['Heading2'],
    fontSize=14,
    leading=18,
    textColor=COLOR_TEAL,
    fontName="Helvetica-Bold",
    spaceBefore=16,
    spaceAfter=8,
    keepWithNext=True
)

style_h3 = ParagraphStyle(
    "PitchH3",
    parent=styles['Heading3'],
    fontSize=11,
    leading=15,
    textColor=COLOR_EMERALD,
    fontName="Helvetica-Bold",
    spaceBefore=12,
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

# Parsing pitch markdown into Flowables
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
        
        # Skip alert block lines or tags
        if raw_line.startswith(">") and any(x in raw_line for x in ["[!", "NOTE", "IMPORTANT", "TIP", "WARNING"]):
            continue
        elif raw_line.startswith(">"):
            # Turn quote lines into standard paragraphs with block style
            quote_text = format_md_line(raw_line[1:])
            style_quote = ParagraphStyle(
                "QuoteStyle",
                parent=style_normal,
                leftIndent=15,
                textColor=HexColor("#334155"),
                fontName="Helvetica-Oblique",
                spaceBefore=8,
                spaceAfter=12
            )
            story_elements.append(Paragraph(quote_text, style_quote))
            continue
            
        # Parse Table Markdown Lines
        if raw_line.startswith("|"):
            in_table = True
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
                    col_widths = [150] + [160] * (col_count - 1) if col_count > 1 else [470]
                    
                    style_th = ParagraphStyle("TH", parent=style_normal, fontName="Helvetica-Bold", fontSize=9.5, leading=13, alignment=TA_LEFT, textColor=white)
                    style_td = ParagraphStyle("TD", parent=style_normal, fontSize=9, leading=12, alignment=TA_LEFT)
                    
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

def build_pitch_pdf(md_path, pdf_path):
    doc = SimpleDocTemplate(pdf_path, pagesize=A4,
                            rightMargin=54, leftMargin=54,
                            topMargin=54, bottomMargin=54)
    story = []
    
    # Ornamental header block
    story.append(Spacer(1, 10))
    style_meta_header = ParagraphStyle("MetaHeader", parent=style_normal, fontSize=9, textColor=COLOR_TEAL, alignment=TA_CENTER)
    story.append(Paragraph("<b>SOLUCIONES CONTABLES — VMP STUDIO 2026</b>", style_meta_header))
    story.append(Spacer(1, 15))
    
    # Parse and inject markdown content
    pitch_story = parse_markdown_to_story(md_path)
    story.extend(pitch_story)
    
    # Custom Page Event for headers & footers
    def on_page_event(canvas, doc):
        canvas.saveState()
        
        # Header line and text
        canvas.setFont('Helvetica-Bold', 7.5)
        canvas.setFillColor(COLOR_DARK_BLUE)
        canvas.drawString(54, A4[1] - 35, "Pitch de Venta & ROI — SolucionesContables")
        
        canvas.setStrokeColor(COLOR_TEAL)
        canvas.setLineWidth(0.6)
        canvas.line(54, A4[1] - 40, A4[0] - 54, A4[1] - 40)
        
        # Footer line and text
        canvas.line(54, 45, A4[0] - 54, 45)
        
        canvas.setFont('Helvetica', 7.5)
        canvas.setFillColor(HexColor("#64748B"))
        canvas.drawString(54, 30, "Documento de Soporte de Ventas — Confidencial VMP S.A.S.")
        canvas.drawRightString(A4[0] - 54, 30, f"Página {doc.page}")
        
        canvas.restoreState()
        
    doc.build(story, onFirstPage=on_page_event, onLaterPages=on_page_event)
    print("PDF Successfully generated at:", pdf_path)

if __name__ == "__main__":
    md_source = "/Users/matias/.gemini/antigravity/brain/9841eabe-bbdc-4636-8f07-5f4500e3e96b/pitch_comercial_soluciones_contables.md"
    pdf_dest = "/Users/matias/Desktop/Pitch_Comercial_Soluciones_Contables.pdf"
    build_pitch_pdf(md_source, pdf_dest)
