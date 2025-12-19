import React from 'react';
import { instance } from '../utils/AxiosConfig';
import { withRouter } from "react-router-dom";
import { userActionCreator } from "../redux/actionCreator/userAction";
import { store } from "../redux/store";

class AuthComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loading: true
    };
  }

  componentDidMount() {
    const jwt = localStorage.getItem('jwtToken');

    if (!jwt) {
      this.props.history.push('/login');
      return;
    }

    instance
      .get('/getUser', {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      .then(res => {
        const user = res.data.userdata.doc;

        localStorage.setItem("username", user.username);

        this.setState({
          user,
          loading: false
        });

        const action = userActionCreator(user, 'AddUser');
        store.dispatch(action);
      })
      .catch(() => {
        localStorage.removeItem('jwtToken');
        this.props.history.push('/login');
      });
  }

  render() {
    if (this.state.loading) {
      return <h1>Loading...</h1>;
    }

    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(AuthComponent);
