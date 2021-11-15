import { renderBigPicture } from './fullSizeImage.js';

const RANDOM_IMGS_COUNT = 10;
const renderUsersPhotos = (pictures) => {
  const pictureContainerElement = document.querySelector('.pictures');
  const picturesElements = pictureContainerElement.querySelectorAll('.picture');

  if (picturesElements.length > 0) {
    picturesElements.forEach((element) => {
      element.remove();
    });
  }

  const pictureTemplate = document.querySelector('#picture').content;
  const fragment = document.createDocumentFragment();

  pictures.forEach((picture) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent =
      picture.comments.length;
    pictureElement.querySelector('.picture__img').id = picture.id;
    fragment.appendChild(pictureElement);
  });

  pictureContainerElement.appendChild(fragment);
};

const imgFilterElement = document.querySelector('.img-filters--inactive');
const ImgFilterFormElement =
  imgFilterElement.querySelector('.img-filters__form');

let imgFilterDefaultElement = imgFilterElement.querySelector('#filter-default');

const getRandomImgs = (pictures, picturesCount) => {
  const newArray = [];
  while (newArray.length < picturesCount) {
    const randomNumber = _.random(0, picturesCount);
    if (!newArray.includes(pictures[randomNumber])) {
      newArray.push(pictures[randomNumber]);
    }
  }
  return newArray;
};

const createImgFilterForm = (pictures) => {
  const defaultPictures = pictures;
  let sortedPictures = pictures;

  ImgFilterFormElement.addEventListener('click', _.throttle (() => {
    if (
      !document.activeElement.classList.contains('img-filters__button--active')
    ) {
      imgFilterDefaultElement.classList.remove('img-filters__button--active');
      imgFilterDefaultElement = document.activeElement;
      imgFilterDefaultElement.classList.add('img-filters__button--active');
    }
    if (document.activeElement.id === 'filter-default') {
      renderUsersPhotos(defaultPictures);
      renderBigPicture(defaultPictures);
    } else if (document.activeElement.id === 'filter-random') {
      sortedPictures = getRandomImgs(pictures, RANDOM_IMGS_COUNT);
      renderUsersPhotos(sortedPictures);
      renderBigPicture(sortedPictures);
    } else if (document.activeElement.id === 'filter-discussed') {
      sortedPictures = _.sortBy(defaultPictures, 'likes').reverse();
      renderUsersPhotos(sortedPictures);
      renderBigPicture(sortedPictures);
    }
  }, 500));
  return sortedPictures;
};

const createImgFilter = (pictures) => {
  imgFilterElement.style.opacity = '1';
  return createImgFilterForm(pictures);
};

export { renderUsersPhotos, createImgFilter };
