
import { useState, useEffect, useContext, createContext} from 'react';

const storeContext = createContext({ store: {} });
const { Provider } = storeContext;

export function StoreProvider({ children }){
    const store = useStoreProvider();
    return <Provider value={store}>{children}</Provider>;
}
export const useStore = () => {
    return useContext(storeContext);
};   

const useStoreProvider = () => {
    const [store, setStore] = useState({
        idGroupe : null
    });
    

    const handleChangeIDGroupe = (idGroupe) => {
        setStore({...store, idGroupe: idGroupe });
    };

    return {
        store,
        handleChangeIDGroupe, 
    };
};