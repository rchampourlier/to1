import * as React from 'react';

interface TodoCardProps {
  title: string;
}

class TodoCard extends React.Component<TodoCardProps, undefined> {
  render() {
    return (
      <div className='todos__card card'>
        <header className='card-header'>
          <p className='card-header-title'>
            {this.props.title}
          </p>
        </header>
        <div className='card-content'>
          <div className='content'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
          </div>
        </div>
        <footer className='card-footer'>
          <a href='#' className='card-footer-item'>Archive</a>
          <a href='#' className='card-footer-item'>Pin</a>
        </footer>
      </div>
    );
  }
}

export { TodoCardProps, TodoCard };
