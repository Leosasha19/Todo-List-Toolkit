import axios from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../redux/store/store.ts';

const api = import.meta.env.VITE_API_URL;

export interface Todo {
  id: number | null;
  completed: boolean;
  description: string;
}

export interface TodosState {
  todos: Todo[];
  currentTodo: Todo;
  error: string;
  loading: boolean;
}

export const initialState: TodosState = {
  todos: [],
  currentTodo: { id: null, completed: false, description: '' },
  error: '',
  loading: false,
};

interface ApiError {
  message: string;
  status: number;
}

interface ChangeDescription {
  id: number;
  newDescription: string;
}

export const getTodos = createAsyncThunk<Todo[], void, { rejectValue: ApiError }>(
  'todos/getTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Todo[]>(`${api}/todos`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Ошибка при получении задач',
          status: error.response?.status || 500,
        });
      }
      return rejectWithValue({ message: 'Неизвестная ошибка', status: 503 });
    }
  }
);

export const addTodo = createAsyncThunk<Todo, string, { rejectValue: ApiError }>(
  'todos/addTodo',
  async (description, { rejectWithValue }) => {
    try {
      const response = await axios.post<Todo>(`${api}/todos`, {
        description,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Ошибка при добавлении задачи',
          status: error.response?.status || 500,
        });
      }
      return rejectWithValue({
        message: 'Ошибка при добавлении',
        status: 503,
      });
    }
  }
);

export const deleteTodo = createAsyncThunk<number, number, { rejectValue: ApiError }>(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${api}/todos/${id}`);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Ошибка при удалении задачи',
          status: error.response?.status || 500,
        });
      }
      return rejectWithValue({
        message: 'Ошибка при удалении',
        status: 503,
      });
    }
  }
);

export const changeCompletedTodo = createAsyncThunk<Todo, number, { rejectValue: ApiError }>(
  'todos/changeCompleted',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put<Todo>(`${api}/todos/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Ошибка при изменении статуса задачи',
          status: error.response?.status || 500,
        });
      }
      return rejectWithValue({
        message: 'Ошибка при изменении статуса',
        status: 503,
      });
    }
  }
);

export const changeDescriptionTodo = createAsyncThunk<
  Todo,
  ChangeDescription,
  { rejectValue: ApiError }
>('todo/changeDescription', async ({ id, newDescription }, { rejectWithValue }) => {
  try {
    const response = await axios.patch<Todo>(`${api}/todos/${id}`, {
      description: newDescription,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Ошибка при изменении задачи',
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: 'Ошибка при изменении',
      status: 503,
    });
  }
});

export const TodoStateSlice = createSlice({
  name: 'todosData',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.loading = false;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Произошла неизвестная ошибка при получении';
      })
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
        state.loading = false;
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Произошла неизвестная ошибка при добавлении';
      })
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Произошла неизвестная ошибка при удалении';
      })
      .addCase(changeCompletedTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeCompletedTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, completed: action.payload.completed } : todo
        );
      })
      .addCase(changeCompletedTodo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || 'Произошла неизвестная ошибка при изменении статуса';
      })
      .addCase(changeDescriptionTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeDescriptionTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo
        );
      })
      .addCase(changeDescriptionTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Произошла неизвестная ошибка при изменении';
      });
  },
});

export default TodoStateSlice.reducer;
export const selectTodosState = (state: RootState) => state.todosState || initialState;
