// ---------------------------------------------------------------------------

import React from "react"
import CSSTransitionGroup from "react-addons-css-transition-group"
import autobind from "autobind-decorator"

// Helpers
import h from "../helpers"


// ---------------------------------------------------------------------------

@autobind
class LineItem extends React.Component {

  render() {
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
  }

  removeButton(key) {
    return (
      <button onClick={this.props.removeFromOrder.bind(null, key)}>
        &times;
      </button>
    )
  }

}


// ---------------------------------------------------------------------------

LineItem.propTypes = {
  index: React.PropTypes.string.isRequired,
  fishes: React.PropTypes.object.isRequired,
  order: React.PropTypes.object.isRequired,
  removeFromOrder: React.PropTypes.func.isRequired
}


// ---------------------------------------------------------------------------

export default LineItem
