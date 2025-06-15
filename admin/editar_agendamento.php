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
$escolha = $_POST['escolha'] ?? null;

if (!$id || !$escolha) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do agendamento ou escolha não fornecidos']);
    exit;
}

$sql = "UPDATE agendamentos SET aprovacao_rejeicao = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro na preparação da query: ' . $conn->error]);
    exit;
}

$stmt->bind_param("si", $escolha, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao editar o agendamento']);
}

$stmt->close();
$conn->close();
