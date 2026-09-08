# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local Node and dependency setup

Use Node **22.23.2 LTS** (recorded in `.nvmrc`) and its bundled npm 10.
With nvm, run `nvm install 22.23.2` and `nvm use 22.23.2`.
Use `npm ci` to install the versions in `package-lock.json`; avoid mixing npm and
pnpm installations in the same `node_modules` directory.

### Early development-server heap crash

If startup fails with `FATAL ERROR: invalid table size` while compiling, stop the
dev server and run:

```sh
npm run clean:cache
npm start
```

This deletes only generated CRA/Webpack/Babel/ESLint/TypeScript caches under
`frontend/node_modules/.cache`. It does not delete dependencies, source files,
public assets, or image data. The next compilation rebuilds the cache.
Also clear this cache after changing Node versions or package managers.

The September 2026 incident was reproduced on Node 24.19.0 with the old Webpack
`default-development` cache, and resolved on the same runtime by clearing it.
Restoring that cache reproduced the crash with unchanged source and dependencies.
A larger heap is not the fix. Node 22 is a reproducible local default, rather than
a required downgrade to repair this cache failure. The dnd-kit packages remain installed.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
