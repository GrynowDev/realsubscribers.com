const getYoutubeMonetization = () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.location.href = "../youtube-consulting-sessions/monetization-session-package.html";
        } else {
          localStorage.setItem("navigatedFrom", "youtube-monetization-session");
          window.location.href = "/auth.html";
        }
    });
}