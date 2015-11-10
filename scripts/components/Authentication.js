// ---------------------------------------------------------------------------

// Config
import config from "../config"

// React
import React from "react"
import ReactDOM from "react-dom"
import Modal from "react-modal"
import autobind from "autobind-decorator"


// ---------------------------------------------------------------------------

@autobind
class Authentication extends React.Component {

  constructor() {
    super()
    this.state = {
      signInModal: false,
      signUpModal: false
    }
  }

  render() {
    return (
      <div>
        <div className="authenticate">
          <a onClick={this.displaySignIn}>Sign In</a> or <a onClick={this.displaySignUp}>Sign Up</a> to create a store!
        </div>
        <Modal
          className="modal"
          isOpen={this.state.signInModal}
          onRequestClose={this.closeModal}
        >
          <h2>Sign In!</h2>
          <button className="close" onClick={this.closeModal}>
            close
          </button>
          <form onSubmit={this.signIn}>
            <input type="text" ref="sessionUsername" />
            <input type="password" ref="sessionPassword" />
            <input type="Submit" />
          </form>
        </Modal>
        <Modal
          className="modal"
          isOpen={this.state.signUpModal}
          onRequestClose={this.closeModal}
        >
          <h2>Sign Up!</h2>
          <button className="close" onClick={this.closeModal}>
            close
          </button>
          <form onSubmit={this.signUp}>
            <input type="text" ref="registerUsername" />
            <input type="password" ref="registerPassword" />
            <input type="Submit" />
          </form>
        </Modal>
      </div>
    )
  }

  signIn(event) {
    event.preventDefault()
    console.log("signIn")
    console.log(this.refs.sessionUsername.value)
    console.log(this.refs.sessionPassword.value)
  }

  signUp(event) {
    event.preventDefault()
    console.log("signUp")
    console.log(this.refs.registerUsername.value)
    console.log(this.refs.registerPassword.value)
  }

  displaySignIn() {
    this.setState({
      signInModal: true
    })
  }

  displaySignUp() {
    this.setState({
      signUpModal: true
    })
  }

  closeModal() {
    this.setState({
      signInModal: false,
      signUpModal: false
    })
  }

}


// ---------------------------------------------------------------------------

export default Authentication
