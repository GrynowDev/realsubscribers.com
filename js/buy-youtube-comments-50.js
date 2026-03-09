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

// var moreText = document.getElementById("more-faq");
// moreText.style.display = "none";
$('#overlay').hide();
const apiUrl = "https://real-subscribers-server.onrender.com/";
const serviceUrl = "/v1/user/sendPaymentMailForYoutubeComment";
// const apiUrl = "http://localhost:3000";
let totalAmount = 25,
    isApplied = 0;
discount = 0;
const user = {};
serviceName = "Buy Youtube Comments"
let videoLinks = [];
let deliveryDate = "will be delivered in 2-4 days";
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

const setUserData = (user) => {
    user.quantity = user.selectedComments + " Comments"
    user.totalAmount = totalAmount;
    user.discount = discount;
    user.serviceName = serviceName;
    user.serviceUrl = serviceUrl;
    localStorage.setItem("user", JSON.stringify(user));
    window.location = "../make-payment.html";
}

$('#sub').change(
    function() {
        if ($(this).val() == 25) {
            deliveryDate = "2-4 days";
        } else if ($(this).val() == 50) {
            deliveryDate = "4-6 days";
        } else if ($(this).val() == 100) {
            deliveryDate = "6-8 days";
        } else if ($(this).val() == 200) {
            deliveryDate = "1-2 weeks"
        } else if ($(this).val() == 300) {
            deliveryDate = "2-3 weeks"
        } else if ($(this).val() == 500) {
            deliveryDate = "3-4 weeks"
        }
        isApplied = 0;
        totalAmount = $(this).val();
        $("#price").html(totalAmount);
    });

function applyPromoCode() {
    const promoCode = "rs40";
    if (promoCode.toLowerCase() === "rs40" && isApplied === 0) {
        isApplied = 1;
        discount = totalAmount * 50 / 100
        $("#price").html(totalAmount - totalAmount * 50 / 100);
        totalAmount = totalAmount - totalAmount * 50 / 100
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
    selectedSubWithDiscount = $("#sub").val();
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
    videoLinks.push(user["youtubeVideoLinkOne"]);
    user.videoLinks = videoLinks;
    user.totalAmount = totalAmount;
    user.deliveryDate = deliveryDate;
    $(".buy-sub").prop("disabled", true);
    $(".buy-sub").html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <strong class="redirect-payment">Redirecting to Payment...</strong>`
    );
    const userInfo = user;
    axios.post(apiUrl + '/user/youtubeComment/add', userInfo).then((res) => {
        axios.post(apiUrl + '/user/youtubeComment/sendYoutubeCommentLead', userInfo).then((res) => {
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
    const apiUrl = "https://real-subscribers-server.onrender.com/v1/user/sendPaymentMailForYoutubeComment";
    // const apiUrl = "http://localhost:3000/v1/user/sendPaymentMailForYoutubeComment";
    axios.post(apiUrl, userData).then(async(response) => {
        if (response.data) {
            $('#overlay').hide();
            $('#paymentModal').modal('hide');
            $("span.spinner-border").remove();
            window.location = "../thank-you.html";
        } else {
            $("span.spinner-border").remove();
            toastr.error("Something went wrong. Please Try Again Later");
        }
    }, (err) => {
        $("span.spinner-border").remove();
        toastr.error("Something went wrong. Please Try Again Later");
    });
}

const selectPlan = (selectedPlan, delivery) => {
    isApplied = 0;
    let element = document.getElementById("sub");
    element.value = selectedPlan;
    totalAmount = selectedPlan;
    $("#price").html(totalAmount);
    deliveryDate = delivery;
    applyPromoCode()
    window.location.href = "#top";
}

const setVideoLinks = () => {
    const videoLinksForm = document.getElementById("video-links-form");
    const inputs = videoLinksForm.querySelectorAll(".form-control");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value) {
            videoLinks.push(inputs[i].value);
        }
    }
    if (videoLinks.length < 1) {
        $("#videoLinksModal").modal('hide');
        return;
    }
    console.log("videoLinks ", videoLinks);
    toastr.success("Video added successfully!");
    $("#videoLinksModal").modal('hide');
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
    $(".buy-sub").html('Buy Youtube Comments Now');
}
populateCountry();