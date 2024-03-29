
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
      fontSize: '50px',
      color: '#ffffff',
      fontWeight: 400,
      fontStyle: 'normal',
      textDecoration: 'none',
      backgroundColor: 'none'
    };
    this._checkedInputsValue = { fontWeight: 600, fontStyle: 'italic', textDecoration: 'underline' };
    this._draggedElement = null;
    this._offsetX;
    this._offsetY;
    this._textDefaultHeight = 64;
  }

  getTextList() {
    return this._textStyleArray;
  }

  _closeActiveInput(e) {
    if (this._activeInput && e.target !== this._activeInput) {
      this._activeInput.classList.remove('editor__input_active');
    }
  }

  _hideToolBar() {
    this._toolbar.classList.remove('editor__toolbar_active');
    this._activeText.classList.remove('editor__text_focused');
    this._activeText;
  }

  _dropActiveInputs() {
    if (this._activeText) this._activeText.classList.remove('editor__text_focused');
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

  addText(container) {
    this._textElements = Array.from(document.querySelectorAll('.editor__text'));
    //find current taken height
    const heights = this._textElements.map(element => element.offsetHeight);
    const totalHeight = heights.reduce((prev, current) => prev + current, 0);
    const lowestElement = this._getLowestText(this._textElements);

    //add element if space left
    if (this._textContainer.offsetHeight > (totalHeight + this._textDefaultHeight) || this._textElements.length === 0) {
      const element = document.createElement('div');
      element.textContent = 'Введите текст';
      element.classList.add('editor__text');
      element.setAttribute('role', 'textbox');
      element.setAttribute('contenteditable', 'true');

      //select where to append element - top or bottom relatively to lowest element
      if (!lowestElement) {
        element.style.top = 0 + 'px';
      } else if ((lowestElement.offsetTop + lowestElement.offsetHeight + this._textDefaultHeight)  > this._textContainer.offsetHeight) {
        element.style.top = lowestElement.offsetTop - lowestElement.offsetHeight + 'px';
      } else {
        element.style.top = lowestElement.offsetTop + lowestElement.offsetHeight + 'px';
      }

      container.appendChild(element);
      this._addBtn.classList.remove('editor__add-btn_inactive');

      //add init styles
      const initStyles = this._initInputsValue;
      this._textStyleArray.push({ ...initStyles, textElement: element });
    } else {
      //disactive add btn if no space for text left
      this._addBtn.classList.add('editor__add-btn_inactive');
    }

  }

  _getLowestText(elements) {
    let lowestElement = elements[0];
    elements.forEach(element => {
      if (element.offsetTop > lowestElement.offsetTop) {
        lowestElement = element;
      }
    });
    return lowestElement;
  }

  dropEditor() {
    //dropp states
    this._activeInput;
    this._activeText;
    this._textStyleArray = [];
    this._draggedElement = null;
    this._offsetX;
    this._offsetY;

    //remove created texts
    this._textElements = Array.from(document.querySelectorAll('.editor__text'));
    if (this._textElements) {
      this._textElements.forEach((i) => {
        i.remove();
      })
    }
    this._textElements = '';
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
      this._activeText.classList.add('editor__text_focused');
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
      this.addText(this._textContainer);
    })

    //handle text moving: initialize offset
    this._textContainer.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('editor__text')) {
        this._draggedElement = e.target;
        const elementY = this._draggedElement.getBoundingClientRect().top;
        const elementX = this._draggedElement.getBoundingClientRect().left;
        this._offsetY = e.clientY - elementY + elementY - e.target.offsetTop;
        this._offsetX = e.clientX - elementX + elementX - e.target.offsetLeft;
        this._draggedElement.classList.add('editor__text_grabbed');
      }
    });

    //handle text moving: set new position
    this._textContainer.addEventListener('mousemove', (e) => {
      if (this._draggedElement) {
        const x = e.clientX - this._offsetX;
        const y = e.clientY - this._offsetY;
        this._draggedElement.style.left = x + 'px';
        this._draggedElement.style.top = y + 'px';
      }
    });

    //handle text moving: drop dragged element
    this._textContainer.addEventListener('mouseup', () => {
      if (this._draggedElement) this._draggedElement.classList.remove('editor__text_grabbed');
      this._draggedElement = null;
    });
  }

}
