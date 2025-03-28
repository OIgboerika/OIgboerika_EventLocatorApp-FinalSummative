const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const path = require("path");
const fs = require("fs");

// Initialize i18next
i18next.init({
  fallbackLng: "en",
  preload: ["en", "es", "fr"],
  ns: ["common", "errors"],
  defaultNS: "common",
  backend: {
    loadPath: path.join(__dirname, "../locales/{{lng}}/{{ns}}.json"),
  },
});

const setupI18n = async () => {
  try {
    // Ensure locales directory exists
    const localesDir = path.join(__dirname, "../locales");
    if (!fs.existsSync(localesDir)) {
      fs.mkdirSync(localesDir, { recursive: true });
    }

    // Create default English translations if they don't exist
    const enDir = path.join(localesDir, "en");
    if (!fs.existsSync(enDir)) {
      fs.mkdirSync(enDir, { recursive: true });
    }

    const defaultTranslations = {
      common: {
        welcome: "Welcome to Event Locator",
        events: "Events",
        categories: "Categories",
        favorites: "Favorites",
        profile: "Profile",
        settings: "Settings",
        logout: "Logout",
        search: "Search events...",
        noEvents: "No events found",
        noCategories: "No categories found",
        noFavorites: "No favorite events yet",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
        rating: "Rating",
        reviews: "Reviews",
        capacity: "Capacity",
        price: "Price",
        free: "Free",
        location: "Location",
        date: "Date",
        time: "Time",
        description: "Description",
        organizer: "Organizer",
        contact: "Contact",
        share: "Share",
        report: "Report",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        confirm: "Confirm",
        back: "Back",
        next: "Next",
        previous: "Previous",
        more: "More",
        less: "Less",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        warning: "Warning",
        info: "Information",
        required: "Required",
        optional: "Optional",
        all: "All",
        none: "None",
        select: "Select",
        clear: "Clear",
        filter: "Filter",
        sort: "Sort",
        view: "View",
        hide: "Hide",
        show: "Show",
        close: "Close",
        open: "Open",
        search: "Search",
        searchPlaceholder: "Search events...",
        noResults: "No results found",
        tryAgain: "Try again",
        refresh: "Refresh",
        loadMore: "Load more",
        noMore: "No more items",
      },
      errors: {
        general: "An error occurred",
        notFound: "Resource not found",
        unauthorized: "Unauthorized access",
        forbidden: "Access forbidden",
        validation: "Validation error",
        server: "Server error",
        network: "Network error",
        timeout: "Request timeout",
        badRequest: "Bad request",
        conflict: "Resource conflict",
        tooManyRequests: "Too many requests",
        maintenance: "System maintenance",
        serviceUnavailable: "Service unavailable",
        gatewayTimeout: "Gateway timeout",
        notImplemented: "Not implemented",
        badGateway: "Bad gateway",
      },
    };

    // Write default translations
    for (const [ns, translations] of Object.entries(defaultTranslations)) {
      const filePath = path.join(enDir, `${ns}.json`);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
      }
    }

    console.log("i18n initialized successfully");
  } catch (error) {
    console.error("Failed to initialize i18n:", error);
    throw error;
  }
};

module.exports = {
  setupI18n,
  i18nextMiddleware: i18nextMiddleware.handle(i18next),
};
