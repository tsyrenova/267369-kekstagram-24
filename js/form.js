// eslint-disable-next-line no-redeclare
/* global noUiSlider:readonly */
import { isEscapeKey } from './util.js';

const imgUploadElement = document.querySelector('.img-upload__input');
const imgUploadCancelElement = document.querySelector('.img-upload__cancel');
const imgEdit = document.querySelector('.img-upload__overlay');
const body = document.body;
const textHashtagsInputElement = document.querySelector('.text__hashtags');
const commentInputElement = document.querySelector('.text__description');
const MAX_COMMENTS_LENGTH = 140;
const HASHTAGS_COUNT = 6;
const effectImgElement = imgEdit.querySelector('.effects__list');
const imgPreviewElement = imgEdit.querySelector('.img-upload__preview  > img');

const scaleContainerElement = imgEdit.querySelector('.img-upload__scale');
const imgEffectElement = imgEdit.querySelector(
  '.img-upload__effect-level.effect-level',
);

const SCALE_IMG_STEP = 25;
const SCALE_IMG_MAX = 100;
const SCALE_IMG_MIN = 25;
const effectLevelValueElement = document.querySelector('.effect-level__value');

const FILTER_NAMES = {
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat',
};

const FILTER_TYPES = {
  GRAYSCALE: 'grayscale',
  SEPIA: 'sepia',
  INVERT: 'invert',
  BLUR: 'blur',
  BRIGHTNESS: 'brightness',
};

const createSlider = (
  min,
  max,
  start,
  step,
  effectLevelElement,
  filterName,
) => {
  if (effectLevelElement.noUiSlider) {
    effectLevelElement.noUiSlider.destroy();
  }
  const sliderParametrs = {
    range: {
      min,
      max,
    },
    start,
    step,
    connect: 'lower',
  };

  noUiSlider.create(effectLevelElement, sliderParametrs);

  effectLevelElement.noUiSlider.on('update', (values, handle) => {
    effectLevelValueElement.value = values[handle];
    switch (filterName) {
      case FILTER_NAMES.CHROME:
        imgPreviewElement.style.filter = `${FILTER_TYPES.GRAYSCALE}(${values[handle]})`;
        break;
      case FILTER_NAMES.SEPIA:
        imgPreviewElement.style.filter = `${FILTER_TYPES.SEPIA}(${values[handle]})`;
        break;
      case FILTER_NAMES.MARVIN:
        imgPreviewElement.style.filter = `${FILTER_TYPES.INVERT}(${values[handle]}%)`;
        break;
      case FILTER_NAMES.PHOBOS:
        imgPreviewElement.style.filter = `${FILTER_TYPES.BLUR}(${values[handle]}px)`;
        break;
      case FILTER_NAMES.HEAT:
        imgPreviewElement.style.filter = `${FILTER_TYPES.BRIGHTNESS}(${values[handle]})`;
        break;
    }
  });
};

const changeImgEffect = () => {
  const effectNoneElement = imgEdit.querySelector('#effect-none');
  const effectLevelElement = imgEdit.querySelector('.effect-level__slider');
  imgEffectElement.classList.add('visually-hidden');
  effectImgElement.addEventListener('click', () => {
    if (effectNoneElement === document.activeElement) {
      imgEffectElement.classList.add('visually-hidden');
      imgPreviewElement.className = '';
      imgPreviewElement.classList.add(
        `effects__preview--${document.activeElement.value}`,
      );
    } else {
      imgEffectElement.classList.remove('visually-hidden');
      imgPreviewElement.className = '';
      imgPreviewElement.classList.add(
        `effects__preview--${document.activeElement.value}`,
      );

      switch (document.activeElement.value) {
        case FILTER_NAMES.CHROME:
          createSlider(0, 1, 1, 0.1, effectLevelElement, FILTER_NAMES.CHROME);
          break;
        case FILTER_NAMES.SEPIA:
          createSlider(0, 1, 1, 0.1, effectLevelElement, FILTER_NAMES.SEPIA);
          break;
        case FILTER_NAMES.MARVIN:
          createSlider(0, 100, 100, 1, effectLevelElement, FILTER_NAMES.MARVIN);
          break;
        case FILTER_NAMES.PHOBOS:
          createSlider(0, 3, 3, 0.1, effectLevelElement, FILTER_NAMES.PHOBOS);
          break;
        case FILTER_NAMES.HEAT:
          createSlider(1, 3, 3, 0.1, effectLevelElement, FILTER_NAMES.HEAT);
          break;
      }
    }
  });
};

const changeImgSize = () => {
  let currentScaleValue = SCALE_IMG_MAX;
  const scaleValueElement = imgEdit.querySelector('.scale__control--value');
  scaleValueElement.value = `${currentScaleValue}%`;
  scaleContainerElement.addEventListener('click', (evt) => {
    if (evt.target.className === 'scale__control  scale__control--smaller') {
      if (currentScaleValue > SCALE_IMG_MIN) {
        currentScaleValue -= SCALE_IMG_STEP;
        scaleValueElement.value = `${currentScaleValue}%`;
        imgPreviewElement.style.transform = `scale(${currentScaleValue / 100})`;
      }
    } else if (
      evt.target.className === 'scale__control  scale__control--bigger'
    ) {
      if (currentScaleValue < SCALE_IMG_MAX) {
        currentScaleValue += SCALE_IMG_STEP;
        scaleValueElement.value = `${currentScaleValue}%`;
        imgPreviewElement.style.transform = `scale(${currentScaleValue / 100})`;
      }
    }
  });
};

const closeImgUploadModal = () => {
  imgEdit.classList.add('hidden');
  body.classList.remove('modal-open');
  imgUploadElement.value = '';
};

const onPopupEscKeydown = (evt) => {
  const activeElement = document.activeElement;
  const isFocusedElement =
    activeElement === textHashtagsInputElement ||
    activeElement === commentInputElement;

  if (!isFocusedElement && isEscapeKey(evt)) {
    evt.preventDefault();
    closeImgUploadModal();
    document.removeEventListener('keydown', onPopupEscKeydown);
  }
};

const updateImageDisplay = () => {
  imgEdit.classList.remove('hidden');
  body.classList.add('modal-open');
  imgEdit.focus();
  document.addEventListener('keydown', onPopupEscKeydown);
  imgUploadCancelElement.addEventListener('click', () => {
    closeImgUploadModal();
    document.removeEventListener('keydown', onPopupEscKeydown);
  });
  changeImgSize();
  changeImgEffect();
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
