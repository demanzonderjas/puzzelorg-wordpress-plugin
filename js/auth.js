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
        this.authButton = null
        this.authWrapper = document.getElementById("auth-wrapper");
        this.loader = document.getElementById("puzzelorg-loader");
        this.emailField = null
        this.passwordField = null
        this.puzzleContainer = document.getElementById("puzzle-container")
        this.apiKey = null
        this.authenticate = this.authenticate.bind(this);
        this.retrievePuzzles = this.retrievePuzzles.bind(this);
        this.createAuthForm = this.createAuthForm.bind(this);
        this.createRetrievePuzzleButton = this.createRetrievePuzzleButton.bind(this)

        this.API_URL = "http://localhost:3000/api/authenticate"
        this.puzzles = []
    }

    /*
     * Setup Firebase and check current authentication
    */
    init() {
        this.loader.classList.remove("hide");
        firebase.initializeApp({
            apiKey: env.firebase_api_key,
            authDomain: env.firebase_auth_domain,
            databaseURL: env.firebase_database_url,
            messagingSenderId: env.firebase_sender_id
        })

        firebase.auth().onAuthStateChanged((user) => {
            this.user = user || null
            this.loader.classList.add("hide");
            if(user) {
                console.log("user found :: ", user);
                this.createRetrievePuzzleButton();
            } else {
                console.log("no user found")
                this.createAuthForm()
            }
        })
    }

    /**
     * Create a button to retrieve the puzzles after being authenticated
     */
    createRetrievePuzzleButton() {
        this.authWrapper.innerHTML = "";
        
        const retrieveButton = document.createElement("button");
        retrieveButton.innerHTML = "Retrieve all puzzles";
        retrieveButton.addEventListener("click", this.retrievePuzzles);
        this.authWrapper.appendChild(retrieveButton);
    }

    /**
     * Create the auth form if the user is not authenticated already
     */
    createAuthForm() {
        this.emailField = document.createElement("input");
        this.emailField.setAttribute("type", "email");
        this.emailField.setAttribute("placeholder", "Puzzel.org email");

        this.passwordField = document.createElement("input");
        this.passwordField.setAttribute("type", "password");
        this.passwordField.setAttribute("placeholder", "Puzzel.org password");

        this.authButton = document.createElement("button");
        this.authButton.innerHTML = "Authenticate with Puzzel.org";
        this.authButton.addEventListener("click", this.authenticate);

        this.authWrapper.appendChild(this.emailField);
        this.authWrapper.appendChild(this.passwordField);
        this.authWrapper.appendChild(this.authButton);
    }

    /**
     * Convert the fetched puzzles to visible HTML fields
     */
    createPuzzleFields() {
        this.puzzleContainer.innerHTML = "";

        this.puzzles.forEach((puzzle, idx) => {
            const puzzleDiv = document.createElement("div");
            puzzleDiv.classList.add("puzzle");
            
            const input = document.createElement("input")
            input.setAttribute('name', `puzzelorg_options[${puzzle.key}][name]`)
            input.setAttribute('readonly', true);
            input.setAttribute('type', 'text');
            input.setAttribute('value', puzzle.name)

            const input2 = document.createElement("input")
            input2.setAttribute('name', `puzzelorg_options[${puzzle.key}][key]`)
            input2.setAttribute('type', 'hidden');
            input2.setAttribute('value', puzzle.key)

            const input3 = document.createElement("input")
            input3.setAttribute('name', `puzzelorg_options[${puzzle.key}][type]`)
            input3.setAttribute('type', 'hidden');
            input3.setAttribute('value', puzzle.puzzleType)

            puzzleDiv.appendChild(input)
            puzzleDiv.appendChild(input2)
            puzzleDiv.appendChild(input3)

            this.puzzleContainer.appendChild(puzzleDiv)
        })
    }

    /**
     * Retrieve the unique API token for the user
     */
    retrievePuzzles() {
        this.loader.classList.remove("hide");
        firebase.auth().currentUser.getIdToken(true).then((token) => {
            axios.post(this.API_URL, { token })
            .catch(() => {
                this.loader.classList.add("hide");
            })
            .then((res) => {
                this.puzzles = Object.keys(res.data.puzzles).map((key) => ({...res.data.puzzles[key], key}))
                this.createPuzzleFields()
                this.loader.classList.add("hide");
            })
          }).catch(function(error) {
            console.log("error")
            this.loader.classList.add("hide");
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
            this.loader.classList.add("hide");
        })
    }
}

const auth = new PuzzelAuth
auth.init()