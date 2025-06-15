document.addEventListener('DOMContentLoaded', function () {
  // Carrega as opções de salas no select
  fetch('opcoes_salas.php')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('selecionarSala');
      data.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala.id;
        option.textContent = sala.nome;
        select.appendChild(option);
      });
    });

  // Evento para deletar sala via AJAX
  const form = document.getElementById('formExcluirSala');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const salaId = document.getElementById('selecionarSala').value;
    if (!salaId) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Selecione uma sala para excluir.',
        background: '#1e1e1e',
        color: '#fff',
        confirmButtonColor: '#d33'
      });
      return;
    }

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#555',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      background: '#1e1e1e',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('deletar_sala.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `sala_id=${encodeURIComponent(salaId)}`
        })
        .then(res => res.text())
        .then(msg => {
          Swal.fire({
            title: 'Sucesso!',
            text: msg,
            icon: 'success',
            confirmButtonColor: '#4caf50',
            background: '#1e1e1e',
            color: '#fff'
          }).then(() => location.reload());
        })
        .catch(() => {
          Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível excluir a sala.',
            icon: 'error',
            confirmButtonColor: '#d33',
            background: '#1e1e1e',
            color: '#fff'
          });
        });
      }
    });
  });
});
