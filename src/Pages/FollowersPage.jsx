import React from 'react'
import { useContext } from 'react'
import Post from '../components/Post'
import { UserInfo } from '../usefull/User';
import { Link } from 'react-router-dom';

const FollowersPage = ({data}) => {

const {userInfo} = useContext(UserInfo)

    const userPosts = [...data].filter((onePost)=>userInfo.followers?.includes(onePost.author))
  return (
    <div>
        {userInfo.followers?.length
        ?
          <div className='under-header'>
              <div>Sledující: </div>
              <div className='followers'>
                {
                  userInfo.followers.map((oneFollower)=> <Link to={`/user/${oneFollower}`} key={oneFollower}>{oneFollower}</Link>)
                }
              </div>
          </div>
        :
          <div className='under-header'>Žádní sledující</div>}
      {userPosts?.length
        ?
        <div className="posts">
              {[...userPosts].map((onePost)=>{
              return <Post data={onePost} key={onePost.id}/>
              })}
        </div>
        :
        <div className='not-exist'>Žádné příspěvky</div>
    }
      
    </div>
  )
}

export default FollowersPage