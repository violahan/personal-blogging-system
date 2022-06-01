window.addEventListener("load", async function () {

    //disable this button when needed
    const submitBtn = document.querySelector("#save-user-btn");

    let usernameValid = true;
    let passwordValid = true;


    //check if username exist, if yes display an error message
    const userNameInput = document.querySelector('#username-input');
    if (userNameInput) {
        const usernamesRes = await fetch(`/getAllUsernames`);
        const allUsernames = await usernamesRes.json();
        userNameInput.addEventListener('keyup', async (e) => {
            const userName = e.target.value;
            if (userName) {
                let exists = allUsernames.find(n => n.userName === userName);
                let errorPara = document.querySelector("#username-error");
                if (exists) {
                    const currentUserRes = await fetch(`/getCurrentUser`);
                    const currentUser = await currentUserRes.json();
                    if (!currentUser || currentUser.userName !== userName) {
                        errorPara.removeAttribute("hidden");
                        errorPara.innerText = 'Username already exists, please type a new one';
                        usernameValid = false;
                    } else {
                        errorPara.setAttribute("hidden", true);
                        errorPara.innerText = '';
                        usernameValid = true;
                    }
                } else {
                    errorPara.setAttribute("hidden", true);
                    errorPara.innerText = '';
                    usernameValid = true;
                }
            }
            
            submitBtn.disabled = !(usernameValid && passwordValid);
        })
    }
    

    //check if re-enter password matches
    const passwordCheckInput = document.querySelector('#passwordCheck');
    if (passwordCheckInput) {
        passwordCheckInput.addEventListener('keyup', async (e) => {
            const psdCheck = e.target.value;
            const passwordInput = document.querySelector('#password');
            let errorPara = document.querySelector("#pwd-error");
            if (psdCheck !== passwordInput.value) {
                errorPara.removeAttribute("hidden");
                errorPara.innerText = 'Passwords are not match';
                passwordValid = false;
            } else {
                errorPara.setAttribute("hidden", true);
                errorPara.innerText = '';
                passwordValid = true;
            }
            submitBtn.disabled = !(usernameValid && passwordValid);
        })
    }
    

})