import { isEscapeKey } from './util.js';

const createModalContainer = () => {
  const modalContainer = document.createElement('div');
  modalContainer.id = 'modalContainer';
  document.body.append(modalContainer);
};

const getModalContainer = () => document.querySelector('#modalContainer');

const onModalButtonClick = () => {
  const modalContainer = getModalContainer();
  if (modalContainer) {
    modalContainer.remove();
    modalContainer.removeEventListener('click', onModalButtonClick);
  }
};

const onModalEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    onModalButtonClick();
    document.removeEventListener('keydown', onModalEscKeydown);
  }
};

const onOutsideClick = (evt) => {
  if (evt.target.id !== 'modalContainer' && evt.target.tagName !== 'DIV') {
    document.removeEventListener('click', onOutsideClick);
    onModalButtonClick();
  }
};

const showModal = (template) => {
  const templateCopy = template.cloneNode(true);
  createModalContainer();
  const modalContainer = getModalContainer();
  modalContainer.append(templateCopy);
  const button = modalContainer.querySelector('button');
  button.addEventListener('click', onModalButtonClick);
  document.addEventListener('keydown', onModalEscKeydown);
  modalContainer.addEventListener('click', onOutsideClick);
};

export { showModal };
