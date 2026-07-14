import fitz

pdf_path = r"c:\Users\DANE\Documents\GitHub\De-Margo-Interior-Contractors\public\assets\Blinds-Catalog.pdf"
doc = fitz.open(pdf_path)

for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    text = page.get_text().strip()
    print(f"--- Page {page_num + 1} ---")
    print(text[:300] if text else "[No text]")
    print()
