import {translations} from './../components/common/translations';

const defaultState = localStorage.getItem('default_lang') && translations[localStorage.getItem('default_lang')] 
?
translations[localStorage.getItem('default_lang')] 
:
translations.bg 

export default (state = defaultState, action) => {
    switch (action.type) {
      case 'SWITCH_LANGUAGE':
        return translations[action.language] ? translations[action.language] : translations["bg"]
      default:
        return state
    }
  }