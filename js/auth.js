import firebase from 'firebase'
import env from './env'
import axios from 'axios'

/**
 * Class for registering a API relation with Puzzel.org 
 */
class PuzzelAuth {

    /**
     * Create new instance and setup listeners
     */
    constructor() {
        this.authButton = document.getElementById("puzzelorg-authenticate")
        this.emailField = document.getElementById("puzzelorg-email")
        this.passwordField = document.getElementById("puzzelorg-password")
        this.puzzleContainer = document.getElementById("puzzle-container")
        this.apiKey = null
        this.authenticate = this.authenticate.bind(this)

        this.authButton.addEventListener("click", this.authenticate)

        this.API_URL = "http://localhost:3000/api/authenticate"
        this.puzzles = []
    }

    /*
     * Setup Firebase and check current authentication
    */
    init() {
        firebase.initializeApp({
            apiKey: env.firebase_api_key,
            authDomain: env.firebase_auth_domain,
            databaseURL: env.firebase_database_url,
            messagingSenderId: env.firebase_sender_id
        })

        firebase.auth().onAuthStateChanged((user) => {
            this.user = user || null
            if(user) {
                this.retrieveToken()
            } else {
                console.log("no user found")
            }
        })
    }

    createPuzzleFields() {
        this.puzzles.forEach((puzzle, idx) => {
            const input = document.createElement("input")
            input.setAttribute('name', `puzzelorg_options[${puzzle.key}][name]`)
            input.setAttribute('value', puzzle.name)

            const input2 = document.createElement("input")
            input2.setAttribute('name', `puzzelorg_options[${puzzle.key}][key]`)
            input2.setAttribute('value', puzzle.key)

            this.puzzleContainer.appendChild(input)
            this.puzzleContainer.appendChild(input2)
        })
    }

    /**
     * Retrieve the unique API token for the user
     */
    retrieveToken() {
        console.log("retrieve token")
        firebase.auth().currentUser.getIdToken(true).then((token) => {
            // Send token to your backend via HTTPS
            console.log("gogogo")
            axios.post(this.API_URL, { token })
            .catch(console.error)
            .then((res) => {
                this.puzzles = Object.keys(res.data.puzzles).map((key) => ({...res.data.puzzles[key], key}))
                console.log(this.puzzles)
                this.createPuzzleFields()
            })
            // ...
          }).catch(function(error) {
            // Handle error
            console.log("error")
          })
    }

    /**  
     * Submit the authentication form via AJAX to Puzzel.org
     * @param {Event} e 
     */  
    authenticate(e) { 
        e.preventDefault()
        const email = this.emailField.value
        const password = this.passwordField.value

        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code
            var errorMessage = error.message
            // ...
            console.log(errorMessage)
        })
    }
}

const auth = new PuzzelAuth
auth.init()