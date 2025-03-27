const i18next = require('i18next');
const config = require('./config');

const setupI18n = () => {
  i18next.init({
    lng: config.defaultLanguage,
    fallbackLng: config.defaultLanguage,
    supportedLngs: config.supportedLanguages,
    resources: {
      en: {
        translation: require('../../locales/en.json')
      },
      es: {
        translation: require('../../locales/es.json')
      },
      fr: {
        translation: require('../../locales/fr.json')
      }
    }
  });

  console.log('i18n initialized successfully.');
};

module.exports = {
  setupI18n
}; 