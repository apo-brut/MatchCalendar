-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 09, 2022 at 08:18 PM
-- Server version: 10.3.34-MariaDB-0+deb10u1
-- PHP Version: 7.3.31-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `calendar`
--

-- --------------------------------------------------------

--
-- Table structure for table `save`
--

CREATE TABLE `save` (
  `ID` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Date` date NOT NULL,
  `Start` datetime DEFAULT NULL,
  `End` datetime DEFAULT NULL,
  `Title` varchar(30) DEFAULT NULL,
  `Description` varchar(30) DEFAULT NULL,
  `Color` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `save`
--

INSERT INTO `save` (`ID`, `UserId`, `Date`, `Start`, `End`, `Title`, `Description`, `Color`) VALUES
(4, 1, '2022-11-02', '2022-11-02 03:00:00', '2022-11-02 21:27:00', 'Wladi 2022-11-02', 'oh boy\n', 'blue'),
(5, 1, '2022-11-03', '2022-11-03 13:00:00', '2022-11-03 16:00:00', 'Wladi 2022-11-03', 'oh boy Jolli\n', 'green'),
(6, 1, '2022-11-03', '2022-11-03 13:00:00', '2022-11-03 16:00:00', 'Wladi 2022-11-03', 'oh boy Jolli\n', 'green');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `save`
--
ALTER TABLE `save`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UserId` (`UserId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `save`
--
ALTER TABLE `save`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `save`
--
ALTER TABLE `save`
  ADD CONSTRAINT `save_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `person` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
