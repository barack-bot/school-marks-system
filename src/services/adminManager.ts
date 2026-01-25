// Admin registration limit management
const MAX_ADMINS = 3;
const ADMIN_STORE_KEY = "registered_admins";

export interface AdminRecord {
  id: string;
  email: string;
  name: string;
  registeredAt: string;
}

export const getAdminCount = (): number => {
  try {
    const admins = localStorage.getItem(ADMIN_STORE_KEY);
    if (!admins) return 0;
    const adminList = JSON.parse(admins) as AdminRecord[];
    return adminList.length;
  } catch {
    return 0;
  }
};

export const canRegisterAdmin = (): boolean => {
  return getAdminCount() < MAX_ADMINS;
};

export const registerAdmin = (admin: AdminRecord): void => {
  try {
    const admins = localStorage.getItem(ADMIN_STORE_KEY);
    const adminList: AdminRecord[] = admins ? JSON.parse(admins) : [];

    if (adminList.length >= MAX_ADMINS) {
      throw new Error("Maximum admin limit reached");
    }

    // Check if admin already exists
    const exists = adminList.some((a) => a.email === admin.email);
    if (exists) {
      throw new Error("Admin already registered");
    }

    adminList.push(admin);
    localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(adminList));
  } catch (error) {
    throw error;
  }
};

export const getRegisteredAdmins = (): AdminRecord[] => {
  try {
    const admins = localStorage.getItem(ADMIN_STORE_KEY);
    if (!admins) return [];
    return JSON.parse(admins);
  } catch {
    return [];
  }
};

export const getMaxAdminLimit = (): number => {
  return MAX_ADMINS;
};
