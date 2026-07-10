import React from 'react';
import { useDiagnostico } from './hooks/useDiagnostico';
import FormularioDiagnostico from './components/FormularioDiagnostico';
import ResultadoDiagnostico from './components/ResultadoDiagnostico';

/**
 * App Component
 * Orquesta la disposición general de la clínica agrícola de diagnóstico.
 */
export default function App() {
  const {
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
    reset
  } = useDiagnostico();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Barra de Navegación / Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🍃</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-500 bg-clip-text text-transparent">
                AgroIA Leaf Clinic
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Diagnóstico Fitosanitario de Precisión</p>
            </div>
          </div>
          <div className="text-slate-500 text-xs font-mono font-bold">
            v1.0.0
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* Banner descriptivo */}
        <div className="text-center md:text-left flex flex-col gap-2 max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
            Diagnóstico de hojas mediante Inteligencia Artificial
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Sube una fotografía en primer plano de una hoja sospechosa de tus cultivos de <strong className="text-emerald-400 font-semibold">Papa</strong> o <strong className="text-amber-500 font-semibold">Café</strong>. Nuestro modelo de aprendizaje profundo basado en <strong className="text-slate-200">MobileNetV2</strong> identificará la anomalía en segundos y te sugerirá acciones preventivas recomendadas.
          </p>
        </div>

        {/* Notificación de Error General si la API falla */}
        {error && (
          <div className="p-4 bg-rose-950/30 border border-rose-900/50 text-rose-300 text-sm rounded-xl flex items-start gap-3 animate-fade-in shadow-[0_4px_15px_rgba(239,68,68,0.1)]">
            <svg className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div>
              <span className="font-bold">Error en el análisis:</span> {error}
            </div>
          </div>
        )}

        {/* Grid de Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Panel de Entrada (Formulario) */}
          <div className="flex flex-col gap-4">
            <FormularioDiagnostico
              cultivo={cultivo}
              setCultivo={setCultivo}
              preview={preview}
              onImageSelected={handleImageChange}
              onDiagnosticar={runDiagnostico}
              loading={loading}
              backendReady={backendReady}
              onReset={reset}
              onLoadSample={loadSampleImage}
            />
          </div>

          {/* Panel de Salida (Resultados) */}
          <div className="flex flex-col gap-4">
            <ResultadoDiagnostico resultado={resultado} />
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="border-t border-slate-900/80 bg-slate-950/40 py-6 text-center text-xs text-slate-500 font-medium">
        <p>© 2026 AgroIA Leaf Clinic. Clasificación por redes convolucionales entrenadas mediante Keras/TensorFlow.</p>
      </footer>
    </div>
  );
}
