<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $sala_id = $_POST["sala_id"] ?? '';

    if (!$sala_id) {
        echo "Nenhuma sala recebida.";
        exit;
    }

    $conn = new mysqli("localhost", "root", "", "database");
    if ($conn->connect_error) {
        echo "Erro na conexão.";
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM espacos WHERE id = ?");
    $stmt->bind_param("i", $sala_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo "Sala excluída com sucesso!";
    } else {
        echo "Sala não encontrada ou já foi excluída.";
    }

    $stmt->close();
    $conn->close();
}
?>
