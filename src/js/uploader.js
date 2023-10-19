
export default class Uploader {
  constructor (openErrorPopup) {
    this._inputElement = document.querySelector('.promo__upload-btn');
    this._fileUrl;
    this._openErrorPopup = openErrorPopup;
  }

  //check file format
  _checkFileType(file) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (file && allowedTypes.includes(file.type)) {
      return true;
    } else {
      return false;
    }
  }

  _handleFileUpload(e) {
    const file = e.target.files[0];
    const fileIsValid = this._checkFileType(file);

    //if format is valid, create img URL
    if (fileIsValid) {
      this._fileUrl = window.URL.createObjectURL(file);

      this._renderImg(this._fileUrl)
    } else {
      //otherwise show error
      this._openErrorPopup();
    }
  }

  _renderImg(src) {
    const imgElement = document.createElement('img');
    imgElement.classList.add('.editor__img')
    imgElement.src = src;

    const imageContainer = document.querySelector('.editor__img-box');
    //remove prev image
    imageContainer.innerHTML = '';
    //appeand imageon page
    imageContainer.appendChild(imgElement);
  }

  setEventListeners() {
    this._inputElement.addEventListener('change', (e) => this._handleFileUpload(e));
  }


}
