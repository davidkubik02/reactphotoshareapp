import React from 'react'
import { db } from '../firebase'
import {getDoc, doc, setDoc } from "firebase/firestore";

const RegisterForm = ({onRegister}) => {
    document.body.style.overflow = 'hidden'

    const regex = /[^A-Za-z0-9]+/g;

    const registerHandle = async (e)=>{
        e.preventDefault()
        const id = e.target.form[0].value
        const password = e.target.form[1].value
        const passwordAgin = e.target.form[2].value
        if (regex.test(id)){
          window.alert('jméno nemůže obsahovat speciální znaky')
          e.target.form[1].value = ''
          e.target.form[2].value = ''
          return
        }
        if (id.length<5 || id.length>15){
          window.alert('jméno musí být delší než 5 a kratší než 15 znaků')
          e.target.form[1].value = ''
          e.target.form[2].value = ''
          return
        }
        if (regex.test(password)){
          window.alert('heslo nemůže obsahovat speciální znaky')
          e.target.form[1].value = ''
          e.target.form[2].value = ''
          return
        }
        if (password.length<6){
          window.alert('heslo musí být delší než 6 znaků')
          e.target.form[1].value = ''
          e.target.form[2].value = ''
          return
        }
        if(passwordAgin !== password){
          window.alert('Hesla nejsou stejné')
          e.target.form[2].value = ''
          return
        }
        const docRef = doc(db, 'users', id)
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          window.alert('Zadejte jiné jméno')
          e.target.form[0].value=''
          return
        }

        try {
            await setDoc(doc(db, 'users',id), {
              password: password,
              liked:[],
              disliked:[],
              followers:[]
            })
            window.alert('Registrace proběhla úspěšně')
            onRegister(id)
            document.cookie = `user=${id}`
            document.cookie = `password=${password}`
            for(let i = 2; i >=0;i--){
              e.target.form[i].value=''
            }
          } catch (error) {
            window.alert(`Zkuste to prosím znovu: ${error}`)
              }
    }



  return (
    <>
      <div onClick={onRegister} className='login-form-overlay'></div>
      <form className='register-form'>
        <div>
            <label className='form-label'>ID:</label>
            <input className='form-input' type="text" />
        </div>
        <div>
            <label className='form-label'>Heslo:</label>
            <input className='form-input' type="password" />
        </div>
        <div>
            <label className='form-label'>Heslo znovu:</label>
            <input className='form-input' type="password" />
        </div>
        <input className='form-submit' value='Zaregistrovat se' type="submit" onClick={registerHandle}/>
        
      </form>
    </>
    
  )
}

export default RegisterForm