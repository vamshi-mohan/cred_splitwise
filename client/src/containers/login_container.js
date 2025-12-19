import React from 'react';
import { Login } from '../components/login';
import { instance } from '../utils/AxiosConfig';
import { withRouter } from "react-router-dom";

class LoginSmart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      invalid: false
    };
  }

  handleInput = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleLogin = () => {
    const { username, password } = this.state;

    instance.post('/login', { username, password })
      .then((response) => {
        const { token, Status } = response.data;

        if (Status === 'S') {
          localStorage.setItem('jwtToken', token);
          this.props.history.push("/Dashboard");
        } else if (Status === 'F') {
          this.setState({ invalid: true });
        }
      })
      .catch(() => {
        this.setState({ invalid: true });
      });
  };

  render() {
    return (
      <Login
        sts={this.state.invalid}
        input={this.handleInput}
        login={this.handleLogin}
      />
    );
  }
}

export default withRouter(LoginSmart);
