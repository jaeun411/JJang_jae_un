import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../contexts/LoginContextProvider';
import './LoginForm.css';
import IdForm from "../Id/IdForm";
import PwForm from "../Pw/Pw";
import { FaUser, FaLock } from "react-icons/fa";
import {Link} from "react-router-dom";

const LoginForm = () => {

  const { login } = useContext(LoginContext);
  const [rememberUserId, setRememberUserId] = useState();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleLabelClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  const onLogin = (e) => {
    e.preventDefault()
    const userId = e.target.username.value
    const password = e.target.password.value
    const rememberId = e.target.rememberId.checked
    console.log(e.target.username.value)
    console.log(e.target.password.value)
    console.log(e.target.rememberId.checked)

    login(userId, password, rememberId )
  }

  useEffect( () => {
    // 쿠키에서 저장된 아이디 가져오기
    const remeberId = Cookies.get("rememberId")
    console.log(`쿠키 remeberId : ${remeberId}`);
    setRememberUserId(remeberId)
  }, [])

  return (
      <div className="wrapper">
        <h1 className="login-title">로그인</h1>
        <form action=" " onSubmit={(e) => onLogin(e)}>
          <div className="input-box">
            <input
                id="username"
                type="text"
                placeholder="Userid"
                name="username"
                autoComplete='username'
                required
                defaultValue={rememberUserId}
            />
            <FaUser className='icon'/>
          </div>
          <div className="input-box">
            <input
                id="password"
                type="password"
                placeholder="password"
                name="password"
                autoComplete='current-password'
                required
            />
            <FaLock className='icon'/>
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
          <button value="Login">
            Login
          </button>
          <div className="register-link">
            계정이 없으신가요?
            <Link to="/join">
              <li className="font" style={{display: 'inline'}}>회원가입</li>
            </Link>
          </div>
        </form>
      </div>
  );
}

export default LoginForm