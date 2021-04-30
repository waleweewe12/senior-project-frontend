import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import SnakeReviews from './components/SnakeReviews';
import SnakeCustom from './components/SnakeCustom';
import Navbar from './components/Navbar';
import UserResult from './components/UserResult'; 
import Upload from './components/Upload';

function App() {

  return (
    <div>
      <Router>
        <Navbar/>
        <Switch>
          <Route exact path="/">
            <Redirect to="/reviews" />
          </Route>
          <Route exact path="/home">
            <Redirect to="/reviews" />
          </Route>
          <Route path="/upload" component={Upload} />
          <Route exact path="/reviews" component={SnakeReviews} />
          <Route exact path="/reviews/:snakename" component={SnakeCustom} />
          <Route path="/userresult" component={UserResult} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
