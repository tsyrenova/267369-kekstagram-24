import { isEscapeKey } from './util.js';

const imgUploadElement = document.querySelector('.img-upload__input');
const imgUploadCancelElement = document.querySelector('.img-upload__cancel');
const imgEdit = document.querySelector('.img-upload__overlay');
const body = document.body;
const textHashtagsInputElement = document.querySelector('.text__hashtags');
const commentInputElement = document.querySelector('.text__description');
const MAX_COMMENTS_LENGTH = 140;
const HASHTAGS_COUNT = 6;
const activeElement = document.activeElement;

const closeImgUploadModal = () => {
  imgEdit.classList.add('hidden');
  body.classList.remove('modal-open');
  imgUploadElement.value = '';
};

const onPopupEscKeydown = (evt) => {
  const isFocusedElement =
    evt.target.className === 'text__hashtags' ||
    evt.target.className === 'text__description';

  if (!isFocusedElement && isEscapeKey(evt)) {
    evt.preventDefault();
    closeImgUploadModal();
    activeElement.removeEventListener('keydown', onPopupEscKeydown);
  }
};

const updateImageDisplay = () => {
  imgEdit.classList.remove('hidden');
  body.classList.add('modal-open');
  imgEdit.focus();
  activeElement.addEventListener('keydown', onPopupEscKeydown);
  imgUploadCancelElement.addEventListener('click', () => {
    closeImgUploadModal();
    activeElement.removeEventListener('keydown', onPopupEscKeydown);
  });
};

const hashtagRegexp = (hashtag) => {
  const re = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
  const valid = re.test(hashtag);
  return valid;
};

const checkHashtagUniqueness = (hashtags) => {
  const uniqHashtags = Array.from(new Set(hashtags));
  return hashtags.length === uniqHashtags.length;
};

const checkHashtag = (hashtags) => {
  const isUniqHashtags = checkHashtagUniqueness(hashtags);
  if (isUniqHashtags && hashtags.length < HASHTAGS_COUNT) {
    return hashtags.every(hashtagRegexp);
  }
  return false;
};

const setCommentsValidityCheck = () => {
  commentInputElement.addEventListener('input', () => {
    const valueLength = commentInputElement.value.length;
    if (valueLength > MAX_COMMENTS_LENGTH) {
      commentInputElement.setCustomValidity(
        `Удалите лишние ${valueLength - MAX_COMMENTS_LENGTH} симв.`,
      );
    } else {
      commentInputElement.setCustomValidity('');
    }
    commentInputElement.reportValidity();
  });
};

const setHashtagsValidityCheck = () => {
  textHashtagsInputElement.addEventListener('input', () => {
    const arrayHashtags = textHashtagsInputElement.value.split(' ');
    if (!checkHashtag(arrayHashtags)) {
      textHashtagsInputElement.setCustomValidity('Хэштег(и) введен(ы) неверно');
    } else {
      textHashtagsInputElement.setCustomValidity('');
    }
    textHashtagsInputElement.reportValidity();
  });
};

const renderPicture = () => {
  imgUploadElement.addEventListener('change', updateImageDisplay);
  setHashtagsValidityCheck();
  setCommentsValidityCheck();
};

export { renderPicture };
