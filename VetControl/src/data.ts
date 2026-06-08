import { Pet, Consultation, HistoryEvent, InventoryItem, TeamRole, ProjectPhase } from './types';

export const INITIAL_PETS: Pet[] = [
  {
    id: 'PET-8842',
    name: 'Max',
    species: 'Canino',
    breed: 'Golden Retriever',
    age: 4,
    ageUnit: 'Años',
    ownerName: 'Carlos Ruiz',
    ownerPhone: '+34 600 000 000',
    weight: 32.5,
    status: 'En Diagnóstico',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEWWmU4N1yyvZFaMZX5EZqpabgLFupjwmJNJ2saM7af6djI7JWGqPj94EyHdycRdxGdK1x3ukkDS6xGekwdsGqQwxaY_o0u4z185MI7-af0BbQZfLkzOP9m1yxd8XwNuTJ3ytMY-Otq7YW95y4qQJ4tZKKiK_yFR7OrElqV9NkmVWRUx4FxN7-CW1gGyAmBQf7Yvbe56r6zk80SUkK6z8se8B8-AX9U298Pw6enzoUTXWzxE8Qgjpkr_VY-tyQVx21W5cxaHQBkEvp'
  },
  {
    id: 'PET-1024',
    name: 'Milo',
    species: 'Felino',
    breed: 'Gato Persa',
    age: 4,
    ageUnit: 'Años',
    ownerName: 'Isabel Torres',
    ownerPhone: '+34 611 222 333',
    weight: 4.2,
    status: 'En Diagnóstico',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXu1teZPy7yotLJQENDdzS8HRt6jfxg2acVfV0ld41XW_eByNh2h4IPhgRWO7T8RqKp2a-d3fSPJyLXtqc2a4dYwGGgATvkOnT0z4t3WwOryYhhShhdA94x4rmtcSD8DdNI81vypJvVQIl7-DRRKMXyCgljyopflj3CQ63Gkzrpd-XVy2GNJux1RHaf2Pq1PSSZoWPUwSQYIdOv7BXnImmiV01R3o7Zi176mfsqOZ1poLE2EFJnkeKnr5Sf40HLL4UTro6B2yTWZp62w'
  },
  {
    id: 'PET-5061',
    name: 'Kira',
    species: 'Canino',
    breed: 'Golden Retriever',
    age: 2,
    ageUnit: 'Años',
    ownerName: 'Sofía Valdés',
    ownerPhone: '+34 688 999 000',
    weight: 28.0,
    status: 'En Recuperación',
    image: 'https://lh3.googleusercontent.com/aida-pro-ehJKTZQ1gDBi7QKfyBwQ8A9ISno1nGri6fk4vr5aoNiar4mZd-Oh0iGgl4ywc56HfxZUd3sLU8C929T6wRFdH7v0Jw8UpZlME-eIMhqvFhpCpi_al0eO32tjuj0lqxJWv2QxE8nzLCx0Js5dgjQ4Tz1z3FNiqSJQ6kkGAfW_vcxT9-Hg5_Uyzol7zeD77427IjV4tMdcyNVk9VinGMlCGfYj8LgaFzG7W_fCxNtkosmp0i1_JQEJfVH7r-g2gQXqNOzTFzZ1LHZU'
  },
  {
    id: 'PET-3099',
    name: 'Simba',
    species: 'Felino',
    breed: 'Mestizo',
    age: 7,
    ageUnit: 'Años',
    ownerName: 'Marta Valle',
    ownerPhone: '+34 677 888 999',
    weight: 5.1,
    status: 'Finalizado',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWwd5q7l1Oyfyy-_wVoBDlkUf3PfJ56eWDilKvkQzAW82R4khCpSfOae8mNqjc50_OovmVAxEdYPYQHt4FQZiNxxXe4kFtZMTBwmvAOSBMZXONHbnEbF4WKtkZLwijN3nBxyh4kOuwmJYuQX_8Qtg989UkWCK4XbpiJyx7ILBaHxOQuD2fVmcQIuiUVDFOBjVy75XKXOrSp2VgBZv0C5FtXZIx0ynn54C0de8mTQU1R_Q8Gdc5hEE1Zm0n7LV4hfOA-8PFeVi3gvcw'
  },
  {
    id: 'PET-2291',
    name: 'Luna',
    species: 'Canino',
    breed: 'Border Collie',
    age: 3,
    ageUnit: 'Años',
    ownerName: 'Dr. Ricardo Espinoza',
    ownerPhone: '+34 655 444 333',
    weight: 18.5,
    status: 'Finalizado',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEWWmU4N1yyvZFaMZX5EZqpabgLFupjwmJNJ2saM7af6djI7JWGqPj94EyHdycRdxGdK1x3ukkDS6xGekwdsGqQwxaY_o0u4z185MI7-af0BbQZfLkzOP9m1yxd8XwNuTJ3ytMY-Otq7YW95y4qQJ4tZKKiK_yFR7OrElqV9NkmVWRUx4FxN7-CW1gGyAmBQf7Yvbe56r6zk80SUkK6z8se8B8-AX9U298Pw6enzoUTXWzxE8Qgjpkr_VY-tyQVx21W5cxaHQBkEvp'
  },
  {
    id: 'PET-4432',
    name: 'Toby',
    species: 'Canino',
    breed: 'Pug',
    age: 5,
    ageUnit: 'Años',
    ownerName: 'Julia Méndez',
    ownerPhone: '+34 644 333 222',
    weight: 9.2,
    status: 'Finalizado',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEWWmU4N1yyvZFaMZX5EZqpabgLFupjwmJNJ2saM7af6djI7JWGqPj94EyHdycRdxGdK1x3ukkDS6xGekwdsGqQwxaY_o0u4z185MI7-af0BbQZfLkzOP9m1yxd8XwNuTJ3ytMY-Otq7YW95y4qQJ4tZKKiK_yFR7OrElqV9NkmVWRUx4FxN7-CW1gGyAmBQf7Yvbe56r6zk80SUkK6z8se8B8-AX9U298Pw6enzoUTXWzxE8Qgjpkr_VY-tyQVx21W5cxaHQBkEvp'
  }
];

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'CON-1001',
    petId: 'PET-8842',
    reason: 'Cojera en pata trasera derecha, inapetencia.',
    diagnosis: 'Cojera leve de ligamento cruzado craneal posterior.',
    treatment: 'Reposo absoluto, antiinflamatorios meloxicam por 5 días, control en una semana.',
    allergy: 'Alergia: Penicilina',
    date: '2026-06-08',
    time: '10:30 AM',
    status: 'En Curso',
    assignedVet: 'Dr. Ricardo Méndez',
    estimationTime: '45 min',
    urgency: 'Normal',
    services: ['Vacunación']
  }
];

export const INITIAL_HISTORY: HistoryEvent[] = [
  {
    id: 'HIST-001',
    title: 'Vacunación Anual',
    type: 'vaccine',
    date: '12 Oct 2023',
    time: '10:30 AM',
    status: 'Completado',
    petName: 'Luna',
    petBreed: 'Border Collie',
    vetName: 'Dr. Ricardo Espinoza',
    notes: 'Aplicada vacuna Óctuple y Antirrábica de manera coordinada. Sin reacciones inmediatas.'
  },
  {
    id: 'HIST-002',
    title: 'Consulta de Urgencia',
    type: 'emergency',
    date: '05 Oct 2023',
    time: '08:15 PM',
    status: 'Finalizado',
    petName: 'Simba',
    petBreed: 'Persa',
    vetName: 'Dra. Marta Valle',
    notes: 'Ingresa por cuadro de vómitos y letargo. Se administraron fluidos isotónicos y antieméticos.'
  },
  {
    id: 'HIST-003',
    title: 'Cirugía Programada',
    type: 'surgery',
    date: '28 Sep 2023',
    time: '09:00 AM',
    status: 'Alta Médica',
    petName: 'Toby',
    petBreed: 'Pug',
    vetName: 'Dr. Ricardo Espinoza',
    notes: 'Profilaxis dental profunda y extracción de premolar dañado. Despertar anestésico óptimo.'
  },
  {
    id: 'HIST-004',
    title: 'Chequeo General',
    type: 'checkup',
    date: '15 Sep 2023',
    time: '04:45 PM',
    status: 'Finalizado',
    petName: 'Luna',
    petBreed: 'Border Collie',
    vetName: 'Dra. Marta Valle',
    notes: 'Revisión preventiva semestral. Peso óptimo, control antiparasitario al día, auscultación cardíaca normal.'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    sku: 'VAC-FEL-001',
    name: 'Vacuna Triple Felina',
    category: 'Vacunas',
    stock: 4,
    unit: 'u.',
    status: 'Crítico',
    icon: 'vaccines'
  },
  {
    sku: 'ANT-AMO-102',
    name: 'Amoxicilina 500mg',
    category: 'Antibióticos',
    stock: 150,
    unit: 'u.',
    status: 'Óptimo',
    icon: 'medical_services'
  },
  {
    sku: 'ANE-PRO-055',
    name: 'Propofol Inyectable',
    category: 'Anestesia',
    stock: 12,
    unit: 'u.',
    status: 'Mínimo',
    icon: 'biotech'
  },
  {
    sku: 'CUR-VEN-400',
    name: 'Vendas Elásticas 5cm',
    category: 'Material de Curación',
    stock: 45,
    unit: 'u.',
    status: 'Óptimo',
    icon: 'healing'
  }
];

export const INITIAL_ROLES: TeamRole[] = [
  {
    role: 'Analista',
    function: 'Define requisitos y recopila necesidades de la clínica clínica.',
    hourlyRate: 25000,
    hoursNeeded: 4
  },
  {
    role: 'Desarrollador',
    function: 'Programa las funcionalidades, vistas interactivas del sistema y persistencia.',
    hourlyRate: 30000,
    hoursNeeded: 10
  },
  {
    role: 'Tester',
    function: 'Realiza pruebas unitarias, de integración y de usabilidad clínica.',
    hourlyRate: 20000,
    hoursNeeded: 5
  },
  {
    role: 'Jefe de Proyecto',
    function: 'Coordina los recursos, supervisa el cumplimiento del EDT y Gantt, reporta avances.',
    hourlyRate: 35000,
    hoursNeeded: 3
  }
];

export const INITIAL_PHASES: ProjectPhase[] = [
  {
    name: 'Análisis',
    cost: 100000,
    durationWeeks: 2,
    startWeek: 1,
    tasks: ['Levantamiento de requisitos clínicos', 'Entrevistas con Veterinarios y staff', 'Definición del documento IEEE 830']
  },
  {
    name: 'Diseño',
    cost: 50000,
    durationWeeks: 2,
    startWeek: 3,
    tasks: ['Diseño de Interfaz de VetControl (Material Blue)', 'Estructura de base de datos de pacientes e inventario', 'Planificación del Plan de Ejecución/EDT']
  },
  {
    name: 'Desarrollo',
    cost: 300000,
    durationWeeks: 4,
    startWeek: 4,
    tasks: ['Construcción de módulos frontend modularizados', 'Programación de persistencia de consultas y alertas', 'Creación de controles de stock y triaje de urgencias']
  },
  {
    name: 'Pruebas',
    cost: 100000,
    durationWeeks: 2,
    startWeek: 7,
    tasks: ['Validación de escenarios médicos complejos', 'Prueba de fiabilidad en registro de datos del 99%', 'Simulación de picos de disponibilidad']
  },
  {
    name: 'Implementación',
    cost: 50000,
    durationWeeks: 1,
    startWeek: 9,
    tasks: ['Configuración para sistemas Windows y navegadores web', 'Puesta en marcha e inducción al equipo de atención', 'Establecimiento del plan de revisión mensual']
  }
];
