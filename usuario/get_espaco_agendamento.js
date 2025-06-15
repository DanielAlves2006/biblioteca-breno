fetch('agendar.php?action=get_espacos')
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById('selecionarSala');
    data.forEach(espaco => {
      const option = document.createElement('option');
      option.value = espaco.id;
      option.textContent = espaco.nome;
      select.appendChild(option);
    });
  })
  .catch(() => {
    console.error('Erro ao carregar os espaços');
    const select = document.getElementById('selecionarSala');
    select.innerHTML = '<option value="">Erro ao carregar espaços</option>';
  });
