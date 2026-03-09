$('#targeted').hide();

// const sendQueryToServer = async (formType) => {
//     const form = $(".rs-contact-form");
//     let subType = "";
//     console.log("form ", form[0].checkValidity());

//     if (form[0].checkValidity() === false) {
//         event.preventDefault()
//         event.stopPropagation()
//         form.addClass('was-validated');
//         return;
//     }

//     if (formType === "buy youtube subscribers") {
//         subType = document.getElementById("subType").value
//     }

//     const userData = initVariables(formType);
//     $(".submit-btn").prop("disabled", true);
//     $(".submit-btn").html(
//         `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
//     );
//     const apiUrl = "https://rs-server.onrender.com/v1/user/contactUs";
//     // const apiUrl = "http://localhost:3000/v1/user/contactUs";
//         console.log("user data ", userData);
//     axios.post(apiUrl, userData).then(async (response) => {
//         if (response.data) {
//             if (subType === "general") {
//                 localStorage.setItem('userData', JSON.stringify(userData));
//                 await resetForm();
//                 window.location = "/make-payement.html";
//                 return;
//             }
//             window.location = "../thank-you.html"
//             return
//         } else {
//             alert("Something went wrong. Please Try Again Later");
//             resetLoader(formType)
//         }
//     }, (err) => {
//         console.log("something went wrong. Please Try Again", err);
//         alert("Something went wrong. Please Try Again Later");
//         resetLoader(formType)
//     });
// }

const resetLoader = (formType) => {
    console.log("formType ", formType);
    if (formType === "buy youtube subscribers") {
        $(".submit-btn").html("Buy Youtube Subscribers")
    } else if (formType === "contact us") {
        $(".submit-btn").html("Send Query")
    } else {
        $(".submit-btn").html("Get a callback from Youtube consultant")
    }
    $("span.spinner-border").remove();
    $(".submit-btn").prop("disabled", false);
}

const initVariables = (formType) => {

    const userData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        country: document.getElementById("country").value,
        countryCode: document.getElementById("countryCode").value,
        message: document.getElementById("message").value,
        mailSubject: "Youtube Consultation Query"
    };
    formType === "youtube consulting" ?
        (localStorage.setItem('formType', 'youtube-consulting'), userData.ytl = document.getElementById("ytl").value) : "";

    formType === "buy youtube subscribers" ?
        (
            userData.subType = document.getElementById("subType").value,
            userData.ytl = document.getElementById("ytl").value,
            localStorage.setItem('formType', 'buy-youtube-subscribers'),
            userData.mailSubject = "Buy Youtube Subscribers Query") : "";


    formType === "youtube-channel-technical-audit" ?
        (userData.ytl = document.getElementById("ytl").value, localStorage.setItem('formType', 'youtube-technical-audit'), userData.mailSubject = "Youtube channel Technical Audit Services Query") : "";

    formType === "youtube-video-seo-services" ?
        (userData.ytl = document.getElementById("ytl").value, localStorage.setItem('formType', 'youtube-video-seo'), userData.mailSubject = "Youtube Video SEO Services Query") : "";

    formType === "video editing services" ?
        (userData.ytl = document.getElementById("ytl").value, localStorage.setItem('formType', 'youtube-video-editing'), userData.mailSubject = "Youtube Videos Editing Services Query") : "";

    formType === "contact us" ?
        (localStorage.setItem('formType', 'contact-us'), userData.mailSubject = "Contact Us Query") : "";
            
    return userData;
}

const updateInfoTitle = () => {
    let info = document.getElementById("info-title");
    const subType = document.getElementById("subType").value;

    if (subType === "general") {
        $('#targeted').hide();
        $('#general').show();
        info.title =
            "These are the real living people who are active on Youtube and engage (share, comment, like) on various niches rather than your particular niche."
    } else if (subType === "targeted") {
        $('#general').hide();
        $('#targeted').show();
        info.title =
            "These are real living people who are similar (like minded) to the subscribers your Youtube channel currently has. These are highly engaging on niches similar to your channel"
    } else {
        info.title = "Please select the subscriber type"
    }
}

const populateCountry = () => {
    $.getJSON("/data/countries.json", function(countries) {
        const country = document.getElementById("country"); 
    for (let i = 0; i < countries.length; i++) {
     country.options[country.options.length] = new Option(countries[i].name, countries[i].name);
    }
    })
    
}

const populateCountryCodeByCountry = () => {
    const selectedCountry = document.getElementById("country").value;
    const countryCode = document.getElementById("countryCode");
    $.getJSON("../data/countries.json", function(countries) {
        countries.map((country) => {
            if (selectedCountry === country.name) {
                countryCode.value = country.dial_code
            }    
        })
    })
}

const resetForm = () => {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("message").value = "";
    document.getElementById("ytl").value = "";
    $("#subType").prop('selectedIndex', 0)
    $("#rys").prop('selectedIndex', 0)
}

populateCountry();