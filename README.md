# Template Web with Next.js / Firebase

Create a new web site with next.js for a server-side rendering. 

Backend management with firebase DB + Auth

## Implementation of the project

### create a firebase project

1. Create project https://console.firebase.google.com/
2. add Apllication for generate a firebaseServiceAccountKey.json
    + create file 'firebase-config.js' in folder 'config'
    + Add this code to the (Don't forgot to add the spécific data of your project)
    ```
    import firebase from 'firebase';

    const firebaseConfig = {
        // place here your data find in file firebaseServiceAccountKey.json
      
    };

    try {
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
    } catch(err){
        if (!/already exists/.test(err.message)) {
            console.error('Firebase initialization error', err.stack)}
    }

    const fire = firebase;
    const auth = firebase.auth();
    const db = firebase.firestore();
    const now = firebase.firestore.Timestamp.now();
    export { fire, auth, db, now };
    export default fire;

    ``` 
    + add this line to your file .gitignore for protect your secret data
    ```
    # config firebase
    /config
    ```

3. In tab Authentification > sign-in method : activated provider ***Email/Password*** and ***Google***
4. In tab CloudFirestore for activated database

### useful link for understand Next.js
+ Doc Next.js   https://nextjs.org/docs/getting-started
+ Page          https://nextjs.org/docs/basic-features/pages
+ Data fecth    https://nextjs.org/docs/basic-features/data-fetching
+ Css with Sass https://nextjs.org/docs/basic-features/built-in-css-support#sass-support


Kind regards friends :)