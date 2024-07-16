/*
  Warnings:

  - You are about to drop the column `imdbID` on the `Review` table. All the data in the column will be lost.
  - Added the required column `movieID` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Review` DROP COLUMN `imdbID`,
    ADD COLUMN `movieID` VARCHAR(191) NOT NULL;
