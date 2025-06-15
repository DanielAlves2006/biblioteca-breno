<?php
session_start();
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

$usuario_id = $_SESSION['utilizador_id'] ?? null;
if (!$usuario_id) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuário não autenticado']);
    exit;
}

$sql = "SELECT 
            a.id, a.data, a.hora_inicio, a.hora_fim, a.motivo, 
            a.aprovacao_rejeicao, 
            e.nome AS espaco,
            u.nome AS utilizador_nome
        FROM agendamentos a
        JOIN espacos e ON a.espaco_id = e.id
        JOIN utilizadores u ON a.utilizador_id = u.id
        WHERE a.status = 1 AND a.utilizador_id = ?
        ORDER BY a.data DESC, a.hora_inicio";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$Lista = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $Lista[] = $row;
    }
}

echo json_encode($Lista);

$stmt->close();
$conn->close();
?>
