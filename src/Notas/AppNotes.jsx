import React, { Component } from 'react';
import './AppNotes.css';
import Note from './Note/Notes';
import NoteForm from './NoteForm/NoteForm';
import {MDBContainer} from "mdbreact";

//import firebase from 'firebase';
//import { DB_config } from '../config/config';
import 'firebase/database';

class AppNotes extends Component {

  constructor(props){
    super();
    this.state = {
      notes: []
      /*[
        {noteID: 1, noteContent: 'nota 1'},
        {noteID: 2, noteContent: 'nota 2'},
        {noteID: 3, noteContent: 'nota 3'},
        
      ]*/
    };
    // inicializar el app-firebase
//    this.app = firebase.initializeApp(DB_config);
    // uso DB: la info que se guarde estará en una coleccion llamada 'notes
 //   this.db = this.app.database().ref().child('notes');

  }

  /*
  componentDidMount() {
    // traer las notas del estado
    const {notes} = this.state;
    // cargar info en state: evento para agregar, snapshot(conjunto de datos actualizados)
    this.db.on('child_added', snapshot => {
       //insertar datos en notes:
       notes.push({
         noteID: snapshot.key,
         noteContent: snapshot.val().noteContent
       })
       // actualizar data:
       this.setState({notes});
    });
  }
  */

  removeNote = () => {

  }

  addNota = (nota) => {
    /*let { notes } = this.state;
    notes.push({
      noteID: notes.length+1,
      noteContent: nota
    });
    // actualizar el estado:
    this.setState({
      notes
    });
    */
   //this.db.push().set({noteContent: nota});
  }

  render() {
    return (
      <div className="notesContainer">
        <div className="notesHeader">
          <h1>Notes-React-Firebase</h1>
        </div>
        <div className="notesBody">
          <ul>{
            // this.state.notes.map
            this.props.AppNotas.map( nota => {
              return (
                <Note 
                  noteContent={nota.noteContent}
                  noteID={nota.noteID}
                  key={nota.noteID}
                  removeNote={this.props.quitarNota}
                />
              )
            })
          }</ul>

        </div>
        <div className="footer-copyright text-center py-3 notesFooter">
          <MDBContainer fluid>
            <NoteForm addNote={this.props.agregarNota}/>
          </MDBContainer>
        </div>
      </div>
    );
  }
}

export default AppNotes;
