import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/Post'
import { UserInfo } from '../usefull/User';
import { db } from '../firebase';
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const UserPage = ({data}) => {
  const [loading, setLoading] = useState(true)
  const user = useParams().id
  
  const [userExist, setUserExist] = useState(false)
  useEffect(()=>{
    getDoc(doc(db, 'users', user))
    .then((res)=>{
      res.exists()?setUserExist(true):setUserExist(false)
      setLoading(false)
    })
  }, [user])

  const followHandle = async ()=>{
    if(!userInfo.userName) {
      alert('Musíte se nejprve přihlásit')
      return
    }
    await updateDoc(doc(db, "users", userInfo.userName), {
      followers: arrayUnion(user)
    })
    setUserInfoUpdated(false)
  }

  const unFollowHandle = async()=>{
    await updateDoc(doc(db, "users", userInfo.userName), {
      followers: arrayRemove(user)
    })
    setUserInfoUpdated(false)
  }
  const {userInfo, setUserInfoUpdated} = useContext(UserInfo)
  const userPosts = [...data].filter((onePost)=>onePost.author===user) 


  return (
    <>{
        userExist
        ?
          <>
            <div className='user-header'>
              <div className='user-header-username'>{user}</div>
              {
                userInfo.followers?.includes(user)
                ?
                  <button className='user-unfollow-button' onClick={unFollowHandle}>Zrušit sledování</button>
                :
                  <button className='user-follow-button' onClick={followHandle}>SLEDOVAT</button>
              }
            </div>
            {userPosts?.length
              ?
                <div>
                  <div className="posts">
                      {[...userPosts].map((onePost)=>{
                      return <Post data={onePost} key={onePost.id}/>
                      })}
                  </div>
                </div>
              :
              <div className='not-exist'>Žádné příspěvky</div>
            }
          </>
        :
          (loading
            ?
              <div className="loading-icon">
                <i className="fas fa-spinner fa-pulse"></i>
              </div>
            :
              <div className='not-exist'>Uživatel neexistuje</div>)
      }
      
      
    </>
  )
}


export default UserPage