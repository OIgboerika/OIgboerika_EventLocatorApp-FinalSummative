module.exports = {
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
  supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'en,es,fr').split(',')
}; 