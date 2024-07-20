import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

interface ISideBarContext {
    expanded: boolean;
    setExpanded: Dispatch<SetStateAction<boolean>>;
}

const defaultExpanded = false;

const SideBarContext = createContext<ISideBarContext>({
    expanded: defaultExpanded,
    setExpanded: () => { },
});

export const useSideBarContext = () => useContext(SideBarContext);

const SideBarContextProvider = ({ children }: { children: ReactNode }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const authContextData = {
        expanded,
        setExpanded,
    };

    return (
        <SideBarContext.Provider value={authContextData}>
            {children}{" "}
        </SideBarContext.Provider>
    );
};

export default SideBarContextProvider;