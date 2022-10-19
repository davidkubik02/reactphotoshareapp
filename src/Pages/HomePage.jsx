import React from 'react'
import Post from '../components/Post'
import PostCreator from '../components/PostCreator'

const HomePage = ({data}) => {
  return (
    <>
      <PostCreator/>
      <div className="posts">
        {data?.length
        ?
        <>
        {
          data[0]
            ?
            [...data].map((onePost)=>{
              return <Post key={onePost.id} data={onePost}/>
            })
            :
            <div className='not-exist'>Žádné příspěvky</div>
        }
        </>
          
        :
          <div className="loading-icon">
            <i className="fas fa-spinner fa-pulse"></i>
          </div>
        }
      </div>
    </>
    
  )
}

export default HomePage