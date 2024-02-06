import React, { useContext } from 'react';
import './JoinForm.css';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { FaUser, FaLock } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { LuUserSquare } from "react-icons/lu";

const JoinForm = ({ join }) => {
  const { login } = useContext(LoginContext);

  const onJoin = (e) => {
    e.preventDefault();
    const userId = e.target.username.value;
    const userPw = e.target.password.value;
    const name = e.target.name.value;
    const email = e.target.email.value;

    console.log(userId, userPw, name, email);

    join(userId, userPw, name, email);
  };

  return (
      <div className="wrapper">
        <h1 className="login-title">회원가입</h1>
        <form action=" " onSubmit={(e) => onJoin(e)}>
          <div className="input-box">
            <input
                id="username"
                type="text"
                placeholder="UserId"
                name="username"
                autoComplete="new-username"
                required
            />
              <FaUser className='icon'/>
          </div>
          <div className="input-box">
            <input
                id="password"
                type="password"
                placeholder="Password"
                name="password"
                autoComplete="new-password"
                required
            />
              <FaLock className='icon'/>
          </div>
          <div className="input-box">
            <input
                id="name"
                type="text"
                placeholder="Name"
                name="name"
                autoComplete="name"
                required
            />
              <LuUserSquare className='icon'/>
          </div>
          <div className="input-box">
            <input
                id="email"
                type="email"
                placeholder="Email"
                name="email"
                autoComplete="email"
                required
            />
              <MdOutlineEmail className='icon'/>
          </div>
          <br/>
          <button type="submit" style={{backgroundColor : '#7a573e', color : 'white'}}>
            Join
          </button>
        </form>
      </div>
  );
};

export default JoinForm;
