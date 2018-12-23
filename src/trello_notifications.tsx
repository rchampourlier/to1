import * as React from 'react';
import * as request from 'request';
import * as moment from 'moment';
import { shell } from 'electron';

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

interface Card {
  notifyChange: () => void;
}

interface Item {
  key: string;
  notificationId: string;
  notificationType: string;
  notificationCreated: string;
  notificationInfo: string;
  cardTitle: string;
  cardUrl: string;
  cardDue: string | void;
  boardTitle: string;
  boardUrl: string;
}

class CardComponent extends React.Component<Item & Card, undefined> {

  constructor(props: Item) {
    super(props);

    this.gotoTrelloCard = this.gotoTrelloCard.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
  }

  gotoTrelloCard(evt: React.MouseEvent<any>) {
    evt.preventDefault();
    shell.openExternal(this.props.cardUrl);
  }

  markAsRead(evt: React.MouseEvent<any>): Promise<boolean> {
    evt.preventDefault();

    let notificationId: string = this.props.notificationId;
    return new Promise<boolean>((resolve, reject) => {
      request.put('https://api.trello.com/1/notifications/' + notificationId + '/unread', {
        'qs': {
          'key': TRELLO_KEY,
          'token': TRELLO_TOKEN,
          'value': false,
        }
      }, (error, response, body) => {
          if (error == null && response && response.statusCode === 200) {
            this.props.notifyChange();
            resolve(true);
          } else if (error !== null) {
            console.log(response);
            reject(new Error(error));
          } else {
            reject(new Error('Non-200 status code: ' + response.statusCode + ' (' + body + ')'));
          }
        }
      );
    });
  }

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
      dueDiv = (
        <div className='trellonotif-card-due'>
          <span className='trellonotif-card-due-content'>
            <span className='icon'>
              <i className='far fa-clock' />
            </span>
            <span>{moment(this.props.cardDue).format('D MMM')}</span>
          </span>
        </div>
      );
    } else {
      dueDiv = <div />;
    }
    return (
      <div className='trellonotif'>
        <div className='trellonotif-top'>
          <div className='trellonotif-icon'>
            <span className='icon has-text-white'>
              <i className='fab fa-lg fa-trello' />
            </span>
          </div>
          <div className='trellonotif-ref'>
            <a className='trellonotif-card' href={this.props.cardUrl} onClick={this.gotoTrelloCard}>
              <div className='trellonotif-card-content'>
                {this.props.cardTitle}
              </div>
              { dueDiv }
            </a>
            <div className='trellonotif-board'>
              <a href={this.props.boardUrl}>{this.props.boardTitle}</a>
            </div>
          </div>
        </div>
        <div className='trellonotif-bottom'>
          <span className='icon is-small'>
            <i className={notificationTypeIconClassName} />
          </span>
          <span>{this.props.notificationInfo}</span>
        </div>
        <div className='trellonotif-actions'>
          <span className='trellonotif-created'>
            {moment(this.props.notificationCreated).fromNow()}
          </span>
          <a className='button is-dark is-small' onClick={this.markAsRead}>
            <i className='fas fa-check' />
          </a>
        </div>
      </div>
    );
  }
}

function Card(item: Item, notifyChange: () => void) {
  return (
    <CardComponent
      key={item.key}
      notificationId={item.notificationId}
      notificationType={item.notificationType}
      notificationCreated={item.notificationCreated}
      notificationInfo={item.notificationInfo}
      cardTitle={item.cardTitle}
      cardUrl={item.cardUrl}
      cardDue={item.cardDue}
      boardTitle={item.boardTitle}
      boardUrl={item.boardUrl}
      notifyChange={notifyChange}
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
            if (notification.unread) {
              let
                data = notification.data,
                itemKey = 'trello-notification__' + notification.type + '__' + notification.date;

              switch (notification.type) {

                case 'cardDueSoon':
                  items.push({
                    key: itemKey,
                    notificationId: notification.id,
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
                    notificationId: notification.id,
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
                    notificationId: notification.id,
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
                    notificationId: notification.id,
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
                    notificationId: notification.id,
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
                    notificationId: notification.id,
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
