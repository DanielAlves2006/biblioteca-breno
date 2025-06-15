<?php
session_start();
require_once 'config/database.php';

// Verifica se o usuário já está logado
if (isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

// Processa o cadastro
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';
    $tipo = $_POST['tipo'] ?? '';

    try {
        $conn = connectDB();
        
        // Verifica se o email já existe
        $stmt = $conn->prepare("SELECT id FROM utilizadores WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $error = "Este email já está cadastrado";
        } else {
            // Insere o novo usuário
            $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO utilizadores (nome, email, palavra_passe, tipo) VALUES (?, ?, ?, ?)");
            $stmt->execute([$nome, $email, $senha_hash, $tipo]);
            
            header('Location: login.php?msg=success');
            exit();
        }
    } catch (PDOException $e) {
        $error = "Erro ao cadastrar usuário";
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Reservas - Cadastro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-5">
                    <div class="card-header">
                        <h3 class="mb-0">Cadastro</h3>
                    </div>
                    <div class="card-body">
                        <?php if (isset($error)): ?>
                            <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                        <?php endif; ?>
                        
                        <form method="POST" action="">
                            <div class="mb-3">
                                <label for="nome" class="form-label">Nome Completo</label>
                                <input type="text" class="form-control" id="nome" name="nome" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" name="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="senha" class="form-label">Senha</label>
                                <input type="password" class="form-control" id="senha" name="senha" required>
                            </div>
                            <div class="mb-3">
                                <label for="tipo" class="form-label">Tipo de Usuário</label>
                                <select class="form-control" id="tipo" name="tipo" required>
                                    <option value="aluno">Aluno</option>
                                    <option value="professor">Professor</option>
                                    <option value="funcionario">Funcionário</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Cadastrar</button>
                        </form>
                        <div class="text-center mt-3">
                            <a href="login.php">Já tem conta? Faça login aqui</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
