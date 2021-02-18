import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { fire, auth, storage, db } from '../config/firebase-config';
import { useAuth } from '../hooks/useAuth'; 
import { useStore } from '../hooks/useStore'; 

import styles from '../styles/component/listGroupeConv.module.scss'

export default function MessageConv({parentCallback, props}) {
    const auth = useAuth();
    const user = auth.user; 

    const userStore = useStore();
    const store = userStore.store;

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {

        console.log(store);
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
                sentBy: user.uid
            })
            .then(() => {
                setNewMessage('');
            }); 
        }

    }

    console.log('CTRL Messages', messages);
    console.log('store CTRL', store);


    return(
        <>
        {store.idGroupe === null ? 
            <p> {`<-- Selectionner une conversation...`}</p>
            :
            <div className={styles.blockListConv}>
                {messages && messages.map(m => 
                    <p>{m.messageText}</p>
                )}
                <div>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                    <button onClick={(e) => sendMessage(e)}>Encoyer</button>
                </div>
            </div>

        }
        </>
    )

}