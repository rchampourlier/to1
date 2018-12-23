import * as React from 'react';
import * as TrelloNotifications from './trello_notifications';

interface ViewState {
  trelloNotificationItems: Array<TrelloNotifications.Item>;
}

class View extends React.Component<undefined, ViewState> {

  constructor() {
    super();
    this.state = {
      trelloNotificationItems: []
    };

    this.updateItems = this.updateItems.bind(this);
  }

  componentDidMount() {
    TrelloNotifications.Fetch().then((items) => {
      this.setState({trelloNotificationItems: items});
    });
  }

  updateItems(): void {
    TrelloNotifications.Fetch().then((items) => {
      this.setState({trelloNotificationItems: items});
    });
  }

  render() {
    const trelloNotificationCards = this.state.trelloNotificationItems.map((item) => {
      return TrelloNotifications.Card(item, this.updateItems);
    });
    return (
      <div className='trellonotif-cards'>
        {trelloNotificationCards}
      </div>
    );
  }
}

export { ViewState, View };
