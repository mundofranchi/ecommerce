import os
import base64
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import math

# === CONFIGURACIÓN FIREBASE ===
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Conectado a Firestore.")
except Exception as e:
    print("❌ Error al conectar con Firebase:", e)
    exit()

# === CARGAR EXCEL ===
EXCEL_PATH = "./subir/Listado de productos - 3.xlsx"
if not os.path.exists(EXCEL_PATH):
    print(f"❌ Archivo no encontrado: {EXCEL_PATH}")
    exit()

df = pd.read_excel(EXCEL_PATH)
print(f"📦 Productos encontrados: {len(df)}")

# === FUNCION PARA CONVERTIR IMAGEN A BASE64 ===
def img_to_base64(nombre_sin_extension, carpeta="subir"):
    if not nombre_sin_extension or not isinstance(nombre_sin_extension, str):
        return ""
    
    nombre_base = nombre_sin_extension.strip().lower()
    extensiones = [".jpg", ".jpeg", ".png", ".webp"]

    for ext in extensiones:
        path = os.path.join(carpeta, nombre_base + ext)
        if os.path.isfile(path):
            try:
                with open(path, "rb") as img_file:
                    return base64.b64encode(img_file.read()).decode("utf-8")
            except Exception as e:
                print(f"❌ Error leyendo imagen {path}: {e}")
                return ""

    print(f"⚠️ Imagen no encontrada: {nombre_sin_extension} (no se encontró con ninguna extensión)")
    return ""


# === RECORRER Y SUBIR ===
errores = []
for i, row in df.iterrows():
    try:
        doc_id = str(row["Codigo"]).strip()
        if not doc_id:
            raise ValueError("Código vacío")
        stock_val = row.get("Stock")
        imagen1 = img_to_base64(row.get("IMAGEN1", ""))
        imagen2 = img_to_base64(row.get("IMAGEN2", ""))

        data = {
            "codigo": doc_id,
            "producto": str(row.get("PRODUCTO", "")).strip(),
            "marca": str(row.get("Marca", "")).strip(),
            "caracteristica": str(row.get("Caracteristica", "")).strip(),
            "costo": int(row.get("Costo") or 0),
            "c_ganancia": int(row.get("C GANANCIA") or 0),
            "cem": float(row.get("CEM") or 0),
            "csi_cem": float(row.get("6 CSI + CEM") or 0),
            "imagen1_base64": imagen1,
            "imagen2_base64": imagen2,
            "stock": int(stock_val) if stock_val and not pd.isna(stock_val) else 0,
        }

        db.collection("productos").document(doc_id).set(data)
        print(f"✅ Subido: {doc_id} ({i+1}/{len(df)})")

    except Exception as err:
        print(f"❌ Error en fila {i+1} (codigo: {row.get('Codigo')}): {err}")
        errores.append((i+1, str(row.get("Codigo")), str(err)))

# === RESUMEN FINAL ===
print("\n📋 Proceso finalizado.")
print(f"✅ Productos subidos: {len(df) - len(errores)}")
if errores:
    print(f"❌ Errores encontrados: {len(errores)}")
    for fila, codigo, motivo in errores:
        print(f"   - Fila {fila} / Código {codigo} → {motivo}")
else:
    print("🎉 Sin errores.")
