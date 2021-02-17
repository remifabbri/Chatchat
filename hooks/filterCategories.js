import React, { useState, useEffect } from 'react';
import { fire } from '../config/firebase-config';
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss'
import styles from '../styles/component/filterCategories.module.scss';

export default function FilterCategories({CallbackFilter, props}) {

    //TODO Inject and export Props for parent

    const [categories, setCategories] = useState('');
    const [subCategorie, setSubCategories] = useState('');
    const [subSubCategorie, setSubSubCategorie] = useState('');

    const [toggleFiltre, setToggleFiltre] = useState(false);
    const [arrFilter, setArrFilter] = useState([]);

    // const [catSelected, setCatSelected] = useState(props[0]);
    // const [subCatSelected, setSubCatSelected] = useState(props[1]);
    // const [subSubCatSelected, setSubSubCatSelected] = useState(props[2]);


    useEffect(() => {
        fire
        .firestore()
        .collection('Categories')
        .onSnapshot(snap => {

            let dbCategories = [];
            let dbSubCat = {};
            let dbSubSubCat = {}; 

            const extractDataCategories = snap.docs.map(doc => ({
                ...doc.data()
            }));

            Object.keys(extractDataCategories).forEach( key => {
                console.log(extractDataCategories[key].nom);
                dbCategories.push(extractDataCategories[key].nom);

                if(extractDataCategories[key].hasOwnProperty('subCat')){
                    let arrSubCat = [];
                    Object.keys(extractDataCategories[key].subCat).forEach( keySub =>{
                        console.log(extractDataCategories[key].subCat[keySub].nom);
                        arrSubCat.push(extractDataCategories[key].subCat[keySub].nom);

                        if(extractDataCategories[key].subCat[keySub].hasOwnProperty('subCat')){
                            let arrSubSubCat = [];
                            Object.keys(extractDataCategories[key].subCat[keySub].subCat).forEach( keySubSub =>{
                                console.log(extractDataCategories[key].subCat[keySub].subCat[keySubSub].nom);
                                arrSubSubCat.push(extractDataCategories[key].subCat[keySub].subCat[keySubSub].nom);
                            })
                          
                            dbSubSubCat = {
                                ...dbSubSubCat, 
                                [extractDataCategories[key].subCat[keySub].nom] : arrSubSubCat
                            }
                        }
                    })
                    
                    dbSubCat = {
                        ...dbSubCat, 
                        [extractDataCategories[key].nom] : arrSubCat
                    }
                }
            })
            console.log('result Cat', dbCategories); 
            console.log('result SubCat', dbSubCat);
            console.log('result SubSubCat', dbSubSubCat);

            setCategories(dbCategories);
            setSubCategories(dbSubCat);
            setSubSubCategorie(dbSubSubCat);
        });
    }, []);

    const ToggleFiltre = (e) => {
        e.preventDefault(); 

        setToggleFiltre(true);
    }

    const cancelFilterCategorie = (e) => {
        e.preventDefault();
        setToggleFiltre(false);
    }

    const SearchFilterCategorie = (e) => {
        e.preventDefault();
        CallbackFilter(arrFilter);
        setToggleFiltre(false);
    }

    const changeArrayFilter = (e, cat) => {
        e.preventDefault();

        let newArr; 
        if(arrFilter.includes(cat)){
            newArr = [...arrFilter];
            let indexOfCat = newArr.indexOf(cat);           
            newArr.splice(indexOfCat, 1);

            if(subCategorie.hasOwnProperty(cat)){
                for( const item of subCategorie[cat]){
                    if(newArr.includes(item)){
                        newArr.splice(newArr.indexOf(item), 1);

                        if(subSubCategorie.hasOwnProperty(item)){
                            for( const itemSub of subSubCategorie[item]){
                                if(newArr.includes(itemSub)){
                                    newArr.splice(newArr.indexOf(itemSub), 1);
                                }
                            }
                        }
                    }
                }
            }

            if(subSubCategorie.hasOwnProperty(cat)){
                for( const item of subSubCategorie[cat]){
                    if(newArr.includes(item)){
                        newArr.splice(newArr.indexOf(item), 1);
                    }
                }
            }


        }else{
            newArr = [...arrFilter, cat];
        }

        setArrFilter(newArr);


    }

    const checkArrFilter = (cat) => {
        if(arrFilter.includes(cat)){
            return true
        }else{
            return false
        }

    }

    const reinitializeFilter = (e) => {
        e.preventDefault();
        setArrFilter([]);

    }


    // useEffect(() => {
    //     let resultCallback = [catSelected, subCatSelected, subSubCatSelected];
    //     console.log('resultCallback', resultCallback);
    //     CallbackCategories(resultCallback);

    // }, [catSelected, subCatSelected, subSubCatSelected]);

    // console.log('Contrôle', 'Cat', catSelected, 'subCat', subCatSelected, 'subSubCat', subSubCatSelected );

    console.log('controle ArrFilter', arrFilter);

    return(
        <div>
            <div className={styles.BlockFilter}>
                <button onClick={(e) => ToggleFiltre(e)} className={styles.btnFilter}>Filtre</button>
                <div className={styles.blockSelection}>
                  { arrFilter.map( (F, index) => 
                    <span key={index}>{F}</span>
                  )}
                </div> 
            </div>
            

            {toggleFiltre && 
                <div className={utilStyles.modalGetCat}>
                <div className={utilStyles.blockModalGetCat}>
                    <p>Séléctionner les catégories à filtrer</p>

                    {arrFilter.length > 0 && 
                        <button onClick={(e) => reinitializeFilter(e)} className={ `${utilStyles.ActionButtonCancel} ${styles.reinitializeFilter}`}>Réinialisez les filtres</button>
                    }
                    
                    <div className={styles.mainBlockFilter}>
                        
                        {categories && categories.map( (Cat, index0) => 
                            <div className={styles.listCat}>
                                <button key={index0} onClick={(e) => changeArrayFilter(e, Cat)} className={checkArrFilter(Cat) ? styles.btnCategorySelected : styles.btnCategory }>{Cat}</button>
                                <div className={styles.listButton}>
                                { checkArrFilter(Cat) && subCategorie[Cat] &&
                                    subCategorie[Cat].map( (subCat, index1) =>  
                                        <>
                                            <button key={index1} onClick={(e) => changeArrayFilter(e, subCat)} className={checkArrFilter(subCat) ? styles.btnCategorySelected : styles.btnCategory }>{subCat}</button>
                                            <div className={styles.listButton}>
                                            { checkArrFilter(subCat) && subSubCategorie[subCat] &&
                                                subSubCategorie[subCat].map( (subSubCat, index2) =>  
                                                    <button key={index2} onClick={(e) => changeArrayFilter(e, subSubCat)} className={checkArrFilter(subSubCat) ? styles.btnCategorySelected : styles.btnCategory }>{subSubCat}</button>
                                                )
                                            }
                                            </div>
                                        </>
                                    )
                                }
                                </div>
                            </div>
                        )}
                    </div>
 
                    <div className={utilStyles.btnModal}>
                        <button onClick={(e) => cancelFilterCategorie(e)} className={utilStyles.ActionButtonCancel}>Annuler</button>
                        <button onClick={(e) => SearchFilterCategorie(e)} className={utilStyles.ActionButtonAdd}>Rechercher</button>
                    </div>
                </div>
            </div>
            }
            
        </div>
    )
}