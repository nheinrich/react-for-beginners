// ---------------------------------------------------------------------------

import React from "react"
import autobind from "autobind-decorator"

// Helpers
import h from "../helpers"


// ---------------------------------------------------------------------------

@autobind
class Fish extends React.Component {

  render() {
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
  }

  selectFish() {
    var key = this.props.index
    this.props.addToOrder(key)
  }

}


// ---------------------------------------------------------------------------

Fish.propTypes = {
  details: React.PropTypes.object.isRequired
}


// ---------------------------------------------------------------------------

export default Fish
