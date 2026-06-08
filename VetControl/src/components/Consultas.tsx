import React, { useState } from 'react';
import { Pet, Consultation, HistoryEvent } from '../types';
import { AlertTriangle, History, CheckCircle, Search, User, Award, Activity, Heart, Clock, Printer, Save } from 'lucide-react';

interface ConsultasProps {
  pets: Pet[];
  consultations: Consultation[];
  currentSubTab: string; // 'nueva' | 'activa' | 'triage'
  onAddHistoryEvent: (event: HistoryEvent) => void;
  onNavigate: (tab: string, sub?: string) => void;
  onUpdatePet: (pet: Pet) => void;
}

export default function Consultas({ pets, consultations, currentSubTab, onAddHistoryEvent, onNavigate, onUpdatePet }: ConsultasProps) {
  const [subTab, setSubTab] = useState<'nueva' | 'activa' | 'triage'>(
    (currentSubTab as 'nueva' | 'activa' | 'triage') || 'nueva'
  );

  // Active state / Form states for "Paciente en Consulta" / "Nueva Consulta Médica"
  const [selectedPet, setSelectedPet] = useState<Pet>(pets[0]); // Default to Max
  const [motivo, setMotivo] = useState('Cojera en pata trasera derecha, inapetencia.');
  const [diagnostico, setDiagnostico] = useState('Cojera leve de ligamento cruzado craneal posterior.');
  const [tratamiento, setTratamiento] = useState('Reposo absoluto, antiinflamatorios meloxicam por 5 días.');
  const [weight, setWeight] = useState('32.5');
  const [temperature, setTemperature] = useState('38.6');
  const [selectedServices, setSelectedServices] = useState<string[]>(['Vacunación']);
  const [vetResponsable, setVetResponsable] = useState('Dr. Ricardo Méndez');
  const [triageLevel, setTriageLevel] = useState<'ALTA' | 'MEDIA' | 'BAJA'>('ALTA');
  const [symptoms, setSymptoms] = useState('Dificultad respiratoria, jadeo excesivo, mucosas pálidas...');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // States for Editing Patient Info
  const [isEditingPet, setIsEditingPet] = useState(false);
  const [editPetName, setEditPetName] = useState('');
  const [editPetSpecies, setEditPetSpecies] = useState('');
  const [editPetBreed, setEditPetBreed] = useState('');
  const [editPetAge, setEditPetAge] = useState(0);
  const [editPetAgeUnit, setEditPetAgeUnit] = useState<'Años' | 'Meses'>('Años');
  const [editPetOwnerName, setEditPetOwnerName] = useState('');
  const [editPetOwnerPhone, setEditPetOwnerPhone] = useState('');
  const [editPetStatus, setEditPetStatus] = useState<'En Diagnóstico' | 'En Recuperación' | 'Finalizado'>('En Diagnóstico');
  const [editPetWeight, setEditPetWeight] = useState(0);

  // Synchronize edit fields when selectedPet changes
  React.useEffect(() => {
    if (selectedPet) {
      setEditPetName(selectedPet.name);
      setEditPetSpecies(selectedPet.species);
      setEditPetBreed(selectedPet.breed);
      setEditPetAge(selectedPet.age);
      setEditPetAgeUnit(selectedPet.ageUnit || 'Años');
      setEditPetOwnerName(selectedPet.ownerName || '');
      setEditPetOwnerPhone(selectedPet.ownerPhone || '');
      setEditPetStatus(selectedPet.status || 'En Diagnóstico');
      setEditPetWeight(selectedPet.weight || 0);
    }
  }, [selectedPet]);

  // Synchronize selectedPet with changes in pets parent list
  React.useEffect(() => {
    const updatedSelected = pets.find(p => p.id === selectedPet.id);
    if (updatedSelected) {
      setSelectedPet(updatedSelected);
    }
  }, [pets]);

  const handleSavePetData = () => {
    if (!editPetName.trim()) {
      alert('El nombre del paciente no puede estar vacío.');
      return;
    }
    const updated: Pet = {
      ...selectedPet,
      name: editPetName,
      species: editPetSpecies,
      breed: editPetBreed,
      age: Number(editPetAge),
      ageUnit: editPetAgeUnit,
      ownerName: editPetOwnerName,
      ownerPhone: editPetOwnerPhone,
      status: editPetStatus,
      weight: Number(editPetWeight)
    };
    onUpdatePet(updated);
    setSelectedPet(updated);
    setIsEditingPet(false);
  };

  React.useEffect(() => {
    if (currentSubTab) {
      setSubTab(currentSubTab as 'nueva' | 'activa' | 'triage');
    }
  }, [currentSubTab]);

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter(s => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleApplyDiagnosisTag = (tag: string) => {
    setDiagnostico(prev => (prev ? prev + ' • ' + tag : tag));
  };

  const handleApplySymptomTag = (tag: string) => {
    setSymptoms(prev => (prev ? prev + ', ' + tag : tag));
  };

  const handleFinalizeInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('¡La consulta ha sido finalizada con éxito y guardada en el Historial Clínico!');

    // Inject history card! Representing section 4.1
    const newHistoryEvent: HistoryEvent = {
      id: `HIST-${Math.floor(100 + Math.random() * 900)}`,
      title: subTab === 'triage' ? 'Atención Urgente / Triage' : 'Consulta General / Diagnóstico',
      type: subTab === 'triage' ? 'emergency' : 'checkup',
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      status: 'Completado',
      petName: selectedPet.name,
      petBreed: selectedPet.breed,
      vetName: vetResponsable,
      notes: `Motivo: ${motivo || symptoms}. Diagnóstico: ${diagnostico || 'Evaluado en Triage urgente'}. Tratamiento: ${tratamiento || 'Estabilización de emergencia'}.`
    };

    onAddHistoryEvent(newHistoryEvent);

    setTimeout(() => {
      setSuccessMessage(null);
      onNavigate('historial');
    }, 2500);
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Visual Sub Navigation for Consultations flows */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setSubTab('nueva')}
          className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
            subTab === 'nueva' ? 'border-slate-900 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Nueva Consulta Médica (Formulario)
        </button>
        <button
          onClick={() => setSubTab('activa')}
          className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
            subTab === 'activa' ? 'border-slate-900 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Paciente en Consulta (Max)
        </button>
        <button
          onClick={() => setSubTab('triage')}
          className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
            subTab === 'triage' ? 'border-red-600 text-red-600 font-bold' : 'border-transparent text-slate-500 hover:text-red-500'
          }`}
        >
          🚑 Registro de Urgencias (Triaje)
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-900 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
          <span className="font-semibold text-sm">{successMessage}</span>
        </div>
      )}

      {/* VIEW 1: NUEVA CONSULTA MÉDICA (Recreates Screenshot 6) */}
      {subTab === 'nueva' && (
        <form onSubmit={handleFinalizeInquiry} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between card-head shrink-0 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/60 mb-2">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 block font-mono">ID de Seguimiento: REG-8842</span>
              <h2 className="text-xl font-bold text-slate-950 mt-0.5">Ingresar Nueva Ficha de Consulta</h2>
              <p className="text-xs text-slate-500 mt-0.5">Complete los detalles para registrar un nuevo expediente clínico.</p>
            </div>
            <div className="mt-2.5 sm:mt-0 font-bold text-xs text-blue-900 bg-blue-100 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>Estado: Pendiente</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side: Information Panels */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Patient Identity */}
              <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                    📁 Información del Paciente
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingPet) {
                        setEditPetName(selectedPet.name);
                        setEditPetSpecies(selectedPet.species);
                        setEditPetBreed(selectedPet.breed);
                        setEditPetAge(selectedPet.age);
                        setEditPetAgeUnit(selectedPet.ageUnit || 'Años');
                        setEditPetOwnerName(selectedPet.ownerName || '');
                        setEditPetOwnerPhone(selectedPet.ownerPhone || '');
                        setEditPetStatus(selectedPet.status || 'En Diagnóstico');
                        setEditPetWeight(selectedPet.weight || 0);
                      }
                      setIsEditingPet(!isEditingPet);
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1 transition-all outline-none cursor-pointer"
                  >
                    <span>✏️ {isEditingPet ? 'Cancelar Edición' : 'Editar Datos del Paciente'}</span>
                  </button>
                </div>
                
                {isEditingPet ? (
                  <div className="space-y-4 text-sm bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                    <p className="font-bold text-xs text-blue-800">Modo Edición Activo para {selectedPet.name}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Nombre de Mascota</label>
                        <input
                          type="text"
                          value={editPetName}
                          onChange={(e) => setEditPetName(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-950"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Especie</label>
                        <input
                          type="text"
                          value={editPetSpecies}
                          onChange={(e) => setEditPetSpecies(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-950"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Raza</label>
                        <input
                          type="text"
                          value={editPetBreed}
                          onChange={(e) => setEditPetBreed(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-950"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Edad</label>
                          <input
                            type="number"
                            value={editPetAge}
                            onChange={(e) => setEditPetAge(Number(e.target.value))}
                            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-950"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 font-semibold">Unidad</label>
                          <select
                            value={editPetAgeUnit}
                            onChange={(e) => setEditPetAgeUnit(e.target.value as 'Años' | 'Meses')}
                            className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-950 font-semibold"
                          >
                            <option value="Años">Años</option>
                            <option value="Meses">Meses</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 font-sans">
                        <label className="text-xs font-bold text-slate-700">Nombre de Dueño/a</label>
                        <input
                          type="text"
                          value={editPetOwnerName}
                          onChange={(e) => setEditPetOwnerName(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-950"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Teléfono Dueño</label>
                        <input
                          type="text"
                          value={editPetOwnerPhone}
                          onChange={(e) => setEditPetOwnerPhone(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-950"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Estado Clínico</label>
                        <select
                          value={editPetStatus}
                          onChange={(e) => setEditPetStatus(e.target.value as any)}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-950"
                        >
                          <option value="En Diagnóstico">En Diagnóstico</option>
                          <option value="En Recuperación">En Recuperación</option>
                          <option value="Finalizado">Finalizado</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Peso (kg)</label>
                        <input
                          type="number"
                          step={0.1}
                          value={editPetWeight}
                          onChange={(e) => setEditPetWeight(Number(e.target.value))}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-950"
                        />
                      </div>

                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleSavePetData}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer outline-none"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>✓ Guardar Cambios de la Mascota</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">ID de Mascota</label>
                      <select
                        value={selectedPet.id}
                        onChange={(e) => {
                          const p = pets.find(x => x.id === e.target.value);
                          if (p) setSelectedPet(p);
                        }}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      >
                        {pets.map(p => (
                          <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 font-semibold">Nombre</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={selectedPet.name} 
                        className="w-full h-11 px-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 outline-none" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 font-semibold">Especie</label>
                        <input 
                          type="text" 
                          readOnly 
                          value={selectedPet.species} 
                          className="w-full h-11 px-4 bg-slate-100 border border-slate-205 rounded-xl text-slate-550 outline-none" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 font-semibold">Raza</label>
                        <input 
                          type="text" 
                          readOnly 
                          value={selectedPet.breed} 
                          className="w-full h-11 px-4 bg-slate-100 border border-slate-205 rounded-xl text-slate-550 outline-none" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 font-semibold">Edad</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={`${selectedPet.age} ${selectedPet.ageUnit}`} 
                        className="w-full h-11 px-4 bg-slate-100 border border-slate-205 rounded-xl text-slate-550 outline-none" 
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Reason & Diagnostico */}
              <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  🩺 Motivo de Consulta y Diagnóstico Inicial
                </h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Notas de Consulta / Síntomas</label>
                    <textarea 
                      rows={3}
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Describa los síntomas reportados por el dueño y la observación clínica inicial..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 text-slate-900 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Diagnóstico Preliminar</label>
                    <textarea 
                      rows={2}
                      value={diagnostico}
                      onChange={(e) => setDiagnostico(e.target.value)}
                      placeholder="Diagnóstico preliminar observado..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Requested Services */}
              <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  💉 Servicios Solicitados
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {[
                    { id: 'desparasitacion', label: 'Desparasitación', desc: 'Interna y externa' },
                    { id: 'vacunacion', label: 'Vacunación', desc: 'Refuerzo anual' },
                    { id: 'limpieza', label: 'Limpieza Dental', desc: 'Bajo sedación leve' },
                    { id: 'sangre', label: 'Examen de Sangre', desc: 'Perfil bioquímico completo' }
                  ].map(srv => {
                    const isChecked = selectedServices.includes(srv.label);
                    return (
                      <label 
                        key={srv.id} 
                        className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                          isChecked ? 'bg-blue-50/60 border-blue-550' : 'bg-slate-50 border-slate-150'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => toggleService(srv.label)}
                          className="mr-3.5 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-slate-800">{srv.label}</p>
                          <p className="text-slate-400 mt-0.5">{srv.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

            </div>

            {/* Right side: Assign and actions */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Assignment details panel */}
              <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  👤 Asignación
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">Veterinario Responsable</label>
                    <select
                      value={vetResponsable}
                      onChange={(e) => setVetResponsable(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    >
                      <option>Dr. Ricardo Méndez</option>
                      <option>Dra. Elena Martínez</option>
                      <option>Dr. Ricardo Espinoza</option>
                      <option>Dra. Marta Valle</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">Tiempo Estimado de Atención</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="45 min" 
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none" 
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between font-bold mb-1.5">
                      <span className="text-slate-500">Urgencia</span>
                      <span className="text-blue-600 uppercase">Normal</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-1/3"></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reference Dog image matched from screenshot 6 */}
              <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-44 bg-slate-50 relative">
                  <img 
                    alt="Patient Reference" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEWWmU4N1yyvZFaMZX5EZqpabgLFupjwmJNJ2saM7af6djI7JWGqPj94EyHdycRdxGdK1x3ukkDS6xGekwdsGqQwxaY_o0u4z185MI7-af0BbQZfLkzOP9m1yxd8XwNuTJ3ytMY-Otq7YW95y4qQJ4tZKKiK_yFR7OrElqV9NkmVWRUx4FxN7-CW1gGyAmBQf7Yvbe56r6zk80SUkK6z8se8B8-AX9U298Pw6enzoUTXWzxE8Qgjpkr_VY-tyQVx21W5cxaHQBkEvp" 
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-mono p-1 rounded">Foto de Referencia</div>
                </div>
                <div className="p-3 text-center text-xs text-slate-500 font-medium bg-slate-50 border-t border-slate-100">
                  Paciente: Beagle (Referencia del Expediente)
                </div>
              </section>

              {/* Actions submit */}
              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow transition-all active:scale-95 duration-100"
                >
                  <Save className="w-4 h-4" />
                  <span>Generar Ficha de Consulta</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('Imprimiendo ticket de ingreso a la clínica VetControl...')}
                  className="w-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors duration-150"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Comprobante de Inreso</span>
                </button>
              </div>

            </div>

          </div>
        </form>
      )}

      {/* VIEW 2: PACIENTE EN CONSULTA (Recreates Screenshot 4 - Max) */}
      {subTab === 'activa' && (
        <form onSubmit={handleFinalizeInquiry} className="space-y-6">
          <section className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1 flex-grow">
              <div className="flex items-center gap-1.5 text-xs text-green-750 font-bold bg-green-50 w-fit p-1 px-2.5 rounded-md">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                <span>PACIENTE EN CONSULTA</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-950 leading-tight">{selectedPet.name} - {selectedPet.breed}</h2>
              <p className="text-sm text-slate-500 font-semibold">{selectedPet.species}, {selectedPet.age} {selectedPet.ageUnit} • {selectedPet.weight || weight} kg • Propietario: {selectedPet.ownerName}</p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (isEditingPet) {
                    setEditPetName(selectedPet.name);
                    setEditPetSpecies(selectedPet.species);
                    setEditPetBreed(selectedPet.breed);
                    setEditPetAge(selectedPet.age);
                    setEditPetAgeUnit(selectedPet.ageUnit || 'Años');
                    setEditPetOwnerName(selectedPet.ownerName || '');
                    setEditPetOwnerPhone(selectedPet.ownerPhone || '');
                    setEditPetStatus(selectedPet.status || 'En Diagnóstico');
                    setEditPetWeight(selectedPet.weight || 0);
                  }
                  setIsEditingPet(!isEditingPet);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer outline-none"
              >
                <span>✏️ {isEditingPet ? 'Cancelar Edición' : 'Editar Paciente'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('historial')}
                className="flex items-center gap-1.5 border border-slate-205 text-slate-800 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm outline-none cursor-pointer"
              >
                <History className="w-4 h-4 text-slate-500" />
                <span>Ver Historial Anterior</span>
              </button>
            </div>
          </section>

          {isEditingPet && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 text-sm animate-fadeIn">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 font-sans">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  ✏️ Formulario: Editar Información del Paciente ({selectedPet.name})
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-800 p-1 px-2 rounded-md font-bold font-mono">ID: {selectedPet.id}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans font-medium">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Nombre de Mascota</label>
                  <input
                    type="text"
                    value={editPetName}
                    onChange={(e) => setEditPetName(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-950"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Especie</label>
                  <input
                    type="text"
                    value={editPetSpecies}
                    onChange={(e) => setEditPetSpecies(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-955"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Raza</label>
                  <input
                    type="text"
                    value={editPetBreed}
                    onChange={(e) => setEditPetBreed(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-955"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 font-semibold">Edad</label>
                    <input
                      type="number"
                      value={editPetAge}
                      onChange={(e) => setEditPetAge(Number(e.target.value))}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-955 font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 font-semibold">Unidad</label>
                    <select
                      value={editPetAgeUnit}
                      onChange={(e) => setEditPetAgeUnit(e.target.value as 'Años' | 'Meses')}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-955 font-medium"
                    >
                      <option value="Años">Años</option>
                      <option value="Meses">Meses</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 font-semibold font-sans">Nombre de Dueño/a</label>
                  <input
                    type="text"
                    value={editPetOwnerName}
                    onChange={(e) => setEditPetOwnerName(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-955"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 font-semibold">Teléfono Dueño</label>
                  <input
                    type="text"
                    value={editPetOwnerPhone}
                    onChange={(e) => setEditPetOwnerPhone(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-955"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 font-semibold">Estado Clínico</label>
                  <select
                    value={editPetStatus}
                    onChange={(e) => setEditPetStatus(e.target.value as any)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-955 font-medium"
                  >
                    <option value="En Diagnóstico">En Diagnóstico</option>
                    <option value="En Recuperación">En Recuperación</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 font-semibold">Peso (kg)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={editPetWeight}
                    onChange={(e) => setEditPetWeight(Number(e.target.value))}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-955"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSavePetData}
                  className="bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer outline-none"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>✓ Guardar Cambios de la Mascota</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Form widgets */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Motivo de Consulta Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono" htmlFor="motivo-consulta-text">
                  Motivo de Consulta
                </label>
                <textarea
                  id="motivo-consulta-text"
                  rows={2}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Cojera en pata trasera derecha, inapetencia..."
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900 outline-none"
                />
              </div>

              {/* Diagnóstico Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono" htmlFor="diagnostico-text">
                  Diagnóstico
                </label>
                <textarea
                  id="diagnostico-text"
                  rows={3}
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  placeholder="Describa el diagnóstico clínico detallado..."
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900 outline-none"
                />

                {/* Tags de inserción rápida matched from screenshot 4 */}
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {['General', 'Traumatología', 'Dermatología', 'Parasitismo', 'Gastrointestinal'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleApplyDiagnosisTag(tag)}
                      className="bg-green-50 hover:bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full border border-green-200/50 shrink-0 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tratamiento Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono" htmlFor="tratamiento-text">
                  Tratamiento prescrito
                </label>
                <textarea
                  id="tratamiento-text"
                  rows={3}
                  value={tratamiento}
                  onChange={(e) => setTratamiento(e.target.value)}
                  placeholder="Prescripción, dosis y recomendaciones de seguimiento..."
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900 outline-none"
                />
              </div>

            </div>

            {/* Sidebar / Alertas Clínicas */}
            <div className="md:col-span-4 space-y-6">
              
              <section className="bg-slate-55 border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">Alertas Médicas Críticas</h3>
                
                {/* Allergy block */}
                <div className="bg-red-50 border border-red-100/65 text-red-900 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold">Alergia: Penicilina</p>
                    <p className="text-red-700 mt-1 leading-normal">Reportado en la ficha clínica interna hace 2 meses.</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-150 text-xs">
                  <div className="flex justify-between py-2.5 font-medium">
                    <span className="text-slate-500">Último Peso Registrado:</span>
                    <span className="text-slate-950 font-bold">{weight} kg</span>
                  </div>
                  <div className="flex justify-between py-2.5 font-medium">
                    <span className="text-slate-500">Temperatura Actual:</span>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="text" 
                        value={temperature} 
                        onChange={(e) => setTemperature(e.target.value)}
                        className="w-14 h-6 text-right bg-transparent border-b border-slate-300 p-0 text-xs text-medium focus:ring-0 focus:outline-none"
                      />
                      <span>°C</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Submit panel sticky */}
              <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-2xl flex flex-col gap-2 shadow-sm text-center">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow transition-all duration-150 active:scale-95 text-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Finalizar Consulta Médica</span>
                </button>
                <span className="text-[10px] text-slate-400 italic">Los datos se sincronizarán con el historial automáticamente.</span>
              </div>

            </div>

          </div>
        </form>
      )}

      {/* VIEW 3: REGISTRO DE URGENCIAS / TRIAGE (Recreates Screenshot 5) */}
      {subTab === 'triage' && (
        <form onSubmit={handleFinalizeInquiry} className="space-y-6">
          <div className="flex flex-col gap-1 inline-head max-w-xl">
            <span className="text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1 font-mono">
              <span className="p-1 px-1.5 rounded bg-red-100 font-mono text-red-600 font-bold">🚨</span>
              ALTA PRIORIDAD / TRIAGE DE GUARDIA
            </span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight mt-1">Registro de Urgencias</h2>
            <p className="text-sm text-slate-500 leading-normal">
              Complete los datos críticos para iniciar el protocolo de triaje y activar la atención inmediata del equipo médico.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side: Patient selector and triage matrix */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Patient Selector */}
              <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Selección de Paciente</h3>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedPet.id}
                    onChange={(e) => {
                      const p = pets.find(x => x.id === e.target.value);
                      if (p) setSelectedPet(p);
                    }}
                    className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  >
                    {pets.map(p => (
                      <option key={p.id} value={p.id}>{p.id} - {p.name} ({p.breed})</option>
                    ))}
                  </select>
                </div>
              </section>

              {/* Triage Matrix */}
              <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Nivel de Triaje (Urgencia)</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* High Button */}
                  <button
                    type="button"
                    onClick={() => setTriageLevel('ALTA')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      triageLevel === 'ALTA'
                        ? 'border-red-600 bg-red-55/70 text-red-950 font-bold scale-[1.02]'
                        : 'border-slate-200 bg-transparent text-slate-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className="text-2xl mb-1 flex">⚠️</span>
                    <span className="text-xs font-bold">ALTA</span>
                  </button>

                  {/* Medium Button */}
                  <button
                    type="button"
                    onClick={() => setTriageLevel('MEDIA')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      triageLevel === 'MEDIA'
                        ? 'border-orange-550 bg-orange-55/70 text-orange-950 font-bold scale-[1.02]'
                        : 'border-slate-200 bg-transparent text-slate-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className="text-2xl mb-1 flex">❕</span>
                    <span className="text-xs font-bold">MEDIA</span>
                  </button>

                  {/* Low Button */}
                  <button
                    type="button"
                    onClick={() => setTriageLevel('BAJA')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      triageLevel === 'BAJA'
                        ? 'border-yellow-600 bg-yellow-55/70 text-yellow-950 font-bold scale-[1.02]'
                        : 'border-slate-200 bg-transparent text-slate-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className="text-2xl mb-1 flex">ℹ️</span>
                    <span className="text-xs font-bold font-semibold">BAJA</span>
                  </button>

                </div>
              </section>

            </div>

            {/* Right side: symptoms and quick trigger */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 flex-grow">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500 block font-mono" htmlFor="critical-symptoms">
                  Síntomas Críticos Detectados
                </label>
                <textarea
                  id="critical-symptoms"
                  rows={5}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dificultad respiratoria, convulsiones, sangrado..."
                />

                <div className="flex flex-wrap gap-2 pt-1.5">
                  {['Hemorragia', 'Convulsión', 'Disnea', 'Politrauma', 'Envenenamiento'].map(sym => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleApplySymptomTag(sym)}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
                    >
                      + {sym}
                    </button>
                  ))}
                </div>
              </section>

              <div className="space-y-2.5">
                <button
                  type="submit"
                  className="w-full bg-red-650 hover:bg-red-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 duration-100 text-sm tracking-wide"
                >
                  <span>📢 Activar Atención Urgente</span>
                </button>
                <p className="text-center text-[10px] text-slate-400 italic">Se notificará inmediatamente a todo el personal de guardia VetControl.</p>
              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-90 pt-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 text-xs leading-relaxed">
              <User className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900">Dueño Responsable</h4>
                <p className="text-slate-500 mt-0.5">Confirmar contacto de emergencia una vez estabilizado el paciente.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 text-xs leading-relaxed">
              <History className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900">Antecedentes Críticos</h4>
                <p className="text-slate-500 mt-0.5">Verificar alergias o cardipatías preexistentes en la base de datos.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 text-xs leading-relaxed">
              <Activity className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900">Cubiculo de Atención</h4>
                <p className="text-slate-500 mt-0.5">El sistema asignará quirófano o sala de choque automáticamente.</p>
              </div>
            </div>
          </div>
        </form>
      )}

    </div>
  );
}
