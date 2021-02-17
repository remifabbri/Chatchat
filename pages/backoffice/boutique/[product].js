import React, { useState } from 'react';
import fire from '../../../config/firebase-config.js';
import Layout from '../../../components/layout';
import CrudMedia from '../../../components/crudMedia.js';
import HookCategories from '../../../hooks/hookCategories.js';
import { useRouter } from 'next/router';
import styles from './Scss_boutique.module.scss';
import utilStyles from '../../../styles/utils.module.scss';

const Student = (props) => {
    const router = useRouter();

    const [name, setFirstName] = useState (props.name); 
    const [description, setLastName] = useState (props.description);
    const [prix, setPrix] = useState (props.prix);
    const [stock, setStock] = useState (props.stock);
    const [publish, setPublish] = useState (props.publish);
    const [images, setImages] = useState(props.images);
    const [categories, setCategories] = useState(props.categories);
    const [mainAttributs, setMainAttributs] = useState(props.mainAttributs); 
    const [secondaryAttributs, setSecondaryAttributs] = useState(props.secondaryAttributs); 

    const [newMainAttributs, setNewMainAttributs] = useState({nameAttributs: "", valueAttributs: ""});
    const [newSecondaryAttributs, setNewSecondaryAttributs] = useState({nameAttributs: "", valueAttributs: ""});
    const [notification, setNotification] = useState('');

    const callbackImageCrud = (imageUrlArr) => {
        setImages(imageUrlArr);
    }
    const callbackCategories = (categArr) => {
        console.log('controle callback', categArr)
        setCategories(categArr);
    }

    const deleteMainAttributs = (e, key) => {
        e.preventDefault();
        let delAttributs = {...mainAttributs};
        delete delAttributs[key]; 
        setMainAttributs(delAttributs);
    }

    const onSubmitMainAttributs = (e) => {
        e.preventDefault();
        setMainAttributs({...mainAttributs, [newMainAttributs.nameAttributs]: newMainAttributs.valueAttributs}); 
        setNewMainAttributs({nameAttributs: "", valueAttributs: ""});
    } 

    const deleteSecondaryAttributs = (e, key) => {
        e.preventDefault();
        let delAttributs = {...mainAttributs};
        delete delAttributs[key]; 
        setSecondaryAttributs(delAttributs);
    }

    const onSubmitSecondaryAttributs = (e) => {
        e.preventDefault();
        setSecondaryAttributs({...secondaryAttributs, [newSecondaryAttributs.nameAttributs]: newSecondaryAttributs.valueAttributs}); 
        setNewSecondaryAttributs({nameAttributs: "", valueAttributs: ""});
    } 
    
    const handleSubmit = (event) => { 
        event.preventDefault();
        console.log(props.id_product);

        if(props.id_product){
            fire.firestore()
            .collection('Boutique')
            .doc(props.id_product)
            .set({
                name: name,
                description: description,
                prix: prix,
                stock: stock,
                publish: publish,
                images: images,
                categories : categories,
                mainAttributs: mainAttributs, 
                secondaryAttributs: secondaryAttributs
            });
        }else{
            fire.firestore()
            .collection('Boutique')
            .add({
                name: name,
                description: description,
                prix: prix,
                stock: stock,
                publish: publish, 
                images: images, 
                categories : categories,
                mainAttributs: mainAttributs, 
                secondaryAttributs: secondaryAttributs
            });
        }

        setNotification('Produit modifié');

        setTimeout(() => {
            setNotification('')
            router.push("/backoffice/boutique/gestionBoutique");
        }, 2000)
    } 

    const suppEleves = (event) => {
        event.preventDefault();
        fire.firestore()
        .collection('Boutique')
        .doc(props.id_product)
        .delete()
        .then(()=>{
            router.push("/backoffice/boutique/gestionBoutique");
        })
    }
    const cancelCreate = (e) => {
        e.preventDefault();
        router.push("/backoffice/boutique/gestionBoutique");
    }

    // console.log("image du crud", images);
    console.log("contrôle Attributs", mainAttributs);
    console.log("contrôle Attributs", newMainAttributs);

  return (
    <Layout backOffice>
    <div>
     <h2>Fiche produit</h2>
        {notification}
        {/* Corriger le fait que enter supprimer l'items */}

        <HookCategories CallbackCategories={callbackCategories} props={props.categories}/>

        <form onSubmit={handleSubmit} className={`${utilStyles.formContainerDefautl}`}>
            <div className={`${utilStyles.formLabelCol}`}>
                <label>Nom</label>
                <input type="input"  placeholder="Nom" value={name} 
                onChange={({target}) => setFirstName(target.value)} required />
            </div>
            <div className={`${utilStyles.formLabelCol}`}>
                <label>Description</label>
                <textarea rows='5' placeholder="Description" value={description} 
                onChange={({target}) => setLastName(target.value)} required />
            </div>
            <div className={`${utilStyles.formLabelCol}`}>
                <label>Prix</label>
                <input type="number" placeholder="prix" value={prix} 
                onChange={({target}) => setPrix(target.value)} required />
            </div>
            <div className={`${utilStyles.formLabelCol}`}>
                <label>Stock</label>
                <input type="input" placeholder="Stock" value={stock} 
                onChange={({target}) => setStock(target.value)} required />
            </div>
            <div className={`${utilStyles.formLabelRow}`}>
                <label>Publié votre produit : </label>
                <input type="checkbox" value={publish} checked={publish}
                onChange={({target}) => setPublish(target.checked)} className={`${utilStyles.inputCheckbox}`}/>
            </div>
            <div className={styles.blockAttributs}>
                <label className={styles.labelTitre}>Attributs Principaux: </label>
                <i>"Définisez les attributs principaux du produit"</i>
                <form className={`${styles.formAttributs}`}>
                    <input value={newMainAttributs.nameAttributs} placeholder={"Nom de l'attributs"} onChange={(e) => setNewMainAttributs({...newMainAttributs, nameAttributs : e.target.value})} />
                    <input value={newMainAttributs.valueAttributs} placeholder={"valeur de l'attributs"} onChange={(e) => setNewMainAttributs({...newMainAttributs, valueAttributs : e.target.value})} />
                    <button onClick={(e) => onSubmitMainAttributs(e)} className={utilStyles.ActionButtonValidate}>Ajouter</button>
                </form>
                {mainAttributs && Object.keys(mainAttributs).map( key => 
                    <div key={key} className={`${styles.tabAttributs}`}>
                        <label>{key}</label>
                        <input value={mainAttributs[key]} onChange={(e) => setMainAttributs({...mainAttributs, [key] : e.target.value})} />
                        <button onClick={(e) => deleteMainAttributs(e, key)} className={utilStyles.ActionButtonCancel}>Supprimer</button>
                    </div>
                )}
            </div>

            <div className={styles.blockAttributs}>
                <label className={styles.labelTitre}>Attributs Secondaire: </label>
                <i>"Définisez les attributs secondaire du produit"</i>
                <form className={`${styles.formAttributs}`}>
                    <input value={newSecondaryAttributs.nameAttributs} placeholder={"Nom de l'attributs"} onChange={(e) => setNewSecondaryAttributs({...newSecondaryAttributs, nameAttributs : e.target.value})} />
                    <input value={newSecondaryAttributs.valueAttributs} placeholder={"valeur de l'attributs"} onChange={(e) => setNewSecondaryAttributs({...newSecondaryAttributs, valueAttributs : e.target.value})} />
                    <button onClick={(e) => onSubmitSecondaryAttributs(e)} className={utilStyles.ActionButtonValidate}>Ajouter</button>
                </form>
                {secondaryAttributs && Object.keys(secondaryAttributs).map( key => 
                    <div key={key} className={`${styles.tabAttributs}`}>
                        <label>{key}</label>
                        <input value={secondaryAttributs[key]} onChange={(e) => setSecondaryAttributs({...secondaryAttributs, [key] : e.target.value})} />
                        <button onClick={(e) => deleteSecondaryAttributs(e, key)} className={utilStyles.ActionButtonCancel}>Supprimer</button>
                    </div>
                )}
            </div>
            {/* {images.map((imgUrl, i) =>
                <img key={i} src={imgUrl} className={`${styles.imgBibli}`}/>
            )} */}
            <CrudMedia parentCallback={callbackImageCrud} props={props}/>
            <div className={styles.rowActionButton}>
            {props.id_product ? 
                <div className={utilStyles.row}>
                    <button onClick={(e)=>suppEleves(e)} className={`${utilStyles.ActionButtonCancel} ${utilStyles.btnLightWidth}`}>Supprimer</button>
                    <button onClick={(e)=>cancelCreate(e)} className={`${utilStyles.ActionButtonCancel} ${utilStyles.btnLightWidth}`}>Annuler</button>
                </div>
                :
                <button onClick={(e)=>cancelCreate(e)} className={utilStyles.ActionButtonCancel}>Annulé</button>
            }
                <button type="submit" className={utilStyles.ActionButtonAdd}>Enregistrer</button>
            </div>
        </form>
    </div>
    </Layout>
  )
}

