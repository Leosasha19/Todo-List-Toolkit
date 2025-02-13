import React, {useEffect, useState} from 'react';
import './MainPage.scss';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {addTodo, changeCompletedTodo, deleteTodo, getTodos, selectTodosState} from "../../features/TodoSlice.ts";
import deleteImg from "../../assets/pictures/basket.png";
import done from "../../assets/pictures/done.png";
import undone from "../../assets/pictures/undone.png";


const MainPage = () => {

    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState("")
    const todosState = useAppSelector(selectTodosState)

    const addHandler = () => {
        dispatch(addTodo(inputValue))
        setInputValue("")
    }

    useEffect(() => {
        dispatch(getTodos())
    }, [])

    return (
            <div className={"mainContainer"}>
                <div className={"mainContainer__topLine"}>
                    <input
                        className={"mainContainer__topLine__inputTodo"}
                        onChange={(event) => setInputValue(event.target.value)}
                        value={inputValue}
                        type="text" name="" id=""/>
                    <button
                        onClick={addHandler}
                        className={"mainContainer__topLine__addButton"}>Добавить</button>
                </div>
                <div className={"mainContainer__todos"}>
                    <div className={"mainContainer__todos__name"}>Задачи</div>
                    <div className={"mainContainer__todos__box"}>
                        {todosState.todos && todosState.todos.map((item) => {
                                return (
                                    <div key={item.id}
                                         className={"mainContainer__todos__box__todo"}>
                                        <div className={"todoLeftMenu"}>
                                            <input
                                                onChange={() => dispatch(changeCompletedTodo(item.id))}
                                                checked={item.completed}
                                                type="checkbox"/>
                                            <img
                                                className={"todoLeftMenu__picture"}
                                                src={item.completed ? done : undone} alt="Todo Status"/>
                                            <div style={item.completed ? { textDecoration: 'line-through' } : { textDecoration: 'none' }} >
                                                {item.description}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {dispatch(deleteTodo(item.id))}}
                                            className={"deleteButton"}>
                                            <img src={deleteImg} alt="Удалить"/>
                                        </button>
                                    </div>
                                )}
                        )}
                    </div>
                    </div>
                </div>
                );
                };

                export default MainPage;