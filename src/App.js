import React, { useEffect, useState } from "react";
import "./app.css"
import { BrowserRouter, Routes, Route, NavLink} from "react-router-dom"
import {getDoc,getDocs, collection, doc } from "firebase/firestore";
import { db } from "./firebase";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { UserInfo } from "./usefull/User";
import HomePage from "./Pages/HomePage";
import UserPage from "./Pages/UserPage";
import FavoritesPage from "./Pages/FavoritesPage";
import FollowersPage from "./Pages/FollowersPage";
import { getCookie } from "./usefull/getCookies";
import ProfilePage from "./Pages/ProfilePage";




function App() {

    const [userName, setUserName] = useState('')
    const [registerFormState, setRegisterFormState] = useState(false)
    const [loginFormState, setLoginFormState] = useState(false)

    useEffect(()=>{
      let userName = getCookie("user");
      let password = getCookie("password");
      if(userName){
        getDoc(doc(db, 'users', userName))
        .then((response)=>{
          if(response.data().password===password){
            setUserName(userName)
          }
        })
      }
    }, [])

      

      // Načtení dat o uživateli
      const [userInfo, setUserInfo] = useState({})
      const [userInfoUpdated, setUserInfoUpdated] = useState(true)
      const getUserInfo = (userName)=>{
        if(userName){
            getDoc(doc(db, 'users/', userName))
            .then((response)=>{
              const userData = response.data()
              delete userData.password
              userData.userName = userName
              setUserInfo(userData)
            })
        }else setUserInfo({liked:[],disliked:[]})
        setUserInfoUpdated(true)
      }
      useEffect(()=>{
        getUserInfo(userName)
      }, [userName, userInfoUpdated])
      // Načtení dat o uživateli


      
      

      // Načtení všech příspěvků z databáze
      const [data, setData] = useState([])
      useEffect(()=>{
        getDocs(collection(db, 'posts'))
          .then((response)=>{
            const postsArray = []
            response.forEach(onePost =>{
              postsArray.push({...onePost.data(), id: onePost.id })
            })
            if(!postsArray.length){
              setData([false])
              return
            }
            setData(postsArray)
          })

      }, [userInfoUpdated])
    // Načtení všech příspěvků z databáze



    const logoutHandle = ()=>{
      const logout = window.confirm('Chcete se odhlásit?')
      if(!logout) return
      setUserName('')
      document.cookie="user=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      document.cookie="password=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    }

    const loginHandle = (userName)=>{
      setRegisterFormState(false)
      setLoginFormState(false)
      userName.length && setUserName(userName)
      document.body.style.overflow = 'auto'
    }
  
  
  return (
    <BrowserRouter>
      <nav className="navigation">
        <NavLink className="navigation-link" to='/'>Domů</NavLink>
        {userName && 
        <>
          <NavLink className={({isActive})=>isActive?"active-navigation-link":"navigation-link"} to={`/user/${userName}`}>Profil</NavLink>
          <NavLink className={({isActive})=>isActive?"active-navigation-link":"navigation-link"} to={`/favorites`}>Oblíbené</NavLink>
          <NavLink className={({isActive})=>isActive?"active-navigation-link":"navigation-link"} to={`/followers`}>Sleduji</NavLink>
        </>
        
        }
      </nav>
      {userName
          ?
            <div className="user-name-button" onClick={logoutHandle}>
              {userName}
            </div>
          :
            <div className="login-register-buttons">
              <div className="form-open-button" onClick={()=>{
                setLoginFormState(true)
                setRegisterFormState(false)
              }}>
                Přihlásit se          
              </div>
              <div className="form-open-button" onClick={()=>{
                setRegisterFormState(true)
                setLoginFormState(false)            
              }}>
                Zaregistruj se
              </div>
            </div>
          }

      
      {loginFormState && <LoginForm onLogin={loginHandle}/>}
      {registerFormState && <RegisterForm onRegister={loginHandle}/>}
      

      <UserInfo.Provider value={{userInfo,setUserInfoUpdated}}>
        <Routes>
          <Route exact path="/" element={<HomePage data={data}/>}/>
          {userName && 
            <>
              <Route path="/favorites" element={<FavoritesPage data={data}/>}/>
              <Route path="/followers" element={<FollowersPage data={data}/>}/>
              <Route path={`user/${userName}`} element={<ProfilePage data={[...data].filter((onePost)=>onePost.author===userName)}/>}/>
            </>
          }
          <Route path="/user/:id" element={<UserPage data={data}/>}/>
          
          <Route path="*" element={<HomePage data={data}/>}/>
        </Routes>
        
      </UserInfo.Provider>
        
        
    </BrowserRouter>
  )
}

export default App;
