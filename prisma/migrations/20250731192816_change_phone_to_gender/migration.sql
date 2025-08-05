/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" TEXT,
    "university" TEXT,
    "faculty" TEXT,
    "year" TEXT,
    "profilePhoto" TEXT,
    "uniqueCode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_uniqueCode_fkey" FOREIGN KEY ("uniqueCode") REFERENCES "unique_codes" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users" ("createdAt", "email", "faculty", "firstName", "id", "lastName", "password", "profilePhoto", "uniqueCode", "university", "updatedAt", "year") SELECT "createdAt", "email", "faculty", "firstName", "id", "lastName", "password", "profilePhoto", "uniqueCode", "university", "updatedAt", "year" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
