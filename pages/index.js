import { useState, useEffect } from 'react';
import fire from '../config/firebase-config';
import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.scss';
import { useAuth } from '../hooks/useAuth'; 
import NeedLog from '../components/needLog';

import MessageConv from '../components/messageConv';

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
          
              <MessageConv/>
            
          }
        </section>
    </Layout>
  )
}