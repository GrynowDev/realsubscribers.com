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