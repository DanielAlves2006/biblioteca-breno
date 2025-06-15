<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

try {
    $conn = connectDB();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (isset($data['action'])) {
            switch ($data['action']) {
                case 'login':
                    if (!isset($data['email']) || !isset($data['senha'])) {
                        throw new Exception('Email e senha são obrigatórios');
                    }

                    $stmt = $conn->prepare("SELECT * FROM utilizadores WHERE email = ?");
                    $stmt->execute([$data['email']]);
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);

                    if ($user && password_verify($data['senha'], $user['palavra_passe'])) {
                        $_SESSION['utilizador_id'] = $user['id'];
                        $_SESSION['user_nome'] = $user['nome'];
                        $_SESSION['user_tipo'] = $user['tipo'];
                        
                        echo json_encode([
                            'success' => true,
                            'user' => [
                                'id' => $user['id'],
                                'nome' => $user['nome'],
                                'tipo' => $user['tipo']
                            ]
                        ]);
                        exit();
                    }
                    throw new Exception('Credenciais inválidas');

                case 'register':
                    if (!isset($data['nome']) || !isset($data['email']) || !isset($data['senha']) || !isset($data['tipo'])) {
                        throw new Exception('Todos os campos são obrigatórios');
                    }

                    // Verificar se email já existe
                    $stmt = $conn->prepare("SELECT id FROM utilizadores WHERE email = ?");
                    $stmt->execute([$data['email']]);
                    if ($stmt->fetch()) {
                        throw new Exception('Este email já está cadastrado');
                    }

                    // Criptografar senha
                    $senha_hash = password_hash($data['senha'], PASSWORD_DEFAULT);

                    // Inserir novo usuário
                    $stmt = $conn->prepare("INSERT INTO utilizadores (nome, email, palavra_passe, tipo) VALUES (?, ?, ?, ?)");
                    $stmt->execute([$data['nome'], $data['email'], $senha_hash, $data['tipo']]);

                    echo json_encode(['success' => true, 'message' => 'Cadastro realizado com sucesso']);
                    exit();

                default:
                    throw new Exception('Ação inválida');
            }
        }
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
