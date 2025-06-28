import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import useAuth from '../hooks/useAuth';

const DebugInfo: React.FC = () => {
  const { user, isLoading, error, isAuthenticated } = useAuth();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3>Debug Info</h3>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.displayName || user.email : 'None'}</div>
      <div>Tasks: {tasks.length}</div>
      <div>Error: {error || 'None'}</div>
    </div>
  );
};

export default DebugInfo;
