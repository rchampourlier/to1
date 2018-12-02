// Consolidate todos in one single place.
//
// - Confluence inline-tasks
// - Jira assigned issues
// - Jira mentions
// - Trello notifications
// - Google Docs mentions
var request = require('request');
var ATLASSIAN_USERNAME = process.env.ATLASSIAN_USERNAME;
var ATLASSIAN_PASSWORD = process.env.ATLASSIAN_PASSWORD;
var TRELLO_KEY = process.env.TRELLO_KEY;
var TRELLO_TOKEN = process.env.TRELLO_TOKEN;
// Confluence inline-tasks
var todos = [];
var fetchConfluenceInlineTasks = function () {
    request('https://jobteaser.atlassian.net/wiki/rest/mywork/1/task', {
        'auth': {
            'user': ATLASSIAN_USERNAME,
            'pass': ATLASSIAN_PASSWORD
        }
    }, function (error, response, body) {
        if (error == null && response && response.statusCode === 200) {
            var tasks = JSON.parse(body);
            tasks.forEach(function (task, index) {
                todos.push({
                    origin: 'Confluence',
                    title: task.title,
                    sourceTitle: task.item.title,
                    sourceUrl: task.item.url,
                    details: null,
                    created: task.created,
                    due: null
                });
            });
            console.log('todos:', todos);
        }
        else if (error !== null) {
            console.log('error:', error); // Print the error if one occurred
        }
        else {
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
        }
    });
};
var fetchTrelloNotifications = function () {
    request('https://api.trello.com/1/members/me/notifications', {
        'qs': {
            'key': TRELLO_KEY,
            'token': TRELLO_TOKEN
        }
    }, function (error, response, body) {
        if (error == null && response && response.statusCode === 200) {
            var notifications = JSON.parse(body);
            notifications.forEach(function (notification, index) {
                if (notification.unread) {
                    var data = notification.data;
                    var board = data.board, list = data.list, card = data.card;
                    switch (notification.type) {
                        case 'makeAdminOfOrganization':
                            todos.push({
                                origin: 'Trello',
                                title: 'Made admin of organization `' + data.organization.name,
                                sourceTitle: null,
                                sourceUrl: null,
                                details: null,
                                created: notification.date,
                                due: null
                            });
                            break;
                        case 'cardDueSoon':
                            todos.push({
                                origin: 'Trello',
                                title: 'Card due soon',
                                sourceTitle: board.name + ' > ' + card.name,
                                sourceUrl: 'https://trello.com/c/' + card.shortLink,
                                details: null,
                                created: notification.date,
                                due: card.due
                            });
                            break;
                        case 'commentCard':
                            var cardFullName = board.name + ' > ' + card.name;
                            todos.push({
                                origin: 'Trello',
                                title: 'Card `' + cardFullName + '` commented',
                                sourceTitle: board.name + ' > ' + card.name,
                                sourceUrl: 'https://trello.com/c/' + card.shortLink,
                                details: notification.data.text,
                                created: notification.date,
                                due: null
                            });
                            break;
                        case 'createdCard':
                            var cardFullName = board.name + ' > ' + list.name + ' > ' + card.name;
                            todos.push({
                                origin: 'Trello',
                                title: 'Card `' + cardFullName + '` created by ' + notification.memberCreator.fullName,
                                sourceTitle: board.name + ' > ' + card.name,
                                sourceUrl: 'https://trello.com/c/' + card.shortLink,
                                details: notification.data.text,
                                created: notification.date,
                                due: null
                            });
                            break;
                        case 'changeCard':
                            var title;
                            if (data.listBefore) {
                                title = 'Card `' + cardFullName + '` moved from list `' + notification.data.listBefore + '`';
                            }
                            else if (data.old && data.old.due !== undefined) { // data.old.due may be null
                                title = 'Card `' + cardFullName + '` changed due to ' + data.card.due + ' (was ' + data.old.due + ')';
                            }
                            else if (data.old && data.old.closed !== undefined) {
                                if (data.old.closed === true) {
                                    title = 'Card `' + cardFullName + '` archived';
                                }
                                else {
                                    title = 'Card `' + cardFullName + '` unarchived';
                                }
                            }
                            else {
                                title = 'N/A';
                                console.log(notification);
                            }
                            var data = notification.data;
                            todos.push({
                                origin: 'Trello',
                                title: title,
                                sourceTitle: board.name + ' > ' + card.name,
                                sourceUrl: 'https://trello.com/c/' + card.shortLink,
                                details: notification.data.text,
                                created: notification.date,
                                due: null
                            });
                            break;
                        case 'mentionedOnCard':
                            var cardFullName = board.name + ' > ' + card.name;
                            todos.push({
                                origin: 'Trello',
                                title: 'Mentioned on card `' + cardFullName + '`',
                                sourceTitle: board.name + ' > ' + card.name,
                                sourceUrl: 'https://trello.com/c/' + card.shortLink,
                                details: data.text,
                                created: notification.date,
                                due: null
                            });
                            break;
                        case 'addAttachmentToCard':
                            var cardFullName = board.name + ' > ' + card.name;
                            todos.push({
                                origin: 'Trello',
                                title: 'Added attachment `' + data.name + '` to card `' + cardFullName + '`',
                                sourceTitle: board.name + ' > ' + card.name,
                                sourceUrl: 'https://trello.com/c/' + card.shortLink,
                                details: data.text,
                                created: notification.date,
                                due: null
                            });
                            break;
                        default:
                            console.log(notification.type);
                            break;
                    }
                }
            });
            console.log('todos:', todos);
        }
        else if (error !== null) {
            console.log('error:', error); // Print the error if one occurred
        }
        else {
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
        }
    });
};
fetchTrelloNotifications();
