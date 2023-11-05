import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE, NOTIFICATION_EVENT } from '@app/common';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-08-16',
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsClient: ClientProxy,
  ) { }

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      payment_method_types: ['card'],
      currency: 'usd',
    });

    this.notificationsClient.emit(NOTIFICATION_EVENT, {
      email,
      text: `Your payment of $${amount} has completed successfully.`,
    });

    return paymentIntent;
  }
}
