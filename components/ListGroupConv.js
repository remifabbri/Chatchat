import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { fire, auth, storage, db } from '../config/firebase-config';
import { useAuth } from '../hooks/useAuth'; 
import styles from '../styles/component/listGroupeConv.module.scss'

export default function CreateGroupConv({parentCallback, props}) {
    const auth = useAuth();
    const user = auth.user; 

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


    console.log('groupes CTRL', groupes);

    return(
        <div className={styles.blockListConv}>
            {groupes && groupes.map(g => 
                <div key={g.id} className={styles.blockItemList}>
                    <div className={styles.blockImg}>
                        <img src={g.ppGroupe[0]}/>
                    </div>
                    <div>
                        <p>{g.titre}</p>
                    </div>
                </div>
            )}
        </div>
    )

}