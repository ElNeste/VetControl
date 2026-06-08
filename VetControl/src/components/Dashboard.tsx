import React from 'react';
import { InventoryItem, Pet, Consultation } from '../types';
import { AlertTriangle, Plus, ClipboardList, RefreshCw, BarChart2, Shield, Settings, Users, BookOpen, AlertCircle } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string, sub?: string) => void;
  inventory: InventoryItem[];
  pets: Pet[];
  consultations: Consultation[];
}

export default function Dashboard({ onNavigate, inventory, pets, consultations }: DashboardProps) {
  // Get critical inventory count
  const criticalItems = inventory.filter(item => item.status === 'Crítico');
  const alertCount = criticalItems.length;

  // Active mock consultations in progress
  const activeConsultationsSummary = [
    { name: 'Bruno', breed: 'Caniche', reason: 'Chequeo post-quirúrgico', vet: 'Dra. Martínez', urgency: 'Baja', badgeStyle: 'bg-green-100 text-green-800' },
    { name: 'Luna', breed: 'Siamés', reason: 'Dificultad respiratoria', vet: 'Dr. Espinoza', urgency: 'Urgente', badgeStyle: 'bg-red-100 text-red-800 font-bold animate-pulse' },
    { name: 'Max', breed: 'Golden Retriever', reason: 'Cojera leve / Inapetencia', vet: 'Dr. Ricardo Méndez', urgency: 'Normal', badgeStyle: 'bg-orange-100 text-orange-800' }
  ];

  // Recent patients
  const recentPatients = pets.slice(1, 4); // Milo, Kira, Simba

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Critical Stock Alert Banner matching screenshot 7 */}
      {alertCount > 0 && (
        <section className="bg-red-50 border border-red-100 text-red-900 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-10 h-10 shrink-0 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-red-900">Alerta de Stock Crítico / Mínimo</h4>
              <p className="text-xs text-red-700 mt-0.5">
                Hay {alertCount} insumo(s) (como {criticalItems.map(i => i.name).join(', ')}) que alcanzaron niveles mínimos. Requiere reposición.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('inventario')}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Ver Detalles
          </button>
        </section>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-slate-950 tracking-tight">Panel de Control</h2>
          <p className="text-sm text-slate-500">Resumen operativo e ingenieril de la clínica - {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => onNavigate('consultas', 'nueva')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 duration-100"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Consulta</span>
          </button>
          <button
            onClick={() => onNavigate('planificacion')}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Ver Planificación EDT/Gantt</span>
          </button>
        </div>
      </div>

      {/* Grid: Triage/Suministros + Consultas en Curso */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inventario Crítico & Plan de Fiabilidad Summary */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="p-1 px-1.5 bg-blue-50 text-blue-600 rounded font-mono text-sm">✓</span>
              Inventario Clínico Crítico
            </h3>
            <span className="bg-red-50 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{alertCount} Alertas</span>
          </div>

          <div className="space-y-3">
            {inventory.slice(0, 3).map((item, idx) => (
              <div 
                key={item.sku} 
                className={`flex items-center justify-between p-3.5 rounded-xl border-l-4 ${
                  item.status === 'Crítico' 
                    ? 'bg-red-50/60 border-red-500' 
                    : item.status === 'Mínimo'
                    ? 'bg-amber-50/60 border-amber-500' 
                    : 'bg-green-50/60 border-green-500'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Stock: {item.stock} {item.unit}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {item.status === 'Crítico' ? (
                    <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-full font-bold">Crítico</span>
                  ) : item.status === 'Mínimo' ? (
                    <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">Mínimo</span>
                  ) : (
                    <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-bold">Óptimo</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Core system attributes as requested in text */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-1">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2 mb-2 flex items-center gap-1">
              <Shield className="w-4 h-4 text-blue-600" />
              Atributos de Operación (IEEE 830)
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Fiabilidad:</span>
                <p className="font-semibold text-green-600">99% de tiempo </p>
              </div>
              <div>
                <span className="text-slate-500">Disponibilidad:</span>
                <p className="font-semibold text-green-600">95% h. laboral</p>
              </div>
              <div>
                <span className="text-slate-500">Mantenibilidad:</span>
                <p className="font-semibold text-blue-600">Revisión Mensual</p>
              </div>
              <div>
                <span className="text-slate-500">Portabilidad:</span>
                <p className="font-semibold text-blue-600">Windows & Web</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('inventario')}
            className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline text-left self-start"
          >
            Gestionar suministros e insumos →
          </button>
        </section>

        {/* Right Column: Consultas en Curso table matched from screenshot 8 */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                Consultas Clínicas en Curso
              </h3>
              <span className="text-xs text-slate-500 font-medium">8 activas hoy</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-400 font-semibold">
                    <th className="py-2.5 pb-2">Paciente</th>
                    <th className="py-2.5 pb-2">Motivo</th>
                    <th className="py-2.5 pb-2">Veterinario</th>
                    <th className="py-2.5 pb-2 text-center">Prioridad</th>
                    <th className="py-2.5 pb-2 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {activeConsultationsSummary.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800">{item.name} <span className="text-slate-400 font-normal">({item.breed})</span></td>
                      <td className="py-3 text-slate-600 truncate max-w-[150px]">{item.reason}</td>
                      <td className="py-3 text-slate-500 font-medium">{item.vet}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.badgeStyle}`}>
                          {item.urgency}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => onNavigate('consultas', 'activa')}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                        >
                          Atender
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-150 flex justify-between items-center bg-blue-50/50 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-slate-700">¿Llegó una urgencia médica crítica?</span>
            </div>
            <button
              onClick={() => onNavigate('consultas', 'triage')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shrink-0 transition-colors"
            >
              Registrar Triage Urgencias
            </button>
          </div>
        </section>
      </div>

      {/* Grid: Accesos Rápidos */}
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Accesos Rápidos del Sistema</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <button 
          onClick={() => onNavigate('mascotas')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:shadow transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center transition-transform group-hover:scale-105">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-semibold">Gestión Pacientes</span>
        </button>

        <button 
          onClick={() => alert('Módulo de Facturación: Se integra con el software del SII para facturar las atenciones e insumos del inventario.')}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:bg-slate-50 transition-all text-center group shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 transition-transform group-hover:scale-105">
            <ClipboardList className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-slate-800">Facturación ($)</span>
        </button>

        <button 
          onClick={() => onNavigate('planificacion')}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:bg-slate-50 transition-all text-center group shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 transition-transform group-hover:scale-105">
            <BarChart2 className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-slate-800">Gantt & Planificación</span>
        </button>

        <button 
          onClick={() => alert('Ajustes del Sistema VetControl: Permisos de roles para Analistas, Desarrolladores, Testers y Jefe de Proyecto.')}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:bg-slate-50 transition-all text-center group shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 transition-transform group-hover:scale-105">
            <Settings className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-slate-800">Configuración</span>
        </button>
      </div>

      {/* Grid: Pacientes Recientes & Estado con Bento Details */}
      <section className="bg-slate-50 rounded-3xl p-6 mt-2 border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Pacientes Recientemente Atendidos o Registrados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPatients.map((patient) => (
            <div 
              key={patient.id} 
              className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 items-center hover:shadow-sm hover:border-blue-500/30 transition-all cursor-pointer"
              onClick={() => onNavigate('mascotas')}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                <img 
                  alt={patient.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  src={patient.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop'} 
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm">{patient.name}</h4>
                <p className="text-xs text-slate-500">{patient.species} • {patient.breed}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className={`w-1 bg-transparent border-l-4 ${
                    patient.status === 'En Diagnóstico' 
                      ? 'border-blue-500' 
                      : patient.status === 'En Recuperación'
                      ? 'border-green-500'
                      : 'border-slate-400'
                  } h-3 block`}></span>
                  
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    patient.status === 'En Diagnóstico' 
                      ? 'text-blue-700' 
                      : patient.status === 'En Recuperación'
                      ? 'text-green-700'
                      : 'text-gray-500'
                  }`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
