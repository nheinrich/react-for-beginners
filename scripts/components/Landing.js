// ---------------------------------------------------------------------------

// Config
import config from "../config"

// React
import React from "react"
import ReactMixin from "react-mixin"
import { History } from "react-router"
import autobind from "autobind-decorator"

// Firebase
import Firebase from "firebase"
const ref = new Firebase(config.firebaseUrl)
import Rebase from "re-base"
const base = Rebase.createClass(config.firebaseUrl)

// Components
import Authentication from "./Authentication"

// Helpers
import h from "../helpers"


// ---------------------------------------------------------------------------

@autobind
class Landing extends React.Component {

  constructor() {
    super()
    this.state = {
      stores: []
    }
  }

  componentDidMount() {
    // Stores (firebase)
    base.fetch("/", {
      context: this,
      then: function(data) {
        let stores = Object.keys(data)
        this.setState({
          stores: stores
        })
      }
    })
  }

  render() {
    if (ref.getAuth()) {
      return (
        <div>
          {this.renderStoreList()}
          <form className="store-selector" onSubmit={this.newStore}>
            <h2>Visit a Store</h2>
            <input type="text" ref="storeId" defaultValue={h.getFunName()} />
            <input type="Submit" />
          </form>
        </div>
      )
    } else {
      return (
        <div>
          {this.renderStoreList()}
          <Authentication />
        </div>
      )
    }
  }

  renderStoreList() {
    return (
      <div className="store-list">
        <h2>Stores</h2>
        <ul>
          {this.state.stores.map(this.renderStore)}
        </ul>
      </div>
    )
  }

  renderStore(storeId) {
    return(
      <li key={storeId}>
        <button onClick={this.selectStore.bind(this, storeId)}>
          {storeId}
        </button>
      </li>
    )
  }

  newStore(event) {
    event.preventDefault()
    var storeId = this.refs.storeId.value
    this.history.pushState(null, "/store/" + storeId)
  }

  selectStore(storeId) {
    this.history.pushState(null, "/store/" + storeId)
  }

}


// ---------------------------------------------------------------------------

ReactMixin.onClass(Landing, History)


// ---------------------------------------------------------------------------

export default Landing
