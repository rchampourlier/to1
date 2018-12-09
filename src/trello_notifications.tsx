import * as React from 'react';
import * as request from 'request';

interface Item {
  key: string;
  origin: string;
  title: string;
  sourceTitle: string;
  sourceUrl: string;
  details: string;
  created: string;
  due: string;
}

interface CardProps {
  title: string;
}

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

class Card extends React.Component<CardProps, undefined> {
  render() {
    return (
      <div className='todos__card card'>
        <header className='card-header'>
          <p className='card-header-title'>
            {this.props.title}
          </p>
        </header>
        <div className='card-content'>
          <div className='content'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
          </div>
        </div>
        <footer className='card-footer'>
          <a href='#' className='card-footer-item'>Archive</a>
          <a href='#' className='card-footer-item'>Pin</a>
        </footer>
      </div>
    );
  }
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
          console.log(body);
          let notifications = JSON.parse(body);
          let cardFullName: string;
          notifications.forEach((notification: any) => {
            if (notification.unread) {
              let
                data = notification.data,
                board = data.board,
                card = data.card,
                itemKey = 'trello-notification__' + notification.type + '__' + notification.date;

              switch (notification.type) {

                case 'makeAdminOfOrganization':
                  items.push({
                    key: itemKey,
                    origin: 'Trello',
                    title: 'Made admin of organization `' + data.organization.name,
                    sourceTitle: '',
                    sourceUrl: '',
                    details: '',
                    created: notification.date,
                    due: '',
                  });
                  break;

                case 'cardDueSoon':
                  items.push({
                    key: itemKey,
                    origin: 'Trello',
                    title: 'Card due soon',
                    sourceTitle: board.name + ' > ' + card.name,
                    sourceUrl: 'https://trello.com/c/' + card.shortLink,
                    details: '',
                    created: notification.date,
                    due: card.due,
                  });
                  break;

                case 'commentCard':
                  items.push({
                    key: itemKey,
                    origin: 'Trello',
                    title: 'Card `' + board.name + ' > ' + card.name + '` commented',
                    sourceTitle: board.name + ' > ' + card.name,
                    sourceUrl: 'https://trello.com/c/' + card.shortLink,
                    details: notification.data.text,
                    created: notification.date,
                    due: '',
                  });
                  break;

                case 'createdCard':
                  items.push({
                    key: itemKey,
                    origin: 'Trello',
                    title: 'Card `' + board.name + ' > ' + card.name + '` created by ' + notification.memberCreator.fullName,
                    sourceTitle: board.name + ' > ' + card.name,
                    sourceUrl: 'https://trello.com/c/' + card.shortLink,
                    details: notification.data.text,
                    created: notification.date,
                    due: '',
                  });
                  break;

                case 'changeCard':
                  let title: string;
                  cardFullName = board.name + ' > ' + card.name;
                  if (data.listBefore) {
                    title = 'Card `' + cardFullName + '` moved from list `' + notification.data.listBefore + '`';
                  } else if (data.old && data.old.due !== undefined) { // data.old.due may be null
                    title = 'Card `' + cardFullName + '` changed due to ' + data.card.due + ' (was ' + data.old.due + ')';
                  } else if (data.old && data.old.closed !== undefined) {
                    if (data.old.closed === true) {
                      title = 'Card `' + cardFullName + '` archived';
                    } else {
                      title = 'Card `' + cardFullName + '` unarchived';
                    }
                  } else {
                    title = 'N/A';
                    console.log(notification);
                  }
                  items.push({
                    key: itemKey,
                    origin: 'Trello',
                    title: title,
                    sourceTitle: board.name + ' > ' + card.name,
                    sourceUrl: 'https://trello.com/c/' + card.shortLink,
                    details: notification.data.text,
                    created: notification.date,
                    due: '',
                  });
                  break;

                case 'mentionedOnCard':
                  cardFullName = board.name + ' > ' + card.name;
                  items.push({
                    key: itemKey,
                    origin: 'Trello',
                    title: 'Mentioned on card `' + cardFullName + '`',
                    sourceTitle: board.name + ' > ' + card.name,
                    sourceUrl: 'https://trello.com/c/' + card.shortLink,
                    details: data.text,
                    created: notification.date,
                    due: '',
                  });
                  break;

                case 'addAttachmentToCard':
                  cardFullName = board.name + ' > ' + card.name;
                  items.push({
                    key: itemKey,
                    origin: 'Trello',
                    title: 'Added attachment `' + data.name + '` to card `' + cardFullName + '`',
                    sourceTitle: board.name + ' > ' + card.name,
                    sourceUrl: 'https://trello.com/c/' + card.shortLink,
                    details: data.text,
                    created: notification.date,
                    due: '',
                  });
                  break;
                default:
                  console.log(notification.type);
                  break;
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
  CardProps,
  Card,
  Fetch,
};
