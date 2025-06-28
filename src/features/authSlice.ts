import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

// ユーザー情報の型定義
export interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// 認証状態の型定義
interface AuthState {
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// 初期状態
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// ログイン用の非同期thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    if (!auth) {
      throw new Error('Firebase認証が利用できません。デモモードで実行中です。');
    }
    
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }
);

// ユーザー登録用の非同期thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }) => {
    if (!auth) {
      throw new Error('Firebase認証が利用できません。デモモードで実行中です。');
    }
    
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // ユーザープロフィールを更新
    await updateProfile(user, { displayName });
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL,
    };
  }
);

// ログアウト用の非同期thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    if (!auth) {
      throw new Error('Firebase認証が利用できません。デモモードで実行中です。');
    }
    
    await signOut(auth);
  }
);

// プロフィール更新用の非同期thunk
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ displayName, photoURL }: { displayName?: string; photoURL?: string }) => {
    if (!auth || !auth.currentUser) {
      throw new Error('ユーザーが認証されていません');
    }
    
    const updateData: { displayName?: string; photoURL?: string } = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    
    await updateProfile(auth.currentUser, updateData);
    
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Firebase Auth状態変更時の手動更新用
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ログイン
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'ログインに失敗しました';
        state.isAuthenticated = false;
      });

    // ユーザー登録
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'ユーザー登録に失敗しました';
        state.isAuthenticated = false;
      });

    // ログアウト
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'ログアウトに失敗しました';
      });

    // プロフィール更新
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'プロフィールの更新に失敗しました';
      });
  },
});

export const { setUser, clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
