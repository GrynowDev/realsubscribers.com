const sendQueryMail = () => {
    const email = document.getElementById('email').value
    const name = document.getElementById('name').value
    const duration = document.getElementById('duration').value;
    const message = document.getElementById('message').value

    if (!email || !name || !duration || !message) {
        toastr.error('Please fill all the fields carefully!');
        return;
    }

    const userData = {
            email,
            name,
            duration,
            message
        }
        // const apiUrl = "http://localhost:3100/v1/ve/sendContactMail";
    const apiUrl = "https://real-subscribers-server.onrender.com/v1/ve/sendContactMail"
    axios.post(apiUrl, userData).then(
        async(response) => {
            $('.buy-sub').prop('disabled', false)
            if (response.data) {
                toastr.error('Query Sent Successfully. Please check mail for more information')
            } else {
                toastr.error('Something went wrong. Please Try Again Later')
            }
        },
        (err) => {
            toastr.error('Something went wrong. Please Try Again Later')
        }
    )
}