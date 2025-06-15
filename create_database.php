<?php
require_once 'config/database.php';

try {
    // Conectar ao MySQL sem selecionar banco
    $conn = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Criar banco de dados
    $sql = file_get_contents('database.sql');
    $conn->exec($sql);
    
    echo "Banco de dados e tabelas criados com sucesso!";
} catch(PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
