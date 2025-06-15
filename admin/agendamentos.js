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
            <td>${ag.utilizador_nome || 'N/D'}</td>
            <td>${ag.espaco}</td>
            <td>${ag.data}</td>
            <td>${ag.hora_inicio}</td>
            <td>${ag.hora_fim}</td>
            <td>${ag.motivo}</td>
            <td class="d-flex justify-content-center gap-2">
                <span class="badge ${ag.status_sala === 'Ativo' ? 'bg-success' : 'bg-secondary'}">${ag.status_sala}</span>
                <span class="badge ${ag.aprovacao_rejeicao === 'Pendente' ? 'bg-warning' : ag.aprovacao_rejeicao === 'Aprovado' ? 'bg-success' : ag.aprovacao_rejeicao === 'Rejeitado' ? 'bg-danger' : 'bg-secondary'}">${ag.aprovacao_rejeicao}</span>
            </td>
            <td>
                <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-sm btn-primary btn-editar" data-id="${ag.id}">Editar</button>
                    <button class="btn btn-sm btn-danger btn-excluir" data-id="${ag.id}">Excluir</button>
                </div>
            </td>
            `;
            tabela.appendChild(linha);
        });

        document.querySelectorAll(".btn-excluir").forEach(botao => {
          botao.addEventListener("click", function () {
            const id_delet = this.getAttribute("data-id");
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
                excluirAgendamento(id_delet);
              }
            });
          });
        });

        document.querySelectorAll(".btn-editar").forEach(botao => {
          botao.addEventListener("click", function () {
            let escolha = "";
            const id_edicao = this.getAttribute("data-id");
            Swal.fire({
              title: 'Edição de agendamento',
              text: 'Escolha um estado para o agendamento!',
              icon: 'info',
              showCancelButton: true,
              showDenyButton: true,         
              confirmButtonText: 'Aprovar',
              denyButtonText: 'Rejeitar',
              cancelButtonText: 'Cancelar',
              confirmButtonColor: '#28a745', 
              denyButtonColor: '#dc3545',    
              cancelButtonColor: '#6c757d'  
            }).then((result) => {
              if (result.isConfirmed) {
                escolha = "Aprovado";
                editarAgendamento(id_edicao, escolha);
              } else if (result.isDenied) {
                escolha = "Rejeitado";
                editarAgendamento(id_edicao, escolha);
              }
            });
          });
        });
        })
        .catch(err => {
            tabela.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Erro ao carregar agendamentos.</td></tr>`;
            console.error("Erro ao carregar agendamentos:", err);
        });

    function excluirAgendamento(id_delet) {
    fetch("excluir_agendamento.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${encodeURIComponent(id_delet)}`
    })
    .then(res => res.json())
    .then(resp => {
      if (resp.success) {
        Swal.fire("Excluído!", "O agendamento foi excluído com sucesso.", "success");
        location.reload();
      } else {
        Swal.fire("Erro!", "Não foi possível excluir o agendamento: " + (resp.error || ""), "error");
      }
    })
    .catch(() => {
      Swal.fire("Erro!", "Erro na requisição ao excluir o agendamento.", "error");
    });
  }

  function editarAgendamento(id_edicao, escolha) {
    fetch("editar_agendamento.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${encodeURIComponent(id_edicao)} & escolha=${encodeURIComponent(escolha)}`
    })
    .then(res => res.json())
    .then(resp => {
      if (resp.success) {
        Swal.fire("Editado!", "O agendamento foi editado com sucesso.", "success");
        location.reload();
      } else {
        Swal.fire("Erro!", "Não foi possível editar o agendamento: " + (resp.error || ""), "error");
      }
    })
    .catch(() => {
      Swal.fire("Erro!", "Erro na requisição ao editar o agendamento.", "error");
    });
  }
});
