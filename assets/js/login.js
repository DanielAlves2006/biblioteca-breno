document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container';
    form.parentNode.insertBefore(alertContainer, form);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            action: 'login',
            email: formData.get('email'),
            senha: formData.get('senha')
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
                if (result.user.tipo === 'admin') {
                    window.location.href = 'admin/main_admin.html';
                } else {
                    window.location.href = 'usuario/main_usuario.html';
                }
            } else {
                showErrorMessage(result.message || 'Erro ao fazer login');
            }
        } catch (error) {
            showErrorMessage('Erro ao fazer login');
        }
    });

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
