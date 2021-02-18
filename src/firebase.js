import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyC0k7UBdQbV-pJqPmTMnfNU0M_ivjribrA",
    authDomain: "venomous-snake.firebaseapp.com",
    databaseURL: "https://venomous-snake.firebaseio.com",
    projectId: "venomous-snake",
    storageBucket: "venomous-snake.appspot.com",
    messagingSenderId: "1094881203944",
    appId: "1:1094881203944:web:8018eacb3cfd8155d8db5d",
    measurementId: "G-123G8PK575"
}

firebase.initializeApp(firebaseConfig)

export default firebase