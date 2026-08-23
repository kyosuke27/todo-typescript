import React, { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<todo[]>([]);
  const [inputText, setInputText] = useState<string>("");

  type todo = {
    id: number;
    text: string;
    isChecked: boolean;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText.trim() !== "") {
      const newTodo: todo = {
        id: todos.length,
        text: inputText,
        isChecked: false,
      };
      setTodos([...todos, newTodo]);
      setInputText("");
    }
  };

  const handleEdit = (id: number, text: string) => {
    const newTodos: todo[] = todos.map((todo) => {
      if (todo.id === id) {
        todo.text = text;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleCheck = (id: number) => {
    const newTodos: todo[] = todos.map((todo) => {
      if (todo.id === id) {
        todo.isChecked = !todo.isChecked;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleDelete = (id: number) => {
    const newTodos: todo[] = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  return (
    <div className="App">
      <div className="">
        <h2>Todo List with Typescript</h2>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => handleChange(e)}
            className="inputText"
          />
          <input type="submit" value="Add" className="submitButton" />
        </form>
        <ul className="todoList">
          {todos.map((todo) => (
            <li key={todo.id}>
              <input
                type="text"
                className="inputText"
                value={todo.text}
                onChange={(e) => handleEdit(todo.id, e.target.value)}
                disabled={todo.isChecked}
              />
              <input
                type="checkbox"
                className="inputText"
                checked={todo.isChecked}
                onChange={() => handleCheck(todo.id)}
              />
              <input
                type="submit"
                className="inputText"
                value="delete"
                onClick={() => {
                  handleDelete(todo.id);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
