-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 13, 2026 at 08:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kendaraan`
--

-- --------------------------------------------------------

--
-- Table structure for table `fuel_records`
--

CREATE TABLE `fuel_records` (
  `id` varchar(191) NOT NULL,
  `vehicleId` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `driver` varchar(191) DEFAULT NULL,
  `fuelType` varchar(191) NOT NULL,
  `liters` double NOT NULL,
  `pricePerLiter` double NOT NULL,
  `totalCost` double NOT NULL,
  `receiptUrl` varchar(191) DEFAULT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fuel_records`
--

INSERT INTO `fuel_records` (`id`, `vehicleId`, `date`, `driver`, `fuelType`, `liters`, `pricePerLiter`, `totalCost`, `receiptUrl`, `remarks`, `createdAt`, `updatedAt`) VALUES
('cmkawncxn0000nwqcagkez9ea', 'cmjaw7z0q000304l2445s3wi1', '2026-01-12 00:00:00.000', 'Akhid', 'Pertamax', 31.714, 12500, 396425, NULL, '', '2026-01-12 08:32:36.152', '2026-01-12 08:32:36.152'),
('cmkawosr10001nwqcguu3gp7n', 'cmjaw7z0q000304l2445s3wi1', '2026-01-12 00:00:00.000', 'Akhid', 'Pertamax', 11.214, 12500, 140175, NULL, '', '2026-01-12 08:33:43.307', '2026-01-12 09:05:48.900'),
('cmkb7r03c00004oqc7hj4dljs', 'cmjaw7z0q000304l2445s3wi1', '2026-01-14 00:00:00.000', 'Akhid', 'Pertamax', 25, 12500, 312500, NULL, '', '2026-01-12 13:43:21.909', '2026-01-12 13:43:21.909'),
('cmkb9g7sq00014oqczbkur9bg', 'cmjaw7z0q000304l2445s3wi1', '2026-01-07 00:00:00.000', '', 'Pertamax', 20, 12500, 250000, NULL, '', '2026-01-12 14:30:57.911', '2026-01-12 14:31:20.553'),
('cmkb9i7w700024oqcx068lwlz', 'cmjaw7z0q000304l2445s3wi1', '2026-01-09 00:00:00.000', 'Akhid', 'Pertamax', 32.714, 12500, 408925, NULL, '', '2026-01-12 14:32:31.349', '2026-01-12 14:32:31.349'),
('cmkb9udq900034oqcqfinjy5j', 'cmjaw7z0q000304l2445s3wi1', '2026-01-15 00:00:00.000', 'Akhid', 'Pertamax', 26.784, 12500, 334800, NULL, '', '2026-01-12 14:41:58.782', '2026-01-12 14:43:05.731');

-- --------------------------------------------------------

--
-- Table structure for table `maintenances`
--

CREATE TABLE `maintenances` (
  `id` varchar(191) NOT NULL,
  `vehicleId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `cost` double DEFAULT NULL,
  `mileage` int(11) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `maintenanceDate` datetime(3) NOT NULL,
  `nextServiceDate` datetime(3) DEFAULT NULL,
  `workshop` varchar(191) DEFAULT NULL,
  `technician` varchar(191) DEFAULT NULL,
  `notes` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `maintenances`
--

INSERT INTO `maintenances` (`id`, `vehicleId`, `type`, `description`, `cost`, `mileage`, `status`, `maintenanceDate`, `nextServiceDate`, `workshop`, `technician`, `notes`, `createdAt`, `updatedAt`) VALUES
('cmjw96cpf000004ifgha9oi36', 'cmjawdslz000504l28vbg145u', 'Ganti Oli & Filter', 'GANTI OLI+FILTER, TUNE UP, CEK REM, ENGINE ANALISA, ENGINE BOOSTER, HOLISTIC CLEAN SYSTEM, BRAKE FLUID BLEEDING', 2456077, NULL, 'completed', '2025-09-26 00:00:00.000', NULL, NULL, 'MUSTOPA KAMAL', 'KILOMETER 377.689', '2026-01-02 02:26:45.075', '2026-01-02 02:28:05.928'),
('cmjw9jbn4000204k3exvokvov', 'cmjawatgo000404l291ckvh9h', 'Lainnya', 'GANTI BUSI 4PCS (DENSO K16TT)\nGANTI LONG TIE ROD DAN TIE ROD\nSPOORING', 2250000, NULL, 'completed', '2025-10-14 00:00:00.000', NULL, NULL, 'YONDY BISMA', 'KILOMETER 321.911', '2026-01-02 02:36:50.224', '2026-01-02 02:37:20.609'),
('cmjw9ou87000304k3xs3g1o8v', 'cmjaw7z0q000304l2445s3wi1', 'Lainnya', 'GANTI BUSI 4PCS (DENSO K16TT)', 236000, NULL, 'completed', '2025-10-14 00:00:00.000', NULL, NULL, 'YONDY BISMA', 'KILOMETER 402.114', '2026-01-02 02:41:07.591', '2026-01-02 02:41:15.366'),
('cmjw9sw9o000404k3j2tgs65q', 'cmjawatgo000404l291ckvh9h', 'Perbaikan Mesin', 'GANTI CRANK SHAFT SEAL REAR + FRONT', 1859001, NULL, 'completed', '2025-10-15 00:00:00.000', NULL, NULL, 'MUSTOPA KAMAL', 'KILOMETER 322.038', '2026-01-02 02:44:16.860', '2026-01-02 02:44:31.219'),
('cmjw9x59d000504k3fbqgg1w9', 'cmjawdslz000504l28vbg145u', 'Lainnya', 'GANTI STABILIZER BUSHING/ASSY\nGANTI SPEEDOMETER CABLE\nGANTI ENGINE MOUNTING 1PCS (KANAN)\nGANTI BUSHING LATERAL', 2585000, NULL, 'completed', '2025-10-22 00:00:00.000', NULL, NULL, 'MUSTOPA KAMAL', 'KILOMETER 379.192', '2026-01-02 02:47:35.137', '2026-01-02 02:47:53.008'),
('cmjwa3pqo000604k3mcsvbp7o', 'cmjaw3fo5000104l2j5evs41c', 'Ganti Oli & Filter', 'GANTI OLI MESIN + FILTER\nGANTI OLI TRANSMISI\nGANTI OLI GARDAN\nENGINE ANALISA', 1561600, NULL, 'completed', '2025-10-28 00:00:00.000', NULL, NULL, 'SISWOYO', 'KILOMETER 121.689', '2026-01-02 02:52:41.616', '2026-01-02 02:52:53.244'),
('cmjwaifn5000004jlobodoj0h', 'cmjavqd0m000304js6v5oz8gg', 'Lainnya', 'GANTI SHOCK ABSORBER REAR (2PCS)', 922000, NULL, 'completed', '2025-11-13 00:00:00.000', NULL, NULL, 'MUSTOPA KAMAL', 'KILOMETER 252.956', '2026-01-02 03:04:08.369', '2026-01-02 03:04:29.000'),
('cmjwaqqq1000004jxh0gmjo5n', 'cmjawatgo000404l291ckvh9h', 'Perbaikan AC', 'SERVICE EVAPULATOR DEPAN + BLOWER\nGANTI DRYER SILIKA\nGANTI OLI COMPRESSOR DAN FREON', 1020000, NULL, 'completed', '2025-11-14 00:00:00.000', NULL, NULL, 'GATOT SUDARSONO', 'KILOMETER 323.832', '2026-01-02 03:10:35.977', '2026-01-02 03:12:40.543'),
('cmjwb5phq000004l18dqc27n8', 'cmjaw7z0q000304l2445s3wi1', 'Perbaikan AC', 'SERVICE EVAPULATOR DEPAN + BLOWER\nGANTI DRYER SILIKA\nGANTI OLI COMPRESSOR + FREON\nGANTI COMPERSSOR AC', 4080000, NULL, 'completed', '2025-11-14 00:00:00.000', NULL, NULL, 'GATOT SUDARSONO', 'KILOMETER 402.558', '2026-01-02 03:22:14.222', '2026-01-02 03:22:30.553'),
('cmjwboc62000004kv0gcrq032', 'cmjaw7z0q000304l2445s3wi1', 'Lainnya', 'GANTI KACA FILM FULL', 568000, NULL, 'completed', '2025-11-10 00:00:00.000', NULL, NULL, 'COOLPLUS', 'KILOMETER 402.531', '2026-01-02 03:36:43.418', '2026-01-02 03:36:59.958'),
('cmjwbrt3b000104kv2uwvp6b5', 'cmjawdslz000504l28vbg145u', 'Lainnya', 'GANTI KACA FILM FULL', 568000, NULL, 'completed', '2025-11-18 00:00:00.000', NULL, NULL, 'COOLPLUS', 'KILOMETER 380.810', '2026-01-02 03:39:25.319', '2026-01-02 03:39:35.485'),
('cmjwcifqt000004lakv15itjr', 'cmjawatgo000404l291ckvh9h', 'Perbaikan Mesin', 'GANTI COVER TIMING', 2684594, NULL, 'completed', '2025-11-22 00:00:00.000', NULL, NULL, 'MUSTOPA KAMAL', 'KILOMETER 324.262', '2026-01-02 04:00:07.733', '2026-01-02 04:00:47.798'),
('cmjwcs5lt000104lawk3gpals', 'cmj6jr7ex000004l1np16lyvb', 'Ganti Oli & Filter', 'GANTI OLI MESIN + FILTER OLI\nGANTI GASKET BAUT OLI\nENGINE FLUSH GERINDO\nBRAKE 4 RODA', 1081336, NULL, 'completed', '2025-12-05 00:00:00.000', NULL, NULL, 'RUSGI RUDIANTO', 'KILOMETER 63.696', '2026-01-02 04:07:41.153', '2026-01-02 04:07:51.451'),
('cmjwcuu29000204la5n9shv9p', 'cmj6jr7ex000004l1np16lyvb', 'Ganti Ban', 'GANTI BAN 1 UNIT DUNLOP 215/60R17 ENSAVE', 1335000, NULL, 'completed', '2025-12-05 00:00:00.000', NULL, NULL, 'YONDY BISMA', 'KILOMETER 63.708', '2026-01-02 04:09:46.161', '2026-01-02 04:09:57.951'),
('cmjwd2jut000304lalwkimkrs', 'cmjavqd0m000304js6v5oz8gg', 'Ganti Oli & Filter', 'GANTI OLI MESIN + FILTER', 742500, NULL, 'completed', '2025-12-08 00:00:00.000', NULL, NULL, 'MUSTOPA KAMAL', 'KILOMETER 253.853', '2026-01-02 04:15:46.181', '2026-01-02 04:16:01.488'),
('cmjwn7nuz000004lb88egp493', 'cmjavgvqp000004jsa3gfaidt', 'Lainnya', 'GANTI AKI (KERING) GS PLATINUM TIPE NS40Z MF 40 AH', 1500000, NULL, 'completed', '2026-01-02 00:00:00.000', NULL, NULL, 'AKMAL', 'KILOMETER 66.761', '2026-01-02 08:59:40.811', '2026-01-02 09:00:17.360'),
('cmk24aws2000004iayxhbuj9q', 'cmjaw5hmi000204l2aogdwbmj', 'Ganti Oli & Filter', 'GANTI OLI MESIN + FILTER OLI\nGANTI GASKET\nENGINE FLUSH\nBRAKE 4 RODA', 1068875, NULL, 'completed', '2025-12-09 00:00:00.000', NULL, NULL, 'ASEP', 'KILOMETER 7.368', '2026-01-06 04:56:56.690', '2026-01-06 04:58:02.502');

-- --------------------------------------------------------

--
-- Table structure for table `toll_records`
--

CREATE TABLE `toll_records` (
  `id` varchar(191) NOT NULL,
  `vehicleId` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `driver` varchar(191) DEFAULT NULL,
  `cost` double NOT NULL,
  `receiptUrl` varchar(191) DEFAULT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `toll_records`
--

INSERT INTO `toll_records` (`id`, `vehicleId`, `date`, `driver`, `cost`, `receiptUrl`, `remarks`, `createdAt`, `updatedAt`) VALUES
('cmkb9wp2j00044oqc89iskdkr', 'cmjaw7z0q000304l2445s3wi1', '2026-01-12 00:00:00.000', 'Akhid', 7500, NULL, '', '2026-01-12 14:43:46.794', '2026-01-12 14:43:46.794'),
('cmkba5um200054oqc4ugo5zxf', 'cmjaw7z0q000304l2445s3wi1', '2026-01-12 00:00:00.000', 'Akhid', 7500, NULL, '', '2026-01-12 14:50:53.880', '2026-01-12 14:50:53.880'),
('cmkba61l000064oqc4xqys4zs', 'cmjaw7z0q000304l2445s3wi1', '2026-01-12 00:00:00.000', 'Akhid', 11000, NULL, '', '2026-01-12 14:51:02.914', '2026-01-12 14:51:02.914'),
('cmkbaer1100074oqczjpbadon', 'cmjaw7z0q000304l2445s3wi1', '2026-01-12 00:00:00.000', 'Akhid', 11000, NULL, '', '2026-01-12 14:57:49.138', '2026-01-12 14:57:58.535');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'user',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('cmj0zxrbu000014ajdvy7q23k', 'admin', 'Administrator', '$2b$10$tfjO6GBgBkRjK1crHakbieYsjgz4ubsMTr/eiskdBuPdYB709m4dm', 'admin', '2025-12-11 05:27:16.121', '2025-12-11 05:27:16.121');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` varchar(191) NOT NULL,
  `licensePlate` varchar(191) NOT NULL,
  `brand` varchar(191) NOT NULL,
  `model` varchar(191) NOT NULL,
  `year` int(11) NOT NULL,
  `fuelType` varchar(191) DEFAULT NULL,
  `ownerId` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `lastServiceDate` datetime(3) DEFAULT NULL,
  `nextServiceDate` datetime(3) DEFAULT NULL,
  `lastServiceKm` int(11) DEFAULT NULL,
  `nextServiceKm` int(11) DEFAULT NULL,
  `taxExpireDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `licensePlate`, `brand`, `model`, `year`, `fuelType`, `ownerId`, `status`, `lastServiceDate`, `nextServiceDate`, `lastServiceKm`, `nextServiceKm`, `taxExpireDate`, `createdAt`, `updatedAt`) VALUES
('cmj6jr7ex000004l1np16lyvb', 'F 1127 J', 'TOYOTA', 'RUSH', 2022, 'MPV', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-12-05 00:00:00.000', NULL, 63696, 73696, '2026-03-04 00:00:00.000', '2025-12-15 02:40:53.576', '2025-12-19 00:48:25.626'),
('cmjavgvqp000004jsa3gfaidt', 'F 1128 J', 'TOYOTA', 'RUSH', 2022, 'MPV', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-10-09 00:00:00.000', NULL, 63059, 73059, '2027-03-04 00:00:00.000', '2025-12-18 03:19:51.985', '2025-12-18 03:19:51.985'),
('cmjavjo4m000204jsgqsrbts8', 'F 1921 I', 'TOYOTA', 'INNOVA', 2020, 'MPV', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-12-09 00:00:00.000', NULL, 183634, 193634, '2030-02-10 00:00:00.000', '2025-12-18 03:22:02.086', '2025-12-18 03:22:02.086'),
('cmjavqd0m000304js6v5oz8gg', 'F 1562 H', 'DAIHATSU', 'LUXIO', 2017, 'MPV', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-12-08 00:00:00.000', '2026-05-08 00:00:00.000', 253853, 263853, '2027-08-23 00:00:00.000', '2025-12-18 03:27:14.278', '2025-12-18 06:55:00.435'),
('cmjavsid4000404js2elyf6x6', 'F 8101 H', 'SUZUKI', 'CARRY', 2022, 'Pickup', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-12-18 00:00:00.000', '2026-03-18 00:00:00.000', 5121, 10121, '2027-04-20 00:00:00.000', '2025-12-18 03:28:54.520', '2025-12-18 06:54:06.954'),
('cmjavzqyi000004l2oox916wy', 'B 7381 TPA', 'TOYOTA', 'HIACE COMMUTER', 2024, 'MPV', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-06-05 00:00:00.000', NULL, 883, 10883, '2029-12-18 00:00:00.000', '2025-12-18 03:34:32.250', '2025-12-18 03:34:32.250'),
('cmjaw3fo5000104l2j5evs41c', 'B 7153 TPA', 'ISUZU', 'ELF', 2015, 'MPV', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-10-28 00:00:00.000', NULL, 121689, 126689, '2030-12-03 00:00:00.000', '2025-12-18 03:37:24.245', '2025-12-18 03:37:24.245'),
('cmjaw5hmi000204l2aogdwbmj', 'B 2037 SQ', 'SUZUKI', 'APV', 2008, 'Ambulan', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-12-09 00:00:00.000', NULL, 7368, 12368, '2028-08-12 00:00:00.000', '2025-12-18 03:39:00.090', '2025-12-18 03:39:00.090'),
('cmjaw7z0q000304l2445s3wi1', 'B 2567 SQ', 'DAIHATSU', 'XENIA', 2006, 'MPV', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-02-06 00:00:00.000', '2026-01-22 00:00:00.000', 399167, 409167, '2030-12-09 00:00:00.000', '2025-12-18 03:40:55.946', '2026-01-12 06:37:57.287'),
('cmjawatgo000404l291ckvh9h', 'B 2887 SQ', 'DAIHATSU', 'XENIA', 2006, 'MPV', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-05-14 00:00:00.000', '2025-12-14 00:00:00.000', 316033, 326033, '2026-10-19 00:00:00.000', '2025-12-18 03:43:08.712', '2025-12-18 11:05:37.399'),
('cmjawdslz000504l28vbg145u', 'B 2192 SQ', 'DAIHATSU', 'XENIA', 2007, 'MPV', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-09-26 00:00:00.000', '2026-03-26 00:00:00.000', 377690, 387690, '2027-11-07 00:00:00.000', '2025-12-18 03:45:27.575', '2025-12-18 07:12:56.450'),
('cmjawgytu000604l2v34hrqr8', 'F 6878 G', 'YAMAHA', 'NMAX', 2022, 'Motor', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-10-15 00:00:00.000', '2026-01-15 00:00:00.000', 4035, 6535, '2027-12-26 00:00:00.000', '2025-12-18 03:47:55.602', '2025-12-18 06:53:32.972'),
('cmjawjnab000704l28axcnnru', 'F 2716 F', 'YAMAHA', 'XRIDE', 2018, 'Motor', 'cmj0zxrbu000014ajdvy7q23k', 'active', '2025-10-15 00:00:00.000', '2026-01-23 00:00:00.000', 12433, 14933, '2028-10-01 00:00:00.000', '2025-12-18 03:50:00.611', '2025-12-23 06:06:30.741');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fuel_records`
--
ALTER TABLE `fuel_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fuel_records_vehicleId_idx` (`vehicleId`),
  ADD KEY `fuel_records_date_idx` (`date`);

--
-- Indexes for table `maintenances`
--
ALTER TABLE `maintenances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `maintenances_vehicleId_idx` (`vehicleId`),
  ADD KEY `maintenances_maintenanceDate_idx` (`maintenanceDate`);

--
-- Indexes for table `toll_records`
--
ALTER TABLE `toll_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `toll_records_vehicleId_idx` (`vehicleId`),
  ADD KEY `toll_records_date_idx` (`date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicles_licensePlate_key` (`licensePlate`),
  ADD KEY `vehicles_ownerId_idx` (`ownerId`),
  ADD KEY `vehicles_licensePlate_idx` (`licensePlate`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fuel_records`
--
ALTER TABLE `fuel_records`
  ADD CONSTRAINT `fuel_records_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `maintenances`
--
ALTER TABLE `maintenances`
  ADD CONSTRAINT `maintenances_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `toll_records`
--
ALTER TABLE `toll_records`
  ADD CONSTRAINT `toll_records_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
