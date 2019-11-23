# express-app

## Important Components

- `app.js`

  - our app's main entry point
  - when creating a new page, add a corresponding router to `app.js`

    ```javascript
    ...
    // require page routers
    const indexRouter = require("./routes/index");
    ...
    const <example>Router = require("./routes/<example>";)
    ...
    ...
    // use page routers
    app.use("/", indexRouter);
    ...
    app.use("/<example>", <example>Router)
    ```

### `\config`

- `firebase-config-admin.js`

  - enables use of the [Firebase Admin SDK](https://firebase.google.com/docs/reference/admin)

  - `require` this file for admin-specific functionality for authentication, firestore, etc.

- `firebase-config-client.js`

  - enables use of the [Firebase JavaScript SDK](https://firebase.google.com/docs/reference/js/)

  - `require` this file for client-side functionality, such as logging a user in

### `\routes`

- contains routing files (JavaScript), one per page

### `\views`

- `\partials`

  - contains reusable elements, such as headers, footers, etc.

- contains view files (Pug), one per page

## Other Components

- `.eslintrc.js`

  - config file for [ESLint](https://eslint.org/)

- `package-lock.json`

  - describes app dependencies

  - automatically updated when installing / updating packages

- `package.json`

  - describes app details, dependencies

  - automatically updated when installing / updating packages

### `\bin`

- `www`
  - creates an HTTP server for `app.js`

### `\node_modules`

- contains libraries downloaded via `npm`

### `\public\stylesheets`

- `style.css`

  - describes the presentation of our content

  - mostly overridden since we are using [Bootstrap](https://getbootstrap.com/)

### `\secrets`

- `foodshare-d3eee-firebase-adminsdk-muxzq-c6401baa87.json`

  - private key file for `firebase-config-admin.js`
