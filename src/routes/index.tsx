import React, { lazy, Suspense, FunctionComponent } from 'react';
import map from 'lodash/map';
import { Route, Switch, Redirect } from 'react-router-dom';
import siteLayout from 'layouts/Site';
import dashboardLayout from 'layouts/Dashboard';
import Login from 'pages/Auth/Login';
import Logout from 'pages/Auth/Logout';
import PrivateRoute from 'components/PrivateRoute';
import SharedLink from 'pages/Dashboard/SharedLink';
const Dashboard = lazy(() => import('pages/Dashboard'));

export const RoutesHOC = (routes: any, defaultPath: any) => {
  const Routes: FunctionComponent<any> = (props: any) => (
    <Suspense fallback={<></>}>
      <Switch>
        {map(routes, (route, i) => {
          if (route.isPrivate) {
            return (
              <PrivateRoute
                key={i}
                title={route.name}
                path={route.path}
                component={route.component}
                defaultPath={DEFAULT_PATH}
                exact={true}
              />
            );
          }
          return (
            <Route
              key={i}
              path={route.path}
              component={route.component}
              exact={props.isExact && false}
            />
          );
        })}
        <Redirect to={defaultPath} />
      </Switch>
    </Suspense>
  );
  return Routes;
};

export const DashboardRoutes = {
  MAIN: {
    isPrivate: true,
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
};

export const AppRoutes = {
  SHARED: {
    component: siteLayout(SharedLink),
    name: 'Shared Link',
    path: '/shared/:id',
    isPrivate: false,
  },
  LOGIN: {
    path: '/login',
    name: 'Login',
    component: siteLayout(Login),
  },
  LOGOUT: {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  DASHBOARD: {
    path: '/',
    name: 'Dashboard',
    component: dashboardLayout(RoutesHOC(DashboardRoutes, '/')),
  },
};

export const DEFAULT_PATH = AppRoutes.LOGIN.path;
export const USER_LANDING_PAGE = AppRoutes.DASHBOARD.path;

export const AppRouter = RoutesHOC(AppRoutes, '/login');
