// ==UserScript==
// @name        Festify script
// @description This enables you to vote multiple times 
// @match       https://festify.us/*
// @exclude-match: *://*.*
// @version 1.1
// @updateURL https://seweso.github.io/scripts/festify.js
// @grant GM.setValue
// @grant GM.getValue
// @require https://code.jquery.com/jquery-1.12.4.min.js
// ==/UserScript==

function deleteFestifyCookies() {
	document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.festify.us;";
	document.cookie = "_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.festify.us;";
	localStorage.clear();
	indexedDB.deleteDatabase("Festify");
	indexedDB.deleteDatabase("firebaseLocalStorageDb");	
}

function selectShadowElement(selector, rootNode = document) {

  const element = rootNode.querySelector(selector);
  if (element) {
    return element;
  }
  
  const shadowRoots = rootNode.querySelectorAll('*');
  for (const shadowRoot of shadowRoots) {
    if (shadowRoot.shadowRoot) {
      const result = selectShadowElement(selector, shadowRoot.shadowRoot);
      if (result) {
        return result;
      }
    }
  }
  
  return null;
}

function addRefreshButton() {
	const searchBar = selectShadowElement('search-bar');
	const svgElement = selectShadowElement('svg', searchBar.shadowRoot);
	svgElement.addEventListener("click", deleteFestifyCookies);
}

window.onload = addRefreshButton;


