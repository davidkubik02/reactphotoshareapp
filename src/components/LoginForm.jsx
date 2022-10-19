import React from 'react'
import { db } from '../firebase'
import { getDoc, doc } from 'firebase/firestore'

const LoginForm = ({onLogin}) => {
    document.body.style.overflow = 'hidden'
    const loginHandle = async (e) =>{
        e.preventDefault()
        const id = e.target.form[0].value
        const password = e.target.form[1].value
        if(!id || !password) return

        const docRef = doc(db, 'users', id)
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          window.alert('účet neexistuje')
          e.target.form[1].value=''
          return
        }
        if(docSnap.data().password!==password){
            window.alert('Chybné heslo')
            e.target.form[1].value=''
            return
        }
        onLogin(id)
        document.cookie = `user=${id}`
        document.cookie = `password=${password}`
        e.target.form[0].value=''
        e.target.form[1].value=''
        window.alert('Úspěšně přihlášen')

        
    }



  return (
    <>
      <div onClick={onLogin} className='login-form-overlay'></div>
      <form className='login-form'>
      <i className="form-exit-button fa-solid fa-x" onClick={onLogin}></i>
        <div>
          <label className='form-label'>ID:</label>
          <input className='form-input' type="text" />
        </div>
        <div>
            <label className='form-label'>Heslo:</label>
            <input className='form-input' type="password" />
        </div>
        <div>
            <input className='form-submit' onClick={loginHandle} value='Přihlásit se' type="submit"/>
            <input style={{backgroundColor:'#987'}} className='form-submit' onClick={(e)=>{
              e.target.form[0].value = 'user1'
              e.target.form[1].value = '123456'
              loginHandle(e)
            }} value='Použít účet user1' type="submit"/>
        </div>
      </form>
    </>
  )
}

export default LoginForm