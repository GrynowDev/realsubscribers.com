const getYoutubeVideoSeo = () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.location.href = "../thank-you-video-seo-service.html";
        } else {
          localStorage.setItem("navigatedFrom", "youtube-video-seo-service");
          window.location.href = "/auth.html";
        }
    });
}