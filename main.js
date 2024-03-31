{
  const fieldset = document.querySelector('fieldset')
  const canvas = document.querySelector('canvas')
  const context = canvas.getContext('2d')

  const templateImage = new Image()
  templateImage.src = 'template.webp'
  const fontFamily = 'Arial'
  let renderTimeout

  fieldset.addEventListener('input', () => {
    clearTimeout(renderTimeout)
    renderTimeout = setTimeout(renderCanvas, 300)
  })

  document.querySelector('button').addEventListener('click', () => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'image.png'
      a.click()
      URL.revokeObjectURL(url)
    })
  })

  renderCanvas()

  /* Rendering */

  function renderCanvas() {
    const textMap = [...fieldset.elements]
      .filter((control) => control instanceof HTMLInputElement)
      .reduce((map, control) => {
        map.set(control.name, control.value)
        return map
      }, new Map())

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(templateImage, 0, 0)

    context.textAlign = 'center'
    context.fillStyle = '#12b7ed'
    context.lineWidth = 4
    context.lineJoin = 'round'

    context.font = `500 50px ${fontFamily}`
    drawOutlinedText(textMap.get('title-top'), 229, 111)
    
    context.font = `900 78px ${fontFamily}`
    context.fillStyle = '#fbeb2a'
    context.letterSpacing = '-4px'
    drawOutlinedText(textMap.get('title-bottom'), 246, 185, 280)
    context.letterSpacing = '0px'

    context.font = `400 18px ${fontFamily}`
    context.fillStyle = '#fff'
    drawMultiLineText(textMap.get('bubble-0'), 138, 234, 18)

    drawRotatedText(textMap.get('bubble-1'), 108, 470, 7)
    drawRotatedText(textMap.get('bubble-2'), 350, 357.5, 9)
    
    context.font = `500 15px ${fontFamily}`
    context.fillStyle = '#000'
    
    drawRotatedText(textMap.get('hand'), 290, 230, -4)
    context.fillText(textMap.get('footer'), 225, 500)
  }

  function drawOutlinedText(...args) {
    context.strokeText(...args)
    context.fillText(...args)
  }

  function drawRotatedText(text, x, y, angle) {
    context.save()
    context.translate(x, y)
    context.rotate(angle * (Math.PI / 180))
    context.fillText(text, 0, 0)
    context.restore()
  }

  function drawMultiLineText(text, x, y, lineHeight) {
    const lines = text.split('\\n')
    let currY = y - lineHeight * lines.length / 2

    for (const line of lines) {
      context.fillText(line, x, currY)
      currY += lineHeight
    }
  }
}