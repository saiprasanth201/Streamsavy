import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiUser, FiCheckCircle, FiEdit2, FiTrash2, FiLock, FiX, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';

const Account = () => {
  const navigate = useNavigate();
  const { 
    user, 
    hasCompletedPayment, 
    updateProfile, 
    deleteAccount, 
    changePassword, 
    signOut 
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const profile = useMemo(
    () => ({
      name: user?.fullName || 'StreamSavvy Member',
      email: user?.email || 'Not provided',
      status: hasCompletedPayment ? 'Active' : 'Incomplete',
      joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
    }),
    [user, hasCompletedPayment]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    const result = await updateProfile({
      fullName: formData.fullName,
      email: formData.email
    });

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setIsEditing(false);
    } else {
      setError(result.error || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = await changePassword(formData.currentPassword, formData.newPassword);

    if (result.success) {
      setSuccess('Password changed successfully!');
      setTimeout(() => {
        setSuccess('');
        setIsChangingPassword(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }, 3000);
    } else {
      setError(result.error || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Failed to delete account');
      setShowDeleteConfirm(false);
    }
  };

  const startEditing = () => {
    setFormData({
      ...formData,
      fullName: user?.fullName || '',
      email: user?.email || ''
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="page page--account">
      <div className="page__content">
        <header className="page__header">
          <div className="flex justify-between items-center">
            <div>
              <h1>Account Overview</h1>
              <p>Manage your StreamSavvy profile and settings</p>
            </div>
            {!isEditing && !isChangingPassword && (
              <div className="flex gap-2">
                <button 
                  onClick={startEditing}
                  className="btn btn--outline"
                >
                  <FiEdit2 className="mr-2" /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Success Message */}
        {success && (
          <motion.div 
            className="alert alert--success mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {success}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div 
            className="alert alert--error mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Profile Section */}
        <section className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card__title">Profile Information</h2>
            {isEditing && (
              <button 
                onClick={cancelEditing}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={cancelEditing}
                  className="btn btn--outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  <FiSave className="mr-2" /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-1/3 text-gray-600">Name</div>
                <div className="flex-1">{profile.name}</div>
              </div>
              <div className="flex items-start">
                <div className="w-1/3 text-gray-600">Email</div>
                <div className="flex-1">{profile.email}</div>
              </div>
              <div className="flex items-start">
                <div className="w-1/3 text-gray-600">Member Since</div>
                <div className="flex-1">{profile.joinDate}</div>
              </div>
              <div className="flex items-start">
                <div className="w-1/3 text-gray-600">Membership Status</div>
                <div className="flex-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${hasCompletedPayment ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Change Password Section */}
        <section className="card mb-6">
          <h2 className="card__title mb-4">Security</h2>
          
          {isChangingPassword ? (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    required
                  />
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    required
                  />
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    required
                  />
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsChangingPassword(false)}
                  className="btn btn--outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Update Password
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-gray-600">Last changed: {new Date().toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="btn btn--outline"
              >
                Change Password
              </button>
            </div>
          )}
        </section>

        {/* Danger Zone */}
        <section className="card border-red-200">
          <div className="text-red-700">
            <h2 className="card__title text-red-700">Danger Zone</h2>
            <p className="text-sm text-red-600 mb-4">These actions are irreversible. Please be certain.</p>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-red-100">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
              </div>
              
              {showDeleteConfirm ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <p className="text-sm text-red-600">Are you sure? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn btn--outline btn--sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteAccount}
                      className="btn btn--danger btn--sm"
                    >
                      <FiTrash2 className="mr-1" /> Delete My Account
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn--danger"
                >
                  <FiTrash2 className="mr-1" /> Delete Account
                </button>
              )}
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-red-100">
              <div>
                <h3 className="font-medium">Sign Out</h3>
                <p className="text-sm text-red-600">Sign out of your account on this device</p>
              </div>
              <button 
                onClick={() => {
                  signOut();
                  navigate('/signin');
                }}
                className="btn btn--outline border-red-200 text-red-700 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Account;
