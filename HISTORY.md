# History

## 2018-12-08

Used [electron-forge](https://v6.electronforge.io) with the `react-typescript` template to rebuild the project. Could not get a local module file to be imported correctly with the previous setup. The project would compile but once loaded in Electron, the JS file could not be required correctly.

This new setup is working fine, the `fetch` module was successfully imported from `app.tsx` and also enables live-reload.

Achieved displaying fetched Trello notifications in the Electron's window.

## 2018-12-02

- Started project
- Basic implementation (rendering todos in terminal) for:
  - Confluence inline tasks
  - Trello notifications
