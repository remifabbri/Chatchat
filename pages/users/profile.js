import { useState } from 'react';
import fire from '../../config/firebase-config';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../hooks/useAuth'
import utilStyles from '../../styles/utils.module.scss'
import Layout from '../../components/layout';
import NeedLog from '../../components/needLog'

const profile = () => {
    const auth = useAuth();
    const router = useRouter();
    const user = auth.user; 
    // console.log("profile User", user);

    const handleLogout = () => {
        auth
        .signOut()
        .then(() => {
            router.push("/")
            // setNotification('Logged out')
            // setTimeout(() => {
            //     setNotification('')
                
            // }, 2000)
        })
    }


    return (
      <Layout backOffice>
        <h1> Votre Profile</h1>
        
        {!user
          ? <NeedLog/>
          :  <>
              <h3>Nom</h3>
              <p>{user.name}</p>
              <h3>Email</h3>
              <p>{user.email}</p>
              <h2>Option de gestion</h2>
              <Link href="/users/resetpassword">
                <a>Changé le mot de passe de son compte</a>
              </Link>
              <button className={`${utilStyles.ButtonAhref}`} onClick={handleLogout}>Logout</button>
            </>
        }
      </Layout>
    )
}

export default profile