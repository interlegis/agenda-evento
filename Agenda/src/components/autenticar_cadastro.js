import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cadastroAutenticado } from '../actions';
import Cookies from 'js-cookie';

class AutenticarCadastro extends Component {
  componentWillMount() {
    const token = this.props.params.token;
    this.props.cadastroAutenticado({ token });
  }

  renderAlert(){
    if (this.props.errorMessage) {
      return(
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="col-md-12 main-div padding-5">
          <h1>Usuario Autenticado com sucesso</h1>
        </div>
        {this.renderAlert()}
      </div>
    );
  }
}

function mapStateToProps(state){
  return { errorMessage: state.authentication.error };
}

export default connect(mapStateToProps,
  { cadastroAutenticado })(AutenticarCadastro);
