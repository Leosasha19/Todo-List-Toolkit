import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {RootState} from "../redux/store/store.ts";

export interface Todo {
    id: number | null;
    completed: boolean;
    description: string;
}

export interface TodosState {
    todos: Todo[];
    currentTodo: Todo;
    error: string | null;
    loading: boolean;
}

export const initialState: TodosState = {
    todos: [],
    currentTodo: {id: null, completed: false, description: ''},
    error: null,
    loading: false,
}

export const getTodos = createAsyncThunk("todos/getTodos",
   async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get("http://localhost:5001/todos")
        return response.data
    } catch (error:any) {
        return rejectWithValue(error.response?.data || "Ошибка при загрузке Todos")
    }})

export const addTodo = createAsyncThunk("todos/addTodo",
    async (description: string, {rejectWithValue}) => {
    try {
        const response = await axios.post("http://localhost:5001/todos", {
            description
        })
        return response.data
    } catch (error:any) {
        return rejectWithValue(error.response?.data || "Ошибка при добавлении Todo")
    }})

export const deleteTodo = createAsyncThunk("todos/deleteTodo",
    async (id: number, {rejectWithValue}) => {
    try {
         await axios.delete(`http://localhost:5001/todos/${id}`)
        return id;
    } catch (error:any) {
        return rejectWithValue(error.response?.data || "Ошибка при удалении задачи")
    }})

export const changeCompletedTodo = createAsyncThunk("todos/changeCompleted",
    async (id:number, {rejectWithValue}) => {
        try {
            const response = await axios.put(`http://localhost:5001/todos/${id}`)
            return response.data
        } catch (error:any) {
            return rejectWithValue(error.response?.data || "Ошибка при изменении статуса completed")
        }
    })

export const changeDescriptionTodo = createAsyncThunk("todo/changeDescription",
    async ({id, newDescription}:{id:number, newDescription:string}, {rejectWithValue}) => {
        try {
            const response = await axios.patch(`http://localhost:5001/todos/${id}`, {
                description: newDescription
            })
            return response.data
      } catch (error:any) {
            return rejectWithValue(error.response?.data || "Ошибка при изменении description")
        }
    })

export const TodoStateSlice = createSlice({
    name: "todosData",
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTodos.pending, (state) => {
                state.loading = true
            })
            .addCase(getTodos.fulfilled, (state , action) => {
                state.todos = action.payload;
                    state.loading = false
            })
            .addCase(getTodos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addTodo.pending, (state) => {
                state.loading = true
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.todos.push(action.payload)
                state.loading = false
            })
            .addCase(addTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
            .addCase(deleteTodo.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.todos = state.todos.filter(todo => todo.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(changeCompletedTodo.pending, (state) => {
                state.loading = true;
            })
            .addCase(changeCompletedTodo.fulfilled, (state, action) => {
                state.loading = false;
                state.todos = state.todos.map((todo) => todo.id === action.payload.id ? {...todo, completed: action.payload.completed} : todo)
            })
            .addCase(changeCompletedTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(changeDescriptionTodo.pending, (state) => {
                state.loading = true;
            })
            .addCase(changeDescriptionTodo.fulfilled, (state, action) => {
                state.loading = false;
                state.todos = state.todos.map((todo) => todo.id === action.payload.id ? {...todo, ...action.payload} : todo)
            })
            .addCase(changeDescriptionTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
})

export default TodoStateSlice.reducer;
export const selectTodosState = (state: RootState) => state.todosState || initialState;