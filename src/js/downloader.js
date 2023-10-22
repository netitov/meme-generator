
export default class Downloader {
  constructor ({ getTextList, showSnackbar }) {
    this._downloadBtn = document.querySelector('.editor__download-btn');
    this.getTextList = getTextList;
    this.showSnackbar = showSnackbar;
  }

  _createCanvas() {
    const imageElement = document.querySelector('.editor__img');

    let img = new Image(imageElement.width, imageElement.height);
    img.src = imageElement.src;

    //create canvas when image is loaded
    img.onload = () => {

      let newWidth = img.width;
      let newHeight = img.height;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const textArray = this.getTextList();
      textArray.forEach((i) => {
        this._addTextData(ctx, i, newWidth);
      })

      const imgLink = canvas.toDataURL();
      this._downloadImg(imgLink);

      this.showSnackbar();
    };

  }

  _addTextData(ctx, textData, maxWidth) {
    const fontSizeValue = parseFloat(textData.fontSize);
    const xPadding = parseFloat(getComputedStyle(textData.textElement).paddingLeft);
    const yPadding = parseFloat(getComputedStyle(textData.textElement).paddingTop) * 2;
    const lineHeight = fontSizeValue * 1.15;
    const textX = textData.textElement.offsetLeft + xPadding;
    const textY = textData.textElement.offsetTop + fontSizeValue;

    ctx.font = `${textData.fontStyle} ${textData.fontWeight} ${textData.fontSize} 'Noto Sans Display'`;

    //text wrap
    const text = textData.textElement.textContent;
    const wrappedText = this._wrapText(ctx, text, textX, textY, maxWidth, lineHeight, textData.textElement.offsetLeft);

    //apply text styles to each text line
    wrappedText.forEach((item) => {

      //background
      if (textData.backgroundColor !== 'none') {
        ctx.fillStyle = textData.backgroundColor;
        const rowWidth = wrappedText.length > 1 ? maxWidth : ctx.measureText(item[0]).width + xPadding
        const rowHeight = lineHeight + yPadding;
        ctx.fillRect(item[1] - xPadding,  item[2] - fontSizeValue, rowWidth, rowHeight);
      }

      //font color should be after background
      ctx.fillStyle = textData.color;

      //item[0] - text, item[1] - x, item[2] - y
      ctx.fillText(item[0], item[1], item[2]);

      //text decoration
      if (textData.textDecoration === 'underline') {
        ctx.beginPath();
        ctx.moveTo(item[1], item[2] + 5); //+5 gap between text and line
        ctx.lineTo(item[1] + ctx.measureText(item[0]).width - 10, item[2] + 5);
        ctx.strokeStyle = textData.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

    })

  }

  _wrapText(ctx, text, x, y, maxWidth, lineHeight, offsetLeft) {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    let words = text.split(' ');
    let line = ''; // This will store the text of the current line
    let testLine = ''; // This will store the text when we add a word, to test if it's too long
    let lineArray = []; // This is an array of lines, which the function will return

    // Lets iterate over each word
    for(var n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]} `;
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        // If the width of this test line is more than the max width
        if ((testWidth + offsetLeft) > maxWidth && n > 0) {
            // Then the line is finished, push the current line into "lineArray"
            lineArray.push([line, x, y]);
            // Increase the line height, so a new line is started
            y += lineHeight;
            // Update line and test line to use this word as the first word on the next line
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        }
        else {
            // If the test line is still less than the max width, then add the word to the current line
            line += `${words[n]} `;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if(n === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
    // Return the line array
    return lineArray;
}

  _downloadImg(imgLink) {
    //create link and download img
    const link = document.createElement('a');
    link.href = imgLink;
    link.download = 'meme.png';
    link.click();
  }


  setEventListeners() {

    this._downloadBtn.addEventListener('click', () => {
      this._createCanvas();
    })

  }

}
