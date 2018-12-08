import * as React from 'react';
import { Todo, TrelloNotifications } from './fetch';
import { TodoCard } from './todo_card';

interface ViewState {
  todos: Array<Todo>;
}

class View extends React.Component<undefined, ViewState> {

  constructor() {
    super();
    let todos: Array<Todo> = [];
    this.state = {todos: todos};
  }

  componentDidMount() {
    TrelloNotifications().then((todos) => {
      this.setState({todos: todos});
    });
  }

  render() {
    const todoCards = this.state.todos.map((todo) => {
      return <TodoCard key={todo.created} title={todo.title} />;
    });
    return (
      <div className='todos__cards'>
        {todoCards}
      </div>
    );
  }
}

export { ViewState, View };
