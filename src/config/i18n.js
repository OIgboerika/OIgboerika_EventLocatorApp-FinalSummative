const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const LanguageDetector = require("i18next-browser-languagedetector");

i18next.use(LanguageDetector).init({
  fallbackLng: "en",
  preload: ["en", "es", "fr"],
  ns: ["common", "errors", "validation"],
  defaultNS: "common",
  backend: {
    loadPath: "./src/locales/{{lng}}/{{ns}}.json",
  },
  detection: {
    order: ["header", "querystring", "cookie"],
    lookupHeader: "accept-language",
    lookupQuerystring: "lang",
    lookupCookie: "i18next",
    caches: ["cookie"],
  },
});

module.exports = i18nextMiddleware.handle(i18next);
