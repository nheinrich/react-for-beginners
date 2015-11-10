// ---------------------------------------------------------------------------

// Config
import config from "../config"

// React
import React from "react"
import autobind from "autobind-decorator"

// Firebase
import Firebase from "firebase"
const ref = new Firebase(config.firebaseUrl)

// Components
import AddFishForm from "./AddFishForm"


// ---------------------------------------------------------------------------

@autobind
class Inventory extends React.Component {

  constructor() {
    super()
    this.state = {
      uid: ""
    }
  }

  authenticate() {
    ref.createUser({

    })
  }

  render() {
    if (!this.state.uid) {
      return this.renderLogin()
    }

    if (this.state.uid !== this.state.owner) {
      return this.renderLogout()
    }

    if (this.state.uid === this.state.owner) {
      return (
        <div className="inventory">
          {this.logoutButton()}
          <h2>Inventory</h2>
          {Object.keys(this.props.fishes).map(this.renderInventory)}
          <AddFishForm {...this.props} />
          <button onClick={this.props.loadSamples}>
            Load Sample Fishes
          </button>
        </div>
      )
    }
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your inventory</p>
        <button onClick={this.authenticate.bind(this, "")} className="twitter">
          Sign In
        </button>
      </nav>
    )
  }

  renderLogout() {
    return (
      <div>
        <p>Sorry you aren't the owner of this store.</p>
        {this.logoutButton()}
      </div>
    )
  }

  renderInventory(key) {
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

  logoutButton() {
    return (
      <button>Log Out!</button>
    )
  }
}


// ---------------------------------------------------------------------------

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  addFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  linkState: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired
}


// ---------------------------------------------------------------------------

export default Inventory
