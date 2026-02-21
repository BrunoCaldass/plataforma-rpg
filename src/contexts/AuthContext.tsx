// ============================================================
// contexts/AuthContext.tsx — Context API para Autenticação + RBAC
// ============================================================
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import {
    type AuthAction,
    type AuthContextType,
    type AuthState,
    type AuthUser,
    type LoginCredentials,
    type RegisterCredentials,
    resolveUserRole,
} from "@/types/auth";

// ── Reducer ────────────────────────────────────────────────
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "AUTH_LOADING":
            return { ...state, isLoading: true };
        case "AUTH_SUCCESS":
            return { user: action.payload, isAuthenticated: true, isLoading: false };
        case "AUTH_LOGOUT":
            return { user: null, isAuthenticated: false, isLoading: false };
        case "AUTH_ERROR":
            return { user: null, isAuthenticated: false, isLoading: false };
        default:
            return state;
    }
}

// ── Helper: Supabase Session → AuthUser ────────────────────
function mapSessionToUser(session: {
    user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at: string };
}): AuthUser {
    const email = session.user.email ?? "";
    const role = resolveUserRole(email);
    const displayName =
        (session.user.user_metadata?.display_name as string) ??
        (session.user.user_metadata?.name as string) ??
        email.split("@")[0];

    return {
        id: session.user.id,
        email,
        displayName,
        role,
        avatarUrl: session.user.user_metadata?.avatar_url as string | undefined,
        createdAt: session.user.created_at,
    };
}

// ── Context ────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Inicializa sessão e escuta mudanças
    useEffect(() => {
        let isMounted = true;

        const initSession = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!isMounted) return;

                if (session) {
                    dispatch({ type: "AUTH_SUCCESS", payload: mapSessionToUser(session) });
                } else {
                    dispatch({ type: "AUTH_LOGOUT" });
                }
            } catch {
                if (isMounted) dispatch({ type: "AUTH_ERROR" });
            }
        };

        initSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isMounted) return;
            if (session) {
                dispatch({ type: "AUTH_SUCCESS", payload: mapSessionToUser(session) });
            } else {
                dispatch({ type: "AUTH_LOGOUT" });
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // ── Actions ──────────────────────────────────────────────
    const login = useCallback(async (credentials: LoginCredentials) => {
        dispatch({ type: "AUTH_LOADING" });

        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email.trim(),
            password: credentials.password,
        });

        if (error) {
            dispatch({ type: "AUTH_ERROR" });
            throw error;
        }

        if (data.session) {
            dispatch({ type: "AUTH_SUCCESS", payload: mapSessionToUser(data.session) });
        }
    }, []);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        dispatch({ type: "AUTH_LOADING" });

        const { data, error } = await supabase.auth.signUp({
            email: credentials.email.trim(),
            password: credentials.password,
            options: {
                data: { display_name: credentials.displayName },
                emailRedirectTo: `${window.location.origin}/login`,
            },
        });

        if (error) {
            dispatch({ type: "AUTH_ERROR" });
            throw error;
        }

        // Supabase pode retornar sessão imediatamente se email confirm desabilitado
        if (data.session) {
            dispatch({ type: "AUTH_SUCCESS", payload: mapSessionToUser(data.session) });
        } else {
            // Se precisa confirmar e-mail, volta pro estado não-autenticado
            dispatch({ type: "AUTH_LOGOUT" });
        }
    }, []);

    const logout = useCallback(async () => {
        dispatch({ type: "AUTH_LOADING" });
        await supabase.auth.signOut();
        dispatch({ type: "AUTH_LOGOUT" });
    }, []);

    const value = useMemo<AuthContextType>(
        () => ({ state, login, register, logout }),
        [state, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────────
export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth deve ser utilizado dentro de um <AuthProvider>");
    }
    return ctx;
}
