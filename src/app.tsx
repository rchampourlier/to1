import * as React from 'react';
import { View } from './view';

class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div>
        <h1>to1</h1>
        <View title='Todos'/>
      </div>
    );
  }
}

export { App };
