import fitz
import os

pdf_path = r"c:\Users\DANE\Documents\GitHub\De-Margo-Interior-Contractors\public\assets\Blinds-Catalog.pdf"
doc = fitz.open(pdf_path)
print(f"Number of pages: {len(doc)}")
print("Metadata:")
for k, v in doc.metadata.items():
    print(f"  {k}: {v}")
