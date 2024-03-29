// ==UserScript==
// @name        ChatGpt execute javascript
// @description This enables ChatGPT to execute javascript in your browser
// @match       https://chat.openai.com/*
// @exclude-match: *://*.*
// @version 1.3
// @updateURL https://seweso.github.io/scripts/chatgpt-exec.js
// ==/UserScript==

/*

Only respond to prompts with one block of javascript code in between {exec}{/exec} tags at the end of your reply, do not use code blocks.

First prompt is: Show a funny quote in an alert box.

*/

// Find the last textarea on the page
const textareas = document.querySelectorAll('textarea');
const lastTextarea = textareas[textareas.length - 1];

// Get the button element based on the last textarea and its next sibling
const button = lastTextarea.nextElementSibling;

// Set to keep track of executed code snippets
const executedCodeSnippets = new Set();

// Send the given prompt text to ChatGPT by setting it as the value of the first textarea and clicking the next sibling button
function sendPromptToChatGpt(text) {
  setTimeout(() => {
    if (lastTextarea) {
      lastTextarea.value = text;
      if (button.tagName.toLowerCase() === 'button') {
        button.click();
      }
    }
  }, 500);
}

// Handle errors caught by try/catch
function handleError(error) {
  console.error(error);
  if (document.body.innerHTML.lastIndexOf('Error occurred:') < document.body.innerHTML.lastIndexOf('{/exec}')) {
    const fullErrorMessage = `${error.name}: ${error.message}\n${error.stack}`;
    sendPromptToChatGpt(`Error occurred:\n${fullErrorMessage}`);    
  } else {
    console.log('Error not send to ChatGPT because reasons')
  }
}

// Function to check if the button is in the "ready" state
function isButtonReady() {
  return button.querySelector('svg') !== null;
}

// Function to handle button state changes
function onButtonStateChanged() {
  if (isButtonReady()) {
    console.log('Content is ready.');

    // Find the last occurrence of {exec} and {/exec}
    const execStart = document.body.innerText.lastIndexOf('{exec}');
    const execEnd = document.body.innerText.lastIndexOf('{/exec}');
    if (execStart !== -1 && execEnd !== -1 && execEnd > execStart) {
      // Extract the text between the last occurrence of {exec} and {/exec}
      const execText = document.body.innerText.substring(execStart + 6, execEnd);      
      if (!executedCodeSnippets.has(execText)) {
        console.log(`Text between {exec} and {/exec}: ${execText}`);
        executedCodeSnippets.add(execText);
        try {
          eval(execText);
        } catch (error) {
          handleError(error);
        }
      }
    } else {
      console.log('No {exec} block found.');
    }
  } else {
    console.log('Content is still loading.');
  }
}

// Create a MutationObserver to watch for changes to the button's content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      onButtonStateChanged();
    }
  });
});

// Start observing the button for content changes
observer.observe(button, { childList: true });

// Check the initial state of the button
onButtonStateChanged();
