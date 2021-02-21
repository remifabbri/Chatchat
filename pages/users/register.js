import { useState } from 'react'; 
import fire from '../../config/firebase-config';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth'
import utilStyles from '../../styles/utils.module.scss'

const Register = () => {
  const router = useRouter();
  const auth = useAuth();
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passConf, setPassConf] = useState('');
  const [notification, setNotification] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password !== passConf) {
      setNotification(
       'Mot de passe non identique.'
      )
      setTimeout(() => {
        setNotification('')
      }, 4000)
      setPassword('');
      setPassConf('');
      return null;
    }

    if (password.length < 6) {
      setNotification(
       'Votre mot de passe est trop court : 6 caractères minimun'
      )
      setTimeout(() => {
        setNotification('')
      }, 4000)
      setPassword('');
      setPassConf('');
      return null;
    }

    return auth.signUp({ name, email, password }).then(()=> {
        setname('');
        setEmail('');
        setPassword('');
        setPassConf('');
        router.push("/")
    })
  }

  const signUpWithGoogle = (e) => {
    e.preventDefault(); 
    return auth.signUpWithGoogle().then(() => {
      router.push('/');
    });
  }

  return (
    <div className={utilStyles.signSection}>
      <div className={utilStyles.bgSignSection}></div>
      <div className={utilStyles.signBlock}>
        <h1>Créer un compte</h1>
        {notification}
        <div className={utilStyles.styleHr}></div>
        <h3>Réseaux sociaux</h3>
        <button className={utilStyles.signGoogle} onClick={(e) => signUpWithGoogle(e)}></button>
        <div className={utilStyles.styleHr}></div>
        <h3>Email et Mot de passe</h3>
        <form onSubmit={handleLogin} className={utilStyles.formDefault} >
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="input" className={utilStyles.form__field} placeholder="Nom" value={name} 
              onChange={({target}) => setname(target.value)} required />
            <label for="name" className={utilStyles.form__label}>Nom</label>
          </div>
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="input" className={utilStyles.form__field} placeholder="Email" value={email} 
              onChange= {({target}) => setEmail(target.value)} required />
            <label for="name" className={utilStyles.form__label}>Email</label>
          </div>
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="password" className={utilStyles.form__field} placeholder="Mot de passe" value={password} 
              onChange= {({target}) => setPassword(target.value)} required />
            <label for="name" className={utilStyles.form__label}>Mot de passe</label>
          </div>
          <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
            <input type="password" className={utilStyles.form__field} placeholder="Confirmer mot de passe" value={passConf} 
              onChange= {({target}) => setPassConf(target.value)} required />
            <label for="name" className={utilStyles.form__label}>Mot de passe</label>
          </div>
          <button type="submit" className={utilStyles.ActionButton}>
            Connexion
          </button>
        </form>
      </div>

      {notification !== "" &&
        <div className={utilStyles.blockNotification}>
          <p>{notification}</p>
        </div>
      }

    </div>
  )
}

export default Register

