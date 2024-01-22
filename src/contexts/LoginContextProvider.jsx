import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Swal from '../apis/alert';
import * as auth from '../apis/auth';

export const LoginContext = React.createContext();
LoginContext.displayName = 'LoginContextName'

const LoginContextProvider = ({ children }) => {

  // 페이지 이동
  const navigate = useNavigate()

  // 로그인 여부
  const [isLogin, setIsLogin] = useState(false);

  // 유저 정보
  const [userInfo, setUserInfo] = useState({});

  // 아이디 저장
  const [rememberUserId, setRememberUserId] = useState()

  /**
   * 💍✅ 로그인 체크
   */
  const loginCheck = async (isAuthPage=false) => {

    let response
    let data

    if(isAuthPage ) {
      navigate("/")
    }
    try {
      response = await auth.info()
    } catch (error) {
      console.error(`error : ${error}`)
      return
    }

    // 응답실패 시, 세팅 ❌
    if( !response ) return

    data = response.data
    console.log(`data : ${data}` );

    // 인증 실패
    if(response.status === 401 ) {
      // 인증이 안되어 있는 경우,
      // 로그인 페이지로 이동 OR refresh token 고려
      // 로그인이 필요한 페이지인 경우, 로그인 페이지로 이동
      // navigate("/")
      console.error(`세션이 만료되었거나 인증에 실패하였습니다.`);
      return
    }
    // ✅ 인증 성공
    // 정보 세팅
    loginSetting(data)
  }

  /**
   * 🔐 로그인
   */
  const login = async (loginId, password, rememberId) => {

    console.log(`username : ${loginId}`);
    console.log(`password : ${password}`);

    // 아이디 저장
    if( rememberId ) Cookies.set("rememberId", loginId)
    else Cookies.remove("rememberId")

    try {
      const {statusCode, responseData}  = await auth.login(loginId, password)

      console.log(responseData);

      if( statusCode === 200 ) {
        // 로그인 체크 ➡ 로그인 세팅
        loginCheck()

        // 페이지 이동 ➡ "/" (메인)
        // TODO : 메인 화면으로 꼭 이동할 필요가 있을까?
        Swal.alert("로그인 성공", "메인 화면으로 이동합니다.", "success", () => { navigate("/home") })}
    } catch (error) {
      console.error(`error : ${error}`)
      // 로그인 실패
      // - 아이디 또는 비밀번호가 일치하지 않습니다.
      Swal.alert("로그인 실패", "아이디 또는 비밀번호가 일치하지 않습니다.", "error" )
    }
  }

  /**
   * 🔓 로그아웃
   */
  const logout = (force=false) => {

    // comfirm 없이 강제 로그아웃
    if( force ) {
      // 로그아웃 세팅
      logoutSetting()
      // 페이지 이동 ➡ "/" (메인)
      navigate("/home")
      return
    }

    Swal.confirms("로그아웃하시겠습니까?", "로그아웃을 진행합니다.", "warning",
        (result) => {
          if( result.isConfirmed ) {
            // 로그아웃 세팅
            logoutSetting()

            // 페이지 이동 ➡ "/" (메인)
            navigate("/home")
          }
        })

  }

  // 로그인 세팅
  const loginSetting = async (userData) => {

    const userId = userData.loginId;
    const userName = userData.userName;

    console.log(`userId : ${userId}`)
    console.log(`userName : ${userName}`)
    // 로그인 여부
    setIsLogin(true)

    // 유저정보 세팅
    const updateUserInfo ={userId, userName}
    setUserInfo(updateUserInfo)

  }

  // 로그아웃 세팅
  const logoutSetting = async () => {
    await auth.logout()
    // 상태 비우기
    setIsLogin(false)
    setUserInfo(null)
    //setRoles(null)
    // 🍪 쿠키 지우기

  }

  useEffect(() => {

    // 로그인 체크
    //loginCheck()

  }, []);

  return (
      <LoginContext.Provider value={ {isLogin, userInfo, loginCheck, login, logout } }>
        {children}
      </LoginContext.Provider>
  );
};

export default LoginContextProvider;
