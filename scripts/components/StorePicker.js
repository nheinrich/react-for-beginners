// ---------------------------------------------------------------------------

import React from "react"
import { History } from "react-router"
import h from "../helpers"


// ---------------------------------------------------------------------------

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

export default StorePicker
