// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';
import { sessionExistsAction } from './containers/LoginSignup/actions';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars
  const isLoggedIn = (nextState, replace, cb) => {
    sessionExistsAction(store.dispatch)();
    cb();
  };

  return [
    {
      path: '/',
      name: 'home',
      onEnter: isLoggedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Search/reducer'),
          import('containers/Search/sagas'),
          import('containers/Search'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('search', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/search',
      name: 'search',
      onEnter: isLoggedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Search/reducer'),
          import('containers/Search/sagas'),
          import('containers/Search'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('search', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/search/:query',
      name: 'search',
      onEnter: isLoggedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Search/reducer'),
          import('containers/Search/sagas'),
          import('containers/Search'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('search', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/study/:nctId',
      name: 'study',
      onEnter: isLoggedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Study/reducer'),
          import('containers/Study'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('study', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/login-signup',
      name: 'loginSignup',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/LoginSignup/reducer'),
          import('containers/LoginSignup'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('loginSignup', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/logout',
      name: 'loginSignup',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/LoginSignup/reducer'),
          import('containers/LoginSignup'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('loginSignup', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/review/:nctId',
      name: 'review',
      onEnter: isLoggedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Study/reducer'),
          import('containers/Study'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('study', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/review/:nctId/edit/:reviewId',
      name: 'review',
      onEnter: isLoggedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Study/reducer'),
          import('containers/Study'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('study', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/reviews/:nctId',
      name: 'reviews',
      onEnter: isLoggedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Study/reducer'),
          import('containers/Study'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('study', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/profile',
      name: 'profile',
      onEnter: isLoggedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Profile/reducer'),
          import('containers/Profile'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('profile', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
