import { generateObjectArray } from './data.js';
import { renderUsersPhotos } from './miniature.js';
import { renderBigPicture } from './fullSizeImage.js';

const pictures = generateObjectArray();
renderUsersPhotos(pictures);
renderBigPicture(pictures);
