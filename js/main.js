const NAME = ['Иван', 'Мария', 'Кристина', 'Виктор', 'Юлия', 'Никита'];
const MESSAGE = [
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Всё отлично!',
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
const ids = [];

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

const createDescription = () => {
  const randomDescriptionIndex = getRandomIntNumber(0, DESCRIPTIONS.length - 1);
  return DESCRIPTIONS[randomDescriptionIndex];
};

const getId = () => {
  const randomNumber = getRandomIntNumber(1, 500);
  if (ids.indexOf(randomNumber) === -1) {
    ids.push(randomNumber);
    return randomNumber;
  }
  return getId();
};

const createAvatar = () => `img/avatar-${getRandomIntNumber(1, 6)}.svg`;

const createName = (nameNumber) => NAME[nameNumber];

const createMessage = (messageNumber) => MESSAGE[messageNumber];

const getComment = () => {
  const randomMessageIndex = getRandomIntNumber(0, MESSAGE.length - 1);
  const randomNameIndex = getRandomIntNumber(0, NAME.length - 1);
  return {
    id: getId(),
    avatar: createAvatar(),
    message: createMessage(randomMessageIndex),
    name: createName(randomNameIndex),
  };
};

const generateComments = () => {
  const commentNumber = getRandomIntNumber(1, 20);
  return new Array(commentNumber).fill('').map(() => getComment());
};

const createDescriptionPhoto = (id) => ({
  idNumber: getId(),
  urlPhoto: createPhotoUrl(id),
  descriptionPhoto: createDescription(),
  likes: getRandomIntNumber(15, 200),
  comments: generateComments(),
});

const generateObjectArray = (objectCount) =>
  new Array(objectCount)
    .fill('')
    .map((item, index) => createDescriptionPhoto(index + 1));

generateObjectArray(25);
