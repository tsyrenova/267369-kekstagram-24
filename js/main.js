/* global uuidv4:readonly */
const NAMES = ['Иван', 'Мария', 'Кристина', 'Виктор', 'Юлия', 'Никита'];
const MESSAGES = [
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Всё отлично!',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
];
const DESCRIPTIONS = [
  'В целом всё неплохо 1',
  'В целом всё неплохо 2',
  'В целом всё неплохо 3',
  'В целом всё неплохо 4',
  'В целом всё неплохо 5',
  'В целом всё неплохо 6',
  'В целом всё неплохо 7',
  'В целом всё неплохо 8',
  'В целом всё неплохо 9',
  'В целом всё неплохо 10',
  'В целом всё неплохо 11',
  'В целом всё неплохо 12',
  'В целом всё неплохо 13',
  'В целом всё неплохо 14',
  'В целом всё неплохо 15',
  'В целом всё неплохо 16',
  'В целом всё неплохо 17',
  'В целом всё неплохо 18',
  'В целом всё неплохо 19',
  'В целом всё неплохо 20',
  'В целом всё неплохо 21',
  'В целом всё неплохо 22',
  'В целом всё неплохо 23',
  'В целом всё неплохо 24',
  'В целом всё неплохо 25',
];

const getRandomIntNumber = (from, to) => {
  if (from < 0 || to < 0) {
    // console.error('Минимальное и максимальное значение должны быть больше 0');
    return;
  }
  if (from > to) {
    // console.error('Максимальное значение должно быть больше, чем минимальное');
    return;
  }

  const rand = from + Math.random() * (to + 1 - from);
  return Math.floor(rand);
};

// Eslint ругается. Функция не используется
// const checkMaxStringLength = (str, maxLength) => str.length <= maxLength;

const createPhotoUrl = (photoNumber) => `photos/${photoNumber}.jpg`;

const getRandomArrayElement = (elements) =>
  elements[_.random(0, elements.length - 1)];

const getRandomMessage = () => {
  const randomNumber = _.random(0, 1);
  return randomNumber
    ? getRandomArrayElement(MESSAGES)
    : `${getRandomArrayElement(MESSAGES)} ${getRandomArrayElement(MESSAGES)}`;
};

const createAvatar = () => `img/avatar-${getRandomIntNumber(1, 6)}.svg`;

const getComment = () => ({
  id: uuidv4(),
  avatar: createAvatar(),
  message: getRandomMessage(),
  name: getRandomArrayElement(NAMES),
});
const generateComments = () => {
  const commentNumber = getRandomIntNumber(1, 20);
  return new Array(commentNumber).fill('').map(() => getComment());
};

const createDescriptionPhoto = (id) => ({
  idNumber: uuidv4(),
  urlPhoto: createPhotoUrl(id),
  descriptionPhoto: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomIntNumber(15, 200),
  comments: generateComments(),
});

const generateObjectArray = (objectCount) =>
  new Array(objectCount)
    .fill('')
    .map((item, index) => createDescriptionPhoto(index + 1));

generateObjectArray(25);
