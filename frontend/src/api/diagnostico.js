import axios from 'axios';

/**
 * Envía la imagen de la hoja y el cultivo seleccionado al backend.
 * Utiliza la ruta proxy configurada en Vite (/predict) para evitar problemas de CORS.
 * 
 * @param {File} imageFile Archivo de imagen subido por el usuario
 * @param {string} cultivo Identificador del cultivo ('papa' o 'cafe')
 * @returns {Promise<{cultivo: string, clase: string, confianza: number}>} Datos de predicción
 */
export const enviarDiagnostico = async (imageFile, cultivo) => {
  if (!imageFile) {
    throw new Error('Es necesario seleccionar una imagen de hoja.');
  }
  if (!cultivo || (cultivo !== 'papa' && cultivo !== 'cafe')) {
    throw new Error('Cultivo no especificado o inválido.');
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('cultivo', cultivo);

  try {
    const response = await axios.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Tiempo límite de 15 segundos para la llamada a modelos
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('No se pudo conectar con el servidor de diagnóstico. Por favor, asegúrate de que el backend esté encendido.');
  }
};

/**
 * Comprueba el estado de conexión con el backend Flask.
 * 
 * @returns {Promise<boolean>} True si responde 'ok', False de lo contrario.
 */
export const verificarConexionBackend = async () => {
  try {
    const response = await axios.get('/health', { timeout: 3000 });
    return response.data && response.data.status === 'ok';
  } catch {
    return false;
  }
};
