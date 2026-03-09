function bsendEmail() {
    const name = document.getElementById("bname").value
    const email = document.getElementById("bemail").value
    const website = document.getElementById("blink").value
    const contact = document.getElementById("bphone").value
    const message = document.getElementById("bmessage").value
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailError = document.getElementById("emailErrorblog");
    // const recaptchaResponse = grecaptcha.getResponse();
    const site = "Igygrow.com"
    if (!name || !email || !contact || !website) {
        alert("Please fill all the fields carefully");
        return;
    }

    if (!emailPattern.test(email)) {
      emailError.textContent = "Please enter a valid email address.";
      document.getElementById("mail-btn").disabled = !1;
      document.getElementById("btn-spinner").style.display = "none";
      
      return;
    } else {
      emailError.textContent = "";
  }

    var form = document.getElementsByName('bcontact-form')[0];
    document.getElementById("bmail-btn").disabled = true
    document.getElementById("bbtn-spinner").style.display = "inline-block"


    // Fetch the API key from the meta tag
    const apiKey = document
      .querySelector('meta[name="x-api-key"]')
      .getAttribute("content");
  

    // const endpoint = 'https://www.mywalll.com/v1/user/sendEmail'
    const endpoint = 'https://www.mywalll.com/v1/realsubscribers/sendemail'; // Use this for production

    const request = {
      name,
      email,
      website,
      contact,
      message,
      site
      // recaptchaResponse
    }
    fetch(endpoint, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(request)
    }).then((res) => {
      form.reset()
      document.getElementById("bmail-btn").disabled = false
      document.getElementById("bbtn-spinner").style.display = "none"
      if (res.status == 200) {
        window.location = "../thank-you.html";
        return;
      }
      alert("Something went wrong, please try again later");
      console.log("res ", res)
    }).catch((error) => {
      document.getElementById("bmail-btn").disabled = false
      document.getElementById("bbtn-spinner").style.display = "none"
      alert("Something went wrong, please try again later");
      console.error("error ", error);
    })
  }