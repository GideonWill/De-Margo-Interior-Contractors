import os
from PIL import Image

src_dir = r"c:\Users\DANE\Documents\GitHub\De-Margo-Interior-Contractors\public\assets\Blinds\pages"
thumb_dir = r"c:\Users\DANE\Documents\GitHub\De-Margo-Interior-Contractors\public\assets\Blinds\thumbnails"

os.makedirs(thumb_dir, exist_ok=True)

print("Starting compression...")
for f in os.listdir(src_dir):
    if not f.endswith(".jpg") and not f.endswith(".jpeg"):
        continue
    
    src_path = os.path.join(src_dir, f)
    thumb_path = os.path.join(thumb_dir, f)
    
    # Open image
    img = Image.open(src_path)
    
    # Save optimized page (resize to max 1200px width/height to keep high quality for lightbox)
    img_large = img.copy()
    img_large.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    img_large.save(src_path, "JPEG", quality=80, optimize=True)
    
    # Save thumbnail (max 400px for grid view)
    img_thumb = img.copy()
    img_thumb.thumbnail((400, 400), Image.Resampling.LANCZOS)
    img_thumb.save(thumb_path, "JPEG", quality=70, optimize=True)
    
    print(f"Compressed {f}: Large size is now {os.path.getsize(src_path)/1024:.1f} KB, Thumbnail is {os.path.getsize(thumb_path)/1024:.1f} KB")

print("Finished compression!")
