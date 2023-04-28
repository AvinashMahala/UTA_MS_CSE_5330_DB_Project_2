Notes App Readme
This is a simple notes app built with React, Node.js, and MongoDB. Users can sign up, log in, create, edit, and delete notes. The app also includes a privacy policy page and a 404 not found page.

Installation
To install the app, follow these steps:

Clone the repository to your local machine.
Install the dependencies by running 
npm install
 in both the root directory and the 
client
 directory.
Create a 
.env
 file in the root directory and add the following variables:
Copy codeMONGODB_URI=<your MongoDB URI>
SESSION_SECRET=<a secret string for session management>
Start the app by running 
npm start
 in both the root directory and the 
client
 directory.
Usage
To use the app, open it in your browser at 
http://localhost:3000
. You can sign up for a new account, log in to an existing account, create, edit, and delete notes, and log out of your account.

Code Overview
The app is built with React on the front-end and Node.js and MongoDB on the back-end. The front-end code is located in the 
client
 directory, and the back-end code is located in the root directory.

The app uses the following libraries and frameworks:

React
React Router
Express
Mongoose
Passport
Bcrypt
Axios
The app is divided into the following components:

App
: The main component that renders the navigation bar and the page content.
NavBar
: The navigation bar component that displays links to the notes page, the privacy policy page, and the login and sign up modals.
NotesPage
: The notes page component that displays a list of notes and allows the user to create, edit, and delete notes.
Note
: The note component that displays a single note and allows the user to edit and delete it.
AddEditNoteDialog
: The add/edit note dialog component that allows the user to create a new note or edit an existing note.
LoginModal
: The login modal component that allows the user to log in to their account.
SignUpModal
: The sign up modal component that allows the user to create a new account.
PrivacyPage
: The privacy policy page component that displays the app's privacy policy.
NotFoundPage
: The 404 not found page component that displays an error message when the user navigates to a non-existent page.
The app also includes the following utility functions:

fetchData
: A function that sends HTTP requests to the back-end API and handles errors.
formatDate
: A function that formats a date string into a human-readable format.
assertIsDefined
: A function that checks if a value is defined and throws an error if it is not.