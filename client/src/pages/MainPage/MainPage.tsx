import { useEffect, useState } from 'react';

import deleteImg from '../../assets/icons/basket.png';
import done from '../../assets/icons/done.png';
import undone from '../../assets/icons/undone.png';
import {
  addTodo,
  changeCompletedTodo,
  deleteTodo,
  getTodos,
  selectTodosState,
} from '../../features/TodoSlice.ts';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.ts';

import './MainPage.scss';

const MainPage = () => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const todosState = useAppSelector(selectTodosState);

  const addHandler = () => {
    dispatch(addTodo(inputValue));
    setInputValue('');
  };

  useEffect(() => {
    dispatch(getTodos());
  }, []);

  return (
    <div className={'mainContainer'}>
      {todosState.error ? (
        <div className="error-message">{'Упс... Похоже что то сломалось'}</div>
      ) : (
        <>
          <div className={'mainContainer__topLine'}>
            <input
              className={'mainContainer__topLine__inputTodo'}
              onChange={(event) => setInputValue(event.target.value)}
              value={inputValue}
              type="text"
              name=""
              id=""
            />
            <button onClick={addHandler} className={'mainContainer__topLine__addButton'}>
              Добавить
            </button>
          </div>
          <div className={'mainContainer__todos'}>
            <div className={'mainContainer__todos__name'}>Задачи</div>
            <div className={'mainContainer__todos__box'}>
              {todosState.todos &&
                todosState.todos.map((item) => {
                  return (
                    <div key={item.id} className={'mainContainer__todos__box__todo'}>
                      <div className={'todoLeftMenu'}>
                        <input
                          onChange={() => {
                            if (item.id == null) return;
                            dispatch(changeCompletedTodo(item.id));
                          }}
                          checked={item.completed}
                          type="checkbox"
                        />
                        <img
                          className={'todoLeftMenu__picture'}
                          src={item.completed ? done : undone}
                          alt="Todo Status"
                        />
                        <div
                          style={
                            item.completed
                              ? { textDecoration: 'line-through' }
                              : { textDecoration: 'none' }
                          }
                        >
                          {item.description}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (item.id == null) return;
                          dispatch(deleteTodo(item.id));
                        }}
                        className={'deleteButton'}
                      >
                        <img src={deleteImg} alt="Удалить" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainPage;
