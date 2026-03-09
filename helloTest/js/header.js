// if ("import" in document.createElement("link")) {
//     var doc = document.querySelector('link[href="components/header.html"]').import;
//     console.log("doc ", doc);
//     var text = doc.querySelector('.rs-header');
//     document.body.appendChild(text.cloneNode(true));
// }
const getUserInfo = async () => {
    const user = localStorage.getItem("username");  
    let auth = document.getElementById("auth-wrapper");  
    let username = document.getElementById("username-wrapper")
    auth.style.display = username.style.display = "none";
    console.log('get user info func called ', username);
    if (user === null || user === "") {
      auth.style.display = "block";
    } else {
      console.log('user ', user);
      document.getElementById('username').textContent = user;
      username.style.display = "block";
    }
    }

const redirectToLogin = async => {  
window.location.href = "/auth.html";
}  

const logoutUser = async => {
    firebase.auth().signOut().then(function() {
      console.log('User Logged Out!');
      localStorage.setItem("username", "");
      localStorage.setItem("user", "");
      localStorage.setItem("navigatedFrom", "home-auth");
      window.location.href = "/auth.html";
    }).catch(function(error) {
      console.log(error);
    });
  }
// getUserInfo();
