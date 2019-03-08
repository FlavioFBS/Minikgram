import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyDyA0cPi-k0YUt24OFCiAVzwaHa38MDbZE",
    authDomain: "pseudogram-408a4.firebaseapp.com",
    databaseURL: "https://pseudogram-408a4.firebaseio.com",
    projectId: "pseudogram-408a4",
    storageBucket: "pseudogram-408a4.appspot.com",
    messagingSenderId: "332596677592"
}


export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
