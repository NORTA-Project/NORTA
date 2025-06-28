import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { setUser, setLoading, UserInfo } from '../features/authSlice';
import { RootState, AppDispatch } from '../store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Firebase認証が利用できない場合はデモモードとして動作
    if (!auth) {
      console.warn("Firebase Auth not available. Running in demo mode.");
      dispatch(setLoading(false));
      // デモユーザーを設定
      const demoUser: UserInfo = {
        uid: 'demo-user',
        email: 'demo@example.com',
        displayName: 'デモユーザー',
        photoURL: null,
      };
      dispatch(setUser(demoUser));
      return;
    }

    dispatch(setLoading(true));
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userInfo: UserInfo = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        dispatch(setUser(userInfo));
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
  };
};

export default useAuth;
