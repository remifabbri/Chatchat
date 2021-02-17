
import { useState, useEffect, useContext, createContext, ReactNode} from 'react';
import { fire, auth, db } from '../config/firebase-config';
   

const authContext = createContext({ user: {} });
const { Provider } = authContext;

export function AuthProvider({ children }){
    const auth = useAuthProvider();
    return <Provider value={auth}>{children}</Provider>;
}
export const useAuth = () => {
    return useContext(authContext);
};   

const useAuthProvider = () => {
    const [user, setUser] = useState(null);
    

    const handleAuthStateChanged = (user) => {
        setUser(user);
        if (user) {
            getUserAdditionalData(user);
        }
    };

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(handleAuthStateChanged);
        return () => unsub();
    }, []);

    useEffect(() => {
        if (user?.uid) {
          // Subscribe to user document on mount
          const unsubscribe = db
            .collection('users')
            .doc(user.uid)
            .onSnapshot((doc) => setUser(doc.data()));
            
          return () => unsubscribe();
        }
      }, []);

    

    const createUser = (user) => {
        return db
            .collection('users')
            .doc(user.uid)
            .set(user)
            .then(() => {
                setUser(user);
                return user;
            })
            .catch((error) => {
                return { error };
            });
    };

    const getUserAdditionalData = (user) => {
        return db
         .collection('users')
         .doc(user.uid)
         .get()
         .then((userData) => {
            if (userData.data()) {
                setUser(userData.data());
            }
         });
    };

    const signUp = ({ name, email, password }) => {
        return auth
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
            auth.currentUser.sendEmailVerification();
            return createUser({ uid: response.user.uid, email, name });
        })
        .catch((error) => {
            return { error };
        });
    };

    const signIn = ({ email, password }) => {
        return auth
         .signInWithEmailAndPassword(email, password)
         .then((response) => {
          setUser(response.user);
          getUserAdditionalData(user);
          return response.user;
         })
         .catch((error) => {
          return { error };
         });
    };

    const signInWithGoogle = () => {
        return auth
          .signInWithPopup(new  fire.auth.GoogleAuthProvider())
          .then((response) => {
            setUser(response.user);
            getUserAdditionalData(user);
                return response.user;
           })
           .catch((error) => {
                return { error };
        });
    };

    const signUpWithGoogle = () => {
        return auth
          .signInWithPopup(new fire.auth.GoogleAuthProvider())
          .then((response) => {
              setUser(response.user);
              return createUser({ uid: response.user.uid, email :response.user.email, name: response.user.displayName });
        });
    };

    const signOut = () => {
        return auth
        .signOut()
        .then(() => {
            setUser(false)
            return
        });
    }

    const sendPasswordResetEmail = (email) => {
        return auth.sendPasswordResetEmail(email).then((response) => {
            return response;
        });
    };

    return {
        user,
        signUp, 
        signIn, 
        signOut,
        signUpWithGoogle, 
        signInWithGoogle,
        sendPasswordResetEmail
    };
};