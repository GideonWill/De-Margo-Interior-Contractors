import fitz
import os

pdf_path = r"c:\Users\DANE\Documents\GitHub\De-Margo-Interior-Contractors\public\assets\Blinds-Catalog.pdf"
output_dir = r"c:\Users\DANE\Documents\GitHub\De-Margo-Interior-Contractors\public\assets\Blinds"

os.makedirs(os.path.join(output_dir, "pages"), exist_ok=True)
os.makedirs(os.path.join(output_dir, "extracted"), exist_ok=True)

doc = fitz.open(pdf_path)

print(f"Processing PDF: {pdf_path}")
print(f"Total pages: {len(doc)}")

# 1. Render pages as images (DPI 150 approx)
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    zoom = 2.0
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    page_img_path = os.path.join(output_dir, "pages", f"page_{page_num + 1:02d}.jpg")
    pix.save(page_img_path)
    print(f"Rendered and saved page {page_num + 1:02d}")

# 2. Extract embedded images
image_count = 0
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    image_list = page.get_images(full=True)
    for img_idx, img_info in enumerate(image_list):
        xref = img_info[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        img_name = f"image_p{page_num + 1:02d}_{img_idx + 1:02d}.{image_ext}"
        img_path = os.path.join(output_dir, "extracted", img_name)
        with open(img_path, "wb") as f:
            f.write(image_bytes)
        image_count += 1

print(f"Finished. Extracted {image_count} embedded images.")
