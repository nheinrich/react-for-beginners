// ---------------------------------------------------------------------------

import React from "react"
import autobind from "autobind-decorator"
import CSSTransitionGroup from "react-addons-css-transition-group"

// Components
import LineItem from "./LineItem"

// Helpers
import h from "../helpers"


// ---------------------------------------------------------------------------

@autobind
class Order extends React.Component {

  render() {
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
  }

  renderLineItem(key) {
    return (
      <LineItem key={key} index={key} {...this.props} />
    )
  }

}


// ---------------------------------------------------------------------------

Order.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  order: React.PropTypes.object.isRequired,
  removeFromOrder: React.PropTypes.func.isRequired
}


// ---------------------------------------------------------------------------

export default Order
