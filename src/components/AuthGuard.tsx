import React, { ReactNode } from 'react';
import useAuth from '../hooks/useAuth';
import LoginForm from './LoginForm';
import './AuthGuard.css';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>認証状態を確認中...</p>
      </div>
    );
  }

  // Firebase認証が利用できない場合はデモモードとして直接表示
  if (!isAuthenticated) {
    // 環境変数が設定されていない場合はデモモードで動作
    const isDemo = !import.meta.env.VITE_API_KEY || import.meta.env.VITE_API_KEY === 'demo-api-key';
    
    if (isDemo) {
      console.log("Running in demo mode - authentication skipped");
      return <>{children}</>;
    }
    
    return fallback ? <>{fallback}</> : <LoginForm />;
  }

  return <>{children}</>;
};

export default AuthGuard;
