export class OwnedAsset {
  symbol: String;
  quantity: number;
  bookValue: number;

  public buyAsset(buyQuantity: number, currentPrice: number) : void {
    this.quantity += buyQuantity;
    this.bookValue += (buyQuantity * currentPrice);
  }

  public sellAsset(sellQuantity: number, currentPrice: number): void {
    this.quantity -= sellQuantity;
    this.bookValue -= (sellQuantity * currentPrice);
  }

  public calculateMarketValue(currentPrice: number) : number {
    return this.quantity * currentPrice;
  }
}
