import * as React from 'react';
import * as request from 'request';

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

interface Item {
  key: string;
  notificationType: string;
  notificationCreated: string;
  notificationInfo: string;
  cardTitle: string;
  cardUrl: string;
  cardDue: string | void;
  boardTitle: string;
  boardUrl: string;
}

class CardComponent extends React.Component<Item, undefined> {
  render() {
    let notificationTypeIconClassName = '';
    switch (this.props.notificationType) {
      case 'cardDueSoon':
        notificationTypeIconClassName = 'far fa-calendar-alt';
        break;
      case 'mentionedOnCard':
        notificationTypeIconClassName = 'fas fa-quote-left';
        break;
      case 'commentCard':
        notificationTypeIconClassName = 'fas fa-comment';
        break;
      case 'changeCard':
        notificationTypeIconClassName = 'fas fa-user-edit';
        break;
      case 'addAttachmentToCard':
        notificationTypeIconClassName = 'fas fa-paperclip';
        break;
    }

    let dueDiv: JSX.Element;
    if (this.props.cardDue) {
      dueDiv = <div>Due {this.props.cardDue}</div>;
    } else {
      dueDiv = <div />;
    }
    return (
      <div className='todo-card'>
        <div className='trello-card'>
          <span className='icon'>
            <i className='fab fa-trello' />
          </span>
          <a href={this.props.cardUrl}>{this.props.cardTitle}</a>
        </div>
        { dueDiv }
        <div className='todo-card__context-link'>
          <a href={this.props.boardUrl}>{this.props.boardTitle}</a>
        </div>
        <div className='todo-card__info'>
          <span className='icon'>
            <i className={notificationTypeIconClassName} />
          </span>
          {this.props.notificationInfo}
        </div>
        <div>{this.props.notificationCreated}</div>
      </div>
    );
  }
}

function Card(item: Item) {
  return (
    <CardComponent
      key={item.key}
      notificationType={item.notificationType}
      notificationCreated={item.notificationCreated}
      notificationInfo={item.notificationInfo}
      cardTitle={item.cardTitle}
      cardUrl={item.cardUrl}
      cardDue={item.cardDue}
      boardTitle={item.boardTitle}
      boardUrl={item.boardUrl}
    />
  );
}

function Fetch(): Promise<Array<Item>> {
  let items: Array<Item> = [];
  return new Promise<Array<Item>>((resolve, reject) => {
    request('https://api.trello.com/1/members/me/notifications', {
      'qs': {
        'key': TRELLO_KEY,
        'token': TRELLO_TOKEN,
      }}, (error, response, body) => {

        if (error == null && response && response.statusCode === 200) {
          let notifications = JSON.parse(body);

          notifications.forEach((notification: any) => {
            if (true || notification.unread) {
              let
                data = notification.data,
                itemKey = 'trello-notification__' + notification.type + '__' + notification.date;

              switch (notification.type) {

                case 'cardDueSoon':
                  items.push({
                    key: itemKey,
                    notificationType: notification.type,
                    notificationCreated: notification.date,
                    notificationInfo: 'Due soon',
                    cardTitle: data.card.name,
                    cardUrl: 'https://trello.com/c/' + data.card.shortLink,
                    cardDue: data.card.due,
                    boardTitle: data.board.name,
                    boardUrl: 'https://trello.com/b/' + data.board.shortLink,
                  });
                  break;

                case 'mentionedOnCard':
                  items.push({
                    key: itemKey,
                    notificationType: notification.type,
                    notificationCreated: notification.date,
                    notificationInfo: data.text,
                    cardTitle: data.card.name,
                    cardUrl: 'https://trello.com/c/' + data.card.shortLink,
                    cardDue: data.card.due,
                    boardTitle: data.board.name,
                    boardUrl: 'https://trello.com/b/' + data.board.shortLink,
                  });
                  break;

                case 'commentCard':
                  items.push({
                    key: itemKey,
                    notificationType: notification.type,
                    notificationCreated: notification.date,
                    notificationInfo: data.text,
                    cardTitle: data.card.name,
                    cardUrl: 'https://trello.com/c/' + data.card.shortLink,
                    cardDue: data.card.due,
                    boardTitle: data.board.name,
                    boardUrl: 'https://trello.com/b/' + data.board.shortLink,
                  });
                  break;

                case 'notificationCreatedCard':
                  items.push({
                    key: itemKey,
                    notificationType: notification.type,
                    notificationCreated: notification.date,
                    notificationInfo: data.text,
                    cardTitle: data.card.name,
                    cardUrl: 'https://trello.com/c/' + data.card.shortLink,
                    cardDue: data.card.due,
                    boardTitle: data.board.name,
                    boardUrl: 'https://trello.com/b/' + data.board.shortLink,
                  });
                  break;

                case 'changeCard':
                  let info: string;
                  if (data.listBefore) {
                    info = 'Moved from "' + data.listBefore.name + '" to "' + data.listAfter.name + '"';
                  } else if (data.old && data.old.due !== null) {
                    info = 'Card due changed to ' + data.card.due + ' (was ' + data.old.due + ')';
                  } else if (data.old && data.old.due === null) {
                    info = 'Card due set to ' + data.card.due;
                  } else if (data.old && data.old.closed !== undefined) {
                    if (data.old.closed === true) {
                      info = 'Card archived';
                    } else {
                      info = 'Card unarchived';
                    }
                  } else {
                    info = 'N/A';
                    console.log(notification);
                  }
                  items.push({
                    key: itemKey,
                    notificationType: notification.type,
                    notificationCreated: notification.date,
                    notificationInfo: info,
                    cardTitle: data.card.name,
                    cardUrl: 'https://trello.com/c/' + data.card.shortLink,
                    cardDue: data.card.due,
                    boardTitle: data.board.name,
                    boardUrl: 'https://trello.com/b/' + data.board.shortLink,
                  });
                  break;

                case 'addAttachmentToCard':
                  items.push({
                    key: itemKey,
                    notificationType: notification.type,
                    notificationCreated: notification.date,
                    notificationInfo: 'Added attachment',
                    cardTitle: data.card.name,
                    cardUrl: 'https://trello.com/c/' + data.card.shortLink,
                    cardDue: data.card.due,
                    boardTitle: data.board.name,
                    boardUrl: 'https://trello.com/b/' + data.board.shortLink,
                  });
                  break;

                default:
              }
            }
          });
          resolve(items);
        } else if (error !== null) {
          reject(new Error(error));
        } else {
          reject(new Error('Non-200 status code: ' + response.statusCode + ' (' + body + ')'));
        }
      }
    );
  });
}

export {
  Item,
  Card,
  Fetch,
};
