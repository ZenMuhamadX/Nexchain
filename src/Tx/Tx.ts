export class transactionInterface {
  public sender: string
  public receiver: string
  public amount: number

  constructor(sender: string, receiver: string, amount: number) {
    this.sender = sender
    this.amount = amount
    this.receiver = receiver
  }
}
