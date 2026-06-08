import React, { useState } from 'react';
import { Pet } from '../types';
import { Plus, User, Heart, Phone, ArrowLeft, Check, Search } from 'lucide-react';

interface MascotasProps {
  pets: Pet[];
  onAddPet: (pet: Pet) => void;
}

export default function Mascotas({ pets, onAddPet }: MascotasProps) {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New pet form inputs
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('canino');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState<number>(3);
  const [edadUnit, setEdadUnit] = useState<'Años' | 'Meses'>('Años');
  const [nombreDueno, setNombreDueno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !raza || !nombreDueno || !telefono) {
      alert('Por favor complete todos los campos obligatorios (*)');
      return;
    }

    const newId = `PET-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPet: Pet = {
      id: newId,
      name: nombre,
      species: especie.charAt(0).toUpperCase() + especie.slice(1),
      breed: raza,
      age: Number(edad),
      ageUnit: edadUnit,
      ownerName: nombreDueno,
      ownerPhone: telefono,
      weight: especie === 'canino' ? 18.5 : 4.5, // estimate
      status: 'En Diagnóstico',
      image: especie === 'canino' 
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEWWmU4N1yyvZFaMZX5EZqpabgLFupjwmJNJ2saM7af6djI7JWGqPj94EyHdycRdxGdK1x3ukkDS6xGekwdsGqQwxaY_o0u4z185MI7-af0BbQZfLkzOP9m1yxd8XwNuTJ3ytMY-Otq7YW95y4qQJ4tZKKiK_yFR7OrElqV9NkmVWRUx4FxN7-CW1gGyAmBQf7Yvbe56r6zk80SUkK6z8se8B8-AX9U298Pw6enzoUTXWzxE8Qgjpkr_VY-tyQVx21W5cxaHQBkEvp'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1teZPy7yotLJQENDdzS8HRt6jfxg2acVfV0ld41XW_eByNh2h4IPhgRWO7T8RqKp2a-d3fSPJyLXtqc2a4dYwGGgATvkOnT0z4t3WwOryYhhShhdA94x4rmtcSD8DdNI81vypJvVQIl7-DRRKMXyCgljyopflj3CQ63Gkzrpd-XVy2GNJux1RHaf2Pq1PSSZoWPUwSQYIdOv7BXnImmiV01R3o7Zi176mfsqOZ1poLE2EFJnkeKnr5Sf40HLL4UTro6B2yTWZp62w'
    };

    onAddPet(newPet);
    setSuccessMsg(`¡Mascota ${nombre} (${newId}) registrada con éxito!`);
    
    // reset form
    setNombre('');
    setRaza('');
    setEdad(3);
    setNombreDueno('');
    setTelefono('');

    setTimeout(() => {
      setSuccessMsg(null);
      setViewMode('list');
    }, 2000);
  };

  const filteredPets = pets.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header section with toggle and title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-slate-950 tracking-tight">Registro de Pacientes Mascotas</h2>
          <p className="text-sm text-slate-500">Manejo y fichas clínicas de las mascotas registradas en la clínica.</p>
        </div>
        <div className="flex gap-2">
          {viewMode === 'list' ? (
            <button
              onClick={() => setViewMode('create')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all duration-150 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nueva Mascota</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('list')}
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Directorio</span>
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-900 p-4 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">{successMsg}</span>
        </div>
      )}

      {/* RENDER VIEW 1: Patient Directory */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 w-5 h-5" />
            <input 
              type="text"
              placeholder="Buscar por nombre de mascota, raza o dueño..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((p) => (
              <div 
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-500/50 transition-all flex flex-col justify-between hover:shadow"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shrink-0">
                    <img 
                      alt={p.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                      src={p.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop'} 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{p.id}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1b6d24]"></span>
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md hover:bg-green-100">{p.status}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.species} • {p.breed}</p>
                    <p className="text-xs text-slate-600 mt-0.5">Edad: {p.age} {p.ageUnit}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dueño:</span>
                    <span className="font-semibold text-slate-800">{p.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Teléfono:</span>
                    <span className="font-mono">{p.ownerPhone}</span>
                  </div>
                  {p.weight && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Peso:</span>
                      <span className="font-semibold">{p.weight} kg</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredPets.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400">
                Ninguna mascota coincide con tu búsqueda.
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER VIEW 2: Create / "Nueva Mascota" Form matched from screenshot 2 */}
      {viewMode === 'create' && (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          
          {/* Section 1: Información de la Mascota */}
          <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                🐾
              </div>
              <h3 className="font-bold text-base text-slate-900">Información de la Mascota</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nombre de Mascota <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Max" 
                  required
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                />
              </div>

              {/* Especie */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Especie <span className="text-red-500">*</span>
                </label>
                <select 
                  value={especie}
                  onChange={(e) => setEspecie(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-sans text-slate-900"
                >
                  <option value="canino">Canino</option>
                  <option value="felino">Felino</option>
                  <option value="ave">Ave</option>
                  <option value="exotico">Exótico</option>
                </select>
              </div>

              {/* Raza */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Raza <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                  placeholder="Ej: Golden Retriever" 
                  required
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                />
              </div>

              {/* Edad */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Edad <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input 
                     type="number" 
                     value={edad}
                     onChange={(e) => setEdad(Number(e.target.value))}
                     min={0}
                     placeholder="Ej: 3" 
                     required
                     className="flex-grow h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                  />
                  <select 
                    value={edadUnit}
                    onChange={(e) => setEdadUnit(e.target.value as 'Años' | 'Meses')}
                    className="w-28 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-sans text-slate-900"
                  >
                    <option value="Años">Años</option>
                    <option value="Meses">Meses</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Información del Dueño */}
          <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                👤
              </div>
              <h3 className="font-bold text-base text-slate-900">Información del Dueño</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nombre de Dueño */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nombre del Dueño <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={nombreDueno}
                  onChange={(e) => setNombreDueno(e.target.value)}
                  placeholder="Ej: María García" 
                  required
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                />
              </div>

              {/* Teléfono */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: +34 600 000 000" 
                  required
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                />
              </div>
            </div>
          </section>

          {/* Actions panel */}
          <div className="flex justify-end gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-6 py-3 border border-slate-200 text-slate-800 bg-white text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all active:scale-95 duration-100"
            >
              Cancelar
            </button>
            <button
               type="submit"
               className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow transition-all active:scale-95 duration-100"
            >
               💾 Guardar Registro
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
