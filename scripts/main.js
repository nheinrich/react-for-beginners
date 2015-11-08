// ---------------------------------------------------------------------------
// Require

var React = require("react")
var ReactDOM = require("react-dom")

var Rebase = require("re-base")
var base = Rebase.createClass("https://fresh-seafood-market.firebaseio.com/")

var ReactRouter = require("react-router")
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var createBrowserHistory = require("history/lib/createBrowserHistory")

var Catalyst = require("react-catalyst")

var CSSTransitionGroup = require("react-addons-css-transition-group")

var h = require("./helpers")


// ---------------------------------------------------------------------------
// App

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
      fishes: require("./sample-fishes")
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
// Header

var Header = React.createClass({
  render: function() {
    return (
      <header className="top">
        <h1>
          Catch
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the</span>
          </span>
          Day
        </h1>
        <h3 className="tagline">
          <span>
            {this.props.tagline}
          </span>
        </h3>
      </header>
    )
  }
})


// ---------------------------------------------------------------------------
// Fish

var Fish = React.createClass({

  render: function() {
    var details = this.props.details
    var isAvailable = (details.status === "available") ? true : false
    var buttonText = (isAvailable ? "Add to Order" : "Sold Out")
    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">
            {h.formatPrice(details.price)}
          </span>
        </h3>
        <p>
          {details.description}
        </p>
        <button disabled={!isAvailable} onClick={this.selectFish}>
          {buttonText}
        </button>
      </li>
    )
  },

  selectFish: function() {
    var key = this.props.index
    this.props.addToOrder(key)
  }

})


// ---------------------------------------------------------------------------
// Order

var Order = React.createClass({

  render: function() {
    var orderIds = Object.keys(this.props.order)
    var total = orderIds.reduce((prevTotal, key) => {
      var fish = this.props.fishes[key]
      var count = this.props.order[key]
      var isAvailable = fish && fish.status === "available"

      if (fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0)
      }

      return prevTotal;
    }, 0)
    return (
      <div className="order-wrap">
        <h2 className="order-title">
          Your Order
        </h2>
        <CSSTransitionGroup
          className="order"
          component="ul"
          transitionName="order"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {orderIds.map(this.renderLineItem)}
          <li className="total">
            <strong>
              Total:
            </strong>
            {h.formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    )
  },

  renderLineItem: function(key) {
    return (
      <LineItem key={key} index={key} {...this.props} />
    )
  }


})


// ---------------------------------------------------------------------------
// Order

var LineItem = React.createClass({

  render: function() {
    var key = this.props.index
    var fish = this.props.fishes[key]
    var lbs = this.props.order[key]

    if (!fish) {
      return (
        <li key={key}>
          Sorry, fish no longer available!
          {this.removeButton(key)}
        </li>
      )
    }

    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup
            className="count"
            component="span"
            transitionName="count"
            transitionLeaveTimeout={200}
            transitionEnterTimeout={200}
          >
            <span key={lbs}>{lbs}</span>
          </CSSTransitionGroup>
          lbs of {fish.name}
          {this.removeButton(key)}
        </span>
        <span className="price">
          {h.formatPrice(lbs * fish.price)}
        </span>
      </li>
    )
  },

  removeButton: function(key) {
    return (
      <button onClick={this.props.removeFromOrder.bind(null, key)}>
        &times;
      </button>
    )
  }

})

// ---------------------------------------------------------------------------
// Inventory

var Inventory = React.createClass({

  render: function() {
    return (
      <div className="inventory">
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>
          Load Sample Fishes
        </button>
      </div>
    )
  },

  renderInventory: function(key) {
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState("fishes." + key + ".name")} />
        <input type="text" valueLink={linkState("fishes." + key + ".price")} />
        <select valueLink={linkState("fishes." + key + ".status")}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea valueLink={linkState("fishes." + key + ".description")} />
        <input type="text" valueLink={linkState("fishes." + key + ".image")} />
        <button onClick={this.props.removeFish.bind(null, key)}>
          Remove Fish
        </button>
      </div>
    )
  }

})


// ---------------------------------------------------------------------------
// Add Fish

var AddFishForm = React.createClass({

  render: function() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name" />
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea ref="description" placeholder="Description"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item</button>
      </form>
    )
  },

  createFish: function(event){
    event.preventDefault()
    var fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      description: this.refs.description.value,
      image: this.refs.image.value
    }
    this.props.addFish(fish)
    this.refs.fishForm.reset()
  }

})


// ---------------------------------------------------------------------------
// StorePicker

var StorePicker = React.createClass({

  mixins: [
    History
  ],

  render: function(){
    return (
      <div>
        <form className="store-selector" onSubmit={this.goToStore}>
          <h2>Please Choose a Store</h2>
          <input type="text" ref="storeId" defaultValue={h.getFunName()} />
          <input type="Submit" />
        </form>
      </div>
    )
  },

  goToStore: function(event) {
    event.preventDefault()
    var storeId = this.refs.storeId.value
    this.history.pushState(null, "/store/" + storeId)
  }

})


// ---------------------------------------------------------------------------
// Missing

var NotFound = React.createClass({

  render: function(){
    return (
      <div>
        <h1>Not Found</h1>
      </div>
    )
  }

})


// ---------------------------------------------------------------------------
// Routes

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
)

ReactDOM.render(routes, document.querySelector("#main"))
