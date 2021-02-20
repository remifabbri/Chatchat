import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout';
import { useRouter } from 'next/router'
import { fire, auth, storage, db } from '../config/firebase-config';
import { useAuth } from '../hooks/useAuth'; 
import styles from '../styles/component/createGroupConv.module.scss';
import utilStyles from '../styles/utils.module.scss';
import { useStore } from '../hooks/useStore'; 
import NeedLog from '../components/needLog';


export default function CreateGroupConv({parentCallback, props}) {
    const auth = useAuth();
    const user = auth.user; 
    const router = useRouter();

    const userStore = useStore();
    const store = userStore.store;
    
    const [toggle, setToggle] = useState(false);

    const [users, setUsers] = useState([]);
    const [usersFind, setUsersFind] = useState([]);

    const [searchUsers, setSearchUsers] = useState('');

    const [usersGroup, setUsersGroup] = useState([]);
    const [titre, setTitre] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if(user){
            fire
            .firestore()
            .collection('users')
            .get()
            .then((querySnapshot) => {
                let usersDb = [];
                querySnapshot.forEach((doc) => {
                    if(doc.id !== user.uid){
                        usersDb.push(doc.data()); 
                    }
                })
                setUsers(usersDb);
                setUsersFind(usersDb);
            })
        }
    }, []);

    const handleSearchUsers = async(e) => {
        setSearchUsers(e.target.value);
        if(e.target.value === ""){
            setUsersFind([]); 
        }else{
            let eventTargetValue = e.target.value;
            let userFindInName = [];
            for await (let user of users) {
                let result = user.name.match(new RegExp(`${eventTargetValue}`, 'gi'));
                if(result !== null){
                    userFindInName.push(user);
                }
            }
            setUsersFind(userFindInName);
        }
    }

    const addUsersToGroupConv = async(e, user) => {
        e.preventDefault();
        let find = false;
        for await (let u of usersGroup){
            if(u.name === user.name){
                find = true;
            }
        }
        if(find === false){
            let newUserGroup = [...usersGroup, user];
            setUsersGroup(newUserGroup);
        }
    }

    const deleteUsersToGroupConv = async(e, ug) => {
        e.preventDefault();
        let newArr = [...usersGroup];
        for await (let u of newArr){
            if(u.name === ug.name){
                newArr.splice(u, 1); 
            }
        }
        setUsersGroup(newArr);

    }

    const cancelCreateGroup = (e) => {
        e.preventDefault();
        cleanHookState(); 
    }

    const createAndSendMessageToGroup = (e) => {
        e.preventDefault();
        let members = usersGroup.map(ug => (ug.uid));
        let titregroupe = titre
        if(titregroupe === ''){
            let arrName = usersGroup.map(ug => (ug.name));
            titregroupe = arrName.join(', ');
            titregroupe = `${titregroupe}, ${user.name}`;
        }

        let arrPP = usersGroup.map(ug => (ug.pp));
        arrPP.push(user.pp);

        members.push(user.uid); 

        let RefidDoc = fire.firestore().collection("Groupe").doc();

        fire
        .firestore()
        .collection("Groupe")
        .doc(RefidDoc.id)
        .set({
            createAt : fire.firestore.Timestamp.fromDate(new Date()),
            createdBy : user.uid, 
            id : RefidDoc.id,
            members : members,
            titre : titregroupe,
            ppGroupe : arrPP
        })
        .then(() => {
            members.forEach( member => {
                fire
                .firestore()
                .collection('users')
                .doc(member)
                .update({
                    groups: fire.firestore.FieldValue.arrayUnion(RefidDoc.id)
                });
            })
        })
        .then(() => {
            fire
            .firestore()
            .collection('Message')
            .doc(RefidDoc.id)
            .collection('Messages')
            .add({
                messageText : message, 
                sentAt : fire.firestore.Timestamp.fromDate(new Date()),
                sentBy : user.uid,
                userPP : user.pp
            })
            .then(() => {
                userStore.handleChangeIDGroupe(RefidDoc.id);
                cleanHookState();
            })
        });
    }

    const cleanHookState = () => {
        setSearchUsers(''); 
        setUsersFind([]);
        setTitre('');
        setUsersGroup([]);
        setMessage('');
        setToggle(false);
        router.push('/');
    }
    
    return(
        <Layout>

            {!user
            ? 
              <NeedLog/>
            :  
                <div className={styles.blockCreateGroupeConv}>
                    <h2>Créer une conversation</h2>
            
                    <input value={searchUsers} placeholder={'Rechercher un utilisateur'} onChange={(e) =>  handleSearchUsers(e)} className={styles.inputSearchUser}/>

                    <div className={styles.blockSearchUser}>
                        {searchUsers !== "" && users ? 
                            usersFind.map( User => 
                                <div key={User.uid}>
                                    <button onClick={(e) => addUsersToGroupConv(e, User)} className={styles.itemUser}>
                                        <img src={User.pp}/>
                                        <span>{User.name}</span>
                                    </button>
                                </div>
                            )
                            :
                            users.map( User => 
                                <button onClick={(e) => addUsersToGroupConv(e, User)} className={styles.itemUser}>
                                    <img src={User.pp}/>
                                    <span>{User.name}</span>
                                </button>
                            )
                        }
                    </div>

                    
                    {usersGroup && 
                        <div className={styles.blockUserSelected}>
                            {usersGroup.map( ug => 
                                <button key={ug.uid} onClick={(e) => deleteUsersToGroupConv(e, ug)} className={styles.btnUserSelected}>
                                    <p>{ug.name}</p>
                                    <span>X</span>
                                </button>
                            )}
                        </div>
                    }
                    <div className={styles.blockText}>
                        
                        <input value={titre} placeholder='Donner un titre à votre conversation (optionel)' onChange={(e) => setTitre(e.target.value)} />

                        <label>Message</label>
                        <textarea rows='5' onChange={(e)=> setMessage(e.target.value)}/>

                    </div>
                    
                    <div className={styles.rowActionButton}>
                        <div className={styles.limiteBlock}>
                                <button onClick={(e) => cancelCreateGroup(e) } className={`${utilStyles.ActionButtonCancel}`}>Annuler</button>
                                <button onClick={(e) => createAndSendMessageToGroup(e) } className={utilStyles.ActionButtonAdd}>Envoyer</button>
                        </div>
                    </div>
                </div>
            }  
        </Layout>
    )

}