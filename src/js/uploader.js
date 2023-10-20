
export default class Uploader {
  constructor (openErrorPopup) {
    this._inputElement = document.querySelector('.promo__upload-btn');
    this._editorContainer = document.querySelector('.editor');
    this._spinner = document.querySelector('.promo-spinner');
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

    this._spinner.classList.add('page__spinner_active');

    //if format is valid, create img URL
    if (fileIsValid) {
      this._fileUrl = window.URL.createObjectURL(file);

      //render image after upload
      this._renderImg(this._fileUrl);

      //smooth scroll to image after upload and activate editor container
      this._editorContainer.classList.add('editor_active');
      setTimeout(() => {
        this._spinner.classList.remove('page__spinner_active');
        this._editorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } else {
      //otherwise show error
      this._openErrorPopup();
    }


  }

  _renderImg(src) {
    //remove prev image
    const currentElement = document.querySelector('.editor__img');
    currentElement && currentElement.remove();

    //create new image
    const imgElement = document.createElement('img');
    imgElement.classList.add('editor__img');
    imgElement.src = src;
    const imageContainer = document.querySelector('.editor__img-container');

    //appeand image on page
    imageContainer.appendChild(imgElement);
  }

  setEventListeners() {
    this._inputElement.addEventListener('change', (e) => this._handleFileUpload(e));
  }


}
