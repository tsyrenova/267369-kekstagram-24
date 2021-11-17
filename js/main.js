import { createImgFilter, renderUsersPhotos } from './miniature.js';
import { renderBigPicture } from './fullsize-image.js';
import { renderPicture, sendForm } from './form.js';
import { getData } from './api.js';

const LOAD_IMAGES_URL = 'https://24.javascript.pages.academy/kekstagram/data';
getData(LOAD_IMAGES_URL).then((pictures) => {
  const updatePictures = createImgFilter(pictures);
  renderUsersPhotos(updatePictures);
  renderBigPicture(updatePictures);
  renderPicture();
});

sendForm();
