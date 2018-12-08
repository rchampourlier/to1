import * as React from 'react';

export class Navbar extends React.Component<undefined, undefined> {
  render() {
    return (
      <nav className='navbar is-light' role='navigation' aria-label='main navigation'>
        <div className='navbar-menu'>
          <div className='navbar-start'>
            <a className='navbar-item'>
              One App
            </a>
            <a className='navbar-item'>
              To Rule
            </a>
            <a className='navbar-item'>
              Them All
            </a>
          </div>
        </div>
      </nav>
    );
  }
}
