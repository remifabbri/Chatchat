import { set } from 'date-fns';
import React, { useState, useEffect, useRef } from 'react';
import { fire, auth, storage, db } from '../config/firebase-config';
import { useAuth } from '../hooks/useAuth'; 
import { useStore } from '../hooks/useStore'; 
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss';
import styles from '../styles/component/messageConv.module.scss'

export default function MessageConv({parentCallback, props}) {
    const auth = useAuth();
    const user = auth.user;

    const blockConv = useRef(null);

    const userStore = useStore();
    const store = userStore.store;

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if(store.idGroupe !== null && user !== null){
            fire
            .firestore()
            .collection('Message')
            .doc(store.idGroupe)
            .collection('Messages')
            .orderBy('sentAt')
            .onSnapshot((querySnapshot) => {
                const arrMessages = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id
                    arrMessages.push(data);
                })
                setMessages(arrMessages);
            })
        }
    }, [store])

    useEffect(() => {
        if( blockConv.current !== null){
            blockConv.current.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest"})
        }
    });


    const sendMessage = (e) => {
        e.preventDefault();
        if(newMessage !== ""){
            fire
            .firestore()
            .collection('Message')
            .doc(store.idGroupe)
            .collection('Messages')
            .add({
                messageText: newMessage,
                sentAt: fire.firestore.Timestamp.fromDate(new Date()),
                sentBy: user.uid,
                userPP : user.pp,
                userName : user.name 

            })
            .then(() => {
                setNewMessage('');
            }); 
        }

    }

    return(
        <div className={styles.blockMessageConv}>
        {store.idGroupe === null ? 
            <div className={styles.blockInfo}>
                <Link href="/createGroupConv">
                    <a className={styles.btnCreateConv}>
                        <span>Créer une conversation</span>
                        <img src='images/icons/addConv.svg'/>
                    </a>
                </Link>
                <span>ou</span>
                <p>Sélectionner une conversation...</p>
            </div>
            :
            <div ref={blockConv} className={styles.blockMessage}>
                {messages && messages.map((m,index) => 
                    <div key={index}>
                    {m.sentBy === user.uid ? 
                        <div  className={styles.messageUser}>
                            <p>{m.messageText}</p>
                        </div>
                        :
                        <div className={styles.message}>
                            <img src={m.userPP}></img>
                            <p>{m.userName && <span className={styles.displayName}>{m.userName}</span>}<span>{m.messageText}</span></p>
                        </div>
                    }
                    </div>
                )}
                <div className={styles.rowActionButton}>
                    <div className={styles.limiteBlock}>
                        <textarea type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                        <button onClick={(e) => sendMessage(e)} className={utilStyles.ActionButtonAdd}>Envoyer</button>
                    </div>
                </div>
            </div>

        }
        </div>
    )

}