// const apiUrl = "http://localhost:3000/v1/user/sendMailWithoutPurchase";
const apiUrl = "https://real-subscribers-server.onrender.com/v1/user/sendMailWithoutPurchase";

const sendMailToGetService = async() => {
    var isMailSent = localStorage.getItem("youtube-channel-targeted-sub");
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
            userData.planSelected = "Buy Targeted YouTube Subscribers";
            axios.post(apiUrl, userData).then(async(response) => {
                if (response.data) {
                    $(".loader-wrapper").css("display", "none");
                    localStorage.setItem("navigatedFrom", "home-auth");
                    alert("Mail sent successfully");
                    localStorage.setItem("youtube-channel-targeted-sub", true);
                    // window.location.href = "/"
                } else {
                    alert("Something went wrong. Please Try Again Later");
                    window.location.href = "/"
                }
            });
        } else {
            alert("Login Failed!!");
            window.location.href = "/auth.html";
        }
    })
}

sendMailToGetService();