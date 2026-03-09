const loginUser = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("email ", email);
    console.log("password ", password);
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(user => {
            firebase.auth().onAuthStateChanged(user => {
                console.log("user response in login ", user);
                if (user) {
                    console.log(user.uid);
                    localStorage.setItem("user", user.uid);
                    alert("Login successful");
                    window.location.href = "plans.html";
                }
            });
        }, (err) => {
            console.error("err ", err);
            alert("Login failed");
        });
}

function logoutUser() {
    localStorage.setItem("user", null);
}

const forgetPassword = () => {
    const auth = firebase.auth();
    const email = document.getElementById("email").value;
    if (!email) {
        alert("Please enter valid email!");
        return;
    }
    auth.sendPasswordResetEmail(email).then(() => {
        alert("mail sended successfully!!!");
        console.log("mail sended successfully!!!");
    }).catch(() => {
        console.log("sending mail failed");
    });
}