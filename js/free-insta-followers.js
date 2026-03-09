const apiUrl = "https://real-subscribers-server.onrender.com/";
// const apiUrl = "http://localhost:3000";
const user = {};
const addUser = () => {
    let name, value = ""
    const registerForm = document.getElementById("register-form");
    const inputs = registerForm.querySelectorAll(".form-control");

    for (var i = 0; i < inputs.length; i++) {
        if (!inputs[i].value) {
            toastr.info('Please fill all fields carefully');
            return;
        }
        name = inputs[i].attributes["name"].value;
        value = inputs[i].value
        user[name] = value;
        console.log("input name ", name);
        console.log("input ", value);
    }
    $(".buy-sub").prop("disabled", true);
    $(".buy-sub").html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
    );
    const userInfo = user;
    axios.post(apiUrl + '/user/freeInsta/add', userInfo).then((res) => {
        axios.post(apiUrl + '/user/sendFreeInstaLead', userInfo).then((res) => {
            resetSpinner();
            window.location = "../thank-you.html";
        }).catch((error) => {
            resetSpinner();
            toast.error("Something went wrong. Please Try Again Later");
        });
    }).catch((error) => {
        resetSpinner();
        toast.error("Something went wrong. Please Try Again Later");
    });
}

const populateCountry = () => {
    $.getJSON("../data/countries.json", function(countries) {
        const country = document.getElementById("country");
        for (let i = 0; i < countries.length; i++) {
            country.options[country.options.length] = new Option(countries[i].name, countries[i].name);
        }
    })

}

const populateCountryCodeByCountry = () => {
    console.log("func called");
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

$(window).scroll(function() {
    $('nav').toggleClass('changebgcolor', $(this).scrollTop() > 50);
});

$(document).ready(function() {
    // Add minus icon for collapse element which is open by default
    $(".collapse.show").each(function() {
        $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
    });

    // Toggle plus minus icon on show hide of collapse element
    $(".collapse").on('show.bs.collapse', function() {
        $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
    }).on('hide.bs.collapse', function() {
        $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
    });
});

function resetSpinner() {
    $("span.spinner-border").remove();
    $(".buy-sub").prop("disabled", false);
    $(".buy-sub").html('buy subscribers now');
}
populateCountry();