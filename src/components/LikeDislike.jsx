import React, { useState } from 'react'
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc} from "firebase/firestore";
import { db } from '../firebase';
import { UserInfo } from '../usefull/User';
import { useContext } from 'react';

const LikeDislike = ({data}) => {

  const {userInfo, setUserInfoUpdated} = useContext(UserInfo)
  const [likes, setLikes] = useState(data.likes.length)
  const [dislikes, setDislikes] = useState(data.dislikes.length)
  const currentLikes = data.likes.includes(userInfo.userName) ? data.likes.length-1 : data.likes.length
  const currentDislikes = data.dislikes.includes(userInfo.userName) ? data.dislikes.length-1 : data.dislikes.length


  const likeHandle = async()=>{
    if(!userInfo.userName){
          window.alert('Musíte se nejprve přihlásit')
          return
        }
      getDoc(doc(db, 'posts', data.id))
          .then(async (response)=>{
            if(response.data().likes.includes(userInfo.userName)){
                  await updateDoc(doc(db, 'posts', `${data.id}`), {
                    likes: arrayRemove(userInfo.userName)
                  })
                  await updateDoc(doc(db, "users", userInfo.userName), {
                    liked: arrayRemove(data.id)
                  })
                  setUserInfoUpdated(false)
                  setLikes(currentLikes)
                  return
                }
            await updateDoc(doc(db, 'posts', `${data.id}`), {
              likes: arrayUnion(userInfo.userName),
              dislikes: arrayRemove(userInfo.userName)
            })
            await updateDoc(doc(db, "users", userInfo.userName), {
                  liked: arrayUnion(data.id),
                  disliked: arrayRemove(data.id)
            })
            setUserInfoUpdated(false)
            if(response.data().dislikes.includes(userInfo.userName)){
              setDislikes(currentDislikes)
            }
            setLikes(currentLikes+1)
            
          })
    
  }
  const dislikeHandle = async()=>{
    if(!userInfo.userName){
          window.alert('Musíte se nejprve přihlásit')
          return
        }
      getDoc(doc(db, 'posts', data.id))
          .then(async (response)=>{

            if(response.data().dislikes.includes(userInfo.userName)){
                  await updateDoc(doc(db, 'posts', `${data.id}`), {
                    dislikes: arrayRemove(userInfo.userName)
                  })
                  await updateDoc(doc(db, "users", userInfo.userName), {
                    disliked: arrayRemove(data.id)
                  })
                  setUserInfoUpdated(false)
                  setDislikes(currentDislikes)
                  return
                  }
            await updateDoc(doc(db, 'posts', `${data.id}`), {
              dislikes: arrayUnion(userInfo.userName),
              likes: arrayRemove(userInfo.userName)
            })
            await updateDoc(doc(db, "users", userInfo.userName), {
                  disliked: arrayUnion(data.id),
                  liked: arrayRemove(data.id)
            })
            setUserInfoUpdated(false)
            if(response.data().likes.includes(userInfo.userName)){
              setLikes(currentLikes)
            }
            setDislikes(currentDislikes+1)
          })
    
  }

  return (
    <div className='like-dislike-button flex'>
        <div onClick={likeHandle} className='like-button'>
            {userInfo.liked.includes(data.id)?<i className="fa-solid fa-thumbs-up"></i>:<i className="fa-regular fa-thumbs-up"></i>}
            
            <span className='like-dislike-counter'>{likes}</span>
        </div>
        <div onClick={dislikeHandle} className='dislike-button'>
            {userInfo.disliked.includes(data.id)?<i className="fa-solid fa-thumbs-down"></i>:<i className="fa-regular fa-thumbs-down"></i>}
            <span className='like-dislike-counter'>{dislikes}</span>
        </div>
    </div>
  )
}

export default LikeDislike