// ---------------------------------------------------------------------------

import React from "react"
import CSSTransitionGroup from "react-addons-css-transition-group"
import LineItem from "./LineItem"
import h from "../helpers"


// ---------------------------------------------------------------------------

var Order = React.createClass({

  propTypes: {
    fishes: React.PropTypes.object.isRequired,
    order: React.PropTypes.object.isRequired,
    removeFromOrder: React.PropTypes.func.isRequired
  },

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

export default Order
