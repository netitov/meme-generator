import '../assets/styles/index.css';
import Uploader from './uploader';
import Popup from './popup';
import Editor from './editor';
import Downloader from './downloader';


const errorPopupElement = document.querySelector('.error-popup');
const downloadPopupElement = document.querySelector('.download-popup');
const errorPopupCloseBtn = errorPopupElement.querySelector('.page__snackbar-close-btn');
const downloadPopupCloseBtn = downloadPopupElement.querySelector('.page__snackbar-close-btn');
const textContainer = document.querySelector('.editor__text-container');

const errorPopup = new Popup(errorPopupElement, errorPopupCloseBtn);
const downloadPopup = new Popup(downloadPopupElement, downloadPopupCloseBtn);
const imgEditor = new Editor();
const imgUploader = new Uploader({
  openErrorPopup: () => errorPopup.openPopup(),
  addInitText: () => imgEditor.addText(textContainer),
  dropEditor: () => imgEditor.dropEditor()
});
const imgDownloader = new Downloader({
  getTextList: () => imgEditor.getTextList(),
  showSnackbar: () => downloadPopup.openPopup()
});

errorPopup.setEventListeners();
downloadPopup.setEventListeners();
imgUploader.setEventListeners();
imgEditor.setEventListeners();
imgDownloader.setEventListeners();
