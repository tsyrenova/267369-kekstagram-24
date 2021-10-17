import { createDescriptionPhoto } from './util.js';
const ARRAY_OBJECTS = 25;

const generateObjectArray = (objectCount = ARRAY_OBJECTS) =>
  new Array(objectCount)
    .fill('')
    .map((item, index) => createDescriptionPhoto(index + 1));

export { generateObjectArray, ARRAY_OBJECTS };
