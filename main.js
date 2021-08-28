firebase.initializeApp({
  apiKey: "AIzaSyBLyoJRTTv3EaEZPBMIs__ZK4osNCAUGL8",
  authDomain: "projectbase-67ef9.firebaseapp.com",
  projectId: "projectbase-67ef9"
});

const db = firebase.firestore();
  
firebase.auth().onAuthStateChanged((user) => {
  if (user) { 
    // console.log(e);
    // window.location.href = "mainpage.html";
    // On mainpage, user is logged in.

    console.log(user.uid);

    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
        } else {
          console.log("No such document!")
        }
      });

    // $("#project-list").appendChild();
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
  Input form validation, to ensure we dont send any invalid information to firebase, and alert the user accordingly.
*/

const signup = () => {
  const email = $("#signup-email").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((usr) => {
      db.collection("users").doc(usr.user.uid).set({
        username: username,
        email: email,
        projects: []
      }).then(e => {
        window.location.href = "mainpage.html";
        console.log(e);
      })

      return usr.user.updateProfile({
        displayName: username
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