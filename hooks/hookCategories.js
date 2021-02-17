import React, { useState, useEffect } from 'react';
import { fire } from '../config/firebase-config';
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss'
// import styles from '../styles/component/crudmedia.module.scss'

export default function HookCategories({CallbackCategories, props}) {

    const [categories, setCategories] = useState('');
    const [subCategorie, setSubCategories] = useState('');
    const [subSubCategorie, setSubSubCategorie] = useState('');

    const [catSelected, setCatSelected] = useState(props[0]);
    const [subCatSelected, setSubCatSelected] = useState(props[1]);
    const [subSubCatSelected, setSubSubCatSelected] = useState(props[2]);


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

    useEffect(() => {
        let resultCallback = [catSelected, subCatSelected, subSubCatSelected];
        console.log('resultCallback', resultCallback);
        CallbackCategories(resultCallback);

    }, [catSelected, subCatSelected, subSubCatSelected]);

    console.log('Contrôle', 'Cat', catSelected, 'subCat', subCatSelected, 'subSubCat', subSubCatSelected );

    return(
        <div>
            <div className={`${utilStyles.formLabelCol}`}>
                <label for="cat-select">Catégories : </label>
                
                <select id="cat-select" value={catSelected} onChange={(e) => {setCatSelected(e.target.value); setSubCatSelected(''); setSubSubCatSelected('');}}>
                    <option value={''}>Choisissez une option</option>
                    {categories && categories.map( C => 
                        <option key={C} value={C}>{C}</option>
                    )}
                </select>
            </div>
            {catSelected && subCategorie[catSelected] && (
                <div className={`${utilStyles.formLabelCol}`}>
                    <label for="cat-select">Sous-catégories :</label>
                    
                    <select id="cat-select" value={subCatSelected} onChange={(e) => {setSubCatSelected(e.target.value); setSubSubCatSelected('');}}>
                        <option value={''}>Choisissez une option</option>
                        {subCategorie && subCategorie[catSelected].map( SC => 
                            <option key={SC} value={SC}>{SC}</option>
                        )}
                    </select>
                </div>
            )}
            {subCatSelected && subSubCategorie[subCatSelected] && (
                <div className={`${utilStyles.formLabelCol}`}>
                    <label for="cat-select">Sous-catégories :</label>
                    
                    <select id="cat-select" value={subSubCatSelected} onChange={(e) => {setSubSubCatSelected(e.target.value);}}>
                        <option value={''}>Choisissez une option</option>
                        {subSubCategorie && subSubCategorie[subCatSelected].map( SSC => 
                            <option key={SSC} value={SSC}>{SSC}</option>
                        )}
                    </select>
                </div>
            )}

        </div>
    )
}