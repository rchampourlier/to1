import * as React from 'react';

export class Navbar extends React.Component<undefined, undefined> {
  render() {
    return (
      <nav className='navbar is-dark is-fixed-top' role='navigation' aria-label='main navigation'>
        <div className='navbar-brand'>
          <div className='navbar-item'>
            <img src='img/to1-logo-white.png' width='68px'/>
          </div>
          <div className='navbar-item'>
            <div className='tabs is-toggle is-toggle-rounded'>
              <ul>
                <li className='is-active'>
                  <a>
                    <span className='icon has-text-white'>
                      <i className='fab fa-trello' />
                    </span>
                  </a>
                </li>
                <li>
                  <a>
                    <span className='icon'>
                      <figure className='image is-16x16'>
                        <img src='img/icon-confluence-white.png' />
                      </figure>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='navbar-menu'>
          <div className='navbar-start' />
          <div className='navbar-end'>
            <div className='navbar-item'>
              <p>Gather all your todos in 1 place</p>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
