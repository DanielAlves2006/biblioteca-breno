<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "database";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro na conexão com o banco de dados']);
    exit;
}

$sql = "SELECT 
            a.id, a.data, a.hora_inicio, a.hora_fim, a.motivo, 
            a.status, a.aprovacao_rejeicao, e.nome AS espaco, u.nome AS utilizador_nome 
        FROM agendamentos a
        JOIN espacos e ON a.espaco_id = e.id
        JOIN utilizadores u ON a.utilizador_id = u.id
        WHERE 1
        ORDER BY a.data DESC, a.hora_inicio";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Erro no prepare: ' . $conn->error]);
    exit;
}

$stmt->execute();
$result = $stmt->get_result();

$Lista = [];

while ($row = $result->fetch_assoc()) {
    $row['status_sala'] = $row['status'] == 1 ? 'Ativo' : 'Desativado';
    unset($row['status']);
    $Lista[] = $row;
}

echo json_encode($Lista);

$stmt->close();
$conn->close();
