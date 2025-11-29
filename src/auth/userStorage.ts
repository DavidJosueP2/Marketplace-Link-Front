import type { UserLocationData } from "@/services/auth/interfaces/UserResponse";

const USER_DATA_KEY = "user_data";
const DEFAULT_LOCATION = {
  latitude: -1.2680301243556702,
  longitude: -78.62415372809278,
};

export const setUserData = (userData: UserLocationData): void => {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const getUserData = (): UserLocationData | null => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const getUserLocation = (): { latitude: number; longitude: number } => {
  const userData = getUserData();
  
  if (userData?.latitude && userData?.longitude) {
    return {
      latitude: userData.latitude,
      longitude: userData.longitude,
    };
  }
  
  return DEFAULT_LOCATION;
};

export const getUserRoles = (): string[] => {
  const userData = getUserData();
  return userData?.roles || [];
};

export const clearUserData = (): void => {
  try {
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};
