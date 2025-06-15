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

$id = $_POST['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do agendamento não fornecido']);
    exit;
}

$sql = "DELETE FROM agendamentos WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao excluir o agendamento']);
}

$stmt->close();
$conn->close();
