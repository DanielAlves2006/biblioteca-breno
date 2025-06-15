document.addEventListener('DOMContentLoaded', function() {
    // Carregar agendamentos
    carregarAgendamentos();

    // Filtros
    const filtroEspaco = document.getElementById('filtro_espaco');
    const filtroData = document.getElementById('filtro_data');
    const filtroStatus = document.getElementById('filtro_status');
    const filtroUsuario = document.getElementById('filtro_usuario');

    // Carregar espaços para o filtro
    fetch('api/espacos.php')
        .then(response => response.json())
        .then(espacos => {
            espacos.forEach(espaco => {
                const option = document.createElement('option');
                option.value = espaco.id;
                option.textContent = espaco.nome;
                filtroEspaco.appendChild(option);
            });
        });

    // Eventos dos filtros
    [filtroEspaco, filtroData, filtroStatus, filtroUsuario].forEach(filtro => {
        filtro.addEventListener('change', carregarAgendamentos);
    });

    // Aprovar agendamento
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-aprovar')) {
            const agendamentoId = e.target.dataset.agendamentoId;
            atualizarStatus(agendamentoId, 'aprovado');
        }
    });

    // Rejeitar agendamento
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-rejeitar')) {
            const agendamentoId = e.target.dataset.agendamentoId;
            atualizarStatus(agendamentoId, 'rejeitado');
        }
    });

    // Funções auxiliares
    async function carregarAgendamentos() {
        const params = new URLSearchParams();
        
        if (filtroEspaco.value) params.append('espaco_id', filtroEspaco.value);
        if (filtroData.value) params.append('data', filtroData.value);
        if (filtroStatus.value) params.append('status', filtroStatus.value);
        if (filtroUsuario.value) params.append('usuario', filtroUsuario.value);

        try {
            const response = await fetch(`api/agendamentos.php?${params.toString()}`);
            const agendamentos = await response.json();

            const tbody = document.getElementById('tabela_agendamentos');
            tbody.innerHTML = agendamentos.map(agenda => `
                <tr>
                    <td>${formatarData(agenda.data)}</td>
                    <td>${agenda.hora_inicio} - ${agenda.hora_fim}</td>
                    <td>${agenda.espaco_nome}</td>
                    <td>${agenda.usuario_nome}</td>
                    <td>${agenda.motivo}</td>
                    <td>
                        <span class="status-badge status-${agenda.status}">
                            ${agenda.status}
                        </span>
                    </td>
                    <td>
                        ${agenda.status === 'pendente' ? `
                            <button class="btn btn-sm btn-success btn-aprovar" 
                                    data-agendamento-id="${agenda.id}">
                                <i class="bi bi-check-circle"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-rejeitar" 
                                    data-agendamento-id="${agenda.id}">
                                <i class="bi bi-x-circle"></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
        }
    }

    async function atualizarStatus(agendamentoId, status) {
        try {
            const response = await fetch('api/atualizar_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: agendamentoId, status })
            });

            const result = await response.json();

            if (result.success) {
                carregarAgendamentos();
            } else {
                showErrorMessage('Erro ao atualizar status');
            }
        } catch (error) {
            showErrorMessage('Erro ao atualizar status');
        }
    }

    function formatarData(data) {
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR');
    }

    function showErrorMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container').insertBefore(alert, document.querySelector('.container').firstChild);
    }
});
