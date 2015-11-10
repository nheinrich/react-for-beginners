// ---------------------------------------------------------------------------

import React from "react"
import ReactMixin from "react-mixin"
import { History } from "react-router"
import autobind from "autobind-decorator"

// Helpers
import h from "../helpers"


// ---------------------------------------------------------------------------

@autobind
class StorePicker extends React.Component {

  render() {
    return (
      <div>
        <form className="store-selector" onSubmit={this.goToStore}>
          <h2>Please Choose a Store</h2>
          <input type="text" ref="storeId" defaultValue={h.getFunName()} />
          <input type="Submit" />
        </form>
      </div>
    )
  }

  goToStore(event) {
    event.preventDefault()
    var storeId = this.refs.storeId.value
    this.history.pushState(null, "/store/" + storeId)
  }

}

ReactMixin.onClass(StorePicker, History)


// ---------------------------------------------------------------------------

export default StorePicker
