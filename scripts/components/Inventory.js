// ---------------------------------------------------------------------------

import React from "react"
import AddFishForm from "./AddFishForm"


// ---------------------------------------------------------------------------

var Inventory = React.createClass({

  propTypes: {
    fishes: React.PropTypes.object.isRequired,
    addFish: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    linkState: React.PropTypes.func.isRequired
  },

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

export default Inventory
