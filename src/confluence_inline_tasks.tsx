import * as React from 'react';
import * as request from 'request';

interface Item {
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

const ATLASSIAN_USERNAME = process.env.ATLASSIAN_USERNAME;
const ATLASSIAN_PASSWORD = process.env.ATLASSIAN_PASSWORD;

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

export {
  Item,
  CardProps,
  Card,
  Fetch,
};
