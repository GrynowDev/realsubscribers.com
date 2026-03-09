const getTechnicalAuditService = () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.location.href = "../thank-you-audit-service.html";
        } else {
          localStorage.setItem("navigatedFrom", "youtube-technical-audit-service");
          window.location.href = "/auth.html";
        }
    });
}