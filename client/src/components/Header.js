import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import '../styles/landing.css';

const Header = ({ user }) => {
  return (
    <nav className="landingNav fixed-top">
      <NavLink to="/">
        <h3 className="landing-name">S P L I T W I S E</h3>
      </NavLink>

      <div className="float">
        <NavLink to="/login">
          <button className="loginBtn">Log In</button>
        </NavLink>
        <label>or</label>
        <NavLink to="/signup">
          <button className="SignUp">Sign Up</button>
        </NavLink>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(Header);
