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
        <h1>Se Connecter</h1>
        {notify}
        <div className={utilStyles.styleHr}></div>
        <h3>Réseaux sociaux</h3>
        <button className={utilStyles.signGoogle} onClick={(e) => signInWithGoogle(e)}></button>
        <div className={utilStyles.styleHr}></div>
        <h3>Email/Mot de passe</h3>
        <form onSubmit={handleLogin} className={utilStyles.formDefault} >
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="input" className={utilStyles.form__field} placeholder="Email" value={email} 
              onChange={({target}) => setEmail(target.value)} required />
            <label for="email" className={utilStyles.form__label}>Email</label>
          </div>
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="password" className={utilStyles.form__field} placeholder="Mot de passe" value={password} 
              onChange={({target}) => setPassword(target.value)} required />
            <label for="name" className={utilStyles.form__label}>Mot de passe</label>
          </div>
          <button type="submit" className={utilStyles.ActionButton}>Connexion</button>
        </form>
        <Link href="/users/resetpassword">
          <a>Mot de passe oublié ?</a>
        </Link>
      </div>
    </div>
  )
}

export default Login