export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty';
  department: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
  phone?: string;
  address?: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface SortState {
  field: keyof User | null;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  department: string;
  role: string;
  status: string;
}
