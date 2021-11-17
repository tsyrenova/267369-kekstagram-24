// eslint-disable-next-line no-redeclare
/* global noUiSlider:readonly */
import { sendData } from './api.js';
import { isEscapeKey } from './util.js';

const SCALE_IMG_STEP = 25;
const SCALE_IMG_MAX = 100;
const SCALE_IMG_MIN = 25;
const MAX_COMMENTS_LENGTH = 140;
const HASHTAGS_COUNT = 6;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
let currentScaleValue = SCALE_IMG_MAX;
const RE = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;

const filterNames = {
  chrome: 'chrome',
  sepia: 'sepia',
  marvin: 'marvin',
  phobos: 'phobos',
  heat: 'heat',
};

const filterTypes = {
  grayscale: 'grayscale',
  sepia: 'sepia',
  invert: 'invert',
  blur: 'blur',
  brightness: 'brightness',
};

const sliderConfigs = {
  chrome: {
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    filterName: filterNames.chrome,
  },
  sepia: {
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    filterName: filterNames.sepia,
  },
  marvin: {
    min: 0,
    max: 100,
    start: 100,
    step: 1,
    filterName: filterNames.marvin,
  },
  phobos: {
    min: 0,
    max: 3,
    start: 3,
    step: 0.1,
    filterName: filterNames.phobos,
  },
  heat: {
    min: 1,
    max: 3,
    start: 3,
    step: 0.1,
    filterName: filterNames.heat,
  },
};

const imgFormElement = document.querySelector('.img-upload__form');
const effectLevelValueElement = imgFormElement.querySelector(
  '.effect-level__value',
);
const imgUploadElement = imgFormElement.querySelector('.img-upload__input');
const imgUploadCancelElement = imgFormElement.querySelector(
  '.img-upload__cancel',
);
const imgEditElement = imgFormElement.querySelector('.img-upload__overlay');
const bodyElement = document.body;
const textHashtagsInputElement =
  imgFormElement.querySelector('.text__hashtags');
const commentInputElement = imgFormElement.querySelector('.text__description');
const imgFormButtonElement = imgFormElement.querySelector(
  '.img-upload__submit',
);
let selectedImage;
const effectImgElement = imgEditElement.querySelector('.effects__list');
const imgPreviewElement = imgEditElement.querySelector(
  '.img-upload__preview  > img',
);

const scaleContainerElement =
  imgEditElement.querySelector('.img-upload__scale');
const imgEffectElement = imgEditElement.querySelector(
  '.img-upload__effect-level.effect-level',
);
const effectNoneElement = imgEditElement.querySelector('#effect-none');
const effectLevelElement = imgEditElement.querySelector(
  '.effect-level__slider',
);
const scaleValueElement = imgEditElement.querySelector(
  '.scale__control--value',
);

const createSlider = (element, sliderConfig) => {
  const { min, max, start, step, filterName } = sliderConfig;
  if (element.noUiSlider) {
    element.noUiSlider.destroy();
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
      case filterNames.chrome:
        imgPreviewElement.style.filter = `${filterTypes.grayscale}(${values[handle]})`;
        break;
      case filterNames.sepia:
        imgPreviewElement.style.filter = `${filterTypes.sepia}(${values[handle]})`;
        break;
      case filterNames.marvin:
        imgPreviewElement.style.filter = `${filterTypes.invert}(${values[handle]}%)`;
        break;
      case filterNames.phobos:
        imgPreviewElement.style.filter = `${filterTypes.blur}(${values[handle]}px)`;
        break;
      case filterNames.heat:
        imgPreviewElement.style.filter = `${filterTypes.brightness}(${values[handle]})`;
        break;
    }
  });
};

const applyFilter = (element, presetNames) => {
  switch (element.value) {
    case presetNames.chrome:
      createSlider(effectLevelElement, sliderConfigs.chrome);
      break;
    case presetNames.sepia:
      createSlider(effectLevelElement, sliderConfigs.sepia);
      break;
    case presetNames.marvin:
      createSlider(effectLevelElement, sliderConfigs.marvin);
      break;
    case presetNames.phobos:
      createSlider(effectLevelElement, sliderConfigs.phobos);
      break;
    case presetNames.heat:
      createSlider(effectLevelElement, sliderConfigs.heat);
      break;
  }
};

const changeImgEffect = () => {
  imgEffectElement.classList.add('visually-hidden');
  effectImgElement.addEventListener('click', () => {
    if (effectNoneElement === document.activeElement) {
      imgEffectElement.classList.add('visually-hidden');
      imgPreviewElement.className = '';
      imgPreviewElement.style = '';
      imgPreviewElement.style.transform = `scale(${
        currentScaleValue / SCALE_IMG_MAX
      })`;
      imgPreviewElement.classList.add(
        `effects__preview--${document.activeElement.value}`,
      );
    } else {
      imgEffectElement.classList.remove('visually-hidden');
      imgPreviewElement.className = '';
      imgPreviewElement.classList.add(
        `effects__preview--${document.activeElement.value}`,
      );

      applyFilter(document.activeElement, filterNames);
    }
  });
};

const changeScale = () => {
  scaleValueElement.value = `${currentScaleValue}%`;
  imgPreviewElement.style.transform = `scale(${
    currentScaleValue / SCALE_IMG_MAX
  })`;
};

const calculateScaleValue = (evt) => {
  if (evt.target.className === 'scale__control  scale__control--smaller') {
    if (currentScaleValue > SCALE_IMG_MIN) {
      currentScaleValue -= SCALE_IMG_STEP;
    }
  } else if (
    evt.target.className === 'scale__control  scale__control--bigger'
  ) {
    if (currentScaleValue < SCALE_IMG_MAX) {
      currentScaleValue += SCALE_IMG_STEP;
    }
  }
};

const onImageSizeChange = (evt) => {
  calculateScaleValue(evt);
  changeScale();
};

const changeImgSize = () => {
  scaleValueElement.value = `${currentScaleValue}%`;
  scaleContainerElement.addEventListener('click', onImageSizeChange);
};

const closeImgUploadModal = () => {
  imgEditElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  imgUploadElement.value = '';
  imgPreviewElement.className = '';
  imgPreviewElement.style = '';
  currentScaleValue = `${SCALE_IMG_MAX}`;
  URL.revokeObjectURL(selectedImage);
  imgFormElement.reset();
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

const onImageOpen = () => {
  imgEditElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  imgEditElement.focus();
  document.addEventListener('keydown', onPopupEscKeydown);
  imgUploadCancelElement.addEventListener('click', () => {
    closeImgUploadModal();
    document.removeEventListener('keydown', onPopupEscKeydown);
  });
  changeImgSize();
  changeImgEffect();

  selectedImage = imgUploadElement.files[0];
  const fileName = selectedImage.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (selectedImage) {
    if (matches) {
      imgPreviewElement.src = URL.createObjectURL(selectedImage);
    }
  }
};

const hashtagRegexp = (hashtag) => {
  const valid = RE.test(hashtag);
  return valid;
};

const checkHashtagUniqueness = (hashtags) => {
  const newHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());
  const uniqHashtags = Array.from(new Set(newHashtags));
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
    commentInputElement.setCustomValidity('');
    commentInputElement.style.pointerEvents = 'auto';
    commentInputElement.style.outline = 'none';
    if (valueLength > MAX_COMMENTS_LENGTH) {
      commentInputElement.setCustomValidity(
        `Удалите лишние ${valueLength - MAX_COMMENTS_LENGTH} симв.`,
      );
      commentInputElement.style.pointerEvents = 'none';
      commentInputElement.style.outline = '2px solid red';
    }
    commentInputElement.reportValidity();
  });
};

const setHashtagsValidityCheck = () => {
  textHashtagsInputElement.addEventListener('input', () => {
    const arrayHashtags = textHashtagsInputElement.value.split(' ');
    const isEmptyString = textHashtagsInputElement.value === '';
    textHashtagsInputElement.setCustomValidity('');
    imgFormButtonElement.style.pointerEvents = 'auto';
    textHashtagsInputElement.style.outline = 'none';
    if (!checkHashtag(arrayHashtags) && !isEmptyString) {
      textHashtagsInputElement.setCustomValidity('Хэштег(и) введен(ы) неверно');
      imgFormButtonElement.style.pointerEvents = 'none';
      textHashtagsInputElement.style.outline = '2px solid red';
    }
    textHashtagsInputElement.reportValidity();
  });
};

const renderPicture = () => {
  imgUploadElement.addEventListener('change', onImageOpen);
  setHashtagsValidityCheck();
  setCommentsValidityCheck();
};

const sendForm = () => {
  imgFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    sendData(
      'https://24.javascript.pages.academy/kekstagram',
      new FormData(evt.target),
    );
  });
};

export { renderPicture, closeImgUploadModal, sendForm };
