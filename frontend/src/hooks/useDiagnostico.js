import { useState, useEffect } from 'react';
import { enviarDiagnostico, verificarConexionBackend } from '../api/diagnostico';

/**
 * Hook personalizado para manejar todo el ciclo de vida del diagnóstico de hojas.
 * Proporciona estados reactivos y manejadores reutilizables.
 */
export const useDiagnostico = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cultivo, setCultivo] = useState('papa'); // 'papa' o 'cafe'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [backendReady, setBackendReady] = useState(null); // null (cargando), true o false

  // Efecto para verificar que el backend Flask esté en marcha
  useEffect(() => {
    let active = true;
    const comprobarConexion = async () => {
      const ready = await verificarConexionBackend();
      if (active) {
        setBackendReady(ready);
      }
    };

    comprobarConexion();

    // Verificación periódica cada 10 segundos
    const intervalId = setInterval(comprobarConexion, 10000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  /**
   * Manejador de cambio de archivo de imagen
   */
  const handleImageChange = (file) => {
    if (!file) return;

    // Liberar la URL de previsualización anterior si existe para evitar fugas de memoria
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResultado(null); // Limpiar resultado previo
    setError(null);     // Limpiar error previo
  };

  /**
   * Carga una imagen de prueba directamente desde la carpeta pública del frontend.
   * Útil para demostraciones y automatizaciones.
   * 
   * @param {string} tipo 'papa' o 'cafe'
   */
  const loadSampleImage = async (tipo) => {
    if (tipo !== 'papa' && tipo !== 'cafe') return;

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const url = tipo === 'papa' ? '/test_papa.png' : '/test_cafe.png';
      const filename = tipo === 'papa' ? 'test_papa.png' : 'test_cafe.png';

      // Petición fetch local a la carpeta public
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al descargar el archivo de muestra.');
      }
      
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'image/png' });

      // Actualizar estados
      setCultivo(tipo);
      handleImageChange(file);
    } catch (err) {
      setError('No se pudo cargar la imagen de muestra en el navegador: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Restablecer el estado a su valor inicial
   */
  const reset = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview(null);
    setResultado(null);
    setError(null);
  };

  /**
   * Ejecutar la petición de diagnóstico al backend
   */
  const runDiagnostico = async () => {
    if (!image) {
      setError('Debes cargar o arrastrar una imagen primero.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const data = await enviarDiagnostico(image, cultivo);
      setResultado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    image,
    preview,
    cultivo,
    setCultivo,
    loading,
    error,
    resultado,
    backendReady,
    handleImageChange,
    loadSampleImage,
    runDiagnostico,
    reset,
  };
};
