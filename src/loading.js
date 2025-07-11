import { createContext, useContext, useState } from "react";
import LoadingOverlay from "./components/Parts/LoadingOverlay";


const LoadingContext = createContext({
    startLoading: () => "",
    stopLoading: () => {},
    clearLoading: () => {},
});

// Provider Component
export const LoadingProvider = ({ children }) => {
    const [loadingIds, setLoadingIds] = useState([]);

    const startLoading = () => {
        const id = Date.now().toString(); // Unique ID
        setLoadingIds((prev) => [...prev, id]);
        return id;
    };



    const stopLoading = (id) => {
        setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
    };
    const clearLoading=()=>{
        setLoadingIds([]);
    }
    return (
        <LoadingContext.Provider value={{ startLoading, stopLoading,clearLoading }}>
            <LoadingOverlay show={loadingIds.length > 0} />
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
