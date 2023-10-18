// Login
const loginForm = document.querySelector("form");
const inputMail = document.querySelector("#email-login");
const inputPassword = document.querySelector("#password");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userInfo = {  email : inputMail.value, 
        password : inputPassword.value
};
console.log(userInfo);

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "post",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
    });
    console.log(response)
    if(response.ok === true) {
        window.location.href = "index.html"
    } else {
        alert("Connexion invalide")
    }
})


