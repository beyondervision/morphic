from pathlib import Path
import zipfile
import re

# Define base and input paths
base_dir = Path("/mnt/data/morphic")
base_dir.mkdir(parents=True, exist_ok=True)

index_html_path = Path("/mnt/data/morphic_index.html")
engine_js_path = Path("/mnt/data/morphic_engine.js")
status_json_path = Path("/mnt/data/status.json")
style_css_path = Path("/mnt/data/morphic_style.css")

# Define destination paths
dest_index = base_dir / "index.html"
dest_engine = base_dir / "engine.js"
dest_status = base_dir / "status.json"
dest_style = base_dir / "style.css"

# Copy the static files
dest_index.write_text(index_html_path.read_text(encoding="utf-8"), encoding="utf-8")
dest_status.write_text(status_json_path.read_text(encoding="utf-8"), encoding="utf-8")
dest_style.write_text(style_css_path.read_text(encoding="utf-8"), encoding="utf-8")

# Patch engine.js
engine_code = engine_js_path.read_text(encoding="utf-8")

c8_patch = """
function handleCellClick(i) {
    if (!isFieldActive) {
        logMessage("SYSTEM", "Veld is GELOCKT. Gebruik canonieke code.");
        return;
    }
    const cluster = FIELD_MAP[i].cluster || "Onbekend";
    const file = FIELD_MAP[i].file || "readme/UNKNOWN.md";
    const glyph = document.getElementById(`cell-${i}`)?.textContent.trim() || "?";

    logMessage(cluster, `Activatie Cel ${i} (Query gestart).`);
    const synapse = document.getElementById("synapse-content");
    if (synapse) {
        synapse.innerHTML = `Active Query: <strong>${cluster} - Cel ${i}</strong><br>Data Pad: <code>${file}</code>`;
    }
}
"""

if "function handleCellClick" in engine_code:
    engine_code = re.sub(r"function handleCellClick\s*\([^)]*\)\s*{[^}]*}", c8_patch.strip(), engine_code)
else:
    engine_code += "\n\n" + c8_patch.strip()

# Save the patched engine.js
dest_engine.write_text(engine_code, encoding="utf-8")

# Create zip of the morphic directory
zip_path = Path("/mnt/data/morphic_v2.4.3_C8_Ready.zip")
with zipfile.ZipFile(zip_path, 'w') as zipf:
    for file_path in [dest_index, dest_engine, dest_status, dest_style]:
        zipf.write(file_path, arcname=file_path.relative_to(base_dir.parent))

zip_path.name
