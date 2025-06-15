document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.querySelector("tbody");

    fetch(`agendamentos.php`)
        .then(res => res.json())
        .then(Lista => {
            tabela.innerHTML = "";

            if (!Array.isArray(Lista) || Lista.length === 0) {
                tabela.innerHTML = `<tr><td colspan="8" class="text-center">Nenhum agendamento encontrado.</td></tr>`;
                return;
            }

            Lista.forEach(ag => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${ag.utilizador_nome}</td>
                    <td>${ag.espaco}</td>
                    <td>${ag.data}</td>
                    <td>${ag.hora_inicio}</td>
                    <td>${ag.hora_fim}</td>
                    <td>${ag.motivo}</td>
                    <td><span class="badge ${ag.aprovacao_rejeicao === 'Pendente' ? 'bg-warning' : ag.aprovacao_rejeicao === 'Aprovado' ? 'bg-success' : ag.aprovacao_rejeicao === 'Rejeitado' ? 'bg-danger' : 'bg-secondary'}">${ag.aprovacao_rejeicao}</span></td>
                    <td>
                        <button class="btn btn-sm btn-danger" data-id="${ag.id}">Excluir</button>
                    </td>
                `;

                tabela.appendChild(linha);
            });

            console.log("Resposta do PHP:", Lista);
        })
        .catch(err => {
            tabela.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Erro ao carregar agendamentos.</td></tr>`;
            console.error("Erro ao carregar agendamentos:", err);
        });

    tabela.addEventListener("click", function (e) {
        if (e.target.matches("button.btn-danger")) {
            const id = e.target.getAttribute("data-id");

            Swal.fire({
                title: "Tem certeza?",
                text: "Você deseja excluir este agendamento?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sim, excluir",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch("desativar_agendamento.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id })
                    })
                    .then(res => res.json())
                    .then(response => {
                        console.log("Resposta ao excluir:", response);

                        if (response.success) {
                            Swal.fire("Excluído!", "Agendamento desativado com sucesso.", "success");
                            e.target.closest("tr").remove();
                        } else {
                            Swal.fire("Erro", "Não foi possível desativar o agendamento.", "error");
                        }
                    });
                }
            });
        }
    });
});
