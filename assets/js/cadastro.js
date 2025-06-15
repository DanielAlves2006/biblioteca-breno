document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container';
    cadastroForm.parentNode.insertBefore(alertContainer, cadastroForm);

    cadastroForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(cadastroForm);
        const data = {
            action: 'register',
            nome: formData.get('nome'),
            email: formData.get('email'),
            senha: formData.get('senha'),
            tipo: formData.get('tipo')
        };

        try {
            const response = await fetch('api/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showSuccessMessage('Cadastro realizado com sucesso!');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showErrorMessage(result.message || 'Erro ao cadastrar');
            }
        } catch (error) {
            showErrorMessage('Erro ao cadastrar');
        }
    });

    function showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alert);
    }

    function showErrorMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alert);
    }
});
