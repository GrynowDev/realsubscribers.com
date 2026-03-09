const getYoutubeMonetization = () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.location.href = "../youtube-consulting-services/youtube-monetization-service-package.html";
        } else {
          localStorage.setItem("navigatedFrom", "youtube-monetization-service");
          window.location.href = "/auth.html";
        }
    });
}