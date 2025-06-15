<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "database";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

$sql = "SELECT id, nome FROM espacos";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<option value='{$row['id']}'>{$row['nome']}</option>";
    }
} else {
    echo "<option value=''>Nenhum espaço encontrado</option>";
}

$conn->close();
?>
