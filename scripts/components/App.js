// ---------------------------------------------------------------------------

// React
import React from "react"

// Firebase
import Rebase from "re-base"
const base = Rebase.createClass("https://fresh-seafood-market.firebaseio.com/")

// Binding
import Catalyst from "react-catalyst"

// Components
import Header from "./Header"
import Fish from "./Fish"
import Order from "./Order"
import Inventory from "./Inventory"
import NotFound from "./NotFound"
import StorePicker from "./StorePicker"


// ---------------------------------------------------------------------------

var App = React.createClass({

  mixins: [
    Catalyst.LinkedStateMixin
  ],

  getInitialState: function() {
    return {
      fishes: {},
      order: {}
    }
  },

  componentDidMount: function() {
    // Fishes (firebase)
    base.syncState(this.storeId() + "/fishes", {
      context: this,
      state: "fishes"
    })

    // Order (localstorage)
    var localStorageRef = localStorage.getItem(this.orderId())
    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  },

  componentWillUpdate: function(nextProps, nextState) {
    localStorage.setItem(this.orderId(), JSON.stringify(nextState.order))
  },

  render: function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          fishes={this.state.fishes}
          addFish={this.addFish}
          removeFish={this.removeFish}
          loadSamples={this.loadSamples}
          linkState={this.linkState}
        />
      </div>
    )
  },

  addFish: function(fish) {
    var timestamp = (new Date()).getTime()
    this.state.fishes["fish-" + timestamp] = fish
    this.setState({
      fishes: this.state.fishes
    })
  },

  removeFish: function(key) {
    if (confirm("Are you sure you want to remove this fish?!")) {
      this.state.fishes[key] = null
      this.setState({
        fishes: this.state.fishes
      })
    }
  },

  renderFish: function(key) {
    return (
      <Fish
        key={key}
        index={key}
        details={this.state.fishes[key]}
        addToOrder={this.addToOrder}
      />
    )
  },

  addToOrder: function(key) {
    var currentPounds = this.state.order[key] || 0
    this.state.order[key] = currentPounds + 1
    this.setState({
      order: this.state.order
    })
  },

  removeFromOrder: function(key) {
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    })
  },

  loadSamples: function() {
    this.setState({
      fishes: require("../sample-fishes")
    })
  },

  storeId: function() {
    return this.props.params.storeId
  },

  orderId: function() {
    return "order-" + this.storeId()
  }

})


// ---------------------------------------------------------------------------

export default App
