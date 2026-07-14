import os

assets_dir = r"c:\Users\DANE\Documents\GitHub\De-Margo-Interior-Contractors\public\assets"
print(f"Listing assets in: {assets_dir}")

all_files = []
for root, dirs, files in os.walk(assets_dir):
    for f in files:
        fp = os.path.join(root, f)
        sz = os.path.getsize(fp)
        rel = os.path.relpath(fp, assets_dir)
        all_files.append((sz, rel))

# Sort by size descending
all_files.sort(key=lambda x: x[0], reverse=True)

print("Top 30 Largest Assets:")
for sz, rel in all_files[:30]:
    sz_mb = sz / (1024 * 1024)
    print(f"{sz_mb:7.2f} MB - {rel}")
