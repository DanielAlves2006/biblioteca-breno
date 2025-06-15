-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 23-Jun-2025 às 20:23
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `database`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `agendamentos`
--

CREATE TABLE `agendamentos` (
  `id` int(11) NOT NULL,
  `utilizador_id` int(11) NOT NULL,
  `espaco_id` int(11) NOT NULL,
  `data` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fim` time NOT NULL,
  `motivo` text NOT NULL,
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `agendamentos`
--

INSERT INTO `agendamentos` (`id`, `utilizador_id`, `espaco_id`, `data`, `hora_inicio`, `hora_fim`, `motivo`, `status`) VALUES
(1, 1, 11, '2025-06-21', '22:08:00', '00:08:00', 'O PALMEIRAS NÃO TEM MUNDIAL!!!!!!!', 1),
(2, 1, 10, '2025-06-22', '23:11:00', '01:11:00', '!!!!O PALMEIRAS NÃO TEM MUNDIAL!!!!!!!', 1),
(3, 1, 5, '2025-06-23', '22:20:00', '03:15:00', 'O MUNDIAL DE CLUBES É UMA MERDA, QUASE DEIXOU MEU MANO SOLTEIRO ;(', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `espacos`
--

CREATE TABLE `espacos` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `espacos`
--

INSERT INTO `espacos` (`id`, `nome`) VALUES
(5, 'Teste 1'),
(6, 'Teste 2'),
(7, 'Teste 3'),
(8, 'Teste 4'),
(9, 'Teste 5'),
(10, 'Teste 6'),
(11, 'Teste 7');

-- --------------------------------------------------------

--
-- Estrutura da tabela `utilizadores`
--

CREATE TABLE `utilizadores` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `palavra_passe` varchar(255) NOT NULL,
  `tipo` enum('aluno','professor','funcionario','admin') DEFAULT 'aluno',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `utilizadores`
--

INSERT INTO `utilizadores` (`id`, `nome`, `email`, `palavra_passe`, `tipo`, `created_at`) VALUES
(1, 'willian Bispo Da Silva', 'diamondcraftee@gmail.com', '$2y$10$6Ch1MxN5Kd7Sz5OVAusQ9ecJGRHetWf7QL32qEeSYXCl5m45NIA/e', 'aluno', '2025-06-20 19:46:19'),
(2, 'Murilo', 'asd@gmail.com', '$2y$10$ZE4GPZ55cSxYnfqmzgp/buDEA1h6yeq6.5cf3Jn6TNvG7sob0aY1K', 'aluno', '2025-06-20 19:46:41'),
(3, 'WillianADM', 'root@admin', '$2y$10$8559h7WiN6eA4ad8IYF1HefXbLPRNeRYyYlZhVdFiRp9zi.8X7HnK', 'admin', '2025-06-20 19:59:41');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `agendamentos`
--
ALTER TABLE `agendamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilizador_id` (`utilizador_id`),
  ADD KEY `espaco_id` (`espaco_id`);

--
-- Índices para tabela `espacos`
--
ALTER TABLE `espacos`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `utilizadores`
--
ALTER TABLE `utilizadores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `agendamentos`
--
ALTER TABLE `agendamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `espacos`
--
ALTER TABLE `espacos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `utilizadores`
--
ALTER TABLE `utilizadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `agendamentos`
--
ALTER TABLE `agendamentos`
  ADD CONSTRAINT `agendamentos_ibfk_1` FOREIGN KEY (`utilizador_id`) REFERENCES `utilizadores` (`id`),
  ADD CONSTRAINT `agendamentos_ibfk_2` FOREIGN KEY (`espaco_id`) REFERENCES `espacos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
