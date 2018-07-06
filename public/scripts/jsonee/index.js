
export const jsonee = {
  initialize:function(){
    const inputElem = document.getElementById("left")
    const inputHeight = inputElem.clientHeight
    const input = document.getElementById("input")
    input.style.height = inputHeight- 70 + "px"
    const inputOptions = {
      mode:"text"
    }
    const inputEditor = new JSONEditor(input, inputOptions)

    const json ={
      a: [1,2,3],
      flag: true,
      obj: {
        c:2,
        b:3
      }
    }
    
    inputEditor.set(json)
    const j = inputEditor.get()
    const outputElem = document.getElementById("right")
    const output = document.getElementById("output")
    const outputHeight = outputElem.clientHeight
    output.style.height = outputHeight- 70 + "px"
    const outputOptions = {
      mode:"text"
    }
    const outputEditor = new JSONEditor(output, outputOptions)
    console.log(j)
  }
}
