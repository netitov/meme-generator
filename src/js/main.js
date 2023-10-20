import '../assets/styles/index.css';
import Uploader from './uploader';
import Popup from './popup';
import Editor from './editor';


const errorPopupElement = document.querySelector('.error-popup');
const errorPopupCloseBtn = errorPopupElement.querySelector('.page__error-close-btn');


const errorPopup = new Popup(errorPopupElement, errorPopupCloseBtn);
const imgUploader = new Uploader(() => errorPopup.openPopup());
const imgEditor = new Editor();

errorPopup.setEventListeners();
imgUploader.setEventListeners();
imgEditor.setEventListeners();
