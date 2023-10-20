
export default class Editor {
  constructor () {
    this._inputElement = document.querySelector('.promo__upload-btn');
    this._inputs = document.querySelectorAll('.editor__input');
    this._labels = document.querySelectorAll('.editor__label');
    this._text = document.querySelector('.editor__text');
    this._textElements = document.querySelectorAll('.editor__text');
    this._toolbar = document.querySelector('.editor__toolbar')
    this._deleteBtn = document.querySelector('.editor__delete-btn');
    this._activeInput;
    this._activeText;
  }

  _closeActiveInput(e) {
    if (this._activeInput && e.target !== this._activeInput) {
      this._activeInput.classList.remove('editor__input_active');
    }
  }

  _hideToolBar() {
    this._toolbar.classList.remove('editor__toolbar_active');
    this._activeText;
  }

  _removeText() {
    this._activeText.remove();
  }

  _handleTextStyleChange(prop, value, checked) {
    let newValue = value;
    if (prop === 'fontWeight') {
      newValue = checked ? 600 : 400;
    }
    if (prop === 'fontStyle') {
      newValue = checked ? 'italic' : 'normal';
    }
    if (prop === 'textDecoration') {
      newValue = checked ? 'underline' : 'none';
    }
    if (prop === 'fontSize') {
      newValue = value + 'px';
    }
    this._text.style[prop] = newValue;
    console.log(newValue)
  }

  setEventListeners() {

    //close tool input and hide toolbar on overlay click
    document.addEventListener('click', (e) => {
      this._closeActiveInput(e);

      if (this._activeText && e.target !== this._activeText && !this._toolbar.contains(e.target)) {
        this._hideToolBar(e);
      }

    });

    //toggle tool input (open/close) on label click
    this._labels.forEach((i) => {
      i.addEventListener('click', (e) => {
        e.stopPropagation();

        if (i.control.classList.contains('editor__input_active') && i.control.type !== 'checkbox') {
          //prevent default to exclude openening default palette
          e.preventDefault();
          //close input
          i.control.classList.remove('editor__input_active');
          this._activeInput = '';
        } else {
          //close other input, if there is active one
          this._closeActiveInput(e);
          //open input
          i.control.classList.add('editor__input_active');
          //toggle checkbox input (checkbox input is not opening - so toggle style on label, not input)
          if (i.control.type === 'checkbox') i.classList.toggle('editor__label_active');
          this._activeInput = i.control;
        }
      })
    })

    //handle text style change
    this._inputs.forEach((i) => {
      i.addEventListener('input', () => {
        this._handleTextStyleChange(i.name, i.value, i.checked);
      })
    })

    //handle text focus
    this._textElements.forEach((i) => {
      i.addEventListener('focus', () => {
        this._activeText = i;
        this._toolbar.classList.add('editor__toolbar_active');
      })
    })

    //hande delete text
    this._deleteBtn.addEventListener('click', () => {
      this._removeText();
      this._hideToolBar();
    });



  }

}
