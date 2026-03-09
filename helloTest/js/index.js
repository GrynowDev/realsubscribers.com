// var moreText = document.getElementById("more-faq");
// moreText.style.display = "none";
$('#overlay').hide()
const apiUrl = 'https://rs-server.onrender.com'
let totalAmount = 66.66,
  isApplied = 0
discount = 0
serviceName = 'Buy Youtube Subscribers'
const serviceUrl = '/v1/user/sendPaymentMail'
const user = {}
const servicesList = [
  'Youtube Likes',
  'Instagram Likes',
  'Yotube Subscribers',
  'Instagram Followers',
  'Instagram Comments',
  'Youtube Comments',
]
const follSubQuantity = [500, 1000, 2000, 5000, 8000, 10000]
const commentsQuantity = [25, 50, 100, 200, 300, 500]
const likesQuantity = [100, 200, 300, 500, 700, 1000]

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

const randomizeUserNotification = () => {
  $.getJSON('../data/countries.json', function (countries) {
    const service =
      servicesList[Math.floor(Math.random() * servicesList.length)]
    let quantity = ''
    if (service === 'Youtube Likes' || service === 'Instagram Likes') {
      quantity = likesQuantity[Math.floor(Math.random() * likesQuantity.length)]
    } else if (
      service === 'Youtube Subscribers' ||
      service === 'Instagram Followers'
    ) {
      quantity =
        follSubQuantity[Math.floor(Math.random() * follSubQuantity.length)]
    } else if (
      service === 'Youtube Comments' ||
      service === 'Instagram Comments'
    ) {
      quantity =
        commentsQuantity[Math.floor(Math.random() * commentsQuantity.length)]
    }
    let country = countries[Math.floor(Math.random() * countries.length)].name
    document.getElementById('countryName').textContent = country
    document.getElementById('quantity').textContent = quantity
    document.getElementById('serviceName').textContent = service
    document.getElementById('time').textContent = Math.floor(
      Math.random() * (60 - 2 + 1) + 2
    )
  })
  setTimeout(randomizeUserNotification, 8000)
}

const resetForm = () => {
  $('#register-form').trigger("reset");
}

randomizeUserNotification()
const setUserData = (user) => {
  const adId = getParameterByName('gclid')
  user.adId = adId
  user.quantity = user.selectedSub + ' Subscribers'
  user.discountApplied = isApplied
  // user.totalAmount = totalAmount
  // user.discount = discount
  user.serviceName = serviceName
  user.serviceUrl = serviceUrl
  const u = new URLSearchParams(user).toString();
  // localStorage.setItem('user', JSON.stringify(user))
  resetForm()
  window.location = `https://www.igygrow.com/make-payment.html?${u}`

}


function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$('#sub').change(function () {
  console.log("$(this).val() ", $(this).val())
  isApplied = 0
  if ($(this).val() == 500) {
    console.log("inside 500")    
      totalAmount = 66.66
      $('#price').html(totalAmount)
      return
  }
  if ($(this).val() == 1000) {
    console.log("inside 1000")  
    totalAmount = 133.32
    $('#price').html(totalAmount)
    return
}
// if ($(this).val() == 2000) {
//   console.log("inside 2000")  
//   totalAmount = 233.5
//     $('#price').html(totalAmount)
//     return
// }
  totalAmount = $(this).val() / 10
  console.log('total amount ', totalAmount)
  $('#price').html(totalAmount)
})

function applyPromoCode() {
  const promoCode = 'rs40'
  selectedSubWithDiscount = $('#sub').val()
  if (promoCode.toLowerCase() === 'rs40' && isApplied === 0) {
    isApplied = 1
    discount = (totalAmount * 40) / 100
    $('#price').html(Math.round((totalAmount - (totalAmount * 40) / 100)))
    totalAmount = Math.round(totalAmount - (totalAmount * 40) / 100)
    toastr.success('Promo code applied successfully')
  } else if (isApplied === 1) {
    toastr.info('Promo code already applied')
  }
}

paypal
  .Buttons({
    createOrder: function (data, actions) {
      // This function sets up the details of the transaction, including the amount and line item details.
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: totalAmount.toString() + '.00',
            },
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
    },
    // Finalize the transaction
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        sendMailAfterPayment()
      })
    },
  })
  .render('#paypal-button')

const addUser = () => {
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
    .post(apiUrl + '/user/add', userInfo)
    .then((res) => {
      axios
        .post(apiUrl + '/v1/user/sendLead', userInfo)
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
    'https://rs-server.onrender.com/v1/user/sendPaymentMail'
  // const apiUrl = "http://localhost:3000/v1/user/sendPaymentMail";
  axios.post(apiUrl, userData).then(
    async (response) => {
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
  if (selectedPlan == 500) {
    console.log("inside 500")    
      totalAmount = 66.66
      $('#price').html(totalAmount)
      applyPromoCode()
      window.location.href = '#top'
      return
  }
  if (selectedPlan == 1000) {
    console.log("inside 1000")  
    totalAmount = 133.32
    $('#price').html(totalAmount)
    applyPromoCode()
    window.location.href = '#top'
    return
}
if (selectedPlan == 2000) {
  console.log("inside 2000")  
  totalAmount = 200
    $('#price').html(totalAmount)
    applyPromoCode()
    window.location.href = '#top'
    return
}
  totalAmount = element.value / 10
  $('#price').html(totalAmount)
  applyPromoCode()
  window.location.href = '#top'
}

const populateCountry = () => {
  $.getJSON('/data/countries.json', function (countries) {
    const country = document.getElementById('country')
    for (let i = 0; i < countries.length; i++) {
      country.options[country.options.length] = new Option(
        countries[i].name,
        countries[i].name
      )
    }
  })
}

const populateCountryCodeByCountry = () => {
  const selectedCountry = document.getElementById('country').value
  const countryCode = document.getElementById('countryCode')
  $.getJSON('../data/countries.json', function (countries) {
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
  $('.buy-sub').html('buy subscribers now')
}
populateCountry()
