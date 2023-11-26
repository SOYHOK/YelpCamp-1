(function () {
    'use strict'

    bsCustomFileInput.init()

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                } else if(!checkPassword()) {
                    event.preventDefault()
                    event.stopPropagation()
                } else if(!checkConfirmPassword()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

function checkPassword () {
    var password = document.getElementById("password").value;
    if (password.search(/^(?=.*[-\#\$\.\%\&\@\!\+\=\<\>\*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,12}$/) ){
        alert("Password must contain at least 8 characters, one number, one uppercase, one lowercase, and one special character.");
        return false;
    }
    return true;
}

function checkConfirmPassword () {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    return true;
    
}


    

    