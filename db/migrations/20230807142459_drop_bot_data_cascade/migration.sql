-- DropForeignKey
ALTER TABLE "Data" DROP CONSTRAINT "Data_botId_fkey";

-- DropForeignKey
ALTER TABLE "DataIndex" DROP CONSTRAINT "DataIndex_dataId_fkey";

-- AddForeignKey
ALTER TABLE "Data" ADD CONSTRAINT "Data_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataIndex" ADD CONSTRAINT "DataIndex_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
