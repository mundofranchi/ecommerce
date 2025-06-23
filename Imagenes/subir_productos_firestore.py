import pandas as pd
import base64
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from PIL import Image
from io import BytesIO

# --- CONFIG ---
EXCEL_FILENAME = "Listado de productos - Lanzamiento.xlsx"
SERVICE_ACCOUNT_FILE = "../serviceAccountKey.json"
COLECCION = "productos"
# --------------

# Iniciar Firebase
cred = credentials.Certificate(SERVICE_ACCOUNT_FILE)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Leer Excel
df = pd.read_excel(EXCEL_FILENAME).fillna("")

# Función para convertir imagen a base64
def img_a_base64(nombre_archivo):
    if not nombre_archivo or not os.path.isfile(nombre_archivo):
        return None
    try:
        img = Image.open(nombre_archivo)
        img = img.convert("RGB")
        img.thumbnail((800, 800))  # Redimensionar si es muy grande
        buffer = BytesIO()
        img.save(buffer, format="JPEG", quality=60)  # Comprimir
        return base64.b64encode(buffer.getvalue()).decode("utf-8")
    except Exception as e:
        print(f"⚠️ Error procesando {nombre_archivo}: {e}")
        return None

# Procesar cada fila
for _, fila in df.iterrows():
    producto = {
        "codigo": str(fila["Codigo"]),
        "producto": str(fila["Producto"]),
        "marca": str(fila["Marca"]),
        "caracteristica": str(fila["Caracteristica"]),
        "costo": float(fila["Costo"]),
        "c_ganancia": float(fila["C GANANCIA"]),
        "csi_csi_cem": float(fila["6 CSI + csi_cem"]),
        "csi_cem": float(fila["csi_cem"]),
        "imagen1_base64": img_a_base64(str(fila["IMAGEN1"]).strip()),
        "imagen2_base64": img_a_base64(str(fila["IMAGEN2"]).strip()),
        "imagen3_base64": img_a_base64(str(fila["IMAGEN3"]).strip()),
        "stock": str(fila["Stock"]),
    }

    print(f"Subiendo {producto['codigo']}...")
    db.collection(COLECCION).document(producto["codigo"]).set(producto)
    print(f"✅ Subido {producto['codigo']}")

print("🔥 Todos los productos fueron subidos correctamente.")
