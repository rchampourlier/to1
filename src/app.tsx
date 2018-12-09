import * as React from 'react';
import { Navbar } from './navbar';
import { View } from './view';

class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div>
        <Navbar />
        <View />
      </div>
    );
  }
}

export { App };
