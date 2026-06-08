import React, { useState } from 'react';
import { TeamRole, ProjectPhase } from '../types';
import { Calendar, DollarSign, ListTodo, Users, CheckCircle, ChevronRight, Zap, Info, Play } from 'lucide-react';

interface PlanificacionProps {
  initialRoles: TeamRole[];
  initialPhases: ProjectPhase[];
}

export default function Planificacion({ initialRoles, initialPhases }: PlanificacionProps) {
  const [roles, setRoles] = useState<TeamRole[]>(initialRoles);
  const [phases, setPhases] = useState<ProjectPhase[]>(initialPhases);
  const [selectedPhase, setSelectedPhase] = useState<string>('Análisis');

  // Interactive rate updater for the budget calculator
  const handleRateChange = (roleName: string, rate: number) => {
    setRoles(prev => prev.map(r => r.role === roleName ? { ...r, hourlyRate: Number(rate) } : r));
  };

  // Interactive timeline shifter
  const handleShiftPhase = (phaseName: string, amount: number) => {
    setPhases(prev => prev.map(p => {
      if (p.name === phaseName) {
        const nextStart = Math.max(1, p.startWeek + amount);
        return { ...p, startWeek: nextStart };
      }
      return p;
    }));
  };

  // Calculate dynamic roll costs based on roles * hours * rate
  const totalInternalCost = roles.reduce((acc, curr) => acc + (curr.hourlyRate * curr.hoursNeeded * 10), 0);
  const phaseSumCost = phases.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header Planning section with IEEE 830 credentials */}
      <div className="flex flex-col gap-1 inline-head">
        <span className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1 font-mono">
          <Zap className="text-amber-500 w-3.5 h-3.5" />
          IEEE 830 - PROPUESTA DE PLANIFICACIÓN DEL SISTEMA
        </span>
        <h2 className="text-2xl font-bold text-slate-950 tracking-tight mt-1">Plan de Proyecto VetControl</h2>
        <p className="text-sm text-slate-500 leading-normal">
          Diseño e implementación bajo buenas prácticas PMI, distribuyendo fases secuenciales y paralelas para optimizar tiempos.
        </p>
      </div>

      {/* Top metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block font-mono">Presupuesto Proyecto</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">${phaseSumCost.toLocaleString('es-CL')} CLP</span>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">Basado en costos fijos de fase</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block font-mono">Costo Desarrollo Roles</span>
          <span className="text-xl font-bold text-blue-600 mt-1 block">${totalInternalCost.toLocaleString('es-CL')} CLP</span>
          <span className="text-[10px] text-green-600 font-medium block mt-1">▲ Tasa variable interactiva</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block font-mono">Plano de Fiabilidad</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">99% Correcto</span>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">Bajo margen de error de datos</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block font-mono">Disponibilidad</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">95% Horario</span>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">Acceso garantizado en jornada</span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: interactive WBS/EDT (Estructura de Desglose del Trabajo) */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2 font-mono">
            <ListTodo className="w-5 h-5 text-slate-900" />
            EDT (Desglose del Trabajo)
          </h3>
          
          <p className="text-xs text-slate-500 leading-normal">
            La Estructura de Desglose del Trabajo permite dividir el proyecto en tareas manejables para asignar responsabilidades claras de la clínica.
          </p>

          <div className="space-y-2.5">
            {phases.map((phase) => {
              const isSelected = selectedPhase === phase.name;
              return (
                <div 
                  key={phase.name}
                  onClick={() => setSelectedPhase(phase.name)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50/50 border-l-4 border-l-slate-900 border-slate-200 shadow-sm' 
                      : 'border-slate-200 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{phase.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">Fija</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>Duración: {phase.durationWeeks} Semanas</span>
                    <span className="font-bold text-slate-900">${phase.cost.toLocaleString('es-CL')} CLP</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected WBS Task list expansion */}
          {selectedPhase && (
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2.5 animate-fadeIn">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Entregables de {selectedPhase}:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 pl-1 list-disc list-inside leading-relaxed font-sans">
                {phases.find(p => p.name === selectedPhase)?.tasks.map((task, ix) => (
                  <li key={ix}>{task}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Right Side: Visual Gantt Chart & team roles calculator */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Visual Gantt Chart represented in custom grid */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2 font-mono">
              <Calendar className="w-5 h-5 text-slate-900" />
              Carta Gantt (Cronograma)
            </h3>

            <p className="text-xs text-slate-500 leading-normal">
              Representación de la planificación temporal. Se organizaron actividades de manera secuencial y paralela para reducir la duración.
            </p>

            {/* Gantt Matrix Grid */}
            <div className="space-y-3.5 pr-1 pt-2">
              {phases.map(phase => {
                const totalWeeks = 10;
                // calculate offset and width percentages
                const startPercent = ((phase.startWeek - 1) / totalWeeks) * 100;
                const widthPercent = (phase.durationWeeks / totalWeeks) * 100;

                return (
                  <div key={phase.name} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-800">
                      <span>{phase.name}</span>
                      <div className="flex gap-1.5 font-normal">
                        <button 
                          type="button" 
                          onClick={() => handleShiftPhase(phase.name, -1)}
                          className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded text-[9px] font-bold cursor-pointer"
                        >
                          ◄
                        </button>
                        <span className="font-mono text-slate-500">Semana {phase.startWeek} (Duración {phase.durationWeeks}s)</span>
                        <button 
                          type="button" 
                          onClick={() => handleShiftPhase(phase.name, 1)}
                          className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded text-[9px] font-bold cursor-pointer"
                        >
                          ►
                        </button>
                      </div>
                    </div>
                    {/* Progress Bar Track */}
                    <div className="w-full bg-slate-50 border border-slate-100 h-6 rounded-lg relative overflow-hidden flex items-center">
                      <div 
                        className="bg-slate-900 hover:bg-slate-800 h-full rounded transition-all duration-300 flex items-center justify-center text-white text-[9px] font-bold p-1 overflow-hidden shrink-0" 
                        style={{ marginLeft: `${startPercent}%`, width: `${widthPercent}%` }}
                      >
                        {phase.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-10 text-[9px] font-bold text-slate-400 border-t border-slate-100 pt-2 text-center font-mono">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i}>S{i+1}</span>
              ))}
            </div>
          </section>

          {/* Interactive Team Rates & roles panel */}
          <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2 font-mono">
              <Users className="w-5 h-5 text-slate-900" />
              Esquema de Roles y Tarifas
            </h3>
            
            <p className="text-xs text-slate-500 leading-normal">
              Defina el equipo de trabajo y ajuste el costo por hora para presupuestar los entregables del plan PMI.
            </p>

            <div className="space-y-3.5">
              {roles.map(r => (
                <div key={r.role} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border border-slate-150 rounded-xl gap-3 text-xs">
                  <div className="space-y-1 sm:max-w-[70%]">
                    <span className="font-bold text-slate-900">{r.role}</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{r.function}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center font-semibold">
                    <span className="text-slate-400 text-[11px] font-mono">CLP/Hr:</span>
                    <input 
                      type="number"
                      value={r.hourlyRate}
                      onChange={(e) => handleRateChange(r.role, Number(e.target.value))}
                      step={1000}
                      className="w-24 h-8 p-1 px-2 text-right border border-slate-200 rounded bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
