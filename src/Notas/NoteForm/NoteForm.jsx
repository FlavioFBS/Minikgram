import React, { Component } from 'react';
import './NoteForm.css';

class NoteForm extends Component{
  constructor(){
    super();
    this.state = {

    }
  }
  agregarNota = () => {
    //console.log("el input--->", this.textInput.value);
    //recibir el estado:
    this.props.addNote(this.textInput.value);
    this.textInput.value='';
    this.textInput.focus();
  }

  render() {
    return (
      <div className="NoteForm">
        <input type="text" placeholder="Escribe una nota" ref={input =>{this.textInput=input}}/>
        <button onClick={this.agregarNota}>Agregar Nota</button>
      </div>
    );
  }
}

export default NoteForm;
