import * as React from 'react';
import * as TrelloNotifications from './trello_notifications';

interface ViewState {
  trelloNotificationItems: Array<TrelloNotifications.Item>;
}

class View extends React.Component<undefined, ViewState> {

  constructor() {
    super();
    let trelloNotificationItems: Array<TrelloNotifications.Item> = [];
    this.state = {trelloNotificationItems: trelloNotificationItems};
  }

  componentDidMount() {
    TrelloNotifications.Fetch().then((items) => {
      this.setState({trelloNotificationItems: items});
    });
  }

  render() {
    const trelloNotificationCards = this.state.trelloNotificationItems.map((item) => {
      return TrelloNotifications.Card(item);
    });
    return (
      <div className='trellonotifs'>
        {trelloNotificationCards}
      </div>
    );
  }
}

export { ViewState, View };
