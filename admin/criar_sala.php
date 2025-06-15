<?php
    $nome = $_POST['nome_sala'];
    
    $host = "localhost";
    $user = "root";
    $pass = "";
    $dbname = "database";

    $conn = new mysqli($host, $user, $pass, $dbname);

    if ($conn->connect_error) {
        die("Erro na conexão: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("INSERT INTO espacos (nome) VALUES (?)");
    $stmt->bind_param("s", $nome);

    if ($stmt->execute()) {
        
        header("Location: confirmacao.html");
        exit;
    } else {
        echo "Erro ao cadastrar: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
?>