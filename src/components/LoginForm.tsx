import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser, clearError } from '../features/authSlice';
import { AppDispatch } from '../store';
import useAuth from '../hooks/useAuth';
import './LoginForm.css';

interface LoginFormProps {
  onClose?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // エラークリア
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      if (isLoginMode) {
        await dispatch(loginUser({
          email: formData.email,
          password: formData.password
        })).unwrap();
      } else {
        await dispatch(registerUser({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName
        })).unwrap();
      }
      
      // 成功時はフォームを閉じる
      if (onClose) {
        onClose();
      }
    } catch (error) {
      // エラーは既にstoreで管理されている
      console.error('認証エラー:', error);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    });
    dispatch(clearError());
  };

  const getErrorMessage = (error: string) => {
    if (error.includes('auth/user-not-found')) {
      return 'ユーザーが見つかりません';
    }
    if (error.includes('auth/wrong-password')) {
      return 'パスワードが間違っています';
    }
    if (error.includes('auth/email-already-in-use')) {
      return 'このメールアドレスは既に使用されています';
    }
    if (error.includes('auth/weak-password')) {
      return 'パスワードは6文字以上で入力してください';
    }
    if (error.includes('auth/invalid-email')) {
      return '有効なメールアドレスを入力してください';
    }
    return error;
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h2>{isLoginMode ? 'ログイン' : 'アカウント作成'}</h2>
        
        {error && (
          <div className="error-message">
            {getErrorMessage(error)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="displayName">表示名</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                required={!isLoginMode}
                placeholder="表示名を入力"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="メールアドレスを入力"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="パスワードを入力"
              minLength={6}
            />
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">パスワード確認</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!isLoginMode}
                placeholder="パスワードを再入力"
                minLength={6}
              />
              {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                <small className="error-text">パスワードが一致しません</small>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading || (!isLoginMode && formData.password !== formData.confirmPassword)}
          >
            {isLoading ? '処理中...' : (isLoginMode ? 'ログイン' : 'アカウント作成')}
          </button>
        </form>

        <div className="form-switch">
          <button type="button" onClick={toggleMode} className="switch-btn">
            {isLoginMode ? 'アカウントを作成' : 'ログインに戻る'}
          </button>
        </div>

        {onClose && (
          <button type="button" onClick={onClose} className="close-btn">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
