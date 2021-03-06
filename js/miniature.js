import {
  removeMinContainerEventListener,
  renderBigPicture
} from './fullsize-image.js';

const RANDOM_IMGS_COUNT = 10;
const DELAY = 500;
const OPACITY = '1';

const filters = {
  default: 'filter-default',
  random: 'filter-random',
  discussed: 'filter-discussed',
};

const removePictures = (picturesElements) => {
  if (picturesElements.length > 0) {
    picturesElements.forEach((element) => {
      element.remove();
    });
  }
};

const renderUsersPhotos = (pictures) => {
  const pictureContainerElement = document.querySelector('.pictures');
  const picturesElements = pictureContainerElement.querySelectorAll('.picture');

  removePictures(picturesElements);

  const pictureTemplateElement = document.querySelector('#picture').content;
  const fragment = document.createDocumentFragment();

  pictures.forEach((picture) => {
    const pictureElement = pictureTemplateElement.cloneNode(true);
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
const imgFilterFormElement =
  imgFilterElement.querySelector('.img-filters__form');

let imgFilterDefaultElement = imgFilterElement.querySelector('#filter-default');

const getRandomImgs = (pictures, picturesCount) => {
  const newPictures = [];
  while (newPictures.length < picturesCount) {
    const randomNumber = _.random(0, picturesCount);
    if (!newPictures.includes(pictures[randomNumber])) {
      newPictures.push(pictures[randomNumber]);
    }
  }
  return newPictures;
};

const onFilterClick = (defaultPictures, sortedPictures) => {
  if (
    !document.activeElement.classList.contains('img-filters__button--active')
  ) {
    imgFilterDefaultElement.classList.remove('img-filters__button--active');
    imgFilterDefaultElement = document.activeElement;
    imgFilterDefaultElement.classList.add('img-filters__button--active');
  }
  switch (document.activeElement.id) {
    case filters.default:
      removeMinContainerEventListener();
      renderUsersPhotos(defaultPictures);
      renderBigPicture(defaultPictures);
      break;
    case filters.random:
      sortedPictures = getRandomImgs(defaultPictures, RANDOM_IMGS_COUNT);
      removeMinContainerEventListener();
      renderUsersPhotos(sortedPictures);
      renderBigPicture(sortedPictures);
      break;
    case filters.discussed:
      sortedPictures = _.sortBy(defaultPictures, 'likes').reverse();
      removeMinContainerEventListener();
      renderUsersPhotos(sortedPictures);
      renderBigPicture(sortedPictures);
      break;
  }
};

const createImgFilterForm = (pictures) => {
  const defaultPictures = pictures;
  const sortedPictures = pictures;

  imgFilterFormElement.addEventListener(
    'click',
    _.throttle(() => onFilterClick(defaultPictures, sortedPictures), DELAY),
  );
  return sortedPictures;
};

const createImgFilter = (pictures) => {
  imgFilterElement.style.opacity = OPACITY;
  return createImgFilterForm(pictures);
};

export { renderUsersPhotos, createImgFilter };

