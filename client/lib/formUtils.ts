/**
 * Utility functions for managing form cache and preventing data persistence
 */

export const clearAllFormCache = () => {
  // Clear localStorage
  localStorage.removeItem("nu_application_draft");
  localStorage.removeItem("nu_user_session");
  localStorage.removeItem("nu_form_cache");

  // Clear sessionStorage
  sessionStorage.clear();

  // Clear browser form cache
  document.querySelectorAll("input, select, textarea").forEach((element) => {
    if (element instanceof HTMLInputElement) {
      element.value = "";
      element.checked = false;
      element.defaultValue = "";
      element.defaultChecked = false;
    } else if (element instanceof HTMLSelectElement) {
      element.selectedIndex = 0;
      element.value = "";
    } else if (element instanceof HTMLTextAreaElement) {
      element.value = "";
      element.defaultValue = "";
    }
  });

  // Clear any form with reset method
  document.querySelectorAll("form").forEach((form) => {
    form.reset();
  });
};

export const disableFormAutocomplete = (formElement: HTMLFormElement) => {
  formElement.setAttribute("autocomplete", "off");
  formElement.setAttribute("data-lpignore", "true");

  // Apply to all inputs in the form
  formElement.querySelectorAll("input, select, textarea").forEach((element) => {
    element.setAttribute("autocomplete", "off");
    element.setAttribute("data-lpignore", "true");
  });
};

export const preventFormCaching = () => {
  // Add event listeners to prevent browser caching
  window.addEventListener("beforeunload", () => {
    clearAllFormCache();
  });

  window.addEventListener("pagehide", () => {
    clearAllFormCache();
  });

  // Disable back/forward cache
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      // Page was loaded from cache, force reload
      window.location.reload();
    }
  });
};

export const setupFormNoCache = () => {
  // Set up no-cache headers via JavaScript
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(() => {
      // Clear any service worker cache
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    });
  }

  // Add meta tags if not present
  const addMetaTag = (httpEquiv: string, content: string) => {
    if (!document.querySelector(`meta[http-equiv="${httpEquiv}"]`)) {
      const meta = document.createElement("meta");
      meta.httpEquiv = httpEquiv;
      meta.content = content;
      document.head.appendChild(meta);
    }
  };

  addMetaTag("Cache-Control", "no-cache, no-store, must-revalidate");
  addMetaTag("Pragma", "no-cache");
  addMetaTag("Expires", "0");
};
