#!/usr/bin/env python3
"""Generate sample invoice and receipt PDF files for the customer portal."""

import os
from datetime import datetime, timedelta
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT

# Create output directory
os.makedirs('backend/public/attachments', exist_ok=True)

def generate_invoice():
    """Generate a sample invoice PDF."""
    filename = 'backend/public/attachments/invoice.pdf'
    
    doc = SimpleDocTemplate(filename, pagesize=letter,
                          rightMargin=0.75*inch, leftMargin=0.75*inch,
                          topMargin=0.75*inch, bottomMargin=0.75*inch)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'],
                                fontSize=24, textColor=colors.HexColor('#667eea'),
                                spaceAfter=30, alignment=TA_CENTER)
    heading_style = ParagraphStyle('CustomHeading', parent=styles['Heading2'],
                                  fontSize=12, textColor=colors.black,
                                  spaceAfter=12)
    normal_style = styles['Normal']
    
    story = []
    
    # Header
    story.append(Paragraph('INVOICE', title_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Invoice details
    invoice_data = [
        ['Invoice Number:', 'INV-2025-001157', 'Invoice Date:', '2025-11-20'],
        ['Due Date:', '2025-12-04', 'Status:', 'Paid'],
    ]
    invoice_table = Table(invoice_data, colWidths=[1.2*inch, 1.5*inch, 1.2*inch, 1.5*inch])
    invoice_table.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, -1), 'Helvetica', 9),
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 9),
    ]))
    story.append(invoice_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Bill to section
    story.append(Paragraph('<b>BILL TO:</b>', heading_style))
    bill_to_data = [
        ['Name:', 'John Smith'],
        ['Email:', 'john.smith@example.com'],
        ['Phone:', '(555) 123-4567'],
        ['Address:', '123 Main Street, Springfield, IL 62701'],
    ]
    bill_table = Table(bill_to_data, colWidths=[1.5*inch, 3.5*inch])
    bill_table.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, -1), 'Helvetica', 9),
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 9),
    ]))
    story.append(bill_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Services
    story.append(Paragraph('<b>SERVICES:</b>', heading_style))
    services_data = [
        ['Description', 'Qty', 'Rate', 'Amount'],
        ['Plumbing Service - Leak Repair', '1', '₱150.00', '₱150.00'],
        ['Parts - Faucet Cartridge', '1', '₱45.00', '₱45.00'],
        ['Labor - 2 hours', '2', '₱50.00', '₱100.00'],
    ]
    services_table = Table(services_data, colWidths=[2.5*inch, 0.8*inch, 1*inch, 1*inch])
    services_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#667eea')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 10),
        ('FONT', (0, 1), (-1, -1), 'Helvetica', 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')]),
    ]))
    story.append(services_table)
    story.append(Spacer(1, 0.2*inch))
    
    # Totals
    totals_data = [
        ['Subtotal:', '₱295.00'],
        ['Tax (8%):', '₱23.60'],
        ['Total:', '₱318.60'],
    ]
    totals_table = Table(totals_data, colWidths=[4*inch, 1*inch])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONT', (0, 0), (-1, -2), 'Helvetica', 9),
        ('FONT', (0, -1), (-1, -1), 'Helvetica-Bold', 11),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#667eea')),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.white),
        ('TOPPADDING', (0, -1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 8),
    ]))
    story.append(totals_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Footer
    story.append(Paragraph('<i>Thank you for your business!</i>', ParagraphStyle('Footer', parent=normal_style, alignment=TA_CENTER, fontSize=9)))
    
    doc.build(story)
    print(f'✓ Generated {filename}')

def generate_receipt():
    """Generate a sample receipt PDF."""
    filename = 'backend/public/attachments/receipt.pdf'
    
    doc = SimpleDocTemplate(filename, pagesize=letter,
                          rightMargin=0.75*inch, leftMargin=0.75*inch,
                          topMargin=0.75*inch, bottomMargin=0.75*inch)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'],
                                fontSize=20, textColor=colors.HexColor('#667eea'),
                                spaceAfter=20, alignment=TA_CENTER)
    heading_style = ParagraphStyle('CustomHeading', parent=styles['Heading2'],
                                  fontSize=11, textColor=colors.black,
                                  spaceAfter=10)
    normal_style = styles['Normal']
    
    story = []
    
    # Header
    story.append(Paragraph('PAYMENT RECEIPT', title_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Receipt details
    receipt_data = [
        ['Receipt #:', 'REC-2025-001157', 'Date:', '2025-11-20'],
        ['Time:', '2:45 PM', 'Payment Method:', 'Credit Card'],
    ]
    receipt_table = Table(receipt_data, colWidths=[1.2*inch, 1.8*inch, 1.2*inch, 1.8*inch])
    receipt_table.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, -1), 'Helvetica', 9),
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 9),
    ]))
    story.append(receipt_table)
    story.append(Spacer(1, 0.25*inch))
    
    # Service information
    story.append(Paragraph('<b>SERVICE DETAILS:</b>', heading_style))
    service_data = [
        ['Service Type:', 'Plumbing Repair'],
        ['Service Date:', '2025-11-20'],
        ['Technician:', 'Mike Johnson'],
        ['Work Location:', '123 Main Street, Springfield, IL 62701'],
    ]
    service_table = Table(service_data, colWidths=[1.8*inch, 3.7*inch])
    service_table.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, -1), 'Helvetica', 9),
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 9),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(service_table)
    story.append(Spacer(1, 0.25*inch))
    
    # Payment breakdown
    story.append(Paragraph('<b>PAYMENT BREAKDOWN:</b>', heading_style))
    payment_data = [
        ['Amount:', '₱318.60'],
        ['Status:', 'PAID'],
    ]
    payment_table = Table(payment_data, colWidths=[2*inch, 2*inch])
    payment_table.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, -1), 'Helvetica', 10),
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 10),
        ('BACKGROUND', (1, 1), (1, 1), colors.HexColor('#c8e6c9')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(payment_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Footer
    story.append(Paragraph(
        '<i>Receipt generated on {}</i><br/><i>Thank you for your payment!</i>'.format(datetime.now().strftime('%B %d, %Y at %I:%M %p')),
        ParagraphStyle('Footer', parent=normal_style, alignment=TA_CENTER, fontSize=8, textColor=colors.grey)
    ))
    
    doc.build(story)
    print(f'✓ Generated {filename}')

if __name__ == '__main__':
    print('Generating sample PDF documents...')
    generate_invoice()
    generate_receipt()
    print('✓ All documents generated successfully!')
