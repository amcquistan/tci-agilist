import React from 'react';
import { BrowserRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import routes from './config/routes'
import Header from './pages/common/Header';

const App: React.FunctionComponent<{}> = props => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Switch>
            {routes.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                exact={route.exact}
                render={(props: RouteComponentProps<any>) => (
                  <route.component name={route.name} {...props} {...route.props}/>
                )}
              />
            ))}
        </Switch>
      </BrowserRouter>
    </div>
  );
} 

export default App;
