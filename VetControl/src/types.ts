export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  ageUnit: 'Años' | 'Meses';
  ownerName: string;
  ownerPhone: string;
  weight?: number;
  status: 'En Diagnóstico' | 'En Recuperación' | 'Finalizado';
  image?: string;
}

export interface Consultation {
  id: string;
  petId: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  allergy?: string;
  date: string;
  time: string;
  status: 'Pendiente' | 'En Curso' | 'Completado';
  assignedVet: string;
  estimationTime: string; // e.g. "45 min"
  urgency: 'Baja' | 'Normal' | 'Urgente';
  services: string[]; // Desparasitación, Vacunación, Limpieza Dental, Examen de Sangre
}

export interface HistoryEvent {
  id: string;
  title: string;
  type: 'vaccine' | 'emergency' | 'surgery' | 'checkup';
  date: string;
  time: string;
  status: 'Completado' | 'Finalizado' | 'Alta Médica';
  petName: string;
  petBreed: string;
  vetName: string;
  notes?: string;
}

export interface InventoryItem {
  sku: string;
  name: string;
  category: 'Vacunas' | 'Antibióticos' | 'Anestesia' | 'Material de Curación';
  stock: number;
  unit: string; // u., ml, etc.
  status: 'Crítico' | 'Mínimo' | 'Óptimo';
  icon: 'vaccines' | 'medical_services' | 'biotech' | 'healing';
}

export interface TeamRole {
  role: string;
  function: string;
  hourlyRate: number;
  hoursNeeded: number;
}

export interface ProjectPhase {
  name: string;
  cost: number;
  durationWeeks: number;
  startWeek: number;
  tasks: string[];
}
