-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: nus_cca_forum
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned DEFAULT NULL,
  `content` longtext,
  `user_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_posts_comments` (`post_id`),
  KEY `fk_comments_user` (`user_id`),
  CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_posts_comments` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` longtext,
  `user_id` bigint unsigned DEFAULT NULL,
  `likes` bigint DEFAULT NULL,
  `tag` longtext,
  `created_at` longtext,
  PRIMARY KEY (`id`),
  KEY `fk_posts_user` (`user_id`),
  CONSTRAINT `fk_posts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'# **Welcome to NUS\' CCA Forum!** \nI hope you enjoy using this forum! \\\n`This forum webapp is written in Golang & Typescript (React)!`',1,2,'main','25-Jan-23 3:44 PM'),(2,'# **Badminton Team recruiting**\nAre you a competitive player? or a casual player? We have players of all skill levels. As long as you have the interest, you are welcome to join us!  \n![image](https://cdn.pixabay.com/photo/2016/05/31/23/21/badminton-1428046__480.jpg)\n## Apply here: foo@bar.com',1,1,'badminton','25-Jan-23 3:46 PM'),(3,'post1',1,1,'tag1','25-Jan-23 4:52 PM'),(4,'post2',1,1,'tag2','25-Jan-23 4:52 PM'),(5,'post3',1,1,'tag3','25-Jan-23 4:52 PM'),(6,'post4',1,1,'tag2','25-Jan-23 4:52 PM'),(7,'post11',1,1,'post2','25-Jan-23 4:53 PM'),(8,'postx',1,2,'tag1','25-Jan-23 4:53 PM'),(9,'posty',1,1,'tag2','25-Jan-23 4:53 PM'),(10,'# **Welcome to NUS\' CCA Forum!** \nI hope you enjoy using this forum! \\\n`This forum webapp is written in Golang & Typescript (React)!` \\\\\n\nFree free to play around in this localhost version :) Test the limits ',1,2,'tag1','25-Jan-23 4:53 PM'),(11,'extraoverflow post',1,1,'overflow','25-Jan-23 4:54 PM');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(191) NOT NULL,
  `password` longblob NOT NULL,
  `security_qns` longtext NOT NULL,
  `security_ans` longblob NOT NULL,
  `likes` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Lam Cheng Hou',_binary '$2a$14$0xEvDcCnT.PNgwCZOX9kSeXtgSJfHRw9JmzoZg4SPRsWHhMxJLoRC','What is your sem1 GPA?',_binary '$2a$14$0YarA68q4b0Op9nd0FZJcej.RK0Nf.kRZYAU64yxbULMDi1R1/ha2','1 10 8 '),(2,'Simon Says',_binary '$2a$14$TXeatMwajvtc.OXBm6KpaubOX6MOqUutAQ2dzcsaHlaZKWErVqJQC','simonsays',_binary '$2a$14$cdabag4jAUcp47hx4O/fIuLnEmxxcR7AtfLOcFc1xxKCM0pNbNAjm','NONE');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-25 16:56:26
