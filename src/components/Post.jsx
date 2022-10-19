import React from 'react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserInfo } from '../usefull/User'
import LikeDislike from './LikeDislike'
import './post.css'
import { db } from '../firebase'
import { updateDoc, doc, arrayUnion, arrayRemove,  } from 'firebase/firestore'

function Post({data}) {

  const {userInfo, setUserInfoUpdated} = useContext(UserInfo)



  const followHandle = async ()=>{
    if(!userInfo.userName) {
      alert('Musíte se nejprve přihlásit')
      return
    }
    await updateDoc(doc(db, "users", userInfo.userName), {
      followers: arrayUnion(data.author)
    })
    setUserInfoUpdated(false)
  }

  const unFollowHandle = async()=>{
    await updateDoc(doc(db, "users", userInfo.userName), {
      followers: arrayRemove(data.author)
    })
    setUserInfoUpdated(false)
  }
  return (
    <div className='post'>
      <div className='post-picture-container'>
          <img src={data.image} alt={`post named ${data.name}`} className='post-picture'/>
      </div>
      
      <div className='post-footer'>
          <h2 className='post-title'>{data.name}</h2>
          <Link to={`/user/${data.author}`}>{data.author}</Link>
          {userInfo.userName !==data.author && (userInfo.followers?.includes(data.author)
            ?
              <i className="follow-button fa-solid fa-heart" onClick={unFollowHandle}></i>
            :
              <i className="follow-button fa-regular fa-heart" onClick={followHandle}></i>)
          }


          
          <LikeDislike data={data}/>
      </div>
      
    
    </div>
  )
}

export default Post