document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById("loginForm");

    formLogin.addEventListener('submit', async (e) => {
        try {
            e.preventDefault();

            const formData = new FormData(formLogin);
            const userData = Object.fromEntries(formData);

            const response = await fetch('http://localhost:8080/api/sessions/login', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            let data;
            try {
                data = await response.json();
            } catch (err) {
                const errorText = await response.text();
                console.error('Error:', errorText);
                Toastify({
                    text: errorText || "Error de autenticación",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right,rgb(255, 0, 0), #FF5733)",
                    },
                    onClick: function(){}
                }).showToast();
                return;
            }

            if (response.ok && data?.message === "Usuario logueado correctamente") {
                Toastify({
                    text: data.message,
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right,rgb(1, 5, 230), #96c93d)",
                    },
                    onClick: function(){}
                }).showToast();

                setTimeout(() => {
                    window.location.href = "http://localhost:8080/api/products";
                }, 3000);
            } else {
                console.log(data);
            }
        } catch (e) {
            console.error('Error al enviar la solicitud:', e);
            Toastify({
                text: "Ocurrió un error inesperado.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #FF5733, #FF0000)",
                }
            }).showToast();
        }
    });
});
