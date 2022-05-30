window.addEventListener("load", function () {

    //disable this button when needed
    const submitBtn = document.querySelector("#signup-submit-btn");

    //check if username exist, if yes display an error message
    const userNameInput = document.querySelector('#username-input');
    userNameInput.addEventListener('blur', async (e) => {
        const userName = e.target.value;
        if (userName) {
            let response = await fetch(`/getUserByUsername?userName=${userName}`);
            let userObj = await response.json();
            let errorPara = document.querySelector("#username-error");
            if (userObj) {
                errorPara.removeAttribute("hidden");
                errorPara.innerText = 'Username already exists, please type a new one';
                submitBtn.disabled = true;
            } else {
                errorPara.setAttribute("hidden", true);
                errorPara.innerText = '';
                submitBtn.disabled = false
                    ;
            }
        }
    })

    //check if re-enter password matches
    const passwordCheckInput = document.querySelector('#passwordCheck');
    passwordCheckInput.addEventListener('keyup', async (e) => {
        const psdCheck = e.target.value;
        const passwordInput = document.querySelector('#password');
        let errorPara = document.querySelector("#pwd-error");
        if (psdCheck !== passwordInput.value) {
            errorPara.removeAttribute("hidden");
            errorPara.innerText = 'Passwords are not match';
            submitBtn.disabled = true;
        } else {
            errorPara.setAttribute("hidden", true);
            errorPara.innerText = '';
            submitBtn.disabled = false;
        }
    })

    

})