document.addEventListener('DOMContentLoaded', () => {
    const formRegister = document.getElementById("registerForm")

    formRegister.addEventListener('submit', async (e) => {
        try {
            e.preventDefault()

            const formData = new FormData(formRegister)

            const userData = Object.fromEntries(formData)

            const response = await fetch('http://localhost:8080/api/sessions/register', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(userData),
                credentials:"include"
            })

            const data = await response.json()
            if(data?.message === "Usuario registrado correctamente") {
                Toastify({
                    text: data.message,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "linear-gradient(to right,rgb(1, 5, 230), #96c93d)",
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
                  setTimeout(() => {
                    window.location.href = "http://localhost:8080/api/sessions/viewlogin"
                  }, 3000);

            } else{
                console.log(data);
            }
        } catch (e) {
            console.log(e);
        }

    })
})