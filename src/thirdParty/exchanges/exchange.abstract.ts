export default abstract class ExchangeAbstract { 
  abstract baseUrl: string
  public abstract getPrices(symbol:string): Promise<any>
}
