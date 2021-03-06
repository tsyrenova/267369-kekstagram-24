import { isEscapeKey } from './util.js';

const COMMENTS_COUNT = 5;
let firstComment = 0;
let lastComment = COMMENTS_COUNT;
let currentPicture;
let userPictures = [];

const bigPictureModalElement = document.querySelector('.big-picture');
const commentTemplateElement = bigPictureModalElement
  .querySelector('.social__comment')
  .cloneNode(true);
const bigPictureModalCloseElement = bigPictureModalElement.querySelector(
  '.big-picture__cancel',
);
const pictureModalElement = document.querySelector('.pictures');
const loaderCommentElement = bigPictureModalElement.querySelector('.comments-loader');
const showedCommentCountElement = bigPictureModalElement.querySelector(
  '.comments-count--showed',
);
const bodyElement = document.body;
const commentsContainerElement = bigPictureModalElement.querySelector('.social__comments');

const findPicture = (id, pictures) =>
  pictures.find((picture) => picture.id === id);

const createBigPicture = () => {
  bigPictureModalElement.classList.remove('hidden');
  const imgElement = bigPictureModalElement
    .querySelector('.big-picture__img')
    .querySelector('img');
  imgElement.src = currentPicture.url;
  bigPictureModalElement.querySelector('.likes-count').textContent =
    currentPicture.likes;
  bigPictureModalElement.querySelector('.comments-count').textContent =
    currentPicture.comments.length;
  bigPictureModalElement.querySelector('.social__caption').textContent =
    currentPicture.description;
};

const createFragmentWithComments = (comments, commentItem) => {
  const commentsListFragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const template = commentItem.cloneNode(true);
    template.querySelector('.social__picture').src = comment.avatar;
    template.querySelector('.social__text').textContent = comment.message;
    template.querySelector('.social__picture').alt = comment.name;
    commentsListFragment.appendChild(template);
  });
  return commentsListFragment;
};

const onCommentLoaderClick = () => {
  const comments = currentPicture.comments.slice(firstComment, lastComment);
  const fragment = createFragmentWithComments(comments, commentTemplateElement);
  commentsContainerElement.appendChild(fragment);
  firstComment += comments.length;
  lastComment += comments.length;
  showedCommentCountElement.textContent = firstComment;
  if (firstComment === currentPicture.comments.length) {
    loaderCommentElement.classList.add('hidden');
  }
};

const closePhotoModal = () => {
  bigPictureModalElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  firstComment = 0;
  lastComment = COMMENTS_COUNT;
  loaderCommentElement.removeEventListener('click', onCommentLoaderClick);
};

const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closePhotoModal();
    document.removeEventListener('keydown', onPopupEscKeydown);
  }
};

// const sendForm = () => {
//   formElement.addEventListener('submit', (evt) => {
//     evt.preventDefault();
//     sendData(
//       'https://24.javascript.pages.academy/kekstagram',
//       new FormData(evt.target),
//     );
//   });
// };

const onMinPicturesContainerClick = (evt) => {
  if (evt.target.className === 'picture__img') {
    currentPicture = findPicture(Number(evt.target.id), userPictures);
    createBigPicture(currentPicture);
    commentsContainerElement.innerHTML = '';
    loaderCommentElement.classList.remove('hidden');
    onCommentLoaderClick();
    loaderCommentElement.addEventListener('click', onCommentLoaderClick);
    bodyElement.classList.add('modal-open');
    document.addEventListener('keydown', onPopupEscKeydown);
  }
};

const removeMinContainerEventListener = () => {
  pictureModalElement.removeEventListener('click', onMinPicturesContainerClick);
};

const renderBigPicture = (pictures) => {
  userPictures = pictures;
  pictureModalElement.addEventListener('click', onMinPicturesContainerClick);

  bigPictureModalCloseElement.addEventListener('click', () => {
    closePhotoModal();
    document.removeEventListener('keydown', onPopupEscKeydown);
  });
};

export {
  renderBigPicture,
  bodyElement as body,
  closePhotoModal,
  removeMinContainerEventListener
};
