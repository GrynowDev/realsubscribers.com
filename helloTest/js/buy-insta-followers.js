document.addEventListener("readystatechange", e => {
    "interactive" === e.target.readyState && (console.log("screen width ", screen.width), screen
      .width <= 1190 ? (document.getElementById("disable-mobile-version").style.display = "none",
        document.getElementById("active-mobile-version").style.display = "block") : (document
          .getElementById("active-mobile-version").style.display = "none", document
            .getElementById("disable-mobile-version").style.display = "block"))
  });
  
  var moreText = document.getElementById("more-faq");
  const apiUrl = "https://rs-server.onrender.com";
  const serviceUrl = "/v1/user/sendPaymentMailForInsta";
//   const apiUrl = "http://localhost:3000";
  moreText.style.display = "none";
  $('#overlay').hide();
  let totalAmount = 50,
    isApplied = 0;
    discount = 0;
    serviceName = "Buy Instagram Followers"
const user = {};
  
  const toggleFaq = () => {
    var btnText = document.getElementById("faq");
  
    if (moreText.style.display === "none") {
      moreText.style.display = "block";
      btnText.innerHTML = "Less FAQ's";
    } else {
      btnText.innerHTML = "More FAQ's";
      moreText.style.display = "none";
    }
  }

  const resetForm = () => {
    $('#register-form').trigger("reset");
  }

  const setUserData = (user) => {
    user.quantity = user.selectedFollowers + " Followers"
    // user.totalAmount = totalAmount;
    const adId = getParameterByName('gclid')
    user.adId = adId
    // user.discount = discount;
    user.discountApplied = isApplied
    user.serviceName = serviceName;
    user.serviceUrl = serviceUrl;
    const u = new URLSearchParams(user).toString();
    // localStorage.setItem("user", JSON.stringify(user));
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
  
  $('#sub').change(
    function () {
      isApplied = 0;
      totalAmount = $(this).val() / 10;
      console.log("total amount ", totalAmount);
      $("#price").html(totalAmount);
    });
  
  function applyPromoCode() {
    const promoCode = "rs40";
    selectedSubWithDiscount = $("#sub").val();
    if (promoCode.toLowerCase() === "rs40" && isApplied === 0) {
      isApplied = 1;
      discount = totalAmount * 40 / 100
      $("#price").html(totalAmount - totalAmount * 40 / 100);
      totalAmount = totalAmount - totalAmount * 40 / 100
      toastr.success("Promo code applied successfully")
    } else if (isApplied === 1) {
      toastr.info("Promo code already applied");
    }
  }

  const selectPlan = (selectedPlan) => {
    isApplied = 0;
    let element = document.getElementById("sub");
      element.value = selectedPlan;
      totalAmount = element.value / 10;
      $("#price").html(totalAmount);
      applyPromoCode()
      window.location.href = "#top";
  }
  
  paypal.Buttons({
    createOrder: function (data, actions) {
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
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        sendMailAfterPayment();
      });
    }
  }).render('#paypal-button');
  
  const addUser = () => {
      console.log("add user called");
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
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <strong class="redirect-payment">Redirecting to Payment...</strong>`
    );
    user.adId = getParameterByName('gclid')
    const userInfo = user;
      axios.post(apiUrl + '/user/insta/add', userInfo).then((res) => {
        axios.post(apiUrl + '/user/sendInstaLead', userInfo).then((res) => {
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
    const apiUrl = "https://rs-server.onrender.com/v1/user/sendPaymentMailForInsta";
    // const apiUrl = "http://localhost:3000/v1/user/sendPaymentMailForInsta";
    axios.post(apiUrl, userData).then(async (response) => {
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
  
  
  const getOffer = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        window.location.href = "/make-payment.html";
      } else {
        localStorage.setItem("navigatedFrom", "buy-youtube-sub");
        window.location.href = "/auth.html";
      }
    });
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
    $(".buy-sub").html('buy subscribers now');
  }
  populateCountry();