import { closeImgUploadModal } from './form.js';
import { showModal } from './modals.js';

const errorLoadElement = document.querySelector('#load-error').content;
const errorTemplate = document.querySelector('#error').content;
const succesModal = document.querySelector('#success').content;

async function getData(url = '') {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    showModal(errorLoadElement);
  }
}

async function sendData(url = '', body) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body,
    });
    const json = await response.json();
    showModal(succesModal);
    closeImgUploadModal();
    return json;
  } catch (error) {
    showModal(errorTemplate);
  }
}

export { getData, sendData };
