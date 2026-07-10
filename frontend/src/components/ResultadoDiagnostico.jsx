import React from 'react';
import { CLASES_TRANSLATION } from '../constants/classes';

/**
 * ResultadoDiagnostico Component
 * Muestra los resultados de la predicción devueltos por el backend
 * junto con la descripción y el tratamiento.
 */
export default function ResultadoDiagnostico({ resultado }) {
  // Vista en caso de no haber cargado ningún diagnóstico todavía
  if (!resultado) {
    return (
      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center min-h-[380px] w-full text-slate-500">
        <div className="p-4 bg-slate-900/40 rounded-full border border-slate-800/80 mb-4">
          <svg className="w-12 h-12 text-slate-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h3 className="text-slate-300 font-semibold text-lg">Esperando Diagnóstico</h3>
        <p className="text-sm max-w-xs mt-2 leading-relaxed">
          Selecciona el tipo de cultivo, sube una imagen clara de la hoja y haz clic en <strong>Diagnosticar Hoja</strong>.
        </p>
      </div>
    );
  }

  // Buscar los detalles de traducción y remediación correspondientes a la clase devuelta
  const info = CLASES_TRANSLATION[resultado.clase] || {
    name: resultado.clase,
    crop: resultado.cultivo,
    status: 'warning',
    description: 'Diagnóstico no indexado en nuestro glosario local. Consulta a un ingeniero agrónomo.',
    remediation: 'Revisar las condiciones de humedad y aplicar buenas prácticas fitosanitarias de carácter general.'
  };

  const porcentajeConfianza = (resultado.confianza * 100).toFixed(1);

  // Configuración de colores de severidad
  const configEstilos = {
    healthy: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/20 border-emerald-900/30',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      progress: 'bg-emerald-500',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      label: 'Sana (Óptimo)'
    },
    warning: {
      text: 'text-amber-400',
      bg: 'bg-amber-950/20 border-amber-900/30',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      progress: 'bg-amber-500',
      shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      label: 'Enfermedad detectada (Severidad Media)'
    },
    critical: {
      text: 'text-rose-400',
      bg: 'bg-rose-950/20 border-rose-900/30',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      progress: 'bg-rose-500',
      shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]',
      label: 'Enfermedad detectada (Severidad Alta)'
    }
  }[info.status];

  return (
    <div className={`glass-panel p-6 rounded-2xl flex flex-col gap-6 w-full border-t-2 ${configEstilos.bg} ${configEstilos.shadow} transition-all duration-500`}>
      
      {/* Cabecera y Severidad */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Resultado del Diagnóstico (IA)
          </span>
          <span className={`px-2.5 py-0.5 text-xs font-semibold border rounded-full ${configEstilos.badge}`}>
            {configEstilos.label}
          </span>
        </div>
        
        <h2 className={`text-2xl font-bold tracking-tight ${configEstilos.text}`}>
          {info.name}
        </h2>
        <p className="text-xs text-slate-400 -mt-1 font-medium">
          Cultivo: <span className="text-slate-200 capitalize">{resultado.cultivo}</span> • Código técnico: <code className="text-slate-300 bg-slate-900/60 px-1 py-0.5 rounded text-[11px]">{resultado.clase}</code>
        </p>
      </div>

      {/* Confianza (Métrica) */}
      <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col gap-2">
        <div className="flex justify-between items-baseline text-sm">
          <span className="text-slate-400">Confianza de predicción</span>
          <span className={`font-bold text-lg ${configEstilos.text}`}>
            {porcentajeConfianza}%
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${configEstilos.progress}`}
            style={{ width: `${porcentajeConfianza}%` }}
          ></div>
        </div>
      </div>

      {/* Descripción de la Enfermedad */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Descripción del Diagnóstico
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/25 p-3 rounded-lg border border-slate-850/50">
          {info.description}
        </p>
      </div>

      {/* Acciones recomendadas / Tratamiento */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          Medidas de Remediación Sugeridas
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/25 p-3 rounded-lg border border-slate-850/50">
          {info.remediation}
        </p>
      </div>
    </div>
  );
}
