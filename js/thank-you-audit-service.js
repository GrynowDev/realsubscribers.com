// const apiUrl = "http://localhost:3000/v1/user/sendMailWithoutPurchase";
const apiUrl = "https://real-subscribers-server.onrender.com/v1/user/sendMailWithoutPurchase";

const sendMailToGetService = async() => {
    var isMailSent = localStorage.getItem("audit-service-mail-sended");
    if (isMailSent) {
        $(".loader-wrapper").css("display", "none");
        return;
    }
    console.log('sendMailToGetService');
    let userData = {}
    await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('user ', user);
            userData.email = user.email;
            userData.name = user.displayName;
            userData.planSelected = "YouTube Channel Technical Audit Service";
            axios.post(apiUrl, userData).then(async(response) => {
                if (response.data) {
                    $(".loader-wrapper").css("display", "none");
                    localStorage.setItem("navigatedFrom", "home-auth");
                    alert("Mail sent successfully");
                    localStorage.setItem("audit-service-mail-sended", true);
                    // window.location.href = "/"
                } else {
                    alert("Something went wrong. Please Try Again Later");
                    window.location.href = "/"
                }
            });
        } else {
            $(".loader-wrapper").css("display", "none");
            alert("Login Failed!!");
            window.location.href = "/auth.html";
        }
    })
}
history.pushState(null, null, location.href);
window.onpopstate = function() {
    history.go(1);
}

const resetMailStatus = (requestedFrom) => {
    localStorage.removeItem("audit-service-mail-sended");
    if (requestedFrom === 'home') {
        window.location.href = '/'
        return;
    }
    window.location.href = '/contact-us.html'
}
sendMailToGetService();