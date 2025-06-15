<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$database = "database";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Erro na conexão com banco"]));
}

if (isset($_GET['action']) && $_GET['action'] === 'get_espacos') {
    header('Content-Type: application/json');
    $result = $conn->query("SELECT id, nome FROM espacos");
    $espacos = [];
    while ($row = $result->fetch_assoc()) {
        $espacos[] = ['id' => $row['id'], 'nome' => $row['nome']];
    }
    echo json_encode($espacos);
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $espaco_id   = $_POST['selecionarSala'] ?? null;
    $data        = $_POST['data'] ?? null;
    $hora_inicio = $_POST['hora_inicio'] ?? null;
    $hora_fim    = $_POST['hora_fim'] ?? null;
    $motivo      = $_POST['motivo'] ?? null;
    $usuario_id  = $_SESSION['utilizador_id'] ?? null;
    $habilitado  = 1;
    $pendente = "Pendente";

    if (!$espaco_id || !$data || !$hora_inicio || !$hora_fim || !$motivo) {
        die("Todos os campos são obrigatórios.");
    }

    $stmt = $conn->prepare("INSERT INTO agendamentos (utilizador_id, espaco_id, data, hora_inicio, hora_fim, motivo, status, aprovacao_rejeicao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iissssis", $usuario_id, $espaco_id, $data, $hora_inicio, $hora_fim, $motivo, $habilitado, $pendente);


    if ($stmt->execute()) {
        header("Location: agendar_espacos.html");
        exit;
    } else {
        echo "Erro ao agendar: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
    exit;
}

http_response_code(405);
echo "Método não permitido";
?>
