import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Search, Plus, Filter, Edit, CreditCard, Calendar, Truck, ArrowLeft, Check } from 'lucide-react';

interface InventarioProps {
  inventory: InventoryItem[];
  onUpdateInventoryItem: (item: InventoryItem) => void;
  onAddInventoryItem: (item: InventoryItem) => void;
}

export default function Inventario({ inventory, onUpdateInventoryItem, onAddInventoryItem }: InventarioProps) {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Create state inputs
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<'Vacunas' | 'Antibióticos' | 'Anestesia' | 'Material de Curación'>('Vacunas');
  const [stock, setStock] = useState<number>(10);
  const [unit, setUnit] = useState('u.');

  // Inline stock edit controls
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [editStockVal, setEditStockVal] = useState<number>(0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name) {
      alert('Por favor, complete SKU e Insumo');
      return;
    }

    let status: 'Crítico' | 'Mínimo' | 'Óptimo' = 'Óptimo';
    if (stock <= 5) status = 'Crítico';
    else if (stock <= 15) status = 'Mínimo';

    const newItem: InventoryItem = {
      sku: sku.toUpperCase(),
      name,
      category,
      stock,
      unit,
      status,
      icon: category === 'Vacunas' ? 'vaccines' : category === 'Anestesia' ? 'biotech' : category === 'Material de Curación' ? 'healing' : 'medical_services'
    };

    onAddInventoryItem(newItem);
    setName('');
    setSku('');
    setStock(10);
    setViewMode('list');
  };

  const startEditing = (item: InventoryItem) => {
    setEditingSku(item.sku);
    setEditStockVal(item.stock);
  };

  const handleUpdateStock = (item: InventoryItem) => {
    let status: 'Crítico' | 'Mínimo' | 'Óptimo' = 'Óptimo';
    if (editStockVal <= 5) status = 'Crítico';
    else if (editStockVal <= 15) status = 'Mínimo';

    onUpdateInventoryItem({
      ...item,
      stock: Number(editStockVal),
      status
    });

    setEditingSku(null);
  };

  const filteredItems = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'all' || 
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus = 
      selectedStatus === 'all' || 
      item.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Visual Stock Warning Alert */}
      {inventory.some(i => i.status === 'Crítico') && (
        <section className="bg-red-50 border border-red-100 text-red-950 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3.5">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-bold text-sm text-red-950">Alerta de Stock Crítico o Mínimo</h4>
              <p className="text-xs text-red-700 mt-0.5">
                Insumos clave han alcanzado el stock de reserva mínimo. Modifique las cantidades en la tabla a continuación para reabastecer el abastecimiento.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => {
              inventory.forEach(item => {
                if (item.status === 'Crítico') {
                  onUpdateInventoryItem({ ...item, stock: 45, status: 'Óptimo' });
                }
              });
              alert('¡Fórmula reabastecida automáticamente! Insumos actualizados a 45 unidades.');
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm shrink-0 outline-none cursor-pointer"
          >
            Reabastecer Todo
          </button>
        </section>
      )}

      {/* Title block */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Gestión de Inventario Médico</h2>
          <p className="text-sm text-slate-500">Supervise y gestione el suministro de medicamentos y material quirúrgico clínico.</p>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'create' : 'list')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer outline-none"
        >
          {viewMode === 'list' ? (
            <>
              <Plus className="w-4 h-4" />
              <span>Ingresar Insumo</span>
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Inventario</span>
            </>
          )}
        </button>
      </section>

      {viewMode === 'create' ? (
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Registrar Nuevo Item en Inventario</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Nombre del Insumo / Medicamento</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Vacuna Felina Octuple" 
                required
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Código SKU</label>
              <input 
                type="text" 
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej: VAC-FEL-99" 
                required
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Categoría</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
              >
                <option value="Vacunas">Vacunas</option>
                <option value="Antibióticos">Antibióticos</option>
                <option value="Anestesia">Anestesia</option>
                <option value="Material de Curación">Material de Curación</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Stock Inicial</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  min={0}
                  required
                  className="flex-grow h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="text" 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-20 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button 
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer outline-none shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Insumo</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          
          {/* Filters Bar matched from screenshot 7 */}
          <section className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Buscar por nombre o código SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700"
                >
                  <option value="all">Todas las Categorías</option>
                  <option value="vacunas">Vacunas</option>
                  <option value="antibióticos">Antibióticos</option>
                  <option value="anestesia">Anestesia</option>
                  <option value="material de curación">Material de Curación</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700"
                >
                  <option value="all">Cualquier Estado</option>
                  <option value="óptimo">Óptimo</option>
                  <option value="mínimo">Mínimo</option>
                  <option value="crítico">Crítico</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end text-xs font-semibold text-slate-500 font-mono">
                <span>Filtros Activos</span>
              </div>
            </div>
          </section>

          {/* Table container matched from screenshot 7 */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-slate-950">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider font-mono">Insumo / Medicamento</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider font-mono">Código SKU</th>
                    <th className="px-6 py-4 font-bold text-slate-500 text-center uppercase tracking-wider font-mono">Stock Actual</th>
                    <th className="px-6 py-4 font-bold text-slate-500 text-center uppercase tracking-wider font-mono">Estado</th>
                    <th className="px-6 py-4 font-bold text-slate-500 text-right uppercase tracking-wider font-mono">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredItems.map(item => (
                    <tr key={item.sku} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100/50">
                            📦
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium font-mono">Categoría: {item.category}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono font-medium text-slate-500">{item.sku}</td>

                      <td className="px-6 py-4 text-center">
                        {editingSku === item.sku ? (
                          <div className="flex items-center justify-center gap-1.5 max-w-[120px] mx-auto">
                            <input
                              type="number"
                              value={editStockVal}
                              onChange={(e) => setEditStockVal(Number(e.target.value))}
                              className="w-14 h-8 p-1 px-2 border border-slate-200 rounded text-center text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateStock(item)}
                              className="p-1.5 bg-green-100 hover:bg-green-200 text-green-900 rounded-lg transition-colors cursor-pointer"
                            >
                              ✓
                            </button>
                          </div>
                        ) : (
                          <span className={`font-bold text-sm ${
                            item.status === 'Crítico' 
                              ? 'text-red-650' 
                              : item.status === 'Mínimo' 
                              ? 'text-amber-600' 
                              : 'text-slate-900'
                          }`}>
                            {item.stock} {item.unit}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1.5 ${
                          item.status === 'Crítico'
                            ? 'bg-red-50 text-red-700' 
                            : item.status === 'Mínimo'
                            ? 'bg-amber-50 text-amber-900'
                            : 'bg-green-50/85 text-green-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'Crítico' 
                              ? 'bg-red-600' 
                              : item.status === 'Mínimo' 
                              ? 'bg-amber-600' 
                              : 'bg-green-600'
                          }`}></span>
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {editingSku === item.sku ? (
                          <button
                            type="button"
                            onClick={() => setEditingSku(null)}
                            className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer outline-none"
                          >
                            Cancelar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditing(item)}
                            className="text-slate-700 hover:text-slate-950 p-1.5 hover:bg-slate-100 rounded-lg transition-colors inline-flex cursor-pointer outline-none"
                          >
                            <Edit className="w-4 h-4 text-slate-500" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        No hay insumos que coincidan con la selección actual.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
              <span>Mostrando {filteredItems.length} insumos de {inventory.length} totales</span>
              <span className="bg-slate-100 p-1 px-2.5 rounded font-mono">Página 1 de 1</span>
            </div>
          </div>

          {/* Stat widgets matched from screenshot 7 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Valor de la Farmacia</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">
                  ${inventory.reduce((acc, item) => acc + item.stock * 1500, 0).toLocaleString('es-CL')} CLP
                </span>
                <span className="text-[10px] text-green-600 font-medium mt-1 inline-flex items-center gap-0.5">
                  ▲ +5.2% este mes
                </span>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Insumos Próximos a Vencer</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">8 ítems</span>
                <span className="text-[10px] text-slate-400 mt-1 block">En los próximos 30 días</span>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Pedidos en Camino</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">2 Pedidos</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Estimación de arribo: Mañana, 14:00</span>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Truck className="w-5 h-5" />
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
