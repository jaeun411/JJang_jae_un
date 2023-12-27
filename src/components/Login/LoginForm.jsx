import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../contexts/LoginContextProvider';
import './LoginForm.css';
import IdForm from "../Id/Id";
import PwForm from "../Pw/Pw";

const LoginForm = () => {

  const { login } = useContext(LoginContext);
  const [rememberUserId, setRememberUserId] = useState();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleLabelClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  const onLogin = (e) => {
    e.preventDefault()
    const username = e.target.username.value
    const password = e.target.password.value
    const rememberId = e.target.rememberId.checked
    console.log(e.target.username.value)
    console.log(e.target.password.value)
    console.log(e.target.rememberId.checked)

    login(username, password, rememberId)
  }

  useEffect( () => {
    // 쿠키에서 저장된 아이디 가져오기
    const remeberId = Cookies.get("rememberId")
    console.log(`쿠키 remeberId : ${remeberId}`);
    setRememberUserId(remeberId)

  }, [])

  return (
      <div className="form">
        <h2 className="login-title">Login</h2>

        <form className="login-form" onSubmit={(e) => onLogin(e)}>
          <div>
            <label htmlFor="name">username</label>
            <input
                id="username"
                type="text"
                placeholder="username"
                name="username"
                autoComplete='username'
                required
                defaultValue={rememberUserId}
            />
          </div>
          <div>
            <label htmlFor="password">password </label>
            <input
                id="password"
                type="password"
                placeholder="password"
                name="password"
                autoComplete='current-password'
                required
            />
          </div>
          <div className='form-check'>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
            <label className="toggle-btn" style={{ marginRight: '5px' }}>
              {!rememberUserId
                  ?
                  <input type="checkbox" id="remember-id" name='rememberId' value='0'/>
                  :
                  <input type="checkbox" id="remember-id" name='rememberId' value='0' defaultChecked/>
              }
              <span className="slider"></span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <label htmlFor='remember-id' className='check-label'>아이디 저장 |</label>
              <IdForm />
              <PwForm />
            </div>
            </div>
          </div>

          <button className="btn btn--form btn-login" value="Login">
            Login
          </button>
        </form>
      </div>
  );
}

export default LoginForm