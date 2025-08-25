-- CreateTable
CREATE TABLE "public"."user_responses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userAnswer" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_responses_userId_questionId_key" ON "public"."user_responses"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "public"."user_responses" ADD CONSTRAINT "user_responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
