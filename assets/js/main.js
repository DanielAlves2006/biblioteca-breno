// Função para validar horários
function validarHorario(horaInicio, horaFim) {
    const inicio = horaInicio.split(':');
    const fim = horaFim.split(':');
    
    if (parseInt(inicio[0]) >= parseInt(fim[0])) {
        return false;
    }
    return true;
}

// Função para formatar data
function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Função para formatar hora
function formatarHora(hora) {
    return hora.padStart(2, '0') + ':00';
}

// Função para mostrar alerta
function mostrarAlerta(mensagem, tipo = 'success') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alerta, container.firstChild);
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }
}

// Função para inicializar os elementos da página
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Flatpickr para o calendário
    if (document.getElementById('data')) {
        flatpickr("#data", {
            dateFormat: "Y-m-d",
            minDate: "today",
            enableTime: false
        });
    }

    // Validar horários ao mudar
    const horaInicio = document.getElementById('hora_inicio');
    const horaFim = document.getElementById('hora_fim');
    
    if (horaInicio && horaFim) {
        horaInicio.addEventListener('change', () => {
            if (!validarHorario(horaInicio.value, horaFim.value)) {
                mostrarAlerta('A hora de início deve ser menor que a hora de término', 'danger');
            }
        });

        horaFim.addEventListener('change', () => {
            if (!validarHorario(horaInicio.value, horaFim.value)) {
                mostrarAlerta('A hora de início deve ser menor que a hora de término', 'danger');
            }
        });
    }
});
