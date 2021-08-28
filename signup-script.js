// Fires on Submission of the Login Page
$("#signup-button").on('click', () => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((usr) => {
      console.log(usr);
      // // Signed in 
      // var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
})
