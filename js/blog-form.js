function sendEmail() {
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const website = document.getElementById("link").value
    const contact = document.getElementById("phone").value
    const message = document.getElementById("message").value
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailError = document.getElementById("emailError");
    const recaptchaResponse = grecaptcha.getResponse();
  
    if (!name || !email || !website || !contact || !recaptchaResponse ) {
      alert("Please fill all the fields and complete the reCAPTCHA.");
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
  
    const form = document.getElementsByName("contact-form")[0];
    document.getElementById("mail-btn").disabled = true;
    document.getElementById("btn-spinner").style.display = "inline-block";
  
    // Fetch the API key from the meta tag
    const apiKey = document
      .querySelector('meta[name="x-api-key"]')
      .getAttribute("content");
  
    const endpoint = "https://www.mywalll.com/v1/realsubscribers/sendemail";
    // const endpoint = 'https://www.mywalll.com/v2'; // Use this for production
  
    const request = {
      name,
      email,
      website,
      contact,
      message,
      recaptchaResponse
    };
  
  
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(request),
    })
      .then((data) => {
        
  
        console.log(data, 'data found');
        form.reset();
        document.getElementById("mail-btn").disabled = false;
        document.getElementById("btn-spinner").style.display = "none";
        if (data.status == 200) {
          window.location.href = "../thank-you.html";
          return;
        }
  
        alert("Something went wrong, please try again later");
        console.log("res ", data);
      })
      .catch((error) => {
        document.getElementById("mail-btn").disabled = false;
        document.getElementById("btn-spinner").style.display = "none";
        alert("Something went wrong, please try again later");
        console.log("error ", error);
      });
  }