import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser, updateUserProfile } from '../features/authSlice';
import { AppDispatch } from '../store';
import useAuth from '../hooks/useAuth';
import './UserProfile.css';

interface UserProfileProps {
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateUserProfile({ displayName })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
    }
  };

  const handleCancelEdit = () => {
    setDisplayName(user?.displayName || '');
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile">
        <h2>ユーザープロフィール</h2>
        
        <div className="profile-info">
          <div className="profile-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt="プロフィール画像" />
            ) : (
              <div className="avatar-placeholder">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-details">
            <div className="profile-field">
              <label>表示名</label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="profile-input"
                  placeholder="表示名を入力"
                />
              ) : (
                <span className="profile-value">
                  {user.displayName || '未設定'}
                </span>
              )}
            </div>

            <div className="profile-field">
              <label>メールアドレス</label>
              <span className="profile-value">{user.email}</span>
            </div>

            <div className="profile-field">
              <label>ユーザーID</label>
              <span className="profile-value user-id">{user.uid}</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <div className="edit-actions">
              <button 
                onClick={handleSaveProfile} 
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : '保存'}
              </button>
              <button 
                onClick={handleCancelEdit} 
                className="cancel-btn"
                disabled={isLoading}
              >
                キャンセル
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className="edit-btn"
            >
              編集
            </button>
          )}

          <button 
            onClick={handleLogout} 
            className="logout-btn"
            disabled={isLoading}
          >
            ログアウト
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

export default UserProfile;
