import React from 'react';
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton';
import { fetchProfile } from '../actions/MovieAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const styles = {
  button: {
    margin: 12,
  },
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      username: '',
      password: ''
    }
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  onPasswordChange(e) {
    this.setState({password: e.target.value});
  }

  onSubmit(e) {
    this.props.fetchProfile(this.state.username, this.state.password);
    console.log('username:', this.state.username);
    console.log('password:', this.state.password);
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <TextField
          hintText={"Username"}
          floatingLabelText={"Username"}
          onChange={this.onUsernameChange}
        /> <br />
        <TextField
          hintText={"Password"}
          floatingLabelText={"Password"}
          type="password"
          onChange={this.onPasswordChange}
        /> <br />

        <RaisedButton
          label="Login"
          labelPosition="before"
          style={styles.button}
          containerElement="label"
          onClick={this.onSubmit}
        >
        </RaisedButton>
      </div>
    );
  }
}


function mapStateToProps({ profile }) {
  return { profile };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchProfile }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

