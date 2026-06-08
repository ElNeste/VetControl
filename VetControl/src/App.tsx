import React, { useState } from 'react';
import { Pet, Consultation, HistoryEvent, InventoryItem } from './types';
import { 
  INITIAL_PETS, 
  INITIAL_CONSULTATIONS, 
  INITIAL_HISTORY, 
  INITIAL_INVENTORY,
  INITIAL_ROLES,
  INITIAL_PHASES
} from './data';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Mascotas from './components/Mascotas';
import Consultas from './components/Consultas';
import Historial from './components/Historial';
import Inventario from './components/Inventario';
import Planificacion from './components/Planificacion';

import { 
  Home, 
  ShieldAlert, 
  Users, 
  FileHeart, 
  History, 
  Package, 
  Compass, 
  LogOut, 
  Bell, 
  Menu,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Layout Tab selection
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [activeSubTab, setActiveSubTab] = useState<string>('nueva');

  // Application Global Reactive State
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [consultations, setConsultations] = useState<Consultation[]>(INITIAL_CONSULTATIONS);
  const [history, setHistory] = useState<HistoryEvent[]>(INITIAL_HISTORY);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);

  // Notification Toast state
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLogin = (user: string) => {
    setCurrentUser(user);
    triggerNotification(`¡Sesión iniciada con éxito! Bienvenido, ${user}`);
    setActiveTab('inicio');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('inicio');
  };

  // Add pet dynamically
  const handleAddPet = (newPet: Pet) => {
    setPets(prev => [newPet, ...prev]);
    triggerNotification(`Se registró al paciente mascota: ${newPet.name}`);
  };

  // Update pet details
  const handleUpdatePet = (updatedPet: Pet) => {
    setPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
    triggerNotification(`Información del paciente ${updatedPet.name} actualizada con éxito.`);
  };

  // Update inventory items stock
  const handleUpdateInventoryItem = (updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(item => item.sku === updatedItem.sku ? updatedItem : item));
    triggerNotification(`Insumo ${updatedItem.name} actualizado. Stock: ${updatedItem.stock} ${updatedItem.unit}`);
  };

  // Create new inventory item
  const handleAddInventoryItem = (newItem: InventoryItem) => {
    setInventory(prev => [...prev, newItem]);
    triggerNotification(`Insumo ${newItem.name} registrado en almacén.`);
  };

  // Add event to timeline history list
  const handleAddHistoryEvent = (newEvent: HistoryEvent) => {
    setHistory(prev => [newEvent, ...prev]);
    triggerNotification(`Nuevo evento clínico agregado: ${newEvent.title}`);
  };

  const navigateTo = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    if (subTab) {
      setActiveSubTab(subTab);
    }
  };

  // If user is not authenticated, show styled Login panel (RNF20)
  if (!currentUser) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col pb-24 md:pb-6 relative transition-colors duration-150">
      
      {/* Toast Notification Container */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white p-3.5 rounded-xl shadow-lg border border-slate-800 text-xs font-semibold animate-slideIn flex items-center gap-2.5 max-w-sm">
          <span className="text-green-400 shrink-0 text-sm">✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Dynamic Header Block matches screenshots */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-slate-200 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold shadow-sm">
              🐾
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight hover:opacity-90 cursor-pointer" onClick={() => setActiveTab('inicio')}>
              VetControl
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-1 items-center bg-slate-50 p-1 border border-slate-100 rounded-xl">
            {[
              { id: 'inicio', label: 'Inicio', icon: '🏠' },
              { id: 'mascotas', label: 'Mascotas', icon: '🐾' },
              { id: 'consultas', label: 'Consultas', icon: '🏥' },
              { id: 'historial', label: 'Historial', icon: '⏱️' },
              { id: 'inventario', label: 'Inventario', icon: '📦' },
              { id: 'planificacion', label: 'Planificación', icon: '📊' }
            ].map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User profile dropdown and bell */}
          <div className="flex items-center gap-3.5">
            
            <button 
              onClick={() => triggerNotification('Usted no tiene alertas de guardias pendientes.')}
              className="relative p-2 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* Profile Avatar Triggering Logout */}
            <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 p-1 pr-3 rounded-full border border-slate-200 transition-colors cursor-pointer group relative">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200">
                <img 
                  alt="Vet Bio Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgqqk8CmDyDrIHRAm9cVgQk4E6If5SPatp5XeA0xF-QUnAAvwuGDrHWc-2RuEd_o7Xdn9BGv3jK66DF_k3iKJ8HcbaG5e8o33QV-GOyfjLz96xkJtSv77NM8k6Cy76KZOKbNKzf-g1u4NUbqYZyL1VoOdUdWm6q9UL-IjLutRyOqrrk-lK0DRdqMvl8T828rz6_bDKboeTQg_3LJKSu9JeTJSw3LUJno272Z7H5H3Y0A5qK0HKCcbLVM-hsinNQ42l9YLj8FhGA0St"
                />
              </div>
              <span className="text-xs font-bold text-slate-700 block max-w-[100px] truncate">{currentUser}</span>
              
              {/* Tooltip action to logout */}
              <button 
                onClick={handleLogout}
                className="hover:scale-105 active:scale-95 transition-transform"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main active canvas container */}
      <main className="max-w-7xl mx-auto w-full px-6 pt-24 pb-8 flex-grow">
        <div className="w-full">
          {activeTab === 'inicio' && (
            <Dashboard 
              onNavigate={navigateTo} 
              inventory={inventory} 
              pets={pets} 
              consultations={consultations} 
            />
          )}

          {activeTab === 'mascotas' && (
            <Mascotas 
              pets={pets} 
              onAddPet={handleAddPet} 
            />
          )}

          {activeTab === 'consultas' && (
            <Consultas 
              pets={pets} 
              consultations={consultations}
              currentSubTab={activeSubTab}
              onAddHistoryEvent={handleAddHistoryEvent}
              onNavigate={navigateTo}
              onUpdatePet={handleUpdatePet}
            />
          )}

          {activeTab === 'historial' && (
            <Historial 
              history={history} 
            />
          )}

          {activeTab === 'inventario' && (
            <Inventario 
              inventory={inventory} 
              onUpdateInventoryItem={handleUpdateInventoryItem}
              onAddInventoryItem={handleAddInventoryItem}
            />
          )}

          {activeTab === 'planificacion' && (
            <Planificacion 
              initialRoles={INITIAL_ROLES}
              initialPhases={INITIAL_PHASES}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar matched from screenshots */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-slate-200 h-20 px-4 pb-safe flex justify-around items-center">
        {[
          { id: 'inicio', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
          { id: 'mascotas', label: 'Mascotas', icon: <Users className="w-5 h-5" /> },
          { id: 'consultas', label: 'Consultas', icon: <Compass className="w-5 h-5" /> },
          { id: 'historial', label: 'Historial', icon: <History className="w-5 h-5" /> },
          { id: 'inventario', label: 'Insumos', icon: <Package className="w-5 h-5" /> }
        ].map(tab => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isSelected 
                  ? 'bg-blue-100 text-blue-700 font-bold px-4 transform scale-102 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
