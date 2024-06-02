import React, { useState } from "react";
import {IntlProvider} from 'react-intl'
import French from "./languages/fr.json";
import Arabic from "./languages/ar.json";
import English from "./languages/en.json";

export const Context = React.createContext();

const local = navigator.language;
// const local = "ar-DZ";
let lang;
if (local === "en-US") {
  lang = English;
  // console.log(lang);
} else {
  if (local === "fr-BE") {
    lang = French;
    // console.log(lang);
  } else {
    lang = Arabic;
    // console.log(lang);
  }
}

const LanguageWrapper=(props)=>{
    const [locale,setLocale] = useState(local);
    const [messages,setMessages] = useState(lang);
     
    function selectLanguage(value){
        const newLocale = value;
        // console.log(value);
        setLocale(newLocale);
        if(newLocale === "en-US")
        {
            setMessages(English);
        }
        else if(newLocale === "fr-BE")
        {
            setMessages(French);
        }
        else{
            setMessages(Arabic);
        }
    }

    return (
        <Context.Provider value={{locale,selectLanguage,messages}}>
            <IntlProvider messages={messages} locale={locale}>
                {props.children}
            </IntlProvider>
        </Context.Provider>
    )
}

export default LanguageWrapper;