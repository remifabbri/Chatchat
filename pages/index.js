import { useState, useEffect } from 'react';
import fire from '../config/firebase-config';
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.scss'
import stylesBoutique from '../styles/page/boutiqueClient.module.scss'
import Link from 'next/link'
// import { getSortedPostsData } from '../lib/posts'

// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData()
//   return {
//     props: {
//       allPostsData
//     }
//   }
// }

export default function Home({allPostsData}) {

  const [Boutique, setBoutique] = useState([]);

  useEffect(() => {
    fire.firestore()
      .collection('Boutique')
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
          <h2>Présentation</h2>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et mollis erat. Morbi vel mi vel tellus ullamcorper rhoncus sed vel augue. Duis leo lectus, tempus luctus hendrerit non, condimentum in odio. Nullam dignissim eu est eget bibendum. Nulla facilisi. Nam euismod felis sit amet ex mollis pretium. 
          </p>
        </section>

        <section className={utilStyles.headingMd}>
          <h2>Notre boutique</h2>

          <div className={stylesBoutique.blockProduitAccueil}>
            {Boutique.map( B => 
            <Link key={B.id} href="/boutiqueClient/[product]" as={'/boutiqueClient/' + B.id}>
              <div key={B.id} className={stylesBoutique.cardProduct}> 
                <img src={B.images[0]}/>
                <p className={stylesBoutique.titre}>{B.name}</p>
                <div>
                  <span>{B.prix} €</span>
                </div>
                <button>Ajouter au panier</button>
              </div>
              </Link>
            )}
          </div>

        </section>
    </Layout>
  )
}