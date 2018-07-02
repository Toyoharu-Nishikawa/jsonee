
export const jsonee = {
  initialize:function(){
    const container = document.getElementById("jsoneditor")
    const options = {
      mode:"text"
    }
    const editor = new JSONEditor(container, options)

    const json ={
      a: [1,2,3],
      flag: true,
      obj: {
        c:2,
        b:3
      }
    }
    
    editor.set(json)
    const j = editor.get()
    console.log(j)
  }
}
