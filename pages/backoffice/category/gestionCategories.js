import React, { useState, useEffect } from 'react';
import fire from '../../../config/firebase-config';
import Layout from '../../../components/layout'
import Head from 'next/head'
import Link from 'next/link'
import genPushId from '../../../hooks/generatePushId'

// import styles from './Scss_boutique.module.scss';
import utilStyles from '../../../styles/utils.module.scss'
import styles from './Scss_categories.module.scss';
import { set } from 'date-fns';


export default function GestionCategories() {

    const [categories, setCategories] = useState([]);

    const [toggleNomCat, setToogleNomCat] = useState(false);
    const [toggleEditCat, setToggleEditCat] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [modifIndexCat , setModifCat] = useState('');
    const [modifIndexSousCat , setModifSousCat] = useState('');
    const [newNameCat, setNewNameCat] = useState('');
    const [editIndexCat , setEditCat] = useState('');
    const [editIndexSousCat , setEditSousCat] = useState('');
    const [editIndexSousCat2 , setEditSousCat2] = useState('');
    

    useEffect(() => { 
        console.log('mountGestion Categories');
        console.log(genPushId());
        fire
        .firestore()
        .collection('Categories')
        .onSnapshot(snap => {
            const categoriesBoutique = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('categoriesBoutique', categoriesBoutique)
            setCategories(categoriesBoutique); 
        });

    }, []);


    const deleteCategory = (e, id) => {
        e.preventDefault(); 

        fire
        .firestore()
        .collection("Categories")
        .doc(categories[id].id)
        .delete()
        .then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    const deleteSubCategory = (e, indexObj, idSub1, idSub2) => {
        e.preventDefault(); 

        let newCategory = [...categories];

        if(idSub2 === undefined){
            delete newCategory[indexObj].subCat[idSub1];
        }else{
            delete newCategory[indexObj].subCat[idSub1].subCat[idSub2];
        }

        console.log(newCategory);
        
        fire
        .firestore()
        .collection("Categories")
        .doc(categories[indexObj].id)
        .set(newCategory[indexObj])
        .then(() => {
            console.log("Document successfully deleted!");
            setCategories(newCategory);
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    const addCategory = (e, idCat, idSousCat) => {
        e.preventDefault();
        console.log(idCat);
        setModifCat(idCat);
        console.log(idSousCat);
        setModifSousCat(idSousCat);
        setToogleNomCat(true);

    }

    const createNewCategorie = (e) => {
        e.preventDefault();
        
        if(modifIndexCat !== undefined){
            let genId = genPushId();
            let newObj = [...categories];

            if(modifIndexSousCat !== undefined){
                if(newObj[modifIndexCat].subCat[modifIndexSousCat].subCat !== undefined){ // si le document comporte des subCat
                    newObj[modifIndexCat].subCat[modifIndexSousCat].subCat = {
                        ...newObj[modifIndexCat].subCat[modifIndexSousCat].subCat,              
                        [genId] : {
                            nom : newCategory
                        }
                    }
                }else{
                    newObj[modifIndexCat].subCat[modifIndexSousCat] = {
                        ...newObj[modifIndexCat].subCat[modifIndexSousCat], 
                        subCat : {
                            [genId] : {
                                nom : newCategory
                            }
                        } 
                    }
                }
            }else{
                if(newObj[modifIndexCat].subCat !== undefined){ // si le document comporte des subCat
                    newObj[modifIndexCat].subCat = {
                        ...newObj[modifIndexCat].subCat,              
                        [genId] : {
                            nom : newCategory
                        }
                    }
                }else{
                    newObj[modifIndexCat] = {
                        ...newObj[modifIndexCat], 
                        subCat : {
                            [genId] : {
                                nom : newCategory
                            }
                        } 
                    }
                }
            }
            
            let ref = newObj[modifIndexCat].id;
            delete newObj[modifIndexCat].id;
    
            fire
            .firestore()
            .collection('Categories')
            .doc(ref)
            .set(newObj[modifIndexCat])
            .then(function(docRef) {
                // console.log("Document written with ID: ", docRef.id);
                // setCategories(newCategory);
                setModifCat('');
                setModifSousCat('');
                setToogleNomCat(false);
                setNewCategory('');
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }else{
            fire
            .firestore()
            .collection('Categories')
            .add({
                nom : newCategory 
            }).then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                setNewCategory('');
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
    
            setToogleNomCat(false);
            setNewCategory('');
        }
    }

    const cancelNewCategorie = (e) => {
        e.preventDefault(); 
        setToogleNomCat(false);
        setNewCategory('');
    }

    const toggleEditCategory = (e, idCat, idSousCat, idSousCat2) => {
        e.preventDefault();
        console.log("idCat, idSousCat",idCat, idSousCat, idSousCat2);

        setEditCat(idCat);
        setEditSousCat(idSousCat);
        setEditSousCat2(idSousCat2); 
        setToggleEditCat(true);
    2
    }

    const createEditCategorie = (e) => {
        e.preventDefault();

        let newObj = [...categories];
        if(editIndexSousCat === undefined){
            newObj[editIndexCat].nom = newNameCat;
        }else {
            if(editIndexSousCat2 === undefined){
                newObj[editIndexCat].subCat[editIndexSousCat].nom = newNameCat; 
            }else{
                newObj[editIndexCat].subCat[editIndexSousCat].subCat[editIndexSousCat2].nom = newNameCat;
            }
        }

        let ref = newObj[editIndexCat].id;
        delete newObj[editIndexCat].id;

        console.log('data send to db', newObj[editIndexCat], 'id', ref);
        fire
        .firestore()
        .collection('Categories')
        .doc(ref)
        .set(newObj[editIndexCat])
        .then(function(docRef) {
            setEditCat('');
            setEditSousCat('');
            setEditSousCat2(''); 
            setToggleEditCat(false);
            setNewNameCat('');
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });

    }

    const cancelEditCategorie = (e) => {
        e.preventDefault();
        setEditCat('');
        setEditSousCat('');
        setEditSousCat2(''); 
        setToggleEditCat(false);
        setNewNameCat('');
    }



    const [notification, setNotification] = useState('');
    const [visible, setVisible] = useState(false);

    console.log('categories', categories)
    return (
      <Layout backOffice>
        <Head>
          <title>Mes Catégories</title>
        </Head>
        
        {notification}
     
        <div className={utilStyles.rowTitleButton}>
            <h2>Gestion des catégories de la boutique</h2>
        </div>
        
        <div className={`${styles.BlockBtnAddCategory}`}>
            <button onClick={(e) => addCategory(e)} className={styles.btnAddCategory}> + Ajouter une catégorie </button>
        </div>

        { categories && categories.map( (C, index0) => 
            <div key={C.id} className={styles.listCategory}>
                <div className={styles.blockCategory}>
                    <div>{C.nom}</div>
                    <button onClick={(e) => toggleEditCategory(e, index0)} className={`${styles.buttonEdit}`}>
                        <img src="/images/icons/edit-black.svg"></img>
                    </button>
                    <button onClick={(e) => deleteCategory(e, index0)} className={`${styles.buttonDelete}`}>
                        <img src="/images/icons/delete_forever-red.svg"></img>
                    </button>
                </div>
                <button onClick={(e) => addCategory(e, index0)} className={`${styles.btnAddCategory} `}> <span>+ Ajouter une sous-catégorie à </span><span className={utilStyles.bold}>{C.nom}</span></button>

                {C.subCat && Object.keys(C.subCat).map( (value, index1) => 
                    <div key={index1} className={styles.listSubCategory}>
                        <div className={styles.blockCategory}>
                            <div>{C.subCat[value].nom}</div>
                            <button onClick={(e) => toggleEditCategory(e, index0, value)} className={`${styles.buttonEdit}`}>
                                <img src="/images/icons/edit-black.svg"></img>
                            </button>
                            <button onClick={(e) => deleteSubCategory(e, index0, value)} className={styles.buttonDelete}>
                                <img src="/images/icons/delete_forever-red.svg"></img>
                            </button>
                        </div>
                        <button onClick={(e) => addCategory(e, index0, value)} className={styles.btnAddCategory}> <span>+ Ajouter une sous-catégorie à </span><span className={utilStyles.bold}>{C.subCat[value].nom}</span></button>

                        {C.subCat[value].subCat && Object.keys(C.subCat[value].subCat).map( (value2, index2) => 
                            <div key={index2} className={styles.listSubCategory}>
                                <div className={styles.blockCategory}>
                                    <div>{C.subCat[value].subCat[value2].nom}</div>
                                    <button onClick={(e) => toggleEditCategory(e, index0, value, value2)} className={`${styles.buttonEdit}`}>
                                        <img src="/images/icons/edit-black.svg"></img>
                                    </button>
                                    <button onClick={(e) => deleteSubCategory(e, index0, value, value2)} className={styles.buttonDelete}>
                                        <img src="/images/icons/delete_forever-red.svg"></img>
                                    </button>
                                </div>
                                
                                {/* {C.subCat.subCat.map( CSubCat3 => 

                                )} */}
                            </div>
                        )}
                    </div>
                )} 
            </div>
        )}
        
        {toggleNomCat && (
            <div className={styles.modalGetCat}>
                <div className={styles.blockModalGetCat}>
                    <p>Nommer votre catégorie / sous-catégorie</p>
                    <form>
                        <input value={newCategory} placeholder={`nom de la catégorie`} onChange={(e) => setNewCategory(e.target.value)}></input>
                        <div className={styles.btnModal}>
                            <button onClick={(e) => cancelNewCategorie(e)} className={utilStyles.ActionButtonCancel}>Annulé</button>
                            <button onClick={(e) => createNewCategorie(e)} className={utilStyles.ActionButtonAdd}>Validé</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {toggleEditCat && (
            <div className={styles.modalGetCat}>
                <div className={styles.blockModalGetCat}>
                    <p>Éditer le nom de votre catégorie / sous-catégorie</p>
                    <form>
                        <input value={newNameCat} placeholder={`nom de la catégorie`} onChange={(e) => setNewNameCat(e.target.value)}></input>
                        <div className={styles.btnModal}>
                            <button onClick={(e) => cancelEditCategorie(e)} className={utilStyles.ActionButtonCancel}>Annulé</button>
                            <button onClick={(e) => createEditCategorie(e)} className={utilStyles.ActionButtonAdd}>Validé</button>
                        </div>
                    </form>
                </div>
            </div>
        )}



      </Layout>
    )
  }