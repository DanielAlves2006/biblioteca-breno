<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID inválido']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "database");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão']);
    exit;
}

$stmt = $conn->prepare("UPDATE agendamentos SET status = 0 WHERE id = ?");
$stmt->bind_param("i", $id);
$success = $stmt->execute();

echo json_encode(['success' => $success]);

$conn->close();
?>
