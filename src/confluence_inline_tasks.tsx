import * as React from 'react';
import * as request from 'request';
import { shell } from 'electron';
import * as out from './interfaces';

const ATLASSIAN_USERNAME = process.env.ATLASSIAN_USERNAME;
const ATLASSIAN_PASSWORD = process.env.ATLASSIAN_PASSWORD;
const TYPE = 'confluence-inline-task';

type Item = out.Item & {
  title: string;
  sourceTitle: string;
  sourceUrl: string;
  details: string;
  due: string;
};

class CardComponent extends React.Component<Item & out.Card, undefined> {
  constructor(props: Item) {
    super(props);

    this.gotoConfluenceContext = this.gotoConfluenceContext.bind(this);
    this.check = this.check.bind(this);
  }

  gotoConfluenceContext(evt: React.MouseEvent<any>) {
    evt.preventDefault();
    shell.openExternal(this.props.sourceUrl);
  }

  check(evt: React.MouseEvent<any>): Promise<boolean> {
    evt.preventDefault();

    //let notificationId: string = this.props.notificationId;
    return new Promise<boolean>((resolve, reject) => {
      let tmp = true;
      if (tmp) {
        resolve(true);
      } else {
        reject(new Error('not implemented'));
      }
      /*
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
      );*/
    });
  }

  render() {
    return (
      <div className='confluencetask'>
        {this.props.title}
      </div>
    );
  }
}

function BuildCard(item: Item, notifyChange: () => void): JSX.Element {
  return (
    <CardComponent
      key={item.key}
      created={item.created}
      type={item.type}
      sourceTitle={item.sourceTitle}
      sourceUrl={item.sourceUrl}
      details={item.details}
      due={item.due}
      title={item.title}
      notifyChange={notifyChange}
    />
  );
}

function Fetch(): Promise<Array<Item>> {
  let todos: Array<Item> = [];
  return new Promise<Array<Item>>((resolve, reject) => {
    request('https://jobteaser.atlassian.net/wiki/rest/mywork/1/task', {
      'auth': {
        'user': ATLASSIAN_USERNAME,
        'pass': ATLASSIAN_PASSWORD,
      }}, (error, response, body) => {
        if (error == null && response && response.statusCode === 200) {
          let tasks = JSON.parse(body);
          tasks.forEach( (task: any) => {
            todos.push({
              key: TYPE + '__' + task.created,
              created: task.created,
              type: TYPE,
              title: task.title,
              sourceTitle: task.item.title,
              sourceUrl: task.item.url,
              details: '',
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

export {
  Item,
  Fetch,
  BuildCard,
};
