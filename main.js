firebase.initializeApp({
  apiKey: "AIzaSyBLyoJRTTv3EaEZPBMIs__ZK4osNCAUGL8",
  authDomain: "projectbase-67ef9.firebaseapp.com",
  projectId: "projectbase-67ef9",
  storageBucket: "projectbase-67ef9.appspot.com",
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

          console.log(data);
          
          /*
            Paramters of projects:

            type Project = {
              name: string,
              version: vnim,
              files: File[],
              description: string
            }
          */
          
          if(window.location.href.includes("mainpage")) renderProjectList()
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

  // gives local id to a project
  const autoID = db.collection("projects").doc().id;

  db.collection("projects").doc(autoID).set({
    name: project_name.value,
    description: project_desc.value,
    files: [],
    version: Math.round((Math.random()*1000000)).toString(16)
  }).then(e => {
    // User Document -> Update to add new project to project list, using the automatic id created for it.
    db.collection("users").doc(firebase.auth().currentUser.uid).update({
      projects: firebase.firestore.FieldValue.arrayUnion(autoID)
    });

    console.log(`Created Document ${autoID}`);
    window.location.href = `project.html?p=${autoID}`;
  });

  /**
   * Version Number: HEX16: abg7ac
   * Project Version History: [NEWEST.....abg7ac..OLDEST]
   */
}

//opens the modal when the button is clicked
const openModal = () => {
  //gets the modal
  const modal = document.getElementById("addRowModal")

  console.log(modal);
  modal.style.display = "flex";
}

//closes the modal when the span is clicked
const closeModal = () => {
  //gets the modal
  const modal = document.getElementById("addRowModal")

  modal.style.display = "none";
}

/*
  //creates a table row with the data for the uploaded files
  data.projects.forEach(e => {
    const parent = document.createElement("tr");
    
    const child = document.createElement("div");
      child.innerHTML = e.name;
      parent.appendChild(child);

    $("#project-list").append(parent);
  });
 */

const renderProjectList = () => {
  // Get All Projects under user, render list.
  const projectParent = document.getElementById("project-list");

  db.collection("users").doc(firebase.auth().currentUser.uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());

        const { projects } = doc.data();
        console.log("Itterating Over", projects);
        // projectParent.appendChild...

        doc.data().projects.forEach(e => {
          console.log(`Fetching Project ${e}`);

          db.collection("projects").doc(e)
          .get()
          .then(doc => {
            const data = doc.data();
            console.log(data);
            
            const parent = document.createElement("tr");
              parent.classList.add("table-row");

            // onclick will take the user to the page for the document
            const child = document.createElement("div");
              child.classList.add("rowElement");
              child.onclick = () => window.location.href = `project.html?p=${e}`;
            
            // will display project name
            const name = document.createElement("h4");
              name.innerHTML = data.name;
              child.appendChild(name);

            // will display project description
            const desc = document.createElement("p");
              desc.innerHTML = data.description;
              child.appendChild(desc);
            
            //will display version number
            const version = document.createElement("p");
              version.innerHTML = data.version;
              child.appendChild(version);

            parent.appendChild(child);
            document.getElementById("project-list").appendChild(parent);
          });
        });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

let project;

const loadProjects = () => {
  // Get Query Parameter for project and fetch.
  var param = [];
  new URLSearchParams(window.location.href).forEach(e => { param.push(e) });

  console.log(param);

  db.collection("projects").doc(param[0])
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        console.log(data);

        project = doc;
        const { files, name, description, version } = doc.data();
        console.log(files);

        // failure of Jquery use to display project page title as name
        document.getElementById("project-name").innerHTML = name;
        document.getElementById("project-desc").innerHTML = description;
        //success with vanilla js

        const filesParent = document.createElement('div');

        files.forEach(e => {
          const file = document.createElement('div');
            file.classList.add("rowElement");
          
          // will display project name
          const file_name = document.createElement("h4");
            file_name.innerHTML = e.name;
            file.appendChild(file_name);

          // will display project description
          const file_id = document.createElement("p");
            file_id.innerHTML = e.ref_id;
            file.appendChild(file_id);

          const file_type = document.createElement("p");
            file_type.innerHTML = e.type;
            file.appendChild(file_type);

          // <span class="close" onclick="closeModal()">&times;</span>
          const del_file = document.createElement("span");
            del_file.classList.add("close");
            del_file.innerHTML = "&times;";
            del_file.onclick = () => { deleteFile(e) }
            file.appendChild(del_file);

          filesParent.appendChild(file)
        });

        while(document.getElementById("files-list").firstChild) {
          document.getElementById("files-list").removeChild(document.getElementById("files-list").lastChild);
        }

        document.getElementById("files-list").appendChild(filesParent);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

//closes the modal if the window outside the modal is clicked on
// window.onclick = function(event) {
//   if (event.target.id !== "addRowModal") {
//     closeModal();
//   }
// }

const filePicker = () => {
  $("#files-input").click();
};

const dropFile = (evt) => {
  evt.preventDefault();

  // pretty simple -- but not for IE :(
  $("#files-input").files = evt.dataTransfer.files;

  // If you want to use some of the dropped files
  const dT = new DataTransfer();
  dT.items.add(evt.dataTransfer.files[0]);
  dT.items.add(evt.dataTransfer.files[3]);
  $("#files-input").files = dT.files;
};

const deleteFile = (file) => {
  db.collection("projects")
    .doc(project.id)
    .update({
      files: firebase.firestore.FieldValue.arrayRemove(file)
    })
    .then(e => {
      var storageRef = firebase.storage().ref().child(file.ref_id);

      // Delete the file
      storageRef.delete().then(() => {
        loadProjects();
      }).catch((error) => {
        console.error("In Uploading ", file, error);
      });
    });
}

const uploadFile = () => {
  const files = $("#files-input")[0].files;
  const storageRef = firebase.storage().ref();

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    // Upload the file to firestore
    const file_id = Math.round(Math.random() * 10000000).toString(16);
    const file_ref = storageRef.child(file_id);

    console.log("Uploading ", file, file_id);

    file_ref
      .put(file)
      .then((snapshot) => {
        console.log(project)

        // Copy Refrence ID to Firebase Database & Save
        db.collection("projects")
          .doc(project.id)
          .update({
            files: firebase.firestore.FieldValue.arrayUnion({
              name: file.name,
              ref_id: file_id,
              type: file.type,
              version: ''
            })
          })
          .then(e => loadProjects());
      });    
  }

  // Clear all files from input element after upload to prevent old uploads from being stored
  $("#files-input")[0].value = null;
};