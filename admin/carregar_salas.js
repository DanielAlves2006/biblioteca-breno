document.addEventListener("DOMContentLoaded", () => {
    fetch("opcoes_salas.php")
        .then(response => response.text())
        .then(html => {
            const select = document.getElementById("selecionarSala");
            if (select) {
                select.insertAdjacentHTML("beforeend", html);
            }
        })
        .catch(error => console.error("Erro ao carregar opções:", error));
});
