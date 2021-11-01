import { isEscapeKey } from './util.js';

const bigPictureModalElement = document.querySelector('.big-picture');
const bigPictureModalCloseElement = bigPictureModalElement.querySelector(
  '.big-picture__cancel',
);
const pictureModalElement = document.querySelector('.pictures');
const body = document.body;

const findPicture = (id, pictures) =>
  pictures.find((picture) => picture.idNumber === id);

const createBigPicture = (currentPicture) => {
  bigPictureModalElement.classList.remove('hidden');
  const imgElement = bigPictureModalElement
    .querySelector('.big-picture__img')
    .querySelector('img');
  imgElement.src = currentPicture.urlPhoto;
  bigPictureModalElement.querySelector('.likes-count').textContent =
    currentPicture.likes;
  bigPictureModalElement.querySelector('.comments-count').textContent =
    currentPicture.comments.length;
  bigPictureModalElement.querySelector('.social__caption').textContent =
    currentPicture.descriptionPhoto;
};

const createCommentList = (currentPicture) => {
  const commentsContainerElement = document.querySelector('.social__comments');
  const commentsListFragment = document.createDocumentFragment();
  const commentListItemElement =
    commentsContainerElement.querySelector('.social__comment');
  currentPicture.comments.forEach((comment) => {
    const commentListItem = commentListItemElement.cloneNode(true);
    commentListItem.querySelector('.social__picture').src = comment.avatar;
    commentListItem.querySelector('.social__text').textContent =
      comment.message;
    commentListItem.querySelector('.social__picture').alt = comment.name;
    commentsListFragment.appendChild(commentListItem);
  });
  commentsContainerElement.innerHTML = '';
  commentsContainerElement.appendChild(commentsListFragment);
};

const closePhotoModal = () => {
  bigPictureModalElement.classList.add('hidden');
  body.classList.remove('modal-open');
};

const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closePhotoModal();
    document.removeEventListener('keydown', onPopupEscKeydown);
  }
};

const renderBigPicture = (pictures) => {
  pictureModalElement.addEventListener('click', (evt) => {
    if (evt.target.className === 'picture__img') {
      const currentPicture = findPicture(evt.target.id, pictures);
      createBigPicture(currentPicture);
      createCommentList(currentPicture);

      const countCommentElement = document.querySelector(
        '.social__comment-count',
      );
      countCommentElement.classList.add('hidden');
      const loaderCoomentElement = document.querySelector('.comments-loader');
      loaderCoomentElement.classList.add('hidden');

      body.classList.add('modal-open');

      document.addEventListener('keydown', onPopupEscKeydown);
    }
  });

  bigPictureModalCloseElement.addEventListener('click', () => {
    closePhotoModal();
    document.removeEventListener('keydown', onPopupEscKeydown);
  });
};

export { renderBigPicture, body };
