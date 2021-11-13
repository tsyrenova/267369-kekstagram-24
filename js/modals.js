import { isEscapeKey } from './util.js';

const createModalContainer = () => {
  const modalContainer = document.createElement('div');
  modalContainer.id = 'modalContainer';
  document.body.append(modalContainer);
};

const getModalContainer = () => document.querySelector('#modalContainer');

const hideModal = () => {
  const modalContainer = getModalContainer();
  if (modalContainer) {
    modalContainer.remove();
    modalContainer.removeEventListener('click', hideModal);
  }
};

const onModalEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    hideModal();
    document.removeEventListener('keydown', onModalEscKeydown);
  }
};

const onOutsideClick = (evt) => {
  if (evt.target.id !== 'modalContainer' && evt.target.tagName !== 'DIV') {
    document.removeEventListener('click', onOutsideClick);
    hideModal();
  }
};

const showModal = (template) => {
  const templateCopy = template.cloneNode(true);
  createModalContainer();
  const modalContainer = getModalContainer();
  modalContainer.append(templateCopy);
  const button = modalContainer.querySelector('button');
  button.addEventListener('click', hideModal);
  document.addEventListener('keydown', onModalEscKeydown);
  modalContainer.addEventListener('click', onOutsideClick);
};

export { showModal };
