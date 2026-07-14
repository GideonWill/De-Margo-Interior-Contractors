import os
import re

app_jsx = r"c:\Users\DANE\Documents\GitHub\De-Margo-Interior-Contractors\src\App.jsx"
assets_dir = r"c:\Users\DANE\Documents\GitHub\De-Margo-Interior-Contractors\public"

with open(app_jsx, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all /assets/... paths in the code
assets = re.findall(r'["\']/assets/([^"\']+)["\']', content)
# deduplicate
assets = list(set(assets))

print("Sizes of assets referenced in App.jsx:")
results = []
for asset in assets:
    # URL decode
    clean_asset = asset.replace('%20', ' ')
    fp = os.path.join(assets_dir, "assets", clean_asset)
    if os.path.exists(fp):
        sz = os.path.getsize(fp)
        results.append((sz, clean_asset))
    else:
        # Check if the folder is just public/assets
        fp2 = os.path.join(assets_dir, clean_asset)
        if os.path.exists(fp2):
            sz = os.path.getsize(fp2)
            results.append((sz, clean_asset))
        else:
            print(f"File not found: {clean_asset} (checked {fp} and {fp2})")

results.sort(key=lambda x: x[0], reverse=True)
for sz, clean_asset in results:
    sz_mb = sz / (1024 * 1024)
    print(f"{sz_mb:7.2f} MB - {clean_asset}")
