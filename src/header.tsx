import * as React from 'react';

export class Header extends React.Component<undefined, undefined> {
  render () {
    return (
      <section className='hero is-dark is-small'>
        <div className='hero-body'>
          <img src='img/to1-logo-white.png' width='68px'/>
          <p className='subtitle'>
            Gather all your todos in 1 place
          </p>
        </div>
      </section>
    );
  }
}
