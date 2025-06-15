<?php
session_start();
require_once '../config/database.php';

// Verificar se o usuário é administrador
if (!isset($_SESSION['user_id']) || $_SESSION['user_tipo'] !== 'admin') {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Acesso não autorizado']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $agendamento_id = $data['id'] ?? null;
    $status = $data['status'] ?? null;

    if (!$agendamento_id || !$status) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit();
    }

    try {
        $conn = connectDB();
        $stmt = $conn->prepare("UPDATE agendamentos SET status = ? WHERE id = ?");
        $stmt->execute([$status, $agendamento_id]);

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar status']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}
?>
