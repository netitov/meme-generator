
export default class Editor {
  constructor () {
    this._inputElement = document.querySelector('.promo__upload-btn');
    this._inputs = document.querySelectorAll('.editor__input');
    this._labels = document.querySelectorAll('.editor__label');
    this._text = document.querySelector('.editor__text');
    this._textElements = document.querySelectorAll('.editor__text');
    this._toolbar = document.querySelector('.editor__toolbar')
    this._deleteBtn = document.querySelector('.editor__delete-btn');
    this._textContainer = document.querySelector('.editor__text-container');
    this._addBtn = document.querySelector('.editor__add-btn');
    this._activeInput;
    this._activeText;
    this._textStyleArray = [];
    this._initInputsValue = {
      fontSize: 50,
      color: '#ffffff',
      fontWeight: 400,
      fontStyle: 'normal',
      textDecoration: 'none',
      backgroundColor: 'none'
    };
    this._checkedInputsValue = { fontWeight: 600, fontStyle: 'italic', textDecoration: 'underline' };
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

  _dropActiveInputs() {
    Array.from(this._labels).forEach((i) => {
      i.classList.remove('editor__label_active');
      if (this._initInputsValue[i.control.name]) i.control.value = this._initInputsValue[i.control.name];
    })
  }

  _showToolBar(e) {

    //drop value and style on toolbar when new text selected
    this._dropActiveInputs();
    const clickedElement = e.target;
    this._activeText = clickedElement;
    this._toolbar.classList.add('editor__toolbar_active');

    const currentStyles = this._textStyleArray.find(i => i.textElement === clickedElement);

    //assign value and styles on toolbar if they were set before
    if (currentStyles) {
      for (const key in currentStyles) {
        if (key === 'textElement') {
          continue;
        } else {
          const editedInput = Array.from(this._inputs).find(i => i.name === key);
          if (editedInput.type === 'checkbox') {
            if (!(editedInput.value == currentStyles[key])) {
              editedInput.labels[0].classList.add('editor__label_active');
              editedInput.checked = true;
            }
          } else {
            const newValue = editedInput.name === 'fontSize' ? parseInt(currentStyles[key]) : currentStyles[key];
            editedInput.value = newValue;
          }
        }
      }
    }
  }

  _removeText() {
    this._activeText.remove();
  }

  _handleTextStyleChange(prop, value, type) {

    const foundObject = this._textStyleArray.find(obj => obj.textElement === this._activeText);

    let newValue = value;
    if (type === 'checkbox') {
      if (!foundObject  || !foundObject[prop] || foundObject[prop] === this._initInputsValue[prop]) {
        newValue = this._checkedInputsValue[prop];
      } else {
        newValue = this._initInputsValue[prop];
      }
    }
    if (prop === 'fontSize') {
      newValue = value + 'px';
    }
    this._activeText.style[prop] = newValue;

    if (foundObject) {
      //if textobject (already set any style property) in array - add new property
      foundObject[prop] = newValue;
    } else {
      //otherwise - add new object (textElement and styles) to array of texts
      const newObj = { textElement: this._activeText, [prop]: newValue };
      this._textStyleArray.push(newObj);
    }
  }

  _addText(container) {

    //find current taken height
    this._textElements = Array.from(document.querySelectorAll('.editor__text'));
    const heights = this._textElements.map(element => element.offsetHeight);
    const totalHeight = heights.reduce((prev, current) => prev + current, 0);

    //add element if space left
    if (this._textContainer.offsetHeight > (totalHeight + 64)) {
      const element = document.createElement('div');
      element.textContent = 'Введите текст';
      element.classList.add('editor__text');
      element.setAttribute('role', 'textbox');
      element.setAttribute('contenteditable', 'true');
      //find last text position
      const lastText = this._textElements[this._textElements.length - 1];
      //set element position after previous one
      element.style.top = lastText.offsetTop + lastText.offsetHeight + 'px';
      container.appendChild(element);
      this._addBtn.classList.remove('editor__add-btn_inactive');
    } else {
      //disactive add btn if no space for text left
      this._addBtn.classList.add('editor__add-btn_inactive');
    }

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
        //e.stopPropagation();

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

    //keep text focus if toolbar clicked
    this._toolbar.addEventListener('click', (e) => {
      e.stopPropagation();
      this._activeText.focus();
    })

    //handle text style change
    this._inputs.forEach((i) => {
      i.addEventListener('input', () => {
        this._handleTextStyleChange(i.name, i.value, i.type);
      })
    })

    //handle text focus/ show toolbar
    this._textContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('editor__text')) {
        this._showToolBar(e);
      }
    })

    //hande delete text
    this._deleteBtn.addEventListener('click', () => {
      this._removeText();
      this._hideToolBar();
    });

    //handle add text
    this._addBtn.addEventListener('click', () => {
      this._addText(this._textContainer);
    })

  }

}
