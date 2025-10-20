export interface RoleResponse {
  id: number;
  name: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  cedula: string;
  gender: string;
  accountStatus: string;
  roles: RoleResponse[];
  latitude: number;
  longitude: number;
}

export interface UserLocationData {
  id: number;
  roles: string[];
  latitude: number;
  longitude: number;
}
