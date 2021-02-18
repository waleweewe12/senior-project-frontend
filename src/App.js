import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import SnakeReviews from './components/SnakeReviews';
import AddImage from './components/AddImage';
import SnakeCustom from './components/SnakeCustom';
import Navbar from './components/Navbar';
import SendImage from './components/SendImage';
import UserResult from './components/UserResult'; 
import Model from './components/Model';

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
          <Route path="/addimage" component={AddImage} />
          <Route exact path="/reviews" component={SnakeReviews} />
          <Route exact path="/reviews/:snakename" component={SnakeCustom} />
          <Route path="/userresult" component={UserResult} />
          <Route path="/model" component={Model} />
        </Switch>
      </Router>
      {/* <UserResult /> */}
      {/* <SendImage /> */}
    </div>
  );
}

export default App;
