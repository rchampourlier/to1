// Consolidate todos in one single place.
//
// - Confluence inline-tasks
// - Jira assigned issues
// - Jira mentions
// - Trello notifications
// - Google Docs mentions
import * as request from 'request';

interface Todo {
  origin: string;
  title: string;
  sourceTitle: string;
  sourceUrl: string;
  details: string;
  created: string;
  due: string;
}

const ATLASSIAN_USERNAME = process.env.ATLASSIAN_USERNAME;
const ATLASSIAN_PASSWORD = process.env.ATLASSIAN_PASSWORD;
const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

// Confluence inline-tasks
function ConfluenceInlineTasks(): Promise<Array<Todo>> {
  let todos: Array<Todo> = [];
  return new Promise<Array<Todo>>((resolve, reject) => {
    request('https://jobteaser.atlassian.net/wiki/rest/mywork/1/task', {
      'auth': {
        'user': ATLASSIAN_USERNAME,
        'pass': ATLASSIAN_PASSWORD,
      }}, (error, response, body) => {
        if (error == null && response && response.statusCode === 200) {
          let tasks = JSON.parse(body);
          tasks.forEach( (task: any) => {
            todos.push({
              origin: 'Confluence',
              title: task.title,
              sourceTitle: task.item.title,
              sourceUrl: task.item.url,
              details: '',
              created: task.created,
              due: ''
            });
          });
          resolve(todos);
        } else if (error !== null) {
          reject(new Error(error));
        } else {
          reject(new Error('Non-200 status code: ' + response.statusCode + ' (' + body + ')'));
        }
      }
    );
  });
}

// Trello notifications
function TrelloNotifications(): Promise<Array<Todo>> {
  let todos: Array<Todo> = [];
  return new Promise<Array<Todo>>((resolve, reject) => {
    request('https://api.trello.com/1/members/me/notifications', {
      'qs': {
        'key': TRELLO_KEY,
        'token': TRELLO_TOKEN,
      }}, (error, response, body) => {
        if (error == null && response && response.statusCode === 200) {
          let notifications = JSON.parse(body);
          let cardFullName: string;
          notifications.forEach((notification: any) => {
            if (notification.unread) {
              let
                data = notification.data,
                board = data.board,
                card = data.card;

              switch (notification.type) {

                case 'makeAdminOfOrganization':
                  todos.push({
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
                  todos.push({
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
                  todos.push({
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
                  todos.push({
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
                  todos.push({
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
                  todos.push({
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
                  todos.push({
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
          resolve(todos);
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
  Todo,
  ConfluenceInlineTasks,
  TrelloNotifications,
};
