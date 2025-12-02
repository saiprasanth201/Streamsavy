import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'streamsavvy_auth';
const ACCOUNT_STORAGE_KEY = 'streamsavvy_account';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const normalizeAccount = (data = {}) => {
  const baseUser = data.user || {};
  return {
    user: {
      fullName: baseUser.fullName ?? data.fullName ?? '',
      email: baseUser.email ?? data.email ?? '',
      password: baseUser.password ?? data.password ?? '',
    },
    hasCompletedPayment: !!(data.hasCompletedPayment ?? baseUser.hasCompletedPayment ?? false),
  };
};


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedSignUp, setHasCompletedSignUp] = useState(false);
  const [hasCompletedPayment, setHasCompletedPayment] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const hasLoaded = useRef(false);
  
  // Initialize auth state from localStorage on mount
  useEffect(() => {
    // No need to initialize users from localStorage anymore
  }, []);

  // Load auth/account state from localStorage on mount
  useEffect(() => {
    try {
      const rawAuthData = localStorage.getItem(AUTH_STORAGE_KEY);
      const rawAccountData = localStorage.getItem(ACCOUNT_STORAGE_KEY);
      const parsedAuth = rawAuthData ? JSON.parse(rawAuthData) : null;
      const parsedAccount = rawAccountData ? normalizeAccount(JSON.parse(rawAccountData)) : null;

      if (parsedAuth) {
        setIsAuthenticated(parsedAuth.isAuthenticated || false);
        setHasCompletedSignUp(parsedAuth.hasCompletedSignUp || !!parsedAccount);
        setHasCompletedPayment(parsedAuth.hasCompletedPayment || parsedAccount?.hasCompletedPayment || false);
        setUser(parsedAuth.user || parsedAccount?.user || null);
      } else if (parsedAccount) {
        setIsAuthenticated(false);
        setHasCompletedSignUp(true);
        setHasCompletedPayment(parsedAccount.hasCompletedPayment);
        setUser(parsedAccount.user);
      }
    } catch (e) {
      console.error('Error parsing auth/account data:', e);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  const persistAccount = (accountData) => {
    try {
      const payload = normalizeAccount(accountData);
      localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to persist account data:', error);
    }
  };

  // Persist session state once initial load has completed
  useEffect(() => {
    if (!hasLoaded.current) return;
    try {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          isAuthenticated,
          hasCompletedSignUp,
          hasCompletedPayment,
          user,
        })
      );
    } catch (error) {
      console.error('Failed to write auth data:', error);
    }
  }, [isAuthenticated, hasCompletedSignUp, hasCompletedPayment, user]);

  const signUp = useCallback(async (userData) => {
    try {
      // Use authService to register the user
      const newUser = await authService.register(userData);
      
      // Update state with the new user
      setUser({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
      });
      setHasCompletedSignUp(true);
      setHasCompletedPayment(newUser.hasCompletedPayment || false);
      
      // Persist the auth state
      const authData = {
        isAuthenticated: true,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
        },
        hasCompletedSignUp: true,
        hasCompletedPayment: newUser.hasCompletedPayment || false,
      };
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      
      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: typeof error === 'string' ? error : 'Failed to create account' 
      };
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      const userAccount = await authService.login(email, password);

      if (userAccount) {
        const accountPayload = {
          user: {
            id: userAccount.id,
            fullName: userAccount.fullName,
            email: userAccount.email,
          },
          hasCompletedPayment: userAccount.hasCompletedPayment || false,
        };
        
        // Update localStorage
        localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accountPayload));
        
        // Update state
        setIsAuthenticated(true);
        setUser(accountPayload.user);
        setHasCompletedSignUp(true);
        setHasCompletedPayment(accountPayload.hasCompletedPayment);
        
        // Persist the auth state
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            isAuthenticated: true,
            user: accountPayload.user,
            hasCompletedSignUp: true,
            hasCompletedPayment: accountPayload.hasCompletedPayment,
          })
        );
        
        return { success: true, user: accountPayload.user };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || 'An error occurred during sign in' };
    }
  }, []);

  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setHasCompletedSignUp(false);
    setHasCompletedPayment(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(ACCOUNT_STORAGE_KEY);
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      if (!user?.id) return { success: false, error: 'No user logged in' };
      
      // Update user data via API
      const updatedUser = await authService.updateProfile(user.id, {
        fullName: userData.fullName,
        email: userData.email
      });
      
      // Update current user in state
      const updatedUserState = {
        ...user,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
      };
      
      setUser(updatedUserState);
      
      // Update account in localStorage
      const accountData = {
        user: updatedUserState,
        hasCompletedPayment: hasCompletedPayment,
      };
      
      persistAccount(accountData);
      
      return { success: true, user: updatedUserState };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: typeof error === 'string' ? error : 'Failed to update profile' 
      };
    }
  }, [user, hasCompletedPayment]);

  const deleteAccount = useCallback(async () => {
    try {
      if (!user?.id) return { success: false, error: 'No user logged in' };
      
      // Delete account via API
      await authService.deleteAccount(user.id);
      
      // Clear auth state
      setIsAuthenticated(false);
      setUser(null);
      setHasCompletedSignUp(false);
      setHasCompletedPayment(false);
      
      // Clear localStorage
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(ACCOUNT_STORAGE_KEY);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { 
        success: false, 
        error: typeof error === 'string' ? error : 'Failed to delete account' 
      };
    }
  }, [user?.id]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      if (!user?.id) return { success: false, error: 'No user logged in' };
      
      // Change password via API
      await authService.changePassword(user.id, currentPassword, newPassword);
      
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        error: typeof error === 'string' ? error : 'Failed to change password' 
      };
    }
  }, [user?.id]);

  const completePayment = useCallback(async () => {
    try {
      if (!user?.id) return { success: false, error: 'No user logged in' };
      
      // Update payment status via API
      const updatedUser = await authService.updateProfile(user.id, {
        hasCompletedPayment: true
      });
      
      // Update state
      setHasCompletedPayment(true);
      
      // Update auth data in localStorage
      const authData = {
        isAuthenticated: true,
        user: {
          ...user,
          hasCompletedPayment: true
        },
        hasCompletedSignUp: true,
        hasCompletedPayment: true,
      };
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      
      return { success: true };
    } catch (error) {
      console.error('Complete payment error:', error);
      return { 
        success: false, 
        error: typeof error === 'string' ? error : 'Failed to complete payment' 
      };
    }
  }, [user]);

  const canAccessHome = useCallback(() => {
    return isAuthenticated;
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasCompletedSignUp,
        hasCompletedPayment,
        user,
        signUp,
        signIn,
        signOut,
        updateProfile,
        deleteAccount,
        changePassword,
        completePayment,
        canAccessHome,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

