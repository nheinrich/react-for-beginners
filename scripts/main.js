// ---------------------------------------------------------------------------
// Vendor

import React from "react"
import ReactDOM from "react-dom"

// Routing
import { Router, Route } from "react-router"
import { createHistory } from "history"


// ---------------------------------------------------------------------------
// Components

import Landing from "./components/Landing"
import App from "./components/App"
import NotFound from "./components/NotFound"


// ---------------------------------------------------------------------------
// Routes

var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={Landing} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
)

ReactDOM.render(routes, document.querySelector("#main"))
