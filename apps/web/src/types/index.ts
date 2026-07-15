export interface Permission {
  _id: string;
  key: string;
  label: string;
  group: string;
  description?: string;
}

export interface Role {
  _id: string;
  name: string;
  isDefault: boolean;
  permissions: Permission[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  approved: boolean;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  approved: boolean;
}

export interface Event {
  _id: string;
  name: string;
  location: string;
  description?: string;
  startTime: string;
  endTime?: string;
  active: boolean;
  totalCoeficiente: number;
  createdBy: string;
}

export interface Device {
  _id: string;
  macAddress: string;
  label?: string;
  active: boolean;
  assignedEvent?: string;
  batteryLevel: number;
}

export enum VoteOption {
  SI = 'SI',
  NO = 'NO',
  ABSTENCION = 'ABSTENCION',
}

export interface Vote {
  _id: string;
  deviceId: string;
  eventId: string;
  vote: VoteOption;
  timestamp: string;
}

export interface VoteResult {
  option: VoteOption;
  count: number;
  percentage: number;
  coeficiente: number;
}

export interface EventResults {
  eventId: string;
  totalVoters: number;
  totalVotes: number;
  quorum: number;
  results: VoteResult[];
}