export const getServerSideProps = async ({ query }) => {
    const content = {}
    console.log(query.product); 
    await fire.firestore()
      .collection('Boutique')
      .doc(query.product)
      .get()
      .then(result => {
        console.log(result.data()); 
        console.log(result.id); 
        content['id_product'] = result.id !== "false" ? result.id : false 
        content['name'] = result.data()?.name ? result.data().name : ""
        content['description'] = result.data()?.description ? result.data().description : ""
        content['prix'] = result.data()?.prix ? result.data().prix : null
        content['stock'] = result.data()?.stock ? result.data().stock : null
        content['publish'] = result.data()?.publish ? result.data().publish : false
        content['images'] = result.data()?.images ? result.data().images : []
        content['categories'] = result.data()?.categories ? result.data().categories : []
        content['mainAttributs'] = result.data()?.mainAttributs ? result.data().mainAttributs : {}
        content['secondaryAttributs'] = result.data()?.secondaryAttributs ? result.data().secondaryAttributs : {}

        
      });
    return {
      props: {
        id_product: content.id_product,
        name: content.name,
        description: content.description,
        prix: content.prix,
        stock: content.stock,
        publish: content.publish,
        images: content.images,
        categories: content.categories,
        mainAttributs : content.mainAttributs,
        secondaryAttributs : content.secondaryAttributs

      }
    }
  }


export default Student