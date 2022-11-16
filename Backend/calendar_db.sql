-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 16. Nov 2022 um 08:13
-- Server-Version: 10.3.34-MariaDB-0+deb10u1
-- PHP-Version: 7.3.31-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `calendar`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `auth_token`
--

CREATE TABLE `auth_token` (
  `id` int(11) NOT NULL,
  `auth_token` varchar(255) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `userID` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `auth_token`
--

INSERT INTO `auth_token` (`id`, `auth_token`, `identifier`, `userID`, `date`) VALUES
(1, '$2b$10$vKjmYSEcoV2kNRVYLOckM.ZQ2UwRK5bqRkF9EgIIrVLd4zl7VIUZe', '0c6370d1ed7de4a20f4b50ecbd2b7b2fb115e44e5b8869a963db369448dda85cb44e17d7e6766278c8aadeba6412e186d54d6b536abd565cb1f0991fd4e7778c45dec114d8820ed6e29e01d13ca72b5305298d48ca6cb9d79d703e947e21ef4211d778027ddd9ec806a1a194e197a83d8f4be4fbad150c2d22d34f3007898c', 1, '2022-11-09 18:52:41'),
(2, '$2b$10$icM2smYqIEhFNziK3cPlRuXIWzLT01ieiwZW6y.Qveq/QBPAZEr5a', '783012105c63cdb643bc556cc5fa3f76a138cd59475ee692e1c45727dcb883b1a6a08eb8f470757aca1745197495ef345c616e4b3420df4afeecaaa6ecb6d2bc58f35c5d4b84c9ff9a911375a28b2fd3ffc31e7a95addb86ee2fccb75d04490a7d2192d3a0543036f8b4d37c7fdadb8df68b1571d90d97ece81964bff53b83', 1, '2022-11-09 18:54:45');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `meet`
--

CREATE TABLE `meet` (
  `ID` int(11) NOT NULL,
  `UserId1` int(11) DEFAULT NULL,
  `UserId2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `person`
--

CREATE TABLE `person` (
  `ID` int(11) NOT NULL,
  `Username` varchar(30) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Firstname` varchar(30) NOT NULL,
  `Lastname` varchar(30) NOT NULL,
  `Entry` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `person`
--

INSERT INTO `person` (`ID`, `Username`, `Email`, `Password`, `Firstname`, `Lastname`, `Entry`) VALUES
(1, 'mb', 'a@a.de', '$2b$10$ornhw8utl5vZr7NXKVzOJ.biXMISNIIY0IAeKUgNXs29FxvDIfieu', '', '', '2022-11-09');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `save`
--

CREATE TABLE `save` (
  `ID` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Date` date NOT NULL,
  `Start` datetime DEFAULT NULL,
  `End` datetime DEFAULT NULL,
  `Title` varchar(30) DEFAULT NULL,
  `Description` varchar(200) DEFAULT NULL,
  `Color` varchar(30) DEFAULT NULL,
  `calendar_type` int(11) NOT NULL,
  `matchID` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `save`
--

INSERT INTO `save` (`ID`, `UserId`, `Date`, `Start`, `End`, `Title`, `Description`, `Color`, `calendar_type`, `matchID`) VALUES
(4, 1, '2022-11-02', '2022-11-02 03:00:00', '2022-11-02 21:27:00', 'Wladi 2022-11-02', 'oh boy\n', 'blue', 0, 0),
(5, 1, '2022-11-03', '2022-11-03 13:00:00', '2022-11-03 16:00:00', 'Wladi 2022-11-03', 'oh boy Jolli\n', 'green', 0, 0),
(6, 1, '2022-11-03', '2022-11-03 13:00:00', '2022-11-03 16:00:00', 'Wladi 2022-11-03', 'oh boy Jolli\n', 'green', 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `settings`
--

CREATE TABLE `settings` (
  `ID` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `Montag` bit(1) DEFAULT NULL,
  `Dienstag` bit(1) DEFAULT NULL,
  `Mittwoch` bit(1) DEFAULT NULL,
  `Donerstag` bit(1) DEFAULT NULL,
  `Freitag` bit(1) DEFAULT NULL,
  `Samstag` bit(1) DEFAULT NULL,
  `Sontag` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `auth_token`
--
ALTER TABLE `auth_token`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `meet`
--
ALTER TABLE `meet`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `save`
--
ALTER TABLE `save`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UserId` (`UserId`);

--
-- Indizes für die Tabelle `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UserId` (`UserId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `auth_token`
--
ALTER TABLE `auth_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `meet`
--
ALTER TABLE `meet`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `person`
--
ALTER TABLE `person`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `save`
--
ALTER TABLE `save`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `settings`
--
ALTER TABLE `settings`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `save`
--
ALTER TABLE `save`
  ADD CONSTRAINT `save_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `person` (`ID`);

--
-- Constraints der Tabelle `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `person` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
