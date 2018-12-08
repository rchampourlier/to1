import * as React from 'react';
import { Todo, TrelloNotifications } from './fetch';

interface ViewProps {
  title: string;
}

interface ViewState {
  todos: Array<Todo>;
}

class View extends React.Component<ViewProps, ViewState> {

  constructor(props: ViewProps) {
    super(props);
    let todos: Array<Todo> = [];
    this.state = {todos: todos};
  }

  componentDidMount() {
    TrelloNotifications().then((todos) => {
      this.setState({todos: todos});
    });
  }

  /*componentWillUnmount() {
  }*/

  render() {
    const todoListItems = this.state.todos.map((todo) => {
      return <li key={todo.created}>{todo.title}</li>;
    });
    return (
      <div>
        <h2>{this.props.title}</h2>
        <ul>{todoListItems}</ul>
      </div>
    );
  }
}

export { ViewProps, ViewState, View };
