import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { CREATE_PAYMENT_EVENT } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @MessagePattern(CREATE_PAYMENT_EVENT)
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() createChargeDto: PaymentsCreateChargeDto) {
    return this.paymentsService.createCharge(createChargeDto);
  }
}
