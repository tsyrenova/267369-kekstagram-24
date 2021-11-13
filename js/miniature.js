const renderUsersPhotos = (pictures) => {
  const pictureTemplate = document.querySelector('#picture').content;
  const fragment = document.createDocumentFragment();
  const pictureContainerElement = document.querySelector('.pictures');

  pictures.forEach((picture) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent =
      picture.comments.length;
    pictureElement.querySelector('.picture__img').id = picture.id;
    fragment.appendChild(pictureElement);
  });
  pictureContainerElement.appendChild(fragment);
};

export { renderUsersPhotos };
