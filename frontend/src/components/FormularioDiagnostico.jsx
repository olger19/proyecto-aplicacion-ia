import React, { useRef, useState } from 'react';

/**
 * FormularioDiagnostico Component
 * Maneja la selección del cultivo, la subida de imágenes y el trigger de predicción.
 */
export default function FormularioDiagnostico({
  cultivo,
  setCultivo,
  preview,
  onImageSelected,
  onDiagnosticar,
  loading,
  backendReady,
  onReset,
  onLoadSample
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onImageSelected(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelected(files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 w-full">
      {/* Estado del Backend */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
        <span className="text-slate-400 font-medium">Estado del Servidor:</span>
        <div className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${
            backendReady === true ? 'bg-emerald-500 animate-pulse' :
            backendReady === false ? 'bg-rose-500' : 'bg-slate-500 animate-pulse'
          }`}></span>
          <span className={
            backendReady === true ? 'text-emerald-400 font-semibold' :
            backendReady === false ? 'text-rose-400 font-semibold' : 'text-slate-400'
          }>
            {backendReady === true ? 'En línea' :
             backendReady === false ? 'Fuera de línea' : 'Verificando conexión...'}
          </span>
        </div>
      </div>

      {/* Selector de Cultivo */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-slate-300">1. Selecciona el Cultivo</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            id="btn-crop-papa"
            onClick={() => setCultivo('papa')}
            disabled={loading}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
              cultivo === 'papa'
                ? 'border-emerald-500/80 bg-emerald-950/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-2xl">🥔</span>
            <div className="text-center">
              <div className="font-bold text-sm">Cultivo de Papa</div>
              <div className="text-[10px] opacity-70">Solanum tuberosum</div>
            </div>
          </button>

          <button
            type="button"
            id="btn-crop-cafe"
            onClick={() => setCultivo('cafe')}
            disabled={loading}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
              cultivo === 'cafe'
                ? 'border-amber-600 bg-amber-950/20 text-amber-300 shadow-[0_0_15px_rgba(217,119,6,0.1)]'
                : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-2xl">☕</span>
            <div className="text-center">
              <div className="font-bold text-sm">Cultivo de Café</div>
              <div className="text-[10px] opacity-70">Coffea arabica</div>
            </div>
          </button>
        </div>
      </div>

      {/* Subida de Imagen */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-slate-300">2. Sube la Foto de la Hoja</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={loading}
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!preview && !loading ? triggerFileSelect : undefined}
          className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
            preview ? 'border-slate-800 bg-slate-900/30' : 'cursor-pointer'
          } ${
            isDragOver ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/20'
          }`}
        >
          {preview ? (
            <div className="relative w-full h-full flex flex-col items-center gap-4">
              <img
                src={preview}
                alt="Vista previa de la hoja"
                className="max-h-48 rounded-lg object-contain border border-slate-700"
              />
              {!loading && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={triggerFileSelect}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 cursor-pointer"
                  >
                    Cambiar Imagen
                  </button>
                  <button
                    type="button"
                    onClick={onReset}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 rounded-lg transition-colors border border-rose-900/50 cursor-pointer"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-slate-850 text-emerald-400 rounded-full border border-slate-800 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Haz clic para subir o arrastra una imagen</p>
                <p className="text-xs text-slate-500 mt-1">Formatos admitidos: PNG, JPG, JPEG</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Muestras de prueba rápidas (Botones de Demo) */}
      {!preview && (
        <div className="flex flex-col gap-2.5 border-t border-slate-900 pt-4 animate-fade-in">
          <span className="text-xs font-semibold text-slate-400">¿No tienes fotos a la mano? Prueba el demo:</span>
          <div className="flex gap-3">
            <button
              type="button"
              id="btn-sample-papa"
              onClick={() => onLoadSample('papa')}
              disabled={loading}
              className="flex-1 py-2 px-3 text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded-lg text-slate-300 font-semibold cursor-pointer transition-all duration-200"
            >
              Muestra de Papa 🥔
            </button>
            <button
              type="button"
              id="btn-sample-cafe"
              onClick={() => onLoadSample('cafe')}
              disabled={loading}
              className="flex-1 py-2 px-3 text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded-lg text-slate-300 font-semibold cursor-pointer transition-all duration-200"
            >
              Muestra de Café ☕
            </button>
          </div>
        </div>
      )}

      {/* Botón de Diagnosticar */}
      <button
        type="button"
        id="btn-diagnosticar"
        onClick={onDiagnosticar}
        disabled={!preview || loading || backendReady !== true}
        className={`w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
          !preview || loading || backendReady !== true
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            : cultivo === 'papa'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.35)] cursor-pointer'
              : 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_4px_20px_rgba(217,119,6,0.25)] hover:shadow-[0_4px_25px_rgba(217,119,6,0.35)] cursor-pointer'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analizando hoja con IA...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <span>Diagnosticar Hoja</span>
          </>
        )}
      </button>

      {/* Advertencia si el servidor está caído */}
      {backendReady === false && (
        <div className="p-3.5 bg-rose-950/20 border border-rose-900/30 text-rose-300 text-xs rounded-xl flex items-start gap-2.5">
          <svg className="w-5 h-5 flex-shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <div>
            <span className="font-bold">Servidor desconectado:</span> Inicia el backend ejecutando <code className="bg-rose-950/50 px-1 py-0.5 rounded text-rose-200">python app.py</code> dentro de la carpeta <code className="bg-rose-950/50 px-1 py-0.5 rounded text-rose-200">backend</code> para habilitar los diagnósticos.
          </div>
        </div>
      )}
    </div>
  );
}
