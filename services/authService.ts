
export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  agencyId: string;
}

const STORAGE_KEY = 'accident_analytics_users';

// Helper: Get users from local storage
const getUsers = (): Record<string, any> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

// Helper: Save user to local storage
const saveUserToStorage = (user: any) => {
  const users = getUsers();
  users[user.email] = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Simulate JWT creation (Base64 encoded JSON)
const generateMockToken = (payload: any) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = "mock-signature-hash"; 
  return `${header}.${body}.${signature}`;
};

// Decode JWT to get user session data
export const decodeToken = (token: string): UserSession | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const body = atob(parts[1]);
    return JSON.parse(body);
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};

export const login = async (email: string, password: string): Promise<UserSession> => {
  // Simulate API Network Delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const users = getUsers();
  const user = users[email];

  if (user && user.password === password) {
    const sessionUser: UserSession = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'Investigator',
      agencyId: user.agencyId || 'AGENCY-GENERIC'
    };

    // Set secure cookie
    const token = generateMockToken(sessionUser);
    document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
    
    return sessionUser;
  }
  throw new Error("Invalid email or password.");
};

export const signup = async (email: string, password: string, name: string, agencyId: string): Promise<UserSession> => {
  // Simulate API Network Delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const users = getUsers();
  if (users[email]) {
    throw new Error("User already exists with this email.");
  }

  const newUser = {
    id: 'usr-' + Math.random().toString(36).substr(2, 9),
    email,
    password, // Note: In production, never store plain text passwords
    name,
    agencyId,
    role: 'Investigator'
  };

  saveUserToStorage(newUser);

  // Auto-login after signup
  const sessionUser: UserSession = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    agencyId: newUser.agencyId
  };

  const token = generateMockToken(sessionUser);
  document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;

  return sessionUser;
};

export const logout = async () => {
  // Clear cookie
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict; Secure";
  // Simulate API call to invalidate session
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const getSession = (): UserSession | null => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find((item) => item.trim().startsWith('auth_token='));
  
  if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    return decodeToken(token);
  }
  return null;
};

export const checkSession = (): boolean => {
  return !!getSession();
};
