import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
  initialize: () => void;
}

// Client-side helper to decode JWT claims without external packages
function decodeJwtClaims(token: string): Partial<User> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return {
      id: decoded.id || decoded.sub || '1',
      name: decoded.name || decoded.username || 'Chef',
      email: decoded.email || 'chef@bitebot.ai',
    };
  } catch (e) {
    console.error('Failed to decode JWT:', e);
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (accessToken) => {
    localStorage.setItem('token', accessToken);
    
    // Sync cookie for Next.js middleware redirects
    document.cookie = `bitebot_token=${accessToken}; path=/; max-age=604800; SameSite=Lax; Secure`;

    // Decode claims or fallback
    const claims = decodeJwtClaims(accessToken);
    const user: User = {
      id: claims?.id || '1',
      name: claims?.name || 'Chef',
      email: claims?.email || 'chef@bitebot.ai',
    };

    localStorage.setItem('bitebot_user', JSON.stringify(user));

    set({
      token: accessToken,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('bitebot_user');
    
    // Clear redirect cookie
    document.cookie = 'bitebot_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: () => {
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('bitebot_user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (token && user) {
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else if (token) {
        // Recover user profile by re-decoding token
        const claims = decodeJwtClaims(token);
        const recoveredUser: User = {
          id: claims?.id || '1',
          name: claims?.name || 'Chef',
          email: claims?.email || 'chef@bitebot.ai',
        };
        localStorage.setItem('bitebot_user', JSON.stringify(recoveredUser));
        
        set({
          token,
          user: recoveredUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
