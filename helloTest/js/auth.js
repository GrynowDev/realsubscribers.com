// const dbRef = firebase.database().ref();
// const usersRef = dbRef.child('users');
const name = document.getElementById("name");
const channelName = document.getElementById("channelName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const country = document.getElementById("country");
const countryCode = document.getElementById("countryCode");
const channelLink = document.getElementById("ytChannelLink");
let uid = "";

function registerUser() {
    console.log("register user called");
    const userDetails = {};
    userDetails.name = name.value;
    userDetails.email = email.value;
    userDetails.password = password.value;
    userDetails.phone = phone.value
    userDetails.channelName = channelName.value;
    userDetails.channelLink = channelLink.value;
    userDetails.buyYoutubeSub = false;
    userDetails.videoEditingService = false;
    userDetails.videoEditingSession = false;
    userDetails.monetizationSession = false;
    userDetails.monetizationService = false
    userDetails.country = country.value;

    DoesUserExists(userDetails);
}


const DoesUserExists = (user) => {
    console.log("user ", !user.email);
    if (!user.email || !user.password || !user.phone || !user.name || !user.country || !user.channelName || !user.channelLink) {
        alert("Please fill all fields carefully!");
        return;
    }
    $(".signup-btn").prop("disabled", true);
    $(".signup-btn").html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
    );
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((userResult) => {
        resetSpinner();
        firebase.auth().currentUser.sendEmailVerification();
        uid = userResult.user.uid;
        return userResult.user.updateProfile({
            displayName: user.name
        }).then(async (res) => {
            let dbRef = "";
            console.log("userResult ", uid);
            dbRef = firebase.database().ref('users/' + uid);
            console.log('user details ', user);
            await dbRef.set(user);
            // var currentUser = firebase.auth().currentUser;
            // currentUser.sendEmailVerification();
            // resetForm();
            alert("User Registered Successfully!");
            window.location.reload();

        }, (err) => {
            // resetForm();
            alert("User Already Exists!");
            window.location.reload();
        });
    }, (err) => {
        console.log("err ", err);
        alert("Registration failed, please try again later.");
        window.location.reload();
    });
}

const loginUser = () => {
    $(".signin-btn").prop("disabled", true);
    $(".signin-btn").html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
    );
    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;
    const navigatedFrom = localStorage.getItem("navigatedFrom");
    console.log("email ", email);
    console.log("password ", password);
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(user => {
            firebase.auth().onAuthStateChanged(async (user) => {
                console.log("user response in login email verification ", user.displayName);
                localStorage.setItem("username", user.displayName)
                if (!user.emailVerified) {
                    alert("Please verify email first to login!!");
                    window.location.reload();
                    return;
                }
                if (user) {
                    alert("Login successful");
                }
                const ref = firebase.database().ref('users/' + user.uid);
                let userData = {};
                await ref.once('value',  snap => {
                userData = snap.val();
                });
                userData.uid = user.uid;
                if (navigatedFrom === "buy-youtube-sub") {
                    if (!userData.buyYoutubeSub) {
                    sendInfoMail(navigatedFrom,userData)
                    return
                    }
                    // sendInfoMail("",user.uid)
                    window.location.href = "/make-payment.html";
                } else if (navigatedFrom === "home-auth") {
                    window.location.href = "/";
                } else if (navigatedFrom === "youtube-technical-audit-session") {
                    window.location.href = "../thank-you-audit-session.html";
                } else if (navigatedFrom === "youtube-technical-audit-service") {
                    window.location.href = "../thank-you-audit-service.html";
                } else if (navigatedFrom === "youtube-video-seo-session") {
                    window.location.href = "../thank-you-video-seo-session.html";
                } else if (navigatedFrom === "youtube-video-seo-service") {
                    window.location.href = "../thank-you-video-seo-service.html";
                } else if (navigatedFrom === "youtube-monetization-service") {
                    if (!userData.monetizationService) {
                        sendInfoMail(navigatedFrom,userData)
                        return
                        }
                    window.location.href = "../youtube-consulting-services/youtube-monetization-service-package.html";
                } else if (navigatedFrom === "youtube-monetization-session") {
                    if (!userData.monetizationSession) {
                        sendInfoMail(navigatedFrom,userData)
                        return
                        }
                    window.location.href = "../youtube-consulting-sessions/monetization-session-package.html";
                } if (navigatedFrom === "why-youtubers-should-not-buy-youtube-subscribers" || navigatedFrom === "video-content-marketing" || navigatedFrom === "top-youtube-vloggers-usa" || navigatedFrom === "increase-subscribers-organically" || navigatedFrom === "how-to-rank-youtube-videos" || navigatedFrom === "how-to-improve-youtube-videos-organic-reach" || navigatedFrom === "how-to-get-more-youtube-subscribers" || navigatedFrom === "grow-fashion-youtube-channel") {
                    window.location.href = "/youtube-consulting-services/youtube-video-seo-service.html";     
                 } else if (navigatedFrom === "youtube-channel-monetization-requirements" || navigatedFrom === "how-travel-youtubers-make-money") {
                 window.location.href = "/youtube-consulting-services/youtube-monetization-service.html";  
                 } else if (navigatedFrom === "youtube-stats" ) {
                 window.location.href = "/youtube-consulting-sessions/youtube-video-seo-session.html";  
                 } else if (navigatedFrom === "youtube-channel-monetization-requirements" || navigatedFrom === "how-tech-youtubers-make-money" || navigatedFrom === "how-comedy-youtubers-can-make-money" || navigatedFrom === "how-beauty-youtubers-make-money" || navigatedFrom === "grow-lifestyle-youtube-channel") {
                     window.location.href = "/youtube-consulting-services/youtube-monetization-service.html";
                 } else if (navigatedFrom === "top-prank-youtubers-usa") {
                     window.location.href = "/youtube-consulting-sessions/youtube-video-editing-session.html";   
                 } else if (navigatedFrom === "top-lifestyle-youtubers-usa" || navigatedFrom === "top-fitness-youtubers-usa" || navigatedFrom === "top-beauty-youtube-channels-usa" || navigatedFrom === "how-can-investment-youtubers-make-money" || navigatedFrom === "grow-travel-youtube-channel" || navigatedFrom === "grow-tech-youtube-channel" || navigatedFrom === "grow-food-youtube-channel" || navigatedFrom === "grow-beauty-youtube-channel" || navigatedFrom === "10-tips-grow-automobile-youtube-channel") {
                     window.location.href = "/youtube-consulting-services/youtube-video-editing-service.html";   
                 } else if (navigatedFrom === "how-youtubers-can-grow-youtube-channel" || navigatedFrom === "how-to-get-more-youtube-views" || navigatedFrom === "how-to-build-youtube-audience") {
                     window.location.href = "/youtube-consulting-services/youtube-video-editing-service.html";   
                 } else if (navigatedFrom === "how-prank-youtubers-can-make-money" || navigatedFrom === "how-can-investment-youtubers-make-money" || navigatedFrom === "how-comedy-youtubers-can-make-money" || navigatedFrom === "how-auto-youtubers-can-make-money") {
                     window.location.href = "/youtube-consulting-sessions/youtube-monetization-session.html";    
                 } else if (navigatedFrom === "youtube-video-editing-session") {
                    if (!userData.videoEditingSession) {
                        sendInfoMail(navigatedFrom,userData)
                        return
                        }
                    window.location.href = "../youtube-consulting-sessions/video-editing-session-package.html";    
                } else if (navigatedFrom === "youtube-video-editing-service-package") {
                    if (!userData.videoEditingService) {
                        sendInfoMail(navigatedFrom,userData)
                        return
                        }
                    window.location.href = "../youtube-consulting-services/video-editing-service-package.html";
                } else if (navigatedFrom === "buy-targeted-sub") {
                    window.location.href = "../thank-you-buy-targeted-subscribers.html";
                }    
            });
        }, (err) => {
            console.error("err ", err);
            alert("Login failed");
            window.location.reload();
        });
}

