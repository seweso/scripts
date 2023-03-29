// ==UserScript==
// @name        ChatGpt execute javascript
// @description This enables ChatGPT to execute javascript in your browser
// @match       https://chat.openai.com/*
// @exclude-match: *://*.*
// @version 1.1
// @updateURL https://seweso.github.io/scripts/chatgpt-exec.js
// ==/UserScript==


/*

Only respond to prompts with javascript code in between {exec}{/exec} tags, do not use code blocks. 

First prompt is: Show a funny quote in an alert box. 

*/

// Select the node that will be observed for mutations
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true, characterData: true };

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Set to keep track of executed code snippets
const executedCodeSnippets = new Set();

// Check a node's text content for {exec} and {/exec} tags and execute the code between them
function checkExecTags(node) {
  const text = node.textContent;
  const matches = text.match(/\{exec\}([\s\S]*?)\{\/exec\}/g);
  if (matches) {
    matches.forEach(match => {
      const execText = match.replace(/\{exec\}([\s\S]*?)\{\/exec\}/g, '$1');
      if (!executedCodeSnippets.has(execText)) {
        console.log(execText);
        executedCodeSnippets.add(execText);
        try {
          eval(execText);
        } catch (error) {
          handleError(error);
        }
      }
    });
  }
}

// Callback function to execute when mutations are observed
function callback(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length) {
      // Check each added node for {exec} and {/exec} tags
      mutation.addedNodes.forEach(node => {
        checkExecTags(node);
      });
    } else if (mutation.type === 'characterData') {
      // Check the modified node for {exec} and {/exec} tags
      checkExecTags(mutation.target);
    }
  }
}

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Send the given prompt text to ChatGPT by setting it as the value of the first textarea and clicking the next sibling button
function sendPromptToChatGpt(text) {
  setTimeout(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = text;
      const button = textarea.nextElementSibling;
      if (button.tagName.toLowerCase() === 'button') {
        button.click();
      }
    }
  }, 500);
}

// Handle errors caught by try/catch
function handleError(error) {
  console.error(error);
  sendPromptToChatGpt(`Error occurred: ${error.message}`);
}
