import React, { Component } from 'react';
import { connect } from 'react-redux';


export default function(ComposedComponent) {
  class Authentication extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {
      if (!this.props.authenticated) {
        this.context.router.push('/login');
      }
    }

    componentWillUpdate(nextProps) {
      console.log(nextProps);
      if (!nextProps.authenticated) {
        this.context.router.push('/login');
      }
    }

    render() {
      console.log(this.context);
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state){
    return { authenticated: state.authentication.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}
