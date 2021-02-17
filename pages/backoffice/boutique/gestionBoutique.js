import React, { useState, useEffect } from 'react';
import fire from '../../../config/firebase-config';
import Layout from '../../../components/layout'; 
import Head from 'next/head'; 
import Link from 'next/link';
import { getProduct }  from './Action_Boutique.js';
import styles from './Scss_boutique.module.scss';
import utilStyles from '../../../styles/utils.module.scss';

import FilterCategories from '../../../hooks/filterCategories';


export default function GestionBoutique() {

    const [boutique, setBoutique] = useState([]);

    const [filterCategories, setFilterCategories] = useState ([]); 

    const [notification, setNotification] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => { 
        fire
        .firestore()
        .collection('Boutique')
        .onSnapshot(snap => {
            const produitBoutique = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBoutique(produitBoutique); 
        });
    }, []);

    useEffect(() => {
        if(filterCategories.length > 0){
            fire
            .firestore()
            .collection('Boutique')
            .where('categories', 'array-contains-any', filterCategories)
            .get()
            .then((querySnapshot) => {
                const produitBoutique = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBoutique(produitBoutique); 
            })
        }else{
            fire
            .firestore()
            .collection('Boutique')
            .onSnapshot(snap => {
                const produitBoutique = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBoutique(produitBoutique); 
            }); 
        }

    }, [filterCategories]);

    const callbackFilter = (filterArr) => {
        setFilterCategories(filterArr);
    }

    console.log("controle filterArr", filterCategories );

    if(!boutique){
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
      <Layout backOffice>
        <Head>
          <title>Ma Boutique</title>
        </Head>
        
        {notification}
        <div className={styles.rowTitleButton}>
            <h2>Gestion des produits de la boutique</h2>
        </div>
        
        <FilterCategories CallbackFilter={callbackFilter} props={filterCategories}/>
        
        <div className={styles.tableauBoutique}>
            
            <Link href="/backoffice/boutique/[product]" as={'/backoffice/boutique/' + false}>
                <a className={styles.buttonTableau}>+ Ajouter un produit</a>
            </Link>
            {boutique.map(B =>
                <Link key={B.id} href="/backoffice/boutique/[product]" as={'/backoffice/boutique/' + B.id}>
                    <a className={styles.blockProduct}>
                        
                        <div className={styles.blockImg}>
                            <img src={B.images[0]} />
                        </div>
                        
                        <div className={styles.blockElement}>
                            <div className={styles.titre}>
                                <span>{B.name}</span> 
                            </div>
                            <div className={styles.rowsElement}>
                                <span>{B.prix} €</span>
                                <span>{B.stock} Disponible</span>
                                <span className={styles.classLevel}>
                                    {B.publish ?
                                        <span className={styles.green}>V</span>
                                        :
                                        <span className={styles.red}>X</span>
                                    }
                                </span> 
                            </div>
                        </div>
                    </a>
                </Link>
            )}
        </div>
      </Layout>
    )
  }