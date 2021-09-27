 export const getRandomIntNumber = (from, to) => {
  if (from < 0 || to < 0) {
    console.error('Минимальное и максимальное значение должны быть больше 0');
    return;
  }
  if (from > to) {
    console.error('Максимальное значение должно быть больше, чем минимальное');
    return;
  }

  const rand = from + Math.random() * (to + 1 - from);
  return Math.floor(rand);
};

export const checkMaxStringLength = (str, maxLength) => str.length <= maxLength;
