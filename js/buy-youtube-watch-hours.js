// var moreText = document.getElementById("more-faq");
// moreText.style.display = "none";
$('#overlay').hide()
const apiUrl = 'https://real-subscribers-server.onrender.com/'
let totalAmount = 115,
    isApplied = 0
discount = 0
serviceName = 'Buy Youtube Watch Hours'
const serviceUrl = '/v1/rs/sendPaymentMailForWatchHours'
const user = {}

const resetForm = () => {
    $('#register-form').trigger("reset");
}

const setUserData = (user) => {
    user.quantity = user.selectedWatchHours + ' Hours'
        // user.totalAmount = totalAmount
    const adId = getParameterByName('gclid')
    user.adId = adId
        // user.discount = discount
    user.discountApplied = isApplied
    user.serviceName = serviceName
    user.serviceUrl = serviceUrl
    const u = new URLSearchParams(user).toString();
    // localStorage.setItem('user', JSON.stringify(user))
    resetForm()
    window.location = `https://www.fidyu.co.in/make-payment.html?${u}`
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$('#sub').change(function() {
    isApplied = 0
    totalAmount = $(this).val() * 0.115
    console.log('total amount ', totalAmount)
    $('#price').html(totalAmount)
})

function applyPromoCode() {
    const promoCode = 'rs40'
    selectedSubWithDiscount = $('#sub').val()
    if (promoCode.toLowerCase() === 'rs40' && isApplied === 0) {
        isApplied = 1
        discount = (totalAmount * 40) / 100
        $('#price').html(totalAmount - (totalAmount * 40) / 100)
        totalAmount = totalAmount - (totalAmount * 40) / 100
        toastr.success('Promo code applied successfully')
    } else if (isApplied === 1) {
        toastr.info('Promo code already applied')
    }
}

function addUser() {
    let name,
        value = ''
    const registerForm = document.getElementById('register-form')
    const inputs = registerForm.querySelectorAll('.form-control')
    console.log('childs', inputs)

    for (var i = 0; i < inputs.length; i++) {
        if (!inputs[i].value) {
            toastr.info('Please fill all fields carefully')
            return
        }
        name = inputs[i].attributes['name'].value
        value = inputs[i].value
        user[name] = value
        console.log('input name ', name)
        console.log('input ', value)
    }
    $('.buy-sub').prop('disabled', true)
    $('.buy-sub').html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <strong class="redirect-payment">Redirecting to Payment...</strong>`
    )
    user.adId = getParameterByName('gclid')
    const userInfo = user
    axios
        .post(apiUrl + '/v1/rs/addUserForWatchHours', userInfo)
        .then((res) => {
            axios
                .post(apiUrl + '/v1/rs/sendWatchHoursLead', userInfo)
                .then((res) => {
                    resetSpinner()
                    console.log('user ', res)
                    setUserData(user)
                })
                .catch((error) => {
                    resetSpinner()
                    console.log('error while adding user in db ', error)
                })
        })
        .catch((error) => {
            resetSpinner()
            console.log('error while adding user in db ', error)
        })
}

const sendMailAfterPayment = () => {
    $('#overlay').show()
    user.totalAmount = totalAmount
    const userData = user
    const apiUrl =
        'https://real-subscribers-server.onrender.com/v1/user/sendPaymentMail'
        // const apiUrl = "http://localhost:3000/v1/user/sendPaymentMail";
    axios.post(apiUrl, userData).then(
        async(response) => {
            if (response.data) {
                $('#overlay').hide()
                $('#paymentModal').modal('hide')
                $('span.spinner-border').remove()
                window.location = '../thank-you.html'
            } else {
                $('span.spinner-border').remove()
                toast.error('Something went wrong. Please Try Again Later')
            }
        },
        (err) => {
            $('span.spinner-border').remove()
            toast.error('Something went wrong. Please Try Again Later')
        }
    )
}

const selectPlan = (selectedPlan) => {
    isApplied = 0
    let element = document.getElementById('sub')
    element.value = selectedPlan
    totalAmount = element.value * 0.115
    $('#price').html(totalAmount)
    applyPromoCode()
    window.location.href = '#top'
}

function populateCountry() {
    $.getJSON('/data/countries.json', function(countries) {
        const country = document.getElementById('country')
        for (let i = 0; i < countries.length; i++) {
            country.options[country.options.length] = new Option(
                countries[i].name,
                countries[i].name
            )
        }
    })
}

function populateCountryCodeByCountry() {
    const selectedCountry = document.getElementById('country').value
    const countryCode = document.getElementById('countryCode')
    $.getJSON('../data/countries.json', function(countries) {
        countries.map((country) => {
            if (selectedCountry === country.name) {
                countryCode.value = country.dial_code
            }
        })
    })
}

function resetSpinner() {
    $('span.spinner-border').remove()
    $('.buy-sub').prop('disabled', false)
    $('.buy-sub').html('Buy Youtube Watch Time Now')
}
populateCountry()