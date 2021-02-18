import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { fire, auth, storage, db } from '../config/firebase-config';
import { useAuth } from '../hooks/useAuth'; 

export default function CreateGroupConv({parentCallback, props}) {
    const auth = useAuth();
    const user = auth.user; 

    const [toggle, setToggle] = useState(false);

    const [users, setUsers] = useState([]);
    const [usersFind, setUsersFind] = useState([]);

    const [searchUsers, setSearchUsers] = useState('');

    const [usersGroup, setUsersGroup] = useState([]);
    const [titre, setTitre] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
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
        console.log('user', user);

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

            console.log('docRef', RefidDoc.id);
            
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
                sentBy : user.uid
            })
            .then(() => {
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
    }
    console.log('RENDER : usersFind', usersFind);
    console.log('RENDER : usersGroup', usersGroup);
    

    return(
        <div>

            <button onClick={(e) => {e.preventDefault(); setToggle(true)}}>Créer un groupe</button>


            { toggle && 
                <div>
                    <h2>Créer une conversation</h2>
            
                    <input value={searchUsers} placeholder={'Rechercher'} onChange={(e) =>  handleSearchUsers(e)}/>

                    {searchUsers !== "" && users ? 
                        usersFind.map( User => 
                            <div key={User.uid}>
                                <button onClick={(e) => addUsersToGroupConv(e, User)}>{User.name}</button>
                            </div>
                        )
                        :
                        users.map( User => 
                            <div key={User.uid}>
                                <button onClick={(e) => addUsersToGroupConv(e, User)}>{User.name}</button>
                        </div>
                        )
                    }

                    <label>Groupe</label>
                    {usersGroup && usersGroup.map( ug => 
                        <div key={ug.uid}>
                                <span>{ug.name}</span>
                                <button onClick={(e) => deleteUsersToGroupConv(e, ug)}>Supprimer</button>
                        </div>
                    )}
                    
                    <input value={titre} placeholder='Donner un titre à votre conversation' onChange={(e) => setTitre(e.target.value)}/>

                    <textarea rows='5' onChange={(e)=> setMessage(e.target.value)}/>
                    
                    <div>
                        <button onClick={(e) => cancelCreateGroup(e) }>Annuler</button>
                        <button onClick={(e) => createAndSendMessageToGroup(e) }>Envoyer</button>
                    </div>
                </div>
            }

        </div>
    )

}