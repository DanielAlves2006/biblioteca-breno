<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

// Verificar autenticação
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Não autorizado']);
    exit();
}

try {
    $conn = connectDB();
    
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            // Buscar espaços
            if (isset($_GET['espacos'])) {
                $stmt = $conn->query("SELECT * FROM espacos ORDER BY nome");
                $espacos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(['success' => true, 'espacos' => $espacos]);
                break;
            }

            // Buscar agendamentos
            $params = [];
            $query = "SELECT a.*, u.nome as usuario_nome, e.nome as espaco_nome 
                     FROM agendamentos a 
                     JOIN utilizadores u ON a.utilizador_id = u.id 
                     JOIN espacos e ON a.espaco_id = e.id 
                     WHERE 1 = 1 ";

            if (isset($_GET['espaco_id'])) {
                $query .= " AND a.espaco_id = ? ";
                $params[] = $_GET['espaco_id'];
            }

            if (isset($_GET['data'])) {
                $query .= " AND a.data = ? ";
                $params[] = $_GET['data'];
            }

            if (isset($_GET['status'])) {
                $query .= " AND a.status = ? ";
                $params[] = $_GET['status'];
            }

            if (isset($_GET['usuario'])) {
                $query .= " AND u.nome LIKE ? ";
                $params[] = "%{$_GET['usuario']}%";
            }

            $query .= " ORDER BY a.data, a.hora_inicio";

            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            $agendamentos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(['success' => true, 'agendamentos' => $agendamentos]);
            break;

        case 'POST':
            // Criar novo agendamento
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Verificar conflitos
            $stmt = $conn->prepare("
                SELECT COUNT(*) as count 
                FROM agendamentos 
                WHERE espaco_id = ? 
                AND data = ? 
                AND ((hora_inicio <= ? AND hora_fim > ?) 
                OR (hora_inicio < ? AND hora_fim >= ?))
            ");
            $stmt->execute([
                $data['espaco_id'],
                $data['data'],
                $data['hora_inicio'],
                $data['hora_inicio'],
                $data['hora_fim'],
                $data['hora_fim']
            ]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result['count'] > 0) {
                throw new Exception('Horário já está reservado para este espaço');
            }

            // Inserir agendamento
            $stmt = $conn->prepare("
                INSERT INTO agendamentos 
                (utilizador_id, espaco_id, data, hora_inicio, hora_fim, motivo) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $_SESSION['user_id'],
                $data['espaco_id'],
                $data['data'],
                $data['hora_inicio'],
                $data['hora_fim'],
                $data['motivo']
            ]);

            echo json_encode(['success' => true, 'message' => 'Agendamento realizado com sucesso']);
            break;

        case 'PUT':
            // Atualizar status do agendamento
            if (!isset($_SESSION['user_tipo']) || $_SESSION['user_tipo'] !== 'admin') {
                throw new Exception('Apenas administradores podem atualizar status');
            }

            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $conn->prepare("
                UPDATE agendamentos 
                SET status = ? 
                WHERE id = ?
            ");
            $stmt->execute([$data['status'], $data['id']]);

            echo json_encode(['success' => true, 'message' => 'Status atualizado com sucesso']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
