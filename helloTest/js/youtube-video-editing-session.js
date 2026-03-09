const getVideoEditingSession = () => {
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
        window.location.href = "../youtube-consulting-sessions/video-editing-session-package.html";
      } else {
        localStorage.setItem("navigatedFrom", "youtube-video-editing-session");
        window.location.href = "/auth.html";
      }
  });
}