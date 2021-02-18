import { useState, useEffect } from 'react';
import fire from '../config/firebase-config';
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.scss'
import stylesBoutique from '../styles/page/boutiqueClient.module.scss'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'; 
import NeedLog from '../components/needLog'
import CreateConv from '../components/createGroupConv';
import ListGroupConv from '../components/ListGroupConv'




export default function Home({allPostsData}) {
  const auth = useAuth();
  const user = auth.user; 

  const [Boutique, setBoutique] = useState([]);

  useEffect(() => {
    fire.firestore()
      .collection('UserPublic')
      .onSnapshot(snap => {
        const snapBoutique = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      
        setBoutique(snapBoutique);
      });
  }, []);

  console.log('controle Boutique', Boutique);
  
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
        <section className={utilStyles.headingMd}>
          {!user
            ? 
              <NeedLog/>
            :  
            <>
              <CreateConv/>
              {/* <ListGroupConv/> */}
            </>
          }
        </section>
    </Layout>
  )
}