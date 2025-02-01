import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface Task {
id: string;
title: string;
description: string;
dueDate: string;
assignee: string;
priority: string;
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

export const fetchTasks = () => async (dispatch: any) => {
const querySnapshot = await getDocs(collection(db, "tasks"));
const tasks: Task[] = [];
querySnapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() } as Task);
});
dispatch(setTasks(tasks));
};

export const createTask = (task: Omit<Task, "id">) => async (dispatch: any) => {
const docRef = await addDoc(collection(db, "tasks"), task);
dispatch(addTask({ id: docRef.id, ...task }));
};

export const deleteTask = (id: string) => async (dispatch: any) => {
await deleteDoc(doc(db, "tasks", id));
dispatch(removeTask(id));
};

export const editTask = (task: Task) => async (dispatch: any) => {
const taskRef = doc(db, "tasks", task.id);
await updateDoc(taskRef, task);
dispatch(updateTask(task));
};

export default tasksSlice.reducer;