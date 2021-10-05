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

    //fetches the data of the user like email, username, etc.
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          
          /*
            Paramters of projects:

            type Project = {
              name: string,
              version: vnim,
              files: File[],
              description: string
            }
          */
          
          //creates a table row with the data for the uploaded files
          data.projects.forEach(e => {
            const parent = document.createElement("tr");
            
            const child = document.createElement("div");
              child.innerHTML = e.name;
              parent.appendChild(child);

            $("#project-list").append(parent);
          });

          //currently working on forcing visual change to page when a project is added.
          //finished the login process

        } else {
          console.log("No such document!")
        }
      });

    
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

// Function called when 'create' button is pressed
const createProject = () => {
  const project_name = document.getElementById("projectName");
  const project_desc = document.getElementById("projectDesc");

  db.collection("users").doc(usr.user.uid).set({
    name: project_name,
    description: project_desc,
    files: [],
    version: (Math.random()*10000).toString(16)
  }).then(e => {
    window.location.href = `project.html?project=${e.data().id}`;
    console.log(e);
  });


  /**
   * Version Number: HEX16: abg7ac
   * Project Version History: [NEWEST.....abg7ac..OLDEST]
   */
}

//opens the modal when the button is clicked
const openModal = () => {
  //gets the modal
  var modal = document.getElementById("addRowModal")

  console.log(modal);
  modal.style.display = "flex";
}

//closes the modal when the span is clicked
const closeModal = () => {
  //gets the modal
  var modal = document.getElementById("addRowModal")

  modal.style.display = "none";
}

//closes the modal if the window outside the modal is clicked on
// window.onclick = function(event) {
//   if (event.target.id !== "addRowModal") {
//     closeModal();
//   }
// }