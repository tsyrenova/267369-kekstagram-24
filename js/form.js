// eslint-disable-next-line no-redeclare
/* global noUiSlider:readonly */
import { isEscapeKey } from './util.js';

const SCALE_IMG_STEP = 25;
const SCALE_IMG_MAX = 100;
const SCALE_IMG_MIN = 25;
const MAX_COMMENTS_LENGTH = 140;
const HASHTAGS_COUNT = 6;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
let currentScaleValue = SCALE_IMG_MAX;

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

const effectLevelValueElement = document.querySelector('.effect-level__value');
const imgUploadElement = document.querySelector('.img-upload__input');
const imgUploadCancelElement = document.querySelector('.img-upload__cancel');
const imgEdit = document.querySelector('.img-upload__overlay');
const body = document.body;
const textHashtagsInputElement = document.querySelector('.text__hashtags');
const commentInputElement = document.querySelector('.text__description');
const effectImgElement = imgEdit.querySelector('.effects__list');
const imgPreviewElement = imgEdit.querySelector('.img-upload__preview  > img');

const scaleContainerElement = imgEdit.querySelector('.img-upload__scale');
const imgEffectElement = imgEdit.querySelector(
  '.img-upload__effect-level.effect-level',
);
const effectNoneElement = imgEdit.querySelector('#effect-none');
const effectLevelElement = imgEdit.querySelector('.effect-level__slider');
const scaleValueElement = imgEdit.querySelector('.scale__control--value');
const formElement = document.querySelector('.img-upload__form');

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
  imgEdit.classList.add('hidden');
  body.classList.remove('modal-open');
  imgUploadElement.value = '';
  imgPreviewElement.className = '';
  imgPreviewElement.style = '';
  currentScaleValue = `${SCALE_IMG_MAX}`;
  formElement.reset();
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

  const file = imgUploadElement.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (file) {
    if (matches) {
      imgPreviewElement.src = URL.createObjectURL(file);
    }
  }
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

export { renderPicture, closeImgUploadModal };
