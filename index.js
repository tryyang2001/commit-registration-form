import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import {
  getDatabase,
  ref as refdb,
  set,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";
import {
  getStorage,
  ref as refimg,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js";

const btnLogout = document.querySelector(".btn-logout");
if (btnLogout) {
  btnLogout.addEventListener("click", function () {
    localStorage.removeItem("userInfo");
    location.href = "./index.html";
  });
}

//set up firebase
const firebaseConfig = {
  apiKey: "AIzaSyA12ydb1LiSfyKE1nqv2prsWQBxMFgrTMs",
  authDomain: "commit-registration-form.firebaseapp.com",
  projectId: "commit-registration-form",
  storageBucket: "commit-registration-form.appspot.com",
  messagingSenderId: "184301489515",
  appId: "1:184301489515:web:cab74235da62ac2f6a102e",
  measurementId: "G-830FZSJQDV",
  databaseURL:
    "https://commit-registration-form-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const firebase = initializeApp(firebaseConfig);
var database = getDatabase(firebase);

function uploadImage(filename, image) {
  const storage = getStorage();
  const storageRef = refimg(storage, filename);
  //var metadata =;
  return uploadBytes(storageRef, image);
}

const regForm = document.querySelector(".reg-form");
if (regForm) {
  let newUser = {};
  regForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const image = document.getElementById("photo").files[0];
    const id = document
      .getElementById("email")
      .value.toString()
      .replace("@", "|")
      .replaceAll(".", "|");
    const filename = document.getElementById("photo").value;

    //async
    uploadImage(id + ".jpg", image).then((e) => {
      newUser = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        dob: document.getElementById("dob").value,
      };
      get(child(refdb(database), "users/" + id))
        .then((snapshot) => {
          if (snapshot.exists()) {
            alert("This email has been used, please try another one");
            console.log("You cannot use this identity to register an account!");
          } else {
            set(refdb(database, `users/${id}`), newUser);
            console.log(newUser);
            console.log("Database is updated successfully.");
            alert("Account registers successfully! Please proceed to log in.");
            location.href = "./index.html";
          }
        })
        .catch((error) => {
          console.log("Error detected!");
          console.error(error);
        });
    });
  });
}

let currUserInfo = {};
const loginForm = document.querySelector(".form-login");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
    const id = user.email.toString().replace("@", "|").replaceAll(".", "|");
    get(child(refdb(database), `users/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          //the user exists
          if (
            snapshot.val().email == user.email &&
            snapshot.val().password == user.password
          ) {
            //authentication succeeds
            const info = snapshot.val();
            localStorage.setItem("userInfo", JSON.stringify(info));
            alert("Welcome, user!");
            location.href = "./home.html";
          } else {
            alert("The password is not correct! Please try again");
            console.log("The password is not correct!");
            console.log(snapshot.val());
          }
        } else {
          alert("The email is not correct, please try again!");
          console.log("The identity does not present!");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

const homepage = document.querySelector(".homepage");
if (homepage) {
  currUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  //localStorage.removeItem("userInfo");
  console.log(currUserInfo);
  const storage = getStorage();
  const id = currUserInfo.email
    .toString()
    .replace("@", "|")
    .replaceAll(".", "|");
  getDownloadURL(refimg(storage, id + ".jpg")).then((url) => {
    document.getElementById("profile").setAttribute("src", url);
  });
  document.getElementById("user-name").innerText = currUserInfo.name;
  document.getElementById("user-email").innerText = currUserInfo.email;
  document.getElementById("user-dob").innerText = currUserInfo.dob;
  homepage.addEventListener("close", function () {
    localStorage.removeItem("userInfo");
  });
}

// set(ref(database, "users/1"), {
//   username: "test_user",
//   email: "test@user.com",
//   img: "https://imgs.search.brave.com/uWySc1aj3JGNM8ymHEb8zjZMKRVBVQDG303z39YseLs/rs:fit:632:225:1/g:ce/aHR0cHM6Ly90c2U0/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5J/eDZYak1idUN2b3Ez/RVFOZ0pveUVRSGFG/aiZwaWQ9QXBp",
// });
// const userId = 1;
// get(child(refdb(database), `users/${userId}`))
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       console.log(snapshot.val());
//     } else {
//       console.log("No data available");
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });
