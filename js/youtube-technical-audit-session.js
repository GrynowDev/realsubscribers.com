const getTechnicalAuditSession = () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.location.href = "../thank-you-audit-session.html";
        } else {
          localStorage.setItem("navigatedFrom", "youtube-technical-audit-session");
          window.location.href = "/auth.html";
        }
    });
}