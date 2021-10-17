import { generateObjectArray } from './data.js';

const renderUsersPhotos = () => {
  const pictureTemplate = document.querySelector('#picture').content;
  const fragment = document.createDocumentFragment();
  const pictureContainerElement = document.querySelector('.pictures');

  generateObjectArray().forEach((item) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = item.urlPhoto;
    pictureElement.querySelector('.picture__likes').textContent = item.likes;
    pictureElement.querySelector('.picture__comments').textContent =
      item.comments[0].message;
    fragment.appendChild(pictureElement);
  });

  pictureContainerElement.appendChild(fragment);
};

export { renderUsersPhotos };