async function sendInfoMail(navigatedFrom, userData) {
    const apiUrl = "https://rs-server.onrender.com/v1/user/sendMailBeforePurchase";
    if (navigatedFrom === "buy-youtube-sub" && !userData.buyYoutubeSub) {
        userData.planSelected = "Buy Youtube Subscribers";
        axios.post(apiUrl, userData).then(async (response) => {
        if (response.data) {
            resetSpinner();
            const ref = firebase.database().ref(`users/${userData.uid}`);
            delete userData.uid;
            delete userData.planSelected;
            userData.buyYoutubeSub = true;
            await ref.update(userData);
            window.location.href = "/make-payment.html";
        } else {
            alert("Something went wrong. Please Try Again Later");
        }
    });
}
if (navigatedFrom === "youtube-video-editing-service-package" && !userData.videoEditingService) {
    userData.planSelected = "YouTube Video Editing Services";
    userData.planType = localStorage.getItem("videoEditingPlanType");
    axios.post(apiUrl, userData).then(async (response) => {
    if (response.data) {
        resetSpinner();
        const ref = firebase.database().ref(`users/${userData.uid}`);
        delete userData.uid;
        delete userData.planSelected;
        userData.videoEditingService = true;
        await ref.update(userData);
        window.location.href = "../youtube-consulting-services/video-editing-service-package.html";
    } else {
        alert("Something went wrong. Please Try Again Later");
    }
});
}
if (navigatedFrom === "youtube-video-editing-session" && !userData.videoEditingSession) {
    userData.planSelected = "YouTube Video Editing Session";
    axios.post(apiUrl, userData).then(async (response) => {
    if (response.data) {
        resetSpinner();
        const ref = firebase.database().ref(`users/${userData.uid}`);
        delete userData.uid;
        delete userData.planSelected;
        userData.videoEditingSession = true;
        await ref.update(userData);
        window.location.href = "../youtube-consulting-sessions/video-editing-session-package.html";    
    } else {
        alert("Something went wrong. Please Try Again Later");
    }
});
}
if (navigatedFrom === "youtube-monetization-session" && !userData.monetizationSession) {
    userData.planSelected = "YouTube Channel Monetization Session";
    axios.post(apiUrl, userData).then(async (response) => {
    if (response.data) {
        resetSpinner();
        const ref = firebase.database().ref(`users/${userData.uid}`);
        delete userData.uid;
        delete userData.planSelected;
        userData.monetizationSession = true;
        await ref.update(userData);
        window.location.href = "../youtube-consulting-sessions/monetization-session-package.html";
    } else {
        alert("Something went wrong. Please Try Again Later");
    }
});
}
if (navigatedFrom === "youtube-monetization-service" && !userData.monetizationService) {
    userData.planSelected = "YouTube Channel Monetization Service";
    axios.post(apiUrl, userData).then(async (response) => {
    if (response.data) {
        resetSpinner();
        const ref = firebase.database().ref(`users/${userData.uid}`);
        delete userData.uid;
        delete userData.planSelected;
        userData.monetizationService = true;
        await ref.update(userData);
        window.location.href = "../youtube-consulting-services/youtube-monetization-service-package.html";
    } else {
        alert("Something went wrong. Please Try Again Later");
    }
});
}
}


function logoutUser() {
    localStorage.setItem("user", null);
    localStorage.setItem("navigatedFrom", "home-auth");
}

function resetSpinner() {
    $("span.spinner-border").remove();
    $(".signup-btn").prop("disabled", false);
}
// function resetForm() {
//     name.value = ytChannelLink.value = phone.value = email.value = password.value = "";
// }