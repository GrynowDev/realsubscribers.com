let user = {}
$(function() {
    getUser()
    $('.text-success').hide()
    $('.text-danger').hide()
    $('.text-info').hide()
    $('.payment-msg').hide()
        // $('#paypal-button').hide()
})

$('input[name=opt]').change(function() {
    var value = $('input[name=opt]:checked').val()
    if (value === 'paypal') {
        $('#paypal-button').show()
        $('#stripe-payment').hide()
    }
    if (value === 'stripe') {
        $('#paypal-button').hide()
        $('#stripe-payment').show()
    }
})

const stripe = Stripe(
    'pk_live_51JD0eVSGilIb04ooewZdMtQhc5w0uoCe1ipgnNDsz9HFC91ZJkS1dKHwTPVCmVfIIW2M4EIFHRnEXRj9kygFORRO00neRUdGzd'
)
let card = null

const initStripe = async() => {
    let style = {
        base: {
            color: '#32325d',
            fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    }

    const elements = stripe.elements()

    card = elements.create('card', { style, hidePostalCode: true })

    card.mount('#card-element')
}

initStripe()

const sendMailAfterPayment = (data, details) => {
    $('.payment-msg').show()
    const userData = user
    userData.data = data
    userData.userDetails = details
    const apiUrl =
        'https://real-subscribers-server.onrender.com/' + user.serviceUrl
        // const apiUrl = "http://localhost:3100" + user.serviceUrl;
    axios.post(apiUrl, userData).then(
        async(response) => {
            $('.buy-sub').prop('disabled', false)
            resetSpinner()
            if (response.data) {
                clearStorage()
                window.location = '../thank-you.html'
            } else {
                toastr.error('Something went wrong. Please Try Again Later')
            }
        },
        (err) => {
            resetSpinner()
            toastr.error('Something went wrong. Please Try Again Later')
        }
    )
}

const doPayment = async(token, userInfo) => {
    userInfo.totalAmount = user.totalAmount
    userInfo.token = token
    userInfo.description = user.serviceName
    userInfo.country = user.selectedCountry
    userInfo.serviceName = user.serviceName
    const apiUrl = 'https://real-subscribers-server.onrender.com/v1/doPayment'
    axios
        .post(apiUrl, userInfo)
        .then(async(response) => {
            if (response) {
                console.log('response ', response)
                sendMailAfterPayment()
            }
        })
        .catch((error) => {
            resetSpinner()
            console.log('error ', error)
            toastr.error('Something went wrong. Please Try Again')
        })
}

const payNow = async() => {
    const name = document.getElementById('name').value
    const address = document.getElementById('address').value
    const zip = document.getElementById('zip').value
    const city = document.getElementById('city').value
    const state = document.getElementById('state').value

    const userInfo = {
        name,
        address,
        zip,
        city,
        state,
    }

    if (!name || !address || !zip || !city || !state) {
        document.getElementById('payNow').disabled = true
        return
    }
    $('.buy-sub').html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <strong class="redirect-payment">Payment Processing...</strong>`
    )
    try {
        const response = await stripe.createToken(card)
        $('.buy-sub').prop('disabled', true)
        console.log('response ', response)
        const { id } = response.token
        doPayment(id, userInfo)
    } catch (error) {
        resetSpinner()
            // console.error('error ', error)
        toastr.error('Please enter correct card details!')
    }
}

paypal
    .Buttons({
        createOrder: function(data, actions) {
            // This function sets up the details of the transaction, including the amount and line item details.
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        // value: '1.00'
                        value: user.totalAmount.toString().includes('.') ? user.totalAmount.toString() : user.totalAmount.toString() + '.00',
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
                sendMailAfterPayment(data, details)
            })
        },
    })
    .render('#paypal-button')

card.on('change', function(event) {
    var displayError = document.getElementById('card-errors')
    if (event.error) {
        console.log('event.error ', event.error)
        document.getElementById('payNow').disabled = true
    } else {
        console.log('no error')
        document.getElementById('payNow').disabled = false
    }
})

function getUser() {
    user = JSON.parse(localStorage.getItem('user'))
    bindValueToUI()
}

function bindValueToUI() {
    let currency = user.currency
    if (!currency) {
        currency = '$'
    }
    if (user) {
        document.getElementById('serviceName').textContent = user.serviceName
        document.getElementById('quantity').textContent = user.quantity
        document.getElementById('amount').textContent =
            currency + parseInt(user.totalAmount + parseInt(user.discount.toFixed(2)))
        document.getElementById('discount').textContent =
            '-' + currency + user.discount.toFixed(2)
        document.getElementById('total').textContent = currency + user.totalAmount
    }
}

function resetSpinner() {
    $('span.spinner-border').remove()
    $('.buy-sub').prop('disabled', false)
    $('.buy-sub').html('Pay Now')
}

function clearStorage() {
    localStorage.clear()
}