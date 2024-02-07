import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DetailPage from './components/DetailPage';
import FormPage from './components/FormPage';
import ModifyForm from './components/ModifyForm';
import LandingPage from './components/LandingPage';

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/detail/:id" component={DetailPage} />
        <Route exact path="/create" component={FormPage} />
        <Route exact path="/modify/:id" component={ModifyForm} />
      </Switch>
    </div>
  );
};

export default App;