import React, { Component } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import AppChat from './Chat/AppChat';
import AppNotes from './Notas/AppNotes';
import firebaseConfig from './config/config';
import firebase from 'firebase';

class App extends Component {

  constructor () {
    super();
    this.state = {
      user: null,
      pictures: [],
      notes: []
    }

    // uso DB: la info que se guarde estará en una coleccion llamada 'notes
    this.db = firebaseConfig.database().ref(); //.child('notes');
    //referencia a coleccion de notas
    this.dbNotas = this.db.child('notes');

   // this.app = firebase.initializeApp(DB_config);
  }

  handleAuth = () => {
    // crear proveeder de google
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log("en handleAuth\n");
    console.log(this.dbNotas);
    firebase.auth().signInWithPopup(provider)
      .then( result => console.log(`${result.user.email}---- iniciado sesion`))
      .catch(error => console.log(`Error: ${error.code}: ${error.message}`));
  }

  handleLogout = () => {
    firebase.auth().signOut()
      .then( result => console.log(`${result.user.email}---- ha salido`))
      .catch(error => console.log(`Error: ${error.code}: ${error.message}`));
  }

  handleUpload = (event) => {
    const file = event.target.files[0]; // obtener el archivo seleccionado
    // definir referencia al Storage de Firebase:
    let ruta = '/fotos';
    const storegeRef = firebase.storage().ref(`${ruta}/${file.name}`);
    // subir:
    const task = storegeRef.put(file);

    //para la barra de progreso: el estado de cambio y snapshot para saber cuánto cambia ese progreso
    task.on('state_changed', snapshot => {
      let progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: progreso
      })
    }, error => {
      console.log(`Error: ${error.message}`);
    }, () => {
      // objeto a almacenar enla BBDD
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };
      // almacenar en BBDD:
      const dbRef = firebase.database().ref('pictures');
      // para añadir la nueva image:
      const newPicture = dbRef.push();
      newPicture.set(record);

      /*
      // en caso ya se haya subido la imagen:5
      storegeRef.getDownloadURL().then(url => {
        this.setState({
          uploadValue: 100,
          picture: url
        })
      })
      */   
    });
  }

  // elemento de ciclo de vida: se dispara cuando un componente se renderiza
  componentWillMount () {
    firebase.auth().onAuthStateChanged(usuario => {
      this.setState({
        user: usuario
      });
    });

    //listener para la BBDD:

    // para app de imagenes:
    //para cada vez que en pictures se añana un hijo(child_added)
    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });

    // para el app de notas:
    // traer las notas del estado
    const {notes} = this.state;
    // cargar info en state: evento para agregar, snapshot(conjunto de datos actualizados)
    this.dbNotas.on('child_added', snapshot => {
      alert("nota agregada!!");
       //insertar datos en notes:
       notes.push({
         noteID: snapshot.key,
         noteContent: snapshot.val().noteContent
       })
       // actualizar data:
       this.setState({notes});
    });

    this.dbNotas.on('child_removed', snapshot => {
      alert("nota agregada!!");
      for(let i =0; i<notes.length; i++){
        if(notes[i].noteID === snapshot.key) {
          notes.splice(i, 1); // remover el indice
        }
      }
      this.setState({notes});
    })

    // para app de chat:

  }

  renderLoginButton = () => {
    // si se logeo:
    if(this.state.user){
      return (
        <div>
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola {this.state.user.displayName}</p>
          <button onClick={this.handleLogout}>Salir</button>
          <FileUpload onUpload={this.handleUpload}/>

          {
            this.state.pictures.map( picture =>(
              <div>
                <img src={picture.image} alt=""/>
                <br/>
                <img src={picture.photoURL} alt={picture.displayName}/>
                <br/>
                <span>{picture.displayName}</span>
              </div>
            )).reverse()
          }
        </div>
      )
    } else {
      return (<button onClick={this.handleAuth}>Ingresar con Google</button>)
    }

    
  }

  // funciones para AppNotas:
  addNote = (nota) => {
    this.dbNotas.push().set({noteContent: nota})
  }

  removerNota = (id) => {
    this.dbNotas.child(id).remove();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>MiniKgram</h2>
        </div>
        <div className="App-intro">
          {this.renderLoginButton()}
        </div>
        <div className="appNotas">
            <AppNotes AppNotas={this.state.notes} agregarNota={this.addNote} quitarNota={this.removerNota}/>
          </div>
          <div className="appChat">
            <AppChat />
          </div>
      </div>
    );
  }
}

export default App;
