// ============================================================
// types/auth.ts — Tipos do Sistema de Autenticação e RBAC
// ============================================================

/** Papéis disponíveis no sistema */
export type UserRole = "master" | "player";

/** Representação do usuário autenticado */
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

/** Estado global de autenticação */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** Credenciais de login */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Credenciais de registro */
export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

/** Ações do Reducer de Autenticação */
export type AuthAction =
  | { type: "AUTH_LOADING" }
  | { type: "AUTH_SUCCESS"; payload: AuthUser }
  | { type: "AUTH_LOGOUT" }
  | { type: "AUTH_ERROR" };

/** Contrato do AuthContext */
export interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

/** Ficha de personagem (mock para listagem do Mestre) */
export interface PlayerCharacterSheet {
  id: string;
  userId: string;
  playerName: string;
  playerEmail: string;
  characterName: string;
  characterAlias: string;
  characterClass: string;
  race: string;
  origin: string;
  level: number;
  vigor: { current: number; max: number };
  sanity: { current: number; max: number };
  lastActive: string;
  isOnline: boolean;
}

/** E-mail do administrador (Mestre) */
export const MASTER_EMAIL = "brunocaldass@hotmail.com";

/** Determina o papel do usuário com base no e-mail */
export function resolveUserRole(email: string): UserRole {
  return email.toLowerCase().trim() === MASTER_EMAIL ? "master" : "player";
}
