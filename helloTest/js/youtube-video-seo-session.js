const getYoutubeVideoSeo = () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.location.href = "../thank-you-video-seo-session.html";
        } else {
          localStorage.setItem("navigatedFrom", "youtube-video-seo-session");
          window.location.href = "/auth.html";
        }
    });
}