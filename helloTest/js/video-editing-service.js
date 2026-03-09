// var moreText = document.getElementById("more-faq");
// moreText.style.display = "none";
$('#overlay').hide()
const apiUrl = 'https://rs-server.onrender.com'
// const apiUrl = 'http://localhost:3100'
let totalAmount = 50,
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


const setUserData = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
  window.location = '../video-editing-pricing.html'
}

$('#sub').change(function () {
  isApplied = 0
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
    $('#price').html(totalAmount - (totalAmount * 40) / 100)
    totalAmount = totalAmount - (totalAmount * 40) / 100
    toastr.success('Promo code applied successfully')
  } else if (isApplied === 1) {
    toastr.info('Promo code already applied')
  }
}

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
  const userInfo = user
  axios
    .post(apiUrl + '/ve/add', userInfo)
    .then((res) => {
      axios
        .post(apiUrl + '/v1/ve/sendLead', userInfo)
        .then((res) => {
          resetSpinner()
          console.log('user ', res)
          setUserData(userInfo)
          // window.location = '../video-editing-pricing.html'
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
  $('.buy-sub').html('processing...')
}
populateCountry()
