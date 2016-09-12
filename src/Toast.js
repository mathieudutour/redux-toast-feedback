import React from 'react'
import { connect } from 'react-redux'
import { clearFeedback } from './index'

module.exports = function (reducername = 'feedback') {
  const Feedback = React.createClass({

    propTypes: {
      error: React.PropTypes.string,
      success: React.PropTypes.string,
      dispatch: React.PropTypes.func,
      className: React.PropTypes.string
    },

    defaultProps: {
      className: 'toast-feedback'
    },

    shouldComponentUpdate (nextProps) {
      return nextProps.error !== this.props.error ||
              nextProps.success !== this.props.success
    },

    render () {
      if (this.props.success !== '') {
        return (
          <div className={this.props.className + ' success-notification'}
            onClick={this.props.clearFeedback} >
            {this.props.success}
          </div>
        )
      }
      if (this.props.error !== '') {
        return (
          <div className={this.props.className + ' error-notification'}
            onClick={this.props.clearFeedback} >
            {this.props.error}
          </div>
        )
      }
      return false
    },

    clearFeedback () {
      this.props.dispatch(clearFeedback())
    }
  })

  function mapStateToProps (state) {
    return state[reducername]
  }

  return connect(mapStateToProps)(Feedback)
}
