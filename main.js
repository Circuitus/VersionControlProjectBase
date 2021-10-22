firebase.initializeApp({
  apiKey: "AIzaSyBLyoJRTTv3EaEZPBMIs__ZK4osNCAUGL8",
  authDomain: "projectbase-67ef9.firebaseapp.com",
  projectId: "projectbase-67ef9",
  storageBucket: "projectbase-67ef9.appspot.com",
});
//the information needed to access the firebase.

const db = firebase.firestore();
//creating a database (db) for firebase

//verifying in firebase that the user exists upon login, loading the function and
//fetching their data information once verified
firebase.auth().onAuthStateChanged((user) => {
  if (user) { 
    // console.log(e);
    // window.location.href = "mainpage.html";
    // On mainpage, user is logged in.

    console.log(user.uid);
    //logging the user's ID to the console for testing purposes.

    //fetches the data of the user like email, username, etc.
    //it is fetched from the firebase database called "users"
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        //if the user has documents and is still active:
        if (doc.exists) {
          const data = doc.data();

          console.log(data);
          //logging the data to the console for testing purposes
          /*
            What data should contain:

            Project = {
              name: string,
              ID: ,
              files: File[],
              description: string
            }
          */
          
          if(window.location.href.includes("mainpage")) renderProjectList()
          //if the user is on the main page, it runs the function that will load the user's
          //unique project list
        
        //if the user has no documents, nothing happens. Else there to finish if statement
        } else {
          console.log("No such document!")
          //logged to console for testing purposes.
        }
      });

    
  } else {
    console.log(window.location);
    //check window.location is not login / signup first
    //if it is, nothing will happen
    // Redirect away from page.
  }
});

//document is any webpage in the browser
//once document is loaded (ready) then the function becomes available for use
$(document).ready(function(){
    $('.header').height($(window).height());
})

//By adding callback, the function above waits for the ready state of the webpage to not be 
//loading before beginning. Or, if the DOMContentLoaded event (which happens once the page is
//completely loaded) occurs, the same thing happens.
var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}

/*
  Input form validation, to ensure we dont send any invalid information to firebase, and alert the user accordingly.
  Creates three constant variables (that don't change) that are the values contained within the
  <input>s of the signup page
*/

const signup = () => {
  const email = $("#signup-email").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
  //creates a user in the user database with the information contained in the constants.
    .then((usr) => {
      db.collection("users").doc(usr.user.uid).set({
        username: username,
        email: email,
        projects: []
      }).then(e => {
        window.location.href = "mainpage.html";
        console.log(e);
      })
      //after creating a user in the database, the user is redirected to the mainpage

      //adds the user's username into firebase as it isn't passed in on original user creation
      //(only email and password are)
      return usr.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => {
      console.error(error);
    });
    //if there is an error, nothing will happen
};

const login = () => {
  const email = $("#login-email").val();
  const password = $("#login-password").val();

  //checks to see if the username and password are in the firebase database and, if they are
  //it will log the user and redirect to the mainpage
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((usr) => {
      window.location.href = "mainpage.html";
    })
    .catch((error) => {
      console.error(error);
    });
    //if an error occurs, nothing happens
};

//the user is signed out and redirected to the index page
const logout = () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    console.error(error);
  });
  //errors are caught
}

//function is called when 'create' button is pressed
const createProject = () => {
  const project_name = document.getElementById("projectName");
  const project_desc = document.getElementById("projectDesc");
  //

  //autoID is the ID of the document that is assigned to the project in firebase
  const autoID = db.collection("projects").doc().id;

  db.collection("projects").doc(autoID).set({
    name: project_name.value,
    description: project_desc.value,
    files: [],
    version: Math.round((Math.random()*1000000)).toString(16)
    //random ID created (originally intended to be version number so named version)
    //version was not functionally viable, however, as too many things would have the same version
  }).then(e => {
    // User Document -> Update to add new project to project list, using the automatic id created for it.
    db.collection("users").doc(firebase.auth().currentUser.uid).update({
      projects: firebase.firestore.FieldValue.arrayUnion(autoID)
      //adds the project ID to the user's list of projects in the "users" database
    });

    console.log(`Created Document ${autoID}`);
    //logging the ID of the created document for testing purposes
    window.location.href = `project.html?p=${autoID}`;
    //auto redirects the user to that project's page so they can upload files
  });

  /**
   * ID Number: HEX16: abg7ac
   * Project Version History: [NEWEST.....abg7ac..OLDEST]
   */
}

//opens the modal when the button is clicked
const openModal = () => {
  //gets the modal
  const modal = document.getElementById("addRowModal")
  console.log(modal);
  //logging for testing purposes
  modal.style.display = "flex";
  //modal is displayed using flexbox
}

//closes the modal when the span (X) is clicked
const closeModal = () => {
  //gets the modal
  const modal = document.getElementById("addRowModal")

  modal.style.display = "none";
  //modal "disappears"
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
  commented out for failure
 */

const renderProjectList = () => {
  // Get All Projects under user, render list.
  const projectParent = document.getElementById("project-list");
  //project list is the "parent" in which elements will be created for project display

  db.collection("users").doc(firebase.auth().currentUser.uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        //logging all of their document data for testing

        const { projects } = doc.data();
        console.log("Itterating Over", projects);
        //logging 

        //e is shorthand for element
        //for every "element" in projects database (note: every project), the name, description, and version number will be displayed.
        doc.data().projects.forEach(e => {
          console.log(`Fetching Project ${e}`);

          db.collection("projects").doc(e)
          .get()
          .then(doc => {
            const data = doc.data();
            console.log(data);
            
            const parent = document.createElement("tr");
              parent.classList.add("table-row");
            //creating a table row for the project to be displayed in

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
            const version = document.createElement("p1");
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
  //stores the project URLs

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

          //will display file type e.g. .png, .txt, etc.
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

//allows users to click on the upload file box
const filePicker = () => {
  $("#files-input").click();
};

const dropFile = (evt) => {
  evt.preventDefault();

  //click on to upload files into
  $("#files-input").files = evt.dataTransfer.files;

  //Adds the uploaded files
  const dT = new DataTransfer();
  dT.items.add(evt.dataTransfer.files[0]);
  //dT.items.add(evt.dataTransfer.files[3]);
  $("#files-input").files = dT.files;
};

const deleteFile = (file) => {
  db.collection("projects")
    .doc(project.id)
    .update({
      files: firebase.firestore.FieldValue.arrayRemove(file)
      //removes the project from the id in the projects collection
    })
    .then(e => {
      //gets a reference for the file location in the firebase storage
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
    //upload the file to firestore
    //generates a random file ID
    const file_id = Math.round(Math.random() * 10000000).toString(16);
    const file_ref = storageRef.child(file_id);

    console.log("Uploading ", file, file_id);
    //logging for testing purposes

    file_ref
      .put(file)
      .then((snapshot) => {
        console.log(project)

        //copies Refrence ID to Firebase Database & saves
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

  //clears all files from input element after upload to prevent old uploads from being stored
  $("#files-input")[0].value = null;
};

