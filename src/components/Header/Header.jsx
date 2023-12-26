import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import './Header.css'
import { LoginContext } from '../../contexts/LoginContextProvider';

const Header = () => {

    // ✅ isLogin   : 로그인 여부 - Y(true), N(false)
    // ✅ logout()  : 로그아웃 함수 - setIsLogin(false)
    const { isLogin, logout, userInfo } = useContext(LoginContext);
    return (
      <header>
          <div className="logo">
              <Link to="/home">
                <img src= "/img/logo.jpg" alt="logo" className='logo' />
              </Link>
          </div>
          <div className="util">
              <ul>
                {/* 로그인 여부에 따라 조건부 랜더링 */}
                { !isLogin ? 
                  <>
                    <Link to="/"><li className="font">로그인</li></Link>
                    <Link to="/join"><li className="font">회원가입</li></Link>
                    <Link to="/about"><li className="font">소개</li></Link>
                    <Link to="/admin"><li className="font">관리자</li></Link>
                  </>
                :
                  <>
                    <Link to="/user"><li className="font">마이페이지({userInfo.userId})</li></Link>
                    <Link to="/admin"><li className="font">관리자</li></Link>
                    <button className='link' onClick={ () => logout() }><li className="font">로그아웃</li></button>
                  </>
                }
              </ul>
          </div>
      </header>
  )
}

export default Header