const sendQueryToServer = () => {
    const form = $(".rs-contact-form");
    if (form[0].checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        form.addClass('was-validated');
        return;
    }
    const email = document.getElementById("email").value;
    const link = document.getElementById("link").value;
    const queryType = document.getElementById("queryType").value;
    const message = document.getElementById("message").value;

    const userData = {
        email,
        link,
        queryType,
        message
    }
    $(".submit-btn").prop("disabled", true);
    $(".submit-btn").html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
    );
    console.log("user data ", userData);

    const apiUrl = "https://real-subscribers-server.onrender.com/v1/user/contactUs";
    // const apiUrl = "http://localhost:3000/v1/user/contactUs";
    axios.post(apiUrl, userData).then((response) => {
        resetSpinner();
        if (response.data) {
            toastr.info("Query sended successfully");
            return
        }
    }, (err) => {
        resetSpinner();
        toast.error("Something went wrong. Please Try Again Later");
        console.log("something went wrong ", err);
    });
}

function resetSpinner() {
    $("span.spinner-border").remove();
    $(".submit-btn").prop("disabled", false);
    $(".submit-btn").html('Send Query');
}