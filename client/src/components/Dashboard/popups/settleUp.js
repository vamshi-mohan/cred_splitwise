import React from 'react';
import '../../../styles/frndPop.css';
import { PaidBy } from './paidBy';
import { PaidTo } from './paidTo';
import { connect } from "react-redux";
import { instance } from '../../../utils/AxiosConfig';
import { store } from '../../../redux/store';
import { userActionCreator } from '../../../redux/actionCreator/userAction';

class SettleUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      paidBy: false,
      paidTo: false,
      byValue: "you",
      toValue: "select",
      amount: ""
    };
  }

  togglePaidBy = () => {
    this.setState({ paidBy: !this.state.paidBy, paidTo: false });
  };

  togglePaidTo = () => {
    this.setState({ paidBy: false, paidTo: !this.state.paidTo });
  };

  handleByValue = (value) => {
    this.setState({ byValue: value === this.props.user.username ? "you" : value });
  };

  handleToValue = (value) => {
    this.setState({ toValue: value === this.props.user.username ? "you" : value });
  };

  save = () => {
    const { byValue, toValue, amount } = this.state;

    if (toValue === "select") {
      alert("Please select the receiver");
      return;
    }

    if (!amount) {
      alert("You must enter an amount");
      return;
    }

    if (toValue !== "you" && byValue !== "you") {
      alert("Expense must involve you");
      return;
    }

    if (toValue === byValue) {
      alert("You can't add money to yourself");
      return;
    }

    let sender = toValue === "you" ? byValue : toValue;
    let value = toValue === "you" ? -amount : amount;

    instance.post("/settle", {
      username: this.props.user.username,
      user: sender,
      val: parseInt(value)
    }).then(resp => {
      const action = userActionCreator(resp.data.doc, 'AddUser');
      store.dispatch(action);
      this.props.friend();
    });
  };

  render() {
    const friendsList = [...this.props.user.friends, this.props.user.username];

    return (
      <div className="friendPopup">
        <div className="flx">
          <div className="frnd-content">
            <div className="frnd-header">
              <span>Settle up</span>
              <button className="float-right" onClick={this.props.friend}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="frnd-set">
              <button onClick={this.togglePaidBy}>
                {this.state.byValue === "you"
                  ? "you"
                  : this.state.byValue.slice(0, 6) + "..."}
              </button>
              paid
              <button onClick={this.togglePaidTo}>
                {(this.state.toValue === "you" || this.state.toValue === "select")
                  ? this.state.toValue
                  : this.state.toValue.slice(0, 6) + "..."}
              </button>
            </div>

            <input
              className="money"
              type="number"
              placeholder="$ 0.0"
              value={this.state.amount}
              onChange={(e) => this.setState({ amount: e.target.value })}
            />

            <div className="pop-btn bt-mr">
              <button className="btn Add" onClick={this.save}>Save</button>
              <button className="btn cut" onClick={this.props.friend}>Close</button>
            </div>
          </div>

          {this.state.paidBy && (
            <PaidBy list={friendsList} byValue={this.handleByValue} />
          )}

          {this.state.paidTo && (
            <PaidTo list={friendsList} toValue={this.handleToValue} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(SettleUp);
