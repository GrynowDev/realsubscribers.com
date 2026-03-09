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




$('#overlay').hide();
const apiUrl = "https://real-subscribers-server.onrender.com/";
const serviceUrl = "/v1/user/sendPaymentMailForInstaLikes";
// const apiUrl = "http://localhost:3000";
let totalAmount = 5,
    isApplied = 0;
discount = 0;
let postLinks = [];
let deliveryDate = "1-2 weeks";
const user = {};
serviceName = "Buy Instagram Likes"
    // const toggleFaq = () => {
    // var btnText = document.getElementById("faq");

//   if (moreText.style.display === "none") {
//     moreText.style.display = "block";
//     btnText.innerHTML = "Less FAQ's";
//   } else {
//     btnText.innerHTML = "More FAQ's";
//     moreText.style.display = "none";
//   }
// }

const resetForm = () => {
    $('#register-form').trigger("reset");
}

const setUserData = (user) => {
    user.quantity = user.selectedLikes + " Likes"
    user.selectedLikes = user.selectedLikes
        // user.totalAmount = totalAmount;
    const adId = getParameterByName('gclid')
    user.adId = adId
        // user.discount = discount;
    user.discountApplied = isApplied
    user.serviceName = serviceName;
    user.serviceUrl = serviceUrl;
    // localStorage.setItem("user", JSON.stringify(user));
    const u = new URLSearchParams(user).toString();
    resetForm()
    window.location = `https://www.fidyu.co.in/make-payment.html?${u}`;
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$('#sub').change(
    function() {
        if ($(this).val() == 100) {
            deliveryDate = "1-2 weeks";
        } else if ($(this).val() == 200) {
            deliveryDate = "1-2 weeks";
        } else if ($(this).val() == 300) {
            deliveryDate = "1-2 weeks";
        } else if ($(this).val() == 500) {
            deliveryDate = "2-3 weeks"
        } else if ($(this).val() == 700) {
            deliveryDate = "3-4 weeks"
        } else if ($(this).val() == 1000) {
            deliveryDate = "1-2 months"
        }
        isApplied = 0;
        totalAmount = $(this).val() / 20;
        $("#price").html(totalAmount);
    });

function applyPromoCode() {
    const promoCode = "rs40";
    selectedSubWithDiscount = $("#sub").val();
    if (promoCode.toLowerCase() === "rs40" && isApplied === 0) {
        isApplied = 1;
        discount = totalAmount * 40 / 100
        totalAmount = (totalAmount - (totalAmount * 40 / 100));
        $("#price").html(totalAmount);
        toastr.success("Promo code applied successfully")
    } else if (isApplied === 1) {
        toastr.info("Promo code already applied");
    }
}


paypal.Buttons({
    createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
            purchase_units: [{
                amount: {
                    "currency_code": "USD",
                    "value": totalAmount.toString() + ".00"
                }
            }],
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        });
    },
    // Finalize the transaction
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            sendMailAfterPayment();
        });
    }
}).render('#paypal-button');

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
    }
    postLinks.push(user["instaPostLinkOne"]);
    user.postLinks = postLinks;
    user.totalAmount = totalAmount;
    user.deliveryDate = deliveryDate;
    $(".buy-sub").prop("disabled", true);
    $(".buy-sub").html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <strong class="redirect-payment">Redirecting to Payment...</strong>`
    );
    user.adId = getParameterByName('gclid')
    const userInfo = user;
    axios.post(apiUrl + '/user/instaLikes/add', userInfo).then((res) => {
        axios.post(apiUrl + '/user/instaLikes/sendInstaLikesLead', userInfo).then((res) => {
            console.log("user ", res);
            resetSpinner();
            setUserData(user);
        }).catch((error) => {
            resetSpinner();
            console.log("error while adding user in db ", error);
        });
    }).catch((error) => {
        resetSpinner();
        console.log("error while adding user in db ", error);
    });
}

const sendMailAfterPayment = () => {
    $('#overlay').show();
    user.totalAmount = totalAmount;
    const userData = user;
    const apiUrl = "https://real-subscribers-server.onrender.com/v1/user/sendPaymentMailForInstaLikes";
    // const apiUrl = "http://localhost:3000/v1/user/sendPaymentMailForInstaLikes";
    axios.post(apiUrl, userData).then(async(response) => {
        if (response.data) {
            $('#overlay').hide();
            $('#paymentModal').modal('hide');
            $("span.spinner-border").remove();
            window.location = "../thank-you.html";
        } else {
            $("span.spinner-border").remove();
            toast.error("Something went wrong. Please Try Again Later");
        }
    }, (err) => {
        $("span.spinner-border").remove();
        toast.error("Something went wrong. Please Try Again Later");
    });
}

const selectPlan = (selectedPlan, delivery) => {
    isApplied = 0;
    let element = document.getElementById("sub");
    element.value = selectedPlan;
    totalAmount = element.value / 20;
    $("#price").html(totalAmount);
    deliveryDate = delivery;
    applyPromoCode()
    window.location.href = "#top";
}

const setPostLinks = () => {
    const postLinksForm = document.getElementById("post-links-form");
    const inputs = postLinksForm.querySelectorAll(".form-control");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value) {
            postLinks.push(inputs[i].value);
        }
    }
    if (postLinks.length < 1) {
        $("#postLinksModal").modal('hide');
        return;
    }
    console.log("post links ", postLinks);
    toastr.success("Video added successfully!");
    $("#postLinksModal").modal('hide');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
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

function resetSpinner() {
    $("span.spinner-border").remove();
    $(".buy-sub").prop("disabled", false);
    $(".buy-sub").html('buy instagram likes');
}
populateCountry();