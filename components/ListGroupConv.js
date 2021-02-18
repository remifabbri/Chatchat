import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { fire, auth, storage, db } from '../config/firebase-config';
import { useAuth } from '../hooks/useAuth'; 
import { useStore } from '../hooks/useStore'; 

import styles from '../styles/component/listGroupeConv.module.scss'

export default function CreateGroupConv({toggleCallback}) {
    const auth = useAuth();
    const user = auth.user; 

    const userStore = useStore();
    const store = userStore.store;

    const [groupes, setGroupes] = useState([]);

    useEffect(() => {

        console.log(user);
        fire
        .firestore()
        .collection('Groupe')
        .where('members', 'array-contains', user.uid)
        .onSnapshot((querySnapshot) => {
            const arrGroups = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id
                arrGroups.push(data);
            })
            setGroupes(arrGroups);
        })
    }, [])

    const storeIdGroupe = (e, id) => {
        e.preventDefault();
        console.log('GO')
        userStore.handleChangeIDGroupe(id);
        toggleCallback(false);
        console.log('store CTRL', store);
    }

    console.log('store CTRL', store);
    console.log('groupes CTRL', groupes);

    return(
        <div className={styles.blockListConv}>
            {groupes && groupes.map(g => 
                <button key={g.id} onClick={(e) => storeIdGroupe(e, g.id)} className={styles.blockItemList}>
                    
                    <p>{g.titre}</p>
                    
                    <div className={styles.blockImg}>
                        <img src={g.ppGroupe[0]}/>
                    </div>
                </button>
            )}
        </div>
    )

}