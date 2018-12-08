import * as React from 'react';
import { Header } from './header';
import { Navbar } from './navbar';
import { View } from './view';

class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div>
        <Header />
        <Navbar />
        <View />
      </div>
    );
  }
}

export { App };
