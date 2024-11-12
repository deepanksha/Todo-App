import React, { useEffect, useState } from "react";
import "../App.css";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
const Todo = () => {
  const [isCompleteScreen, setCompleteScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [completedTodoList, setCompletedTodoList] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [inputData, setInputData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTodo = () => {
    if (!inputData.title && !inputData.description) {
      alert("please fill data");
      return;
    }

    if (editItem !== null) {
      let editedTodo = allTodos.map((item) =>
        item.id === editItem
          ? {
              ...item,
              title: inputData.title,
              description: inputData.description,
            }
          : item
      );

      setAllTodos(editedTodo);
      localStorage.setItem("editedList", JSON.stringify(editedTodo));
      setToggle(true);
      setEditItem(null);
    } else {
      let newTodo = {
        id: Date.now(),
        title: inputData.title,
        description: inputData.description,
      };
      setAllTodos([...allTodos, newTodo]);
      localStorage.setItem("todolist", JSON.stringify(allTodos));
    }

    setInputData({
      title: "",
      description: "",
    });
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem("todolist"));
    let completeTodo = JSON.parse(localStorage.getItem("completedList"));

    if (savedTodo) {
      setAllTodos(savedTodo);
    }
    if (completeTodo) {
      setCompletedTodoList(completeTodo);
    }
  }, []);

  const handleDeleteTodo = (itemId) => {
    const reducedtodo = allTodos.filter((item) => item.id !== itemId);
    localStorage.setItem("todolist", JSON.stringify(reducedtodo));
    setAllTodos(reducedtodo);
  };

  const handleCompleted = (itemId) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn =
      dd + "-" + mm + "-" + yyyy + " at " + h + ":" + m + ":" + s;

    // let filtersingleItem = allTodos.filter((item) => item.id === itemId);
    let filtersingleItem = allTodos.find((item) => item.id === itemId);
    // let filteredItem = {
    //   ...allTodos[itemId],
    //   completedOn: completedOn,
    // };
    let filteredItem;
    if (filtersingleItem) {
      filteredItem = {
        ...filtersingleItem,
        completedOn: completedOn,
      };
    }

    console.log(filtersingleItem);
    console.log(filteredItem);

    setCompletedTodoList([...completedTodoList, filteredItem]);
    handleDeleteTodo(itemId);
    localStorage.setItem("completedList", JSON.stringify(completedTodoList));
  };

  const CompleteTodoDelete = (itemId) => {
    let remainingTodo = completedTodoList.filter((item) => item.id !== itemId);

    setCompletedTodoList(remainingTodo);
    localStorage.setItem("completedList", JSON.stringify(remainingTodo));
  };

  const handleEditTodo = (itemId) => {
    const editItem = allTodos.find((item) => item.id === itemId);
    // const editItem = allTodos.filter((item) => item.id === itemId);
    console.log(editItem);
    if (editItem) {
      setToggle(false);
      setEditItem(itemId);
      setInputData({
        title: editItem.title,
        description: editItem.description,
      });
    }
    console.log(inputData);
  };
  return (
    <>
      <h2>My Todos</h2>
      <div className="todo-wrapper">
        <div className="todo-inputs">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              placeholder="write here Title"
              name="title"
              value={inputData.title}
              onChange={handleChange}
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              placeholder="write here Description"
              name="description"
              value={inputData.description}
              onChange={handleChange}
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              className="primaryBtn"
              onClick={handleAddTodo}
            >
              {toggle ? "Add" : "Edit"}
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && "active"}`}
            onClick={() => setCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && "active"}`}
            onClick={() => setCompleteScreen(true)}
          >
            Complete
          </button>
        </div>
        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodos?.map((item) => (
              <div className="todo-list-item" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <FaRegEdit
                    className="icon"
                    onClick={() => handleEditTodo(item.id)}
                  />
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => handleDeleteTodo(item.id)}
                  />
                  <BsCheck
                    className="check-icon"
                    onClick={() => handleCompleted(item.id)}
                  />
                </div>
              </div>
            ))}
          {isCompleteScreen === true &&
            completedTodoList?.map((item) => (
              <div className="todo-list-item" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>
                    <small>completed On {item.completedOn}</small>
                  </p>
                </div>
                <div>
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => CompleteTodoDelete(item.id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Todo;
