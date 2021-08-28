firebase.initializeApp({
  apiKey: "AIzaSyBLyoJRTTv3EaEZPBMIs__ZK4osNCAUGL8",
  authDomain: "projectbase-67ef9.firebaseapp.com",
  projectId: "projectbase-67ef9"
});

const db = firebase.firestore();

// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
//   .then(() => {
//     // Existing and future Auth states are now persisted in the current
//     // session only. Closing the window would clear any existing state even
//     // if a user forgets to sign out.
//     // ...
//     // New sign-in will be persisted with session persistence.
//     return firebase.auth().signInWithEmailAndPassword(email, password);
//   })
//   .catch((error) => {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//   });
  
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
  } else {
    console.log(window.location);
    // check window.location !== login / signup first.
    // Redirect away from page.
  }
});

$(document).ready(function(){
    $('.header').height($(window).height());
})

var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => {
    document.querySelector(".header").style.height = window.innerHeight + "px";
});

/*
  If the user is on mainpage & they arent logged in, or there session has expired -> Redirect

  Input form validation, to ensure we dont send any invalid information to firebase, and alert the user accordingly.
*/

const signup = () => {
  const email = $("#signup-email").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((usr) => {
      return usr.user.updateProfile({
        displayName: username
      })

      db.collection("users").add({
        username: username,
        email: email,
        files: []
      }).then(e => {
        console.log(e);
        window.location.href = "mainpage.html";
      })
    })
    .catch((error) => {
      console.error(error);
    });
};

const login = () => {
  const email = $("#login-email").val();
  const password = $("#login-password").val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((usr) => {
      window.location.href = "mainpage.html";
    })
    .catch((error) => {
      console.error(error);
    });
};

const logout = () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    console.error(error);
  });
}