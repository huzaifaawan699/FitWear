import React from 'react';
import ToDoList from '../components/ToDoList';

const ToDoListPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">30-Day To-Do List</h1>
      <ToDoList />
    </div>
  );
};

export default ToDoListPage;
