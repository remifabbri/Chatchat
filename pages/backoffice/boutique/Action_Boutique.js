import fire from '../../../config/firebase-config';

const getProduct = () => {
    return fire
    .firestore()
    .collection('Boutique')
    .onSnapshot(snap => {
        const produitBoutique = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(produitBoutique);
        return produitBoutique
    });
}

export { getProduct }; 