import React from 'react';
import { Route } from 'react-router';
import App from './../containers/App';
import About from './../containers/About';
import Home from './../containers/Home';
import Contact from './../containers/Contact';

export default (
  <Route path="/" component={App}>
  	<Route path="/About" component={About} />
  	<Route path="/Home" component={Home} />
  	<Route path="/contact" component={Contact} />
  </Route>
);
