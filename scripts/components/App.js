// ---------------------------------------------------------------------------

// Config
import config from "../config"

// React
import React from "react"
import ReactMixin from "react-mixin"
import autobind from "autobind-decorator"

// Firebase
import Rebase from "re-base"
const base = Rebase.createClass(config.firebaseUrl)

// Two-way Binding
import Catalyst from "react-catalyst"

// Components
import Header from "./Header"
import Fish from "./Fish"
import Order from "./Order"
import Inventory from "./Inventory"


// ---------------------------------------------------------------------------

@autobind
class App extends React.Component {

  constructor() {
    super()
    this.state = {
      fishes: {},
      order: {}
    }
  }

  componentDidMount() {
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
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(this.orderId(), JSON.stringify(nextState.order))
  }

  render() {
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
          linkState={this.linkState.bind(this)}
          params={this.props.params}
        />
      </div>
    )
  }

  addFish(fish) {
    var timestamp = (new Date()).getTime()
    this.state.fishes["fish-" + timestamp] = fish
    this.setState({
      fishes: this.state.fishes
    })
  }

  removeFish(key) {
    if (confirm("Are you sure you want to remove this fish?!")) {
      this.state.fishes[key] = null
      this.setState({
        fishes: this.state.fishes
      })
    }
  }

  renderFish(key) {
    return (
      <Fish
        key={key}
        index={key}
        details={this.state.fishes[key]}
        addToOrder={this.addToOrder}
      />
    )
  }

  addToOrder(key) {
    var currentPounds = this.state.order[key] || 0
    this.state.order[key] = currentPounds + 1
    this.setState({
      order: this.state.order
    })
  }

  removeFromOrder(key) {
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    })
  }

  loadSamples() {
    this.setState({
      fishes: require("../sample-fishes")
    })
  }

  storeId() {
    return this.props.params.storeId
  }

  orderId() {
    return "order-" + this.storeId()
  }

}


// ---------------------------------------------------------------------------

ReactMixin.onClass(App, Catalyst.LinkedStateMixin)


// ---------------------------------------------------------------------------

export default App
