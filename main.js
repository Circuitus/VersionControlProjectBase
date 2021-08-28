firebase.initializeApp({
  apiKey: "AIzaSyBLyoJRTTv3EaEZPBMIs__ZK4osNCAUGL8",
  authDomain: "projectbase-67ef9.firebaseapp.com",
  projectId: "projectbase-67ef9"
});

const db = firebase.firestore();

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

const signup = () => {
  const email = $("#signup-email").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((usr) => {
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