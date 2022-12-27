import { ServiceBroker } from 'moleculer'
export abstract class SMSAbstract { 
  abstract baseUrl: string
  public abstract sendAuthSms(broker: ServiceBroker, mobile: string, code: number): Promise<string>
  public abstract sendUserVerifiedSms(broker: ServiceBroker, mobile: string): Promise<string> 
  public abstract sendUserRejectedSms(broker: ServiceBroker, mobile: string): Promise<string>  
  public abstract sendBuySuccessfulSms(broker: ServiceBroker, mobile: string, tokenType: string, tokenAmount: number): Promise<string> 
  public abstract sendSellSuccessfulSms(broker: ServiceBroker, mobile: string, tokenAmount: number, tokenType: string, priceFinalToman: number): Promise<string> 
  public abstract getMessageStatus(messageid: string): Promise<string>
  public abstract getStatus(): Promise<boolean>
}
