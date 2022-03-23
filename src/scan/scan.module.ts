import { HttpModule, Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  exports: [HttpModule],
})
export class ScanModule {}
