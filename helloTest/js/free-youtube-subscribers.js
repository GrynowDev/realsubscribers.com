const apiUrl = "https://rs-server.onrender.com";
// const apiUrl = "http://localhost:3000";
let user = {};
let totalAmount = 0,
isApplied = 0;
discount = 0;
serviceName = "Buy Youtube Subscribers"
const serviceUrl = "/v1/user/sendPaymentMail";
const servicesList = ["Youtube Likes", "Instagram Likes", "Yotube Subscribers", "Instagram Followers", "Instagram Comments", "Youtube Comments"]
const follSubQuantity = [500, 1000, 2000, 5000, 8000, 10000]
const commentsQuantity = [25, 50, 100, 200, 300, 500]
const likesQuantity = [100, 200, 300, 500, 700, 1000]

const randomizeUserNotification = () => {
  $.getJSON("../data/countries.json", function (countries) {
  const service = servicesList[Math.floor(Math.random() * servicesList.length)];
  let quantity = ""
  if (service === "Youtube Likes" || service === "Instagram Likes") {
    quantity = likesQuantity[Math.floor(Math.random() * likesQuantity.length)];
  } else if (service === "Youtube Subscribers" || service === "Instagram Followers") {
    quantity = follSubQuantity[Math.floor(Math.random() * follSubQuantity.length)];
  } else if (service === "Youtube Comments" || service === "Instagram Comments") {
    quantity = commentsQuantity[Math.floor(Math.random() * commentsQuantity.length)];
  }
  let country = countries[Math.floor(Math.random() * countries.length)].name;
  document.getElementById("countryName").textContent = country
  document.getElementById("quantity").textContent = quantity
    document.getElementById("serviceName").textContent = service
    document.getElementById("time").textContent = Math.floor(Math.random() * (60 - 2 + 1) + 2);
  })
  setTimeout(randomizeUserNotification, 8000);
}

randomizeUserNotification()

$('#sub').change(
  function () {
    isApplied = 0;
    totalAmount = $(this).val() / 10;
    if (totalAmount > 0) {
      $(".buy-sub").html('buy now');
    } else {
      $(".buy-sub").html('Get free youtube subscribers now!');
    }
    console.log("total amount ", totalAmount);
    $("#price").html(totalAmount);
  });

  const setUserData = (user) => {
    user.quantity = user.selectedSub + " Subscribers"
    user.totalAmount = totalAmount;
    user.discount = discount;
    user.serviceName = serviceName;
    user.serviceUrl = serviceUrl;
    localStorage.setItem("user", JSON.stringify(user));
    window.location = "../make-payment.html";
  }  

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
  axios.post(apiUrl + '/user/freeYoutube/add', userInfo).then((res) => {
    if (totalAmount === 0) {
      axios.post(apiUrl + '/user/sendFreeYoutubeLeadToUser', userInfo).then((res) => {
        resetSpinner();
        window.location = "../thank-you.html";
      }).catch((error) => {
        resetSpinner();
        toast.error("Something went wrong. Please Try Again Later");
      });
    } else {
      axios.post(apiUrl + '/user/sendLead', userInfo).then((res) => {
        resetSpinner();
        setUserData(user);
      }).catch((error) => {
        resetSpinner();
        toast.error("Something went wrong. Please Try Again Later");
      });
    }
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

function applyPromoCode() {
  if (totalAmount === 0) {
    toastr.warning("Promo code can't be apply on free plan")
    return;
  }
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
    window.location.href = "#top-1";
}

function resetSpinner() {
  $("span.spinner-border").remove();
  $(".buy-sub").prop("disabled", false);
  $(".buy-sub").html('buy subscribers now');
}
populateCountry();

$(window).scroll(function () {
  $('nav').toggleClass('changebgcolor', $(this).scrollTop() > 50);
});