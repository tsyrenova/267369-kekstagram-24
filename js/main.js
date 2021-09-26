export const getRandomIntNumber = (from, to) => {
  const rand = from + Math.random() * (to + 1 - from);
  return Math.abs(Math.floor(rand));
};

export const checkMaxStringLength = (str, maxLength) => str.length < maxLength;
