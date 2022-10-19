import React from 'react'
import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { UserInfo } from '../usefull/User';

const PostCreator = () => {


  const {userInfo, setUserInfoUpdated} = useContext(UserInfo)
  const [name, setName] = useState('')


  // Načtení obrázku uživatelem
  const [postedImageSrc, setPostedImageSrc] = useState('')
  const [postedImage, setPostedImage] = useState('')
  
  const getPicture = (e)=>{
      const reader = new FileReader()
      reader.onload = ()=>{
        setPostedImageSrc(reader.result)
      }
      reader.readAsDataURL(e.target.files[0])
      setPostedImage(e.target.files[0])
      e.target.value=""
    }
    // Načtení obrázku uživatelem



    // Uložení příspěvku uživatele do databáze
    const storePost = (name, image)=>{
      if(name.length>22) {
        alert('Název je příliš dlouhý')
        return
      }
      if(name.length<3) {
        alert('Musíte zvolit název alespoň o třech znacích')
        return
      }
      if(!image){
        alert('došlo k chybě zkuste to prosím znovu')
        return
      }
      cancelHandle()
      const storageRef = ref(storage, `images/${name+Math.random()}`);
      uploadBytes(storageRef, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url)=> {
          try {
            await addDoc(collection(db, "posts"), {
              name: name,
              image: url,
              likes: [],
              dislikes:[],
              author: userInfo.userName
            });
            alert(`příspěvek ${name} byl úspěšně přidán`)
            setUserInfoUpdated(false)
      } catch (e) {
          alert('došlo k chybě zkuste to prosím znovu')

          }})})}
    // Uložení příspěvku uživatele do databáze

          const cancelHandle=()=>{
            setName('')
            setPostedImageSrc('')
            setPostedImage('')
          }

  return (

    <>
      {userInfo.userName && 
      <div className='post-creator'>
        <input className='get-file-button-input' type='file' id='file' accept='image/*' onChange={getPicture}/>
        <label className='get-file-button' htmlFor="file"> Vyberte obrázek z počítače</label>
        {postedImageSrc &&
          <>    
          <img src={postedImageSrc} alt="preview" className='post-creator-picture-preview'/>
          <div>
            <i className="post-creator-cancel-button fa-solid fa-x" onClick={cancelHandle}></i>
            <input className='post-creator-name-preview' value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder='Název'/>
            <button className='post-creator-publish-button' onClick={()=>storePost(name, postedImage)}>Zveřejnit</button>
          </div>
        </>}
      </div>}
    
    </>
  )
}

export default PostCreator