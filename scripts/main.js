// ---------------------------------------------------------------------------
// Vendor

import React from "react"
import ReactDOM from "react-dom"

// Routing
import { Router, Route } from "react-router"
import { createHistory } from "history"


// ---------------------------------------------------------------------------
// Components

import App from "./components/App"
import StorePicker from "./components/StorePicker"
import NotFound from "./components/NotFound"


// ---------------i------------------------------------------------------------
// Routes

var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
)

ReactDOM.render(routes, document.querySelector("#main"))
