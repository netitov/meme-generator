
export default class Popup {
  constructor (popupSelector, closeBtnSelector) {
    this._popupSelector = popupSelector;
    this._closeBtnSelector = closeBtnSelector;
    this.closePopup = this.closePopup.bind(this);
    this._handleOverlayClose = this._handleOverlayClose.bind(this);
    this._handleEscClose = this._handleEscClose.bind(this);
    this._pageElement = document.querySelector('.page');
  }

   openPopup() {
    this._popupSelector.classList.add('popup_opened');
    document.addEventListener('mousedown', this._handleOverlayClose);
    document.addEventListener('keydown', this._handleEscClose);
   }

   closePopup() {
    this._popupSelector.classList.remove('popup_opened');
    document.removeEventListener('mousedown', this._handleOverlayClose);
    document.removeEventListener('keydown', this._handleEscClose);
  }

  _handleEscClose(evt) {
    const activePopup = document.querySelector('.popup_opened');
    if (evt.key === 'Escape') {
      this.closePopup(activePopup);
    }
  }

  _handleOverlayClose(evt) {
    const activePopup = document.querySelector('.popup_opened');
    if (evt.target.classList.contains('popup_opened')) {
      this.closePopup(activePopup)}
  }

  setEventListeners() {
    this._closeBtnSelector.addEventListener('click', this.closePopup);
  }

}
