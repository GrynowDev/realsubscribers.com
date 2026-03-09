function getTargetedSub() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.location.href = "../thank-you-buy-targeted-subscribers.html";
        } else {
          localStorage.setItem("navigatedFrom", "buy-targeted-sub");
          window.location.href = "/auth.html";
        }
    });
}