# Diagnóstico de Enfermedades en Hojas de Papa y Café mediante IA

<div align="center">
  <span><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" /></span>
  <span><img src="https://img.shields.io/badge/Flask-%23000000.svg?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" /></span>
  <span><img src="https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white" alt="TensorFlow" /></span>
  <span><img src="https://img.shields.io/badge/Keras-%23D00000.svg?style=for-the-badge&logo=Keras&logoColor=white" alt="Keras" /></span>
  <span><img src="https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" /></span>
  <span><img src="https://img.shields.io/badge/Vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></span>
  <span><img src="https://img.shields.io/badge/Tailwind_CSS_v4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></span>
</div>

Este proyecto es una aplicación web fitosanitaria de precisión que permite cargar fotos de hojas de **Papa** y **Café**, clasificar su salud o identificar patologías específicas en segundos mediante modelos de Aprendizaje Profundo (Deep Learning), y proveer medidas de remediación agronómica recomendadas.

<p align="center">
  <img src="preview.png" alt="Vista previa de AgroIA Leaf Clinic" width="800" />
</p>

---

## 1. Contexto de la Solución y Técnica de IA

### 1.1 El Problema Fitosanitario
El diagnóstico oportuno de plagas y enfermedades en cultivos agrícolas es vital para asegurar la soberanía alimentaria y reducir pérdidas económicas. La aplicación automatiza este diagnóstico para dos cultivos esenciales:
*   **Papa (Solanum tuberosum):** Identifica *Tizón Temprano* (hongo *Alternaria solani*) y *Tizón Tardío* (oomiceto *Phytophthora infestans*).
*   **Café (Coffea arabica):** Identifica *Arañita Roja* (ácaro *Oligonychus coffeae*) y *Roya del Café* (hongo *Hemileia vastatrix*).

### 1.2 Datos de Entrenamiento
*   **Papa:** Subconjunto a color de **PlantVillage**, cubriendo hojas con Tizón Temprano, Tizón Tardío y hojas Sanas.
*   **Café:** Dataset **RoCoLe** (Robusta Coffee Leaf Images), cubriendo hojas Sanas, con Arañita Roja y con Roya.

### 1.3 Pipeline de IA y Selección de Técnica
Se compararon tres experimentos de modelado para seleccionar la arquitectura final en producción:
1.  **CNN desde cero (Baseline):** Una arquitectura convolucional básica que sirvió de línea de base pero presentó un alto riesgo de sobreajuste (overfitting) debido al tamaño acotado del dataset de café.
2.  **MobileNetV2 (Transfer Learning Puro):** Congelación total de los pesos preentrenados en ImageNet y entrenamiento exclusivo del clasificador final (Softmax). Demostró gran velocidad, pero faltó especificidad fina para las texturas de la roya y el tizón.
3.  **MobileNetV2 con Fine-Tuning (Últimas 20 capas):** **Seleccionado para Producción**. Se descongelaron las últimas 20 capas de la red base para adaptar los filtros convolucionales de más alto nivel a los gradientes cromáticos y texturas específicas de las hojas. Logró la mayor métrica de precisión (Accuracy y F1-Score) manteniendo la ligereza estructural característica de MobileNetV2 (~18 MB por modelo), óptima para despliegues locales y dispositivos ligeros.

---

## 2. Estructura del Repositorio
```text
proyecto-aplicacion-ia/
├── .gitignore                  # Exclusiones del control de versiones (virtualenv, node_modules)
├── README.md                   # Documentación principal del proyecto
├── .vscode/
│   └── settings.json           # Configuración para el editor del IDE
├── backend/
│   ├── app.py                  # Servidor Flask principal y lógica de inferencia
│   ├── requirements.txt        # Dependencias de Python
│   └── models/
│       ├── modelo_papa.keras   # Pesos de red MobileNetV2 (Papa)
│       ├── clases_papa.json    # Mapeo de índices a clases legibles
│       ├── modelo_cafe.keras   # Pesos de red MobileNetV2 (Café)
│       └── clases_cafe.json    # Mapeo de índices a clases legibles
└── frontend/
    ├── index.html              # HTML5 base y SEO
    ├── vite.config.js          # Configuración de Vite, Tailwind v4 y Proxy del API
    ├── package.json            # Configuración de Node y scripts
    └── src/
        ├── App.jsx             # Componente raíz y maquetado general del Dashboard
        ├── index.css           # Estilos globales y Tailwind CSS v4
        ├── api/
        │   └── diagnostico.js  # Cliente de peticiones HTTP (Axios)
        ├── constants/
        │   └── classes.js      # Diccionario fitosanitario y remedios agronómicos
        └── hooks/
            └── useDiagnostico.js # Lógica de carga de muestras y peticiones de diagnóstico
```

---

## 3. Instrucciones de Instalación y Ejecución

### Requisitos Previos
*   Python 3.10 o superior (Probado en Python 3.12.3)
*   Node.js v18 o superior (Probado en Node.js v22.18.0)

---

### Paso 3.1: Configurar e Iniciar el Backend (Flask)

1.  **Entra a la carpeta del backend y crea el entorno virtual:**
    ```bash
    cd backend
    python -m venv venv
    ```
2.  **Activa el entorno virtual:**
    *   **Windows (PowerShell):**
        ```powershell
        .\venv\Scripts\Activate.ps1
        ```
    *   **Mac/Linux:**
        ```bash
        source venv/bin/activate
        ```
3.  **Instala las dependencias necesarias:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Inicia el servidor Flask:**
    ```bash
    python app.py
    ```
    El servidor levantará en `http://localhost:5000` y cargará ambos modelos en memoria al arrancar. Puedes comprobar su estado abriendo `http://localhost:5000/health` en tu navegador.

---

### Paso 3.2: Configurar e Iniciar el Frontend (React + Vite + Tailwind v4)

1.  **Abre una nueva terminal en la raíz del proyecto, entra a la carpeta del frontend e instala dependencias:**
    ```bash
    cd frontend
    npm install
    ```
2.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
3.  **Acceso:**
    Abre tu navegador web en `http://localhost:5173`.

---

## 4. Funcionalidad de Demostración ("Prueba el demo")
Para simplificar la evaluación de la herramienta sin necesidad de descargar o buscar imágenes reales en la computadora, el formulario cuenta con botones de **Muestra de Papa** 🥔 y **Muestra de Café** ☕.
*   Al hacer clic sobre ellos, el navegador descarga localmente una imagen representativa preestablecida, refresca el preview e inicializa el selector.
*   Al pulsar **Diagnosticar Hoja**, el frontend envía los datos al proxy de Vite, que canaliza la consulta al backend Flask, procesando la imagen y devolviendo el diagnóstico en tiempo real.
