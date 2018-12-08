import * as React from 'react';
import { Todo } from './fetch';

//const todos = await ConfluenceInlineTasks();
const todos: Array<Todo> = [];
const todoItems = todos.map((todo) => {
  return (
    <li>{todo.title}</li>
  );
});

class View extends React.Component<undefined, undefined> {
  render() {
    return (
      <ul>{todoItems}</ul>
    );
  }
}

export { View };
