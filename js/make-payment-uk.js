let user = {}
$(function() {
    getUser()
    $('.text-success').hide()
    $('.text-danger').hide()
    $('.text-info').hide()
    $('.payment-msg').hide()
})

function getUser() {
    user = JSON.parse(localStorage.getItem('user'))
    bindValueToUI()
}

function bindValueToUI() {
    let currency = "£"
    if (user) {
        document.getElementById('serviceName').textContent = user.serviceName
        document.getElementById('quantity').textContent = user.quantity
        document.getElementById('amount').textContent =
            currency + parseInt(user.totalAmount + user.discount)
        document.getElementById('discount').textContent = '-' + currency + user.discount
        document.getElementById('total').textContent = currency + user.totalAmount
    }
}

function clearStorage() {
    localStorage.clear();
}

paypal
    .Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
        },
        createOrder: function(data, actions) {
            let curr = "GBP"
                // This function sets up the details of the transaction, including the amount and line item details.
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: curr,
                        value: user.totalAmount.toString() + '.00',
                    },
                }, ],
                application_context: {
                    shipping_preference: 'NO_SHIPPING',
                },
            })
        },
        // Finalize the transaction
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                sendMailAfterPayment()
            })
        },
    })
    .render('#paypal-button')

const sendMailAfterPayment = () => {
    $('.payment-msg').show()
    const userData = user;
    const apiUrl = "https://real-subscribers-server.onrender.com/" + user.serviceUrl;
    // const apiUrl = "http://localhost:3000" + user.serviceUrl;
    axios.post(apiUrl, userData).then(async(response) => {
        if (response.data) {
            clearStorage()
            window.location = "/thank-you-uk.html";
        } else {
            toast.error("Something went wrong. Please Try Again Later");
        }
    }, (err) => {
        toast.error("Something went wrong. Please Try Again Later");
    });
}