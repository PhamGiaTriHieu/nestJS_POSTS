import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Tri Hieu!';
  }
  getCalc(): number {
    return 1 + 1;
  }
}
