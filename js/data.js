import { createDescriptionPhoto } from './util.js';

const generateObjectArray = (objectCount) =>
  new Array(objectCount)
    .fill('')
    .map((item, index) => createDescriptionPhoto(index + 1));

export { generateObjectArray };
