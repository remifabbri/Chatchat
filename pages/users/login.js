import { useState } from 'react';
import fire from '../../config/firebase-config';
import { useRouter } from 'next/router'
import { useAuth } from '../../hooks/useAuth'
import Link from 'next/link'
import utilStyles from '../../styles/utils.module.scss'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notify, setNotification] = useState('');
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    return auth.signIn({email, password}).then(()=> {
        setEmail('')
        setPassword('')
        router.push("/")
    })
  }

  const signInWithGoogle = (e) => {
    e.preventDefault(); 
    return auth.signInWithGoogle().then(() => {
      router.push('/');
    });
  }

  return (
    <div className={utilStyles.signSection}>
      <div className={utilStyles.bgSignSection}></div>
      <div className={utilStyles.signBlock}>
        <h1>Login</h1>
        {notify}
        <div className={utilStyles.styleHr}></div>
        <h3>Sign in with social média</h3>
        <button className={utilStyles.signGoogle} onClick={signInWithGoogle}></button>
        <div className={utilStyles.styleHr}></div>
        <h3>sign in with your Email/Password</h3>
        <form onSubmit={handleLogin} className={utilStyles.formDefault} >
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="input" className={utilStyles.form__field} placeholder="Email" value={email} 
              onChange={({target}) => setEmail(target.value)} required />
            <label for="email" className={utilStyles.form__label}>Email</label>
          </div>
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="input" className={utilStyles.form__field} placeholder="Password" value={password} 
              onChange={({target}) => setPassword(target.value)} required />
            <label for="name" className={utilStyles.form__label}>Password</label>
          </div>
          <button type="submit" className={utilStyles.ActionButton}>Login</button>
        </form>
        <Link href="/users/resetpassword">
          <a>Mot de passe oublié ?</a>
        </Link>
      </div>
    </div>
  )
}

export default Login