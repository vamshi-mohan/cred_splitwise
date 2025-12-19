import React from "react";
import "../../../styles/frndPop.css";
import { connect } from "react-redux";
import Chips from "react-chips";
import { instance } from "../../../utils/AxiosConfig";
import { store } from "../../../redux/store";
import { userActionCreator } from "../../../redux/actionCreator/userAction";

class AddExpense extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chips: [],
      description: "",
      amount: "",
      date: ""
    };
  }

  onChangeChips = (chips) => {
    this.setState({ chips });
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  save = () => {
    const { chips, description, amount, date } = this.state;

    if (!description || !amount || chips.length === 0) {
      alert("Please fill all fields and select friends");
      return;
    }

    const splitAmount = Math.round(
      parseInt(amount, 10) / (chips.length + 1)
    );

    chips.forEach(friend => {
      instance
        .post("/addExp", {
          username: this.props.user.username,
          user: friend,
          inp: {
            description,
            amount: splitAmount,
            date
          }
        })
        .then(resp => {
          const action = userActionCreator(resp.data.doc, "AddUser");
          store.dispatch(action);
          this.props.friend();
        })
        .catch(() => {
          alert("Failed to add expense");
        });
    });
  };

  render() {
    return (
      <div className="friendPopup">
        <div className="frnd-content">
          <div className="frnd-header">
            <span>Add an expense</span>
            <button className="float-right" onClick={this.props.friend}>
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="exp-inp">
            <label>With you and</label>
            <div className="exp-name">
              <Chips
                value={this.state.chips}
                onChange={this.onChangeChips}
                suggestions={this.props.user.friends}
              />
            </div>
          </div>

          <div className="exp-inp2">
            <input
              id="description"
              type="text"
              placeholder="Enter Description"
              onChange={this.handleChange}
            />
            <input
              id="amount"
              type="number"
              placeholder="Enter Amount"
              onChange={this.handleChange}
            />
            <input
              id="date"
              type="date"
              onChange={this.handleChange}
            />
          </div>

          <div className="pop-btn pop-btns">
            <button className="btn Add" onClick={this.save}>
              Save
            </button>
            <button className="btn cut" onClick={this.props.friend}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(AddExpense);
