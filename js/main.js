import { renderUsersPhotos } from './miniature.js';
import { renderBigPicture, sendForm } from './fullSizeImage.js';
import { renderPicture } from './form.js';
import { getData } from './api.js';

const LOAD_IMAGES_URL = 'https://24.javascript.pages.academy/kekstagram/data';
getData(LOAD_IMAGES_URL).then((pictures) => {
  renderUsersPhotos(pictures);
  renderBigPicture(pictures);
  renderPicture();
});

sendForm();
