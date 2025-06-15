document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#data", {
    dateFormat: "Y-m-d",
    minDate: "today"
  });

  document.getElementById("formAgendamento").addEventListener("submit", function (e) {
    e.preventDefault();

    Swal.fire({
      title: 'Agendamento enviado!',
      text: 'Seu pedido de reserva foi processado com sucesso.',
      icon: 'success',
      background: '#1e1e1e',
      color: '#fff',
      confirmButtonColor: 'hsl(0, 0%, 46%)',
      confirmButtonText: 'OK'
    }).then(() => {
      this.submit();
    });
  });
});
