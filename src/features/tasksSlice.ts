import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AppDispatch } from "../store"; // AppDispatch をインポート

export interface Task {
id: string;
title: string;
description: string;
startDate: string;
endDate: string;
assignee: string;
priority: string;
status: string;
group: string;
createdAt: string;
ownerId: string; // タスクの所有者（作成者）のUID
ownerEmail?: string; // タスクの所有者のメールアドレス（表示用）
}

interface TasksState {
tasks: Task[];
}

const initialState: TasksState = {
tasks: [],
};

const tasksSlice = createSlice({
name: "tasks",
initialState,
reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
    state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
    state.tasks.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<string>) => {
    state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
    const index = state.tasks.findIndex((task) => task.id === action.payload.id);
    if (index !== -1) {
        state.tasks[index] = action.payload;
    }
    },
},
});

export const { setTasks, addTask, removeTask, updateTask } = tasksSlice.actions;

export const fetchTasks = (userId: string) => async (dispatch: AppDispatch) => {
if (!db) {
    console.warn("Firestore not available. Loading demo tasks.");
    // デモタスクを作成
    const demoTasks: Task[] = [
        {
            id: "demo-1",
            title: "デモタスク1",
            description: "これはデモ用のタスクです",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assignee: "デモユーザー",
            priority: "中",
            status: "未着手",
            group: "デモプロジェクト",
            createdAt: new Date().toISOString(),
            ownerId: userId,
            ownerEmail: "demo@example.com"
        },
        {
            id: "demo-2",
            title: "デモタスク2",
            description: "これも別のデモタスクです",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assignee: "デモユーザー",
            priority: "高",
            status: "進行中",
            group: "デモプロジェクト",
            createdAt: new Date().toISOString(),
            ownerId: userId,
            ownerEmail: "demo@example.com"
        }
    ];
    dispatch(setTasks(demoTasks));
    return;
}

const querySnapshot = await getDocs(collection(db, "tasks"));
const tasks: Task[] = [];
querySnapshot.forEach((doc) => {
    const taskData = doc.data() as Omit<Task, 'id'>;
    // ユーザーが所有者のタスクのみを取得
    if (taskData.ownerId === userId) {
        tasks.push({ id: doc.id, ...taskData } as Task);
    }
});
dispatch(setTasks(tasks));
};

export const createTask = (task: Omit<Task, "id">) => async (dispatch: AppDispatch) => {
if (!db) {
    console.warn("Firestore not available. Adding task to local state only.");
    const newTask: Task = { id: `demo-${Date.now()}`, ...task };
    dispatch(addTask(newTask));
    return;
}

const docRef = await addDoc(collection(db, "tasks"), task);
dispatch(addTask({ id: docRef.id, ...task }));
};

export const deleteTask = (id: string) => async (dispatch: AppDispatch) => {
if (!db) {
    console.warn("Firestore not available. Removing task from local state only.");
    dispatch(removeTask(id));
    return;
}

await deleteDoc(doc(db, "tasks", id));
dispatch(removeTask(id));
};

export const editTask = (task: Task) => async (dispatch: AppDispatch) => {
if (!db) {
    console.warn("Firestore not available. Updating task in local state only.");
    dispatch(updateTask(task));
    return;
}

const taskRef = doc(db, "tasks", task.id);
const taskDoc = await getDoc(taskRef);
if (taskDoc.exists()) {
    const existingData = taskDoc.data();
    const updatedData = { ...existingData, ...task };
    await updateDoc(taskRef, updatedData);
    dispatch(updateTask(task));
}
};

export default tasksSlice.reducer;