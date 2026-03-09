let selectedSub = 1000;
let selectedSubWithDiscount = 1000;
$(".loader-wrapper").css("display", "none");
let totalAmount = 100;
let planSelected = "trial"
$(function() {
    $('.text-success').hide();
    $('.text-danger').hide();
    $('.paypal-btn').hide();
    $('.buy-button-wraper').hide();
});
var currentPlan = "#plan-100"
var isApplied = 0;
$('#sub').change(
    function() {
        isApplied = 0;
        totalAmount = $(this).val() / 10;
        console.log("total amount ", totalAmount);
        $("#price").html(totalAmount);
    });


paypal.Buttons({
    createOrder: function(data, actions) {
        planSelected = "trial";
        let totalAmount = document.getElementById('trial-amount').innerText
        console.log('total amount ', totalAmount);
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

paypal.Buttons({
    createOrder: function(data, actions) {
        planSelected = "silver";
        let totalAmount = document.getElementById('silver-amount').innerText
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
}).render('#paypal-button-silver');

paypal.Buttons({
    createOrder: function(data, actions) {
        planSelected = "gold";
        let totalAmount = document.getElementById('gold-amount').innerText
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
}).render('#paypal-button-gold');

paypal.Buttons({
    createOrder: function(data, actions) {
        planSelected = "platinum";
        let totalAmount = document.getElementById('platinum-amount').innerText
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
}).render('#paypal-button-platinum');

function applyPromoCode() {
    selectedSubWithDiscount = $("#sub").val();
    console.log('sub inside promo code', selectedSubWithDiscount);
    const promoCode = document.getElementById("promoCode").value;
    if (promoCode === "RSDISCOUNT10" && isApplied === 0) {
        isApplied = 1;
        $("#price").html(totalAmount - totalAmount * 10 / 100);
        totalAmount = totalAmount - totalAmount * 10 / 100
        $('.text-danger').hide();
        $('.text-success').show();
    } else if (promoCode === "RSDISCOUNT20" && isApplied === 0) {
        isApplied = 1;
        $("#price").html(totalAmount - totalAmount * 20 / 100);
        totalAmount = totalAmount - totalAmount * 20 / 100
        $('.text-danger').hide();
        $('.text-success').show();
    } else {
        $('.text-success').hide();
        $('.text-danger').show();
    }
}

const buyNow = (planType) => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = "../youtube-consulting-services/video-editing-service-package.html";
        } else {
            localStorage.setItem("videoEditingPlanType", planType);
            localStorage.setItem("navigatedFrom", "youtube-video-editing-service-package");
            window.location.href = "/auth.html";
        }
    });

}

const sendMailAfterPayment = () => {
    let userData = {};
    let totalAmount = document.getElementById('amount').innerText;
    localStorage.setItem('planSelected', planSelected);
    userData.planSelected = planSelected
    userData.totalAmount = totalAmount;
    userData.planSelected = "YouTube Video Editing Services"
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            userData.email = user.email;
            userData.name = user.displayName;
        }
    });
    const apiUrl = "https://real-subscribers-server.onrender.com/v1/user/sendMailWithPurchase";
    // const apiUrl = "http://localhost:3000/v1/user/sendMailWithPurchase";
    axios.post(apiUrl, userData).then(async(response) => {
        // $(".loader-wrapper").css("display", "none");
        if (response.data) {
            window.location = "../thank-you-video-editing-service.html";
        } else {
            alert("Something went wrong. Please Try Again Later");
        }
    }, (err) => {
        console.log("something went wrong. Please Try Again", err);
        alert("Something went wrong. Please Try Again Later");
    });
}