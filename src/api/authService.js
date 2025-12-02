const STORAGE_KEY = 'streamsavvy_users';

// Initialize users in localStorage if not exists
const initializeUsers = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
      {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        createdAt: new Date().toISOString(),
        hasCompletedPayment: true
      }
    ]));
  }
};

// Get all users
const getUsers = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const authService = {
  // Initialize the auth system
  initialize: () => {
    initializeUsers();
  },

  // Register a new user
  register: async (userData) => {
    const users = getUsers();
    
    // Check if user already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already in use');
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      hasCompletedPayment: false
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
  },

  // Login user
  login: async (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return user;
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Keep the original password if not provided
    const updatedUser = {
      ...users[userIndex],
      ...userData,
      // Don't update the password if it's not provided
      password: userData.password || users[userIndex].password
    };
    
    users[userIndex] = updatedUser;
    saveUsers(users);
    return updatedUser;
  },

  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const user = users[userIndex];
    
    // Verify current password
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Update password
    user.password = newPassword;
    users[userIndex] = user;
    saveUsers(users);
    
    return { success: true };
  },

  // Delete user account
  deleteAccount: async (userId) => {
    const users = getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    
    if (filteredUsers.length === users.length) {
      throw new Error('User not found');
    }
    
    saveUsers(filteredUsers);
    return { success: true };
  },

  // Get user by ID
  getUser: async (userId) => {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
};

// Initialize the auth service when the module loads
authService.initialize();
