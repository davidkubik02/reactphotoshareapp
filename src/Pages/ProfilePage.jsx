import React from 'react'
import { useState } from 'react';
import { useContext } from 'react';
import Post from '../components/Post'
import PostCreator from '../components/PostCreator';
import { UserInfo } from '../usefull/User';
import { db } from '../firebase';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';
import { storage } from '../firebase';
import { deleteObject, ref } from 'firebase/storage';

const ProfilePage = ({data}) => {
  const {userInfo, setUserInfoUpdated} = useContext(UserInfo)
  const userPosts = data

  const [deletePostActive, setDeletePostActive] = useState(false)

  const deletePost = (postID)=>{
    if(!window.confirm('Vážně chcete odtranit tento příspěvek?')) return

    getDoc(doc(db, 'posts', postID))
    .then(async (res)=>{
        await deleteDoc(doc(db, 'posts', postID))
        await deleteObject(ref(storage, res.data().image))
        alert('příspěvek byl úspěšně smazán')
        setUserInfoUpdated(false)
        setDeletePostActive(false)
    })
    }
  

  return (
    <>{
          <>
            <div className='under-header'>
              <div className='under-header-text'>{userInfo.userName}</div>
              <button className='activate-delete-button' onClick={()=>setDeletePostActive(!deletePostActive)}>{deletePostActive?'Zrušit':'Odstranit'}</button>
            </div>
            <PostCreator/>
            
            {userPosts?.length
              ?
                <div>
                  <div className="posts">
                      {[...userPosts].map((onePost)=>
                       <div key={onePost.id}>
                            {deletePostActive &&
                                <div className='delete-post-overlay'>
                                    <i onClick={()=>deletePost(onePost.id)} className="trash-can fa-solid fa-trash-can"></i>
                                </div>
                            }
                            <Post data={onePost}/>
                        </div>
                      )}
                  </div>
                </div>
              :
              <div className='not-exist'>Žádné příspěvky</div>
            }
          </>
      }
      
      
    </>
  )
}


export default ProfilePage