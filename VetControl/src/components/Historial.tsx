import React, { useState } from 'react';
import { HistoryEvent } from '../types';
import { Search, Calendar, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle, Syringe, Heart } from 'lucide-react';

interface HistorialProps {
  history: HistoryEvent[];
}

export default function Historial({ history }: HistorialProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const filteredHistory = history.filter(event => {
    const matchesSearch = 
      event.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.vetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.notes && event.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = 
      selectedType === 'todos' || 
      (selectedType === 'vacuna' && event.type === 'vaccine') ||
      (selectedType === 'urgencia' && event.type === 'emergency') ||
      (selectedType === 'cirugia' && event.type === 'surgery') ||
      (selectedType === 'chequeo' && event.type === 'checkup');

    return matchesSearch && matchesType;
  });

  const toggleExpand = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccine':
        return <Syringe className="w-5 h-5 text-blue-600" />;
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 text-red-650" />;
      case 'surgery':
        return <CheckCircle2 className="w-5 h-5 text-amber-600" />;
      default:
        return <Heart className="w-5 h-5 text-slate-700" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine':
        return 'bg-blue-50 text-blue-900 border border-blue-100/60';
      case 'emergency':
        return 'bg-red-50 text-red-950 border border-red-100/60';
      case 'surgery':
        return 'bg-amber-50 text-amber-950 border border-amber-100/60';
      default:
        return 'bg-slate-50 text-slate-900 border border-slate-100/80';
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header section matched from screenshot 3 */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Historial Clínico de Atenciones</h2>
        <p className="text-sm text-slate-500">Consulta el registro cronológico completo de todas las atenciones médicas y cirugías.</p>
      </div>

      {/* Search and Filters matched from screenshot 3 */}
      <section className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Text Search Box */}
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por mascota, veterinario, vacuna o diagnóstico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 h-12 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-950 transition-all outline-none"
            />
          </div>

          {/* Quick Selectors Filter */}
          <div className="flex gap-2.5 shrink-0">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 h-12 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los Tipos</option>
              <option value="vacuna">Vacunas</option>
              <option value="urgencia">Urgencias</option>
              <option value="cirugia">Cirugías</option>
              <option value="chequeo">Chequeos</option>
            </select>

            <button 
              type="button"
              onClick={() => alert('Filtros de rango de fechas: VetControl permite buscar por rangos mensuales o anuales.')}
              className="px-4.5 h-12 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Rango</span>
            </button>
          </div>

        </div>
      </section>

      {/* Expandable chronological history cards matched from screenshot 3 */}
      <section className="space-y-4">
        
        {filteredHistory.map((event) => {
          const isExpanded = expandedEventId === event.id;
          return (
            <div 
              key={event.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-350 transition-colors flex flex-col gap-4 cursor-pointer"
              onClick={() => toggleExpand(event.id)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Visual badge and details */}
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getTypeColor(event.type)}`}>
                    {getTypeIcon(event.type)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
                      {event.date} • {event.time}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{event.title}</h3>
                    
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <span className="text-slate-700">Mascota: <strong className="text-slate-900">{event.petName} ({event.petBreed})</strong></span>
                      <span className="text-slate-500">Vet: <strong className="text-slate-800">{event.vetName}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Arrow & status */}
                <div className="flex items-center justify-between md:justify-end gap-3.5 border-t border-slate-100 md:border-t-0 pt-2 md:pt-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    event.type === 'emergency' 
                      ? 'bg-red-50 text-red-650' 
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {event.status}
                  </span>
                  <div className="p-1 px-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>

              </div>

              {/* Expansion Details Drawer */}
              {isExpanded && (
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 text-xs leading-relaxed text-slate-600 space-y-2 animate-fadeIn">
                  <p className="font-bold text-slate-800 border-b border-slate-150 pb-1.5 uppercase tracking-wider text-[10px] font-mono">Detalle Clínico de la Atención</p>
                  <p className="italic">"{event.notes || 'No se registraron notas adicionales en la consulta.'}"</p>
                  <div className="flex gap-2.5 pt-1">
                    <span className="p-1 px-2 bg-blue-50 text-blue-800 rounded text-[10px] font-semibold border border-blue-100/50">Copia Enviada a Dueño</span>
                    <span className="p-1 px-2 bg-slate-100 text-slate-800 rounded text-[10px] font-semibold border border-slate-200/55">Registro Permanente</span>
                  </div>
                </div>
              )}

            </div>
          );
        })}

        {filteredHistory.length === 0 && (
          <div className="py-12 bg-white text-center rounded-2xl text-slate-400 text-sm border border-slate-200">
            No se encontraron eventos clínicos con los filtros activos.
          </div>
        )}

      </section>

      {/* Load More Button matched from screenshot 3 */}
      <div className="flex justify-center pt-2">
        <button 
          onClick={() => alert('Cargando más registros históricos de la base de datos VetControl...')}
          className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-full border border-slate-200 transition-colors shadow-sm cursor-pointer"
        >
          Cargar más registros
        </button>
      </div>

    </div>
  );
}
