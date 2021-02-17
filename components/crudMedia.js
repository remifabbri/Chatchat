import React, { useState, useEffect } from 'react';
import { fire, auth, storage, db } from '../config/firebase-config';
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss'
import styles from '../styles/component/crudmedia.module.scss'
import detectMobileOrDesktop from '../hooks/detectMobileOrDesktop.js'
import { set } from 'date-fns';
// ANCHOR Prob next.js with the import Css from a node_modules  https://github.com/vercel/next.js/issues/12079 
// import FilerobotImageEditor from 'filerobot-image-editor';

export default function CrudMedia({parentCallback, props}) {
    const isMobile = detectMobileOrDesktop().isMobile();

    // console.log(props);
    const [images, setImages] = useState([]);
    const [imageTransfert, setImageTransfert] = useState('');
    const [createUrlImgImport, setCreateUrlImgImport] = useState('');
    const [newNameImage, setNewNameImage] = useState('');

    const [imageSelect, setImageSelect] = useState(props.images);
    const [indexImage, setIndexImage] = useState('');

    const [show, toggle] = useState(false);
    const [fileRobot, setFileRobot] = useState('');

    const [isToggled, setToggled] = useState(false);
    

    useEffect(() => { 
        // console.log('storage crud');
        storage
        .ref()
        .child('images')
        .listAll()
        .then(function(res) {
            res.prefixes.forEach(function(folderRef) {
              // All the prefixes under listRef.
              // You may call listAll() recursively on them.
              console.log('folderRef', folderRef);
            });
            let imagesArr = [];
            res.items.forEach(function(itemRef) {
              // All the items under listRef.

              // TODO créer un resultat en fonction de la date d'upload
              let promise = itemRef.getDownloadURL().then(function(url) {
                  return url
              }); 
              imagesArr = [...imagesArr, promise];
            });
            Promise.all(imagesArr).then((result) => {
                setImages(result);
            })
          }).catch(function(error) {
            // Uh-oh, an error occurred!
            console.log(itemRef);
          });
    }, []);

    const importFile = (e) => {
        setImageTransfert(e.target.files[0]);
        setCreateUrlImgImport(URL.createObjectURL(e.target.files[0]));
        setNewNameImage(e.target.files[0].name);
    }

    // TODO gérez la suppréssion des images.

    const saveFile = (e) => {
        e.preventDefault()

        // TODO Vérifier que le nom n'est pas déjà utilisé.

        storage
        .ref(`images/${newNameImage}`)
        .put(imageTransfert)
        .then(function(snapshot) {
            snapshot.ref.getDownloadURL()
            .then(function(downloadURL) {
                let addImagePut = [downloadURL, ...images];
                console.log('addImagePut', addImagePut);
                setImageTransfert('');
                setCreateUrlImgImport(''); 
                setNewNameImage('');
                setImages(addImagePut);
            });
        });
    }

    const suppImageCrud = (e, i) => {
        e.preventDefault();

        let httpsReference = storage.refFromURL(images[i]).fullPath;
        
        storage
        .ref(`${httpsReference}`)
        .delete().then(function() {
            // File deleted successfully
            let suppImage = [...images];
            suppImage.splice(i, 1);
            console.log('suppImage',suppImage);
            setImages(suppImage);
        }).catch(function(error) {
        // Uh-oh, an error occurred!
            console.log(error);
        });
    }

    const suppImageSelected = (e, i) => {
        e.preventDefault();
        let newArr = [...imageSelect];
        newArr.splice(i, 1);
        setImageSelect(newArr);
    }

    const imageSelected = (imgUrl) => {
        let newArr = [...imageSelect];
        console.log('newArr', newArr);
        console.log('indexImage', indexImage);
        if(indexImage === -1){
            newArr.push(imgUrl);
        }else{
            newArr.splice(indexImage, 1, imgUrl)
        }

        setImageSelect(newArr);
        parentCallback(newArr);
        setToggled(!isToggled);
    }

    const addImage = (e, index) => {
        e.preventDefault();
        setIndexImage(index);
        setToggled(!isToggled);
    }

    const closeModal = (e) =>{
        e.preventDefault();
        setIndexImage('');
        setToggled(!isToggled);
    }

    const modificationImage = (e, url) => {
        e.preventDefault();
        setFileRobot(url); 
        toggle(true);
    }

    // console.log('imageSelected', imageSelect);
    
    return (
        <div>
            <p className={utilStyles.labelTitre} >Images sélectionnées</p>
            <div className={styles.blockImgSelection}>
                {imageSelect.map((imgUrl, i) =>
                    <div key={i} className={`${styles.imgBlockBibli}`}>
                        <img  src={imgUrl} onClick={(e) => addImage(e, i)} className={`${styles.imgBibli}`} />
                        <button  onClick={(e) => suppImageSelected(e, i)} className={styles.supBtn}>Supp X</button>
                    </div>
                )}
                <button onClick={(e) => addImage(e, -1)} className={`${styles.buttonAddPhoto}`}>
                    <img src="/images/icons/addPhoto_icon.svg"></img>
                    <span>Ajouter</span>
                    <span>une image</span>
                </button>
            </div>
            { isToggled && (
                <div className={styles.modalCrud}>
                    <div className={styles.headerModal}>
                        <p>Gestion des images</p>
                        <button onClick={(e) => closeModal(e)}>X</button>
                    </div>
                    <div className={styles.blockInput}>
                        {isMobile && ( 
                            <input type="file" accept="image/*" capture="camera"></input>
                        )}
                        <input type='file' value={images.value} onChange={(e) => importFile(e) } accept=".png, .jpg, .jpeg"></input>
                    </div>
                    {imageTransfert !== "" && (
                        <div className={styles.blockTransfert}>
                            <p>Transfert du fichier</p>
                            <img src={createUrlImgImport}/>
                            <span>
                                <label>renomer votre images</label>
                                <input type='text' value={newNameImage} onChange={(e) => setNewNameImage(e.target.value)}/>
                            </span>
                            <button onClick={(e) => saveFile(e)}>Ajouter l'image à votre bibliothèque</button>
                        </div>
                    )}
                    <div className={styles.blockImg}>
                        <p>Votre bibliothèque d'images</p>
                        {images.map((imgUrl, i) => 
                            <div key={i} className={`${styles.imgBlockBibli}`}>
                                <img  src={imgUrl} onClick={() => imageSelected(imgUrl)} className={`${styles.imgBibli}`}/>
                                <button  onClick={(e) => suppImageCrud(e, i)}className={styles.supBtn}>Supprimer</button>
                                {/* <button  onClick={(e) => { modificationImage(e, url) }} className={styles.supBtn}>Modifier</button> */}
                            </div>
                        )}
                    </div>
                    {/* <FilerobotImageEditor
                        show={show}
                        src={fileRobot}
                        onClose={() => { toggle(false) }}
                    /> */}
                </div>
            )}
        </div>
    )
}