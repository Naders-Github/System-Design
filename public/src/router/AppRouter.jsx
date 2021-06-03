import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../components/Home.jsx';
import LandingPage from '../components/LandingPage.jsx';
import Reviews from '../components/reviews/Reviews.jsx';

const AppRouter = () => (
  <BrowserRouter>
    <div className='main'>
      <Switch>
        <Route path='/' component={LandingPage} exact/>
        <Route path='/home' component={Home}/>
        <Route path='/reviews' component={Reviews}/>
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;