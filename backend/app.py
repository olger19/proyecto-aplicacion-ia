import os
import json
import io
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# Configuración inicial de Flask y CORS
app = Flask(__name__)
# Permitimos CORS para todos los orígenes en desarrollo, facilitando la conexión
CORS(app)

# Rutas base para los archivos de modelos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Carga de modelos y mapeo de clases al iniciar el servidor (se cargan una sola vez)
modelos = {}
clases = {}

try:
    print("Cargando modelo de papa...")
    modelos['papa'] = tf.keras.models.load_model(os.path.join(MODELS_DIR, 'modelo_papa.keras'))
    with open(os.path.join(MODELS_DIR, 'clases_papa.json'), 'r', encoding='utf-8') as f:
        clases['papa'] = json.load(f)
    print("Modelo de papa cargado correctamente.")
    
    print("Cargando modelo de café...")
    modelos['cafe'] = tf.keras.models.load_model(os.path.join(MODELS_DIR, 'modelo_cafe.keras'))
    with open(os.path.join(MODELS_DIR, 'clases_cafe.json'), 'r', encoding='utf-8') as f:
        clases['cafe'] = json.load(f)
    print("Modelo de café cargado correctamente.")
except Exception as e:
    print(f"Error crítico al cargar los modelos o clases: {e}")
    # No detenemos la ejecución de inmediato para permitir que Flask inicie y muestre el error en /health

@app.route('/health', methods=['GET'])
def health():
    """
    Endpoint de salud para comprobar el estado del servidor y la disponibilidad de los modelos.
    """
    estado_modelos = {k: (v is not None) for k, v in modelos.items()}
    if all(estado_modelos.values()) and len(estado_modelos) == 2:
        return jsonify({
            "status": "ok",
            "modelos_cargados": list(estado_modelos.keys())
        }), 200
    else:
        return jsonify({
            "status": "error",
            "message": "Uno o más modelos no se cargaron correctamente.",
            "estado_modelos": estado_modelos
        }), 500

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint para clasificar la imagen de una hoja de papa o café.
    """
    # 1. Validar el parámetro 'cultivo'
    # Puede venir en el form data o como query param
    cultivo = request.form.get('cultivo') or request.args.get('cultivo')
    if not cultivo:
        return jsonify({"error": "El parámetro 'cultivo' es obligatorio."}), 400
    
    cultivo = cultivo.strip().lower()
    if cultivo not in ['papa', 'cafe']:
        return jsonify({"error": "Cultivo inválido. Debe ser 'papa' o 'cafe'."}), 400

    # Verificar si el modelo solicitado está disponible
    if cultivo not in modelos or modelos[cultivo] is None:
        return jsonify({"error": f"El modelo para el cultivo '{cultivo}' no está disponible en este momento."}), 500

    # 2. Validar que venga una imagen en la petición
    if 'image' not in request.files:
        return jsonify({"error": "No se proporcionó ningún archivo de imagen bajo la clave 'image'."}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "El archivo de imagen seleccionado está vacío."}), 400

    try:
        # 3. Leer e intentar abrir la imagen con Pillow
        image_bytes = file.read()
        try:
            image = Image.open(io.BytesIO(image_bytes))
        except Exception:
            return jsonify({"error": "El archivo enviado no es una imagen válida."}), 400

        # 4. Preprocesamiento de la imagen
        # - Convertir a RGB (manejo de RGBA o escala de grises)
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # - Redimensionar a 224x224
        image = image.resize((224, 224))
        
        # - Convertir a array de numpy y agregar dimensión de lote (batch size)
        img_array = np.array(image, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)

        # - Aplicar la normalización específica de MobileNetV2 [-1, 1]
        img_preprocessed = preprocess_input(img_array)

        # 5. Ejecutar la predicción
        predictions = modelos[cultivo].predict(img_preprocessed)
        
        # Obtener clase predicha (argmax) y confianza
        pred_idx = int(np.argmax(predictions[0]))
        confianza = float(predictions[0][pred_idx])
        clase_predicha = clases[cultivo][pred_idx]

        # 6. Retornar los resultados en formato JSON
        return jsonify({
            "cultivo": cultivo,
            "clase": clase_predicha,
            "confianza": confianza
        }), 200

    except Exception as e:
        # Retornar error de servidor con mensaje claro si ocurre algún error inesperado
        return jsonify({
            "error": "Error interno del servidor durante el procesamiento de la predicción.",
            "detalle": str(e)
        }), 500

if __name__ == '__main__':
    # Ejecutar en el puerto 5000 en modo desarrollo
    app.run(debug=True, port=5000)
