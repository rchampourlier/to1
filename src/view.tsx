import * as React from 'react';
import * as ConfluenceInlineTasks from './confluence_inline_tasks';
import * as TrelloNotifications from './trello_notifications';
import * as out from './interfaces';

interface ViewState {
  items: Array<out.Item>;
}

function sortItems(a: out.Item, b: out.Item): number {
  if (a.created < b.created) {
    return -1;
  } else if (a.created > b.created) {
    return 1;
  } else {
    return 0;
  }
}

class View extends React.Component<undefined, ViewState> {

  constructor() {
    super();
    this.state = {
      items: []
    };

    this.updateItems = this.updateItems.bind(this);
  }

  componentDidMount() {
    ConfluenceInlineTasks.Fetch().then((items) => {
      this.setState({items: this.state.items.concat(items).sort(sortItems)});
    });
    TrelloNotifications.Fetch().then((items) => {
      this.setState({items: this.state.items.concat(items).sort(sortItems)});
    });
  }

  updateItems(): void {
    TrelloNotifications.Fetch().then((items) => {
      this.setState({items: items});
    });
  }

  render() {
    const cards: Array<JSX.Element> = this.state.items.map((item) => {
      switch (item.type) {
        case 'trello-notification':
          return TrelloNotifications.BuildCard(item as TrelloNotifications.Item, this.updateItems);
        case 'confluence-inline-task':
          return ConfluenceInlineTasks.BuildCard(item as ConfluenceInlineTasks.Item, this.updateItems);
        default:
          return null;
      }
    });
    return (
      <div className='cards'>
        {cards}
      </div>
    );
  }
}

export { ViewState, View };
