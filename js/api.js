import { closeImgUploadModal } from './form.js';
import { showModal } from './modals.js';

const errorLoadElement = document.querySelector('#load-error').content;
const errorTemplateElement = document.querySelector('#error').content;
const succesModalElement = document.querySelector('#success').content;

const getData = async (url = '') => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    showModal(errorLoadElement);
  }
};

const sendData = async (url = '', body) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body,
    });
    const json = await response.json();
    closeImgUploadModal();
    showModal(succesModalElement);
    return json;
  } catch (error) {
    closeImgUploadModal();
    showModal(errorTemplateElement);
  }
};

export { getData, sendData };
