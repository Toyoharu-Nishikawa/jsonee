import {view} from "./view.js"
import {parseParam, addParamToHash, removeParamFromHash} from "./hash.js"
"use strict"

export const model ={
  initialize: function(){
    const param = parseParam(location.hash.slice(1))
    if(param.has("viaserver")){
      const serverFlag = param.get("viaserver")
      const viaserver = view.elements.viaserver
      viaserver.checked = Boolean(parseInt(serverFlag))
    }
    const url = window.localStorage.getItem("jsoneeSendURL") ||""
    const urlInput = view.elements.urlInput
    urlInput.value =  url
  },
  resize:function(){
    const inputElem = view.elements.left
    const inputHeight = inputElem.clientHeight
    const input = view.elements.input 
    input.style.height = inputHeight- 70 + "px"

    const output = view.elements.right
    output.style.height = inputHeight- 70 + "px"
  },
  editor:{
    inputEditor:null,
    outputEditor:null,
    init:function(){
      const inputElem = view.elements.left
      const inputHeight = inputElem.clientHeight
      const input = view.elements.input 
      input.style.height = inputHeight- 70 + "px"
      const inputOptions = {
        modes:["text", "tree"]
      }
      const inputText = window.localStorage.getItem("jsoneeInputText") ||{}
      this.inputEditor = new JSONEditor(input, inputOptions)
      try{
        const input = JSON.parse(inputText)
        this.inputEditor.set(input)
      }
      catch(e){
        console.log("input text in localStorage is not type of json")
        window.localStorage.removeItem("jsoneeInputText")
        this.inputEditor.set({})
      }
  
      const outputElem = view.elements.right
      const output = view.elements.right
      const outputHeight = outputElem.clientHeight
      output.style.height = outputHeight- 70 + "px"
      const outputOptions = {
        modes:["text", "tree"]
      }
      this.outputEditor = new JSONEditor(output, outputOptions)
    },
  },
  viaserver:function(){
    const viaserver = view.elements.viaserver
    const serverFlag = viaserver.checked ? 1:0
    addParamToHash("viaserver",serverFlag)
  },
  readInput:function(){
    const element = view.elements.readInput
    const editor = model.editor.inputEditor
    editor.set("")
    const text = [];
    importFiles(element,text,()=>{
      editor.set(text[0].text);
    });
  },
  saveInput:function(){
    const editor = this.editor.inputEditor
    const string = JSON.stringify(editor.get());
    const blob = new Blob([string],{type:'text/plain;charset=utf-8;'}) 
    saveAs(blob, 'jsnoeeInput.json');
  },
  saveOutput:function(){
    const editor = this.editor.outputEditor
    const string = JSON.stringify(editor.get());
    const blob = new Blob([string],{type:'text/plain;charset=utf-8;'}) 
    saveAs(blob, 'jsnoeeOutput.json');
  },
  sendData:function(){
    const base = new URL("http://jsonee")
    const jsoneeServerURL = "/jsonee/node/server"
    const viaserver = view.elements.viaserver
    const serverFlag = viaserver.checked
    const urlInput = view.elements.urlInput
    const url = urlInput.value
    window.localStorage.setItem("jsoneeSendURL",url) 

    const jsoneeSendURL = serverFlag ? jsoneeServerURL:url 

    const inputEditor = this.editor.inputEditor
    const outputEditor = this.editor.outputEditor
    const text = inputEditor.get()
    const sendText = serverFlag ? Object.assign(text,{jsoneeSendURL:url}):text
    window.localStorage.setItem("jsoneeInputText",JSON.stringify(text)) 

    const data ={
      body: JSON.stringify(sendText),
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    }
    const send = async()=>{
      try{
        console.log(`send to ${new URL(url,base)}`)
        const response = await fetch(jsoneeSendURL,data)
        const st = response.status
        if(st!==200){
          throw new Error(`response status is ${st}`)
        }
        const json = await response.json()
        console.log(`recive from ${new URL(url,base)}`)
        outputEditor.set(json)
      }
      catch(e){
        console.log(e.message)
        const json = {
          error: e.message
        }
        console.log(`recive from ${new URL(url,base)}`)
        outputEditor.set(json)
      }
    }
    send()
  },
  keyDown: function(e){
    switch(e.keyCode){
      //keydown shift + Enter
      case 13:{ //key code 13: Enter
        if(e.shiftKey){
          e.preventDefault();
          //console.log("shift+Enter")
          model.sendData();
        }
        break;
      }
      default:{
        break;
      }
    }
  },
}
