import React from 'react'
import { useContext } from 'react'
import Post from '../components/Post'
import { UserInfo } from '../usefull/User';

const FavoritesPage = ({data}) => {

const {userInfo} = useContext(UserInfo)


  const userPosts = [...data].filter((onePost)=>userInfo.liked.includes(onePost.id))

  
  return (
    <>
      {userPosts?.length
        ?
        <div className="posts">
              {[...userPosts].map((onePost)=>{
              return <Post data={onePost} key={onePost.id}/>
              })}
        </div>
        :
        <div className='not-exist'>Žádné oblíbené</div>
    }
      
    </>
  )
}

export default FavoritesPage