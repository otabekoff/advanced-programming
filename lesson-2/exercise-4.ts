interface Payment {
  prepare(): void;
  process(amount: number): void;
}

// 1. Concrete Payment Classes

class CreditCardPayment implements Payment {
  constructor(private readonly cardLast4: string) {}

  validate(): void {
    if (!/^\d{4}$/.test(this.cardLast4)) {
      throw new Error("Invalid credit card reference");
    }
  }

  prepare(): void {
    this.validate();
    console.log("Credit card validated");
  }

  process(amount: number): void {
    console.log(`Credit card payment: ${amount.toFixed(2)}`);
  }
}

class PaymePayment implements Payment {
  constructor(private readonly accessToken: string) {}

  authenticate(): void {
    if (!this.accessToken.trim()) {
      throw new Error("Payme access token is required");
    }
  }

  prepare(): void {
    this.authenticate();
    console.log("Payme authenticated");
  }

  process(amount: number): void {
    console.log(`Payme payment: ${amount.toFixed(2)}`);
  }
}

class ClickPayment implements Payment {
  constructor(private readonly billingAddress: string) {}

  validateAddress(): void {
    if (!this.billingAddress.trim()) {
      throw new Error("Click billing address is required");
    }
  }

  prepare(): void {
    this.validateAddress();
    console.log("Click address validated");
  }

  process(amount: number): void {
    console.log(`Click payment: ${amount.toFixed(2)}`);
  }
}

// 2. Abstract Factory

abstract class PaymentFactory {
  abstract createPayment(): Payment;
}

// 3. Concrete Factories

class CreditCardPaymentFactory extends PaymentFactory {
  constructor(private readonly cardLast4: string) {
    super();
  }

  override createPayment(): Payment {
    return new CreditCardPayment(this.cardLast4);
  }
}

class PaymePaymentFactory extends PaymentFactory {
  constructor(private readonly accessToken: string) {
    super();
  }

  override createPayment(): Payment {
    return new PaymePayment(this.accessToken);
  }
}

class ClickPaymentFactory extends PaymentFactory {
  constructor(private readonly billingAddress: string) {
    super();
  }

  override createPayment(): Payment {
    return new ClickPayment(this.billingAddress);
  }
}

// 4. Payment Processor

class PaymentProcessor {
  constructor(private readonly factory: PaymentFactory) {}

  processPayment(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Payment amount must be a positive number");
    }

    const payment = this.factory.createPayment();

    payment.prepare();
    payment.process(amount);
  }
}

// 5. New Payment Method: Bank Transfer

class BankTransferPayment implements Payment {
  constructor(private readonly accountNumber: string) {}

  prepare(): void {
    if (!this.accountNumber.trim()) {
      throw new Error("Bank account number is required");
    }

    console.log("Bank account validated");
  }

  process(amount: number): void {
    console.log(`Bank transfer: ${amount.toFixed(2)}`);
  }
}

class BankTransferPaymentFactory extends PaymentFactory {
  constructor(private readonly accountNumber: string) {
    super();
  }

  override createPayment(): Payment {
    return new BankTransferPayment(this.accountNumber);
  }
}

// 6. Testing

function testPaymentFactory(): void {
  const creditCardProcessor = new PaymentProcessor(
    new CreditCardPaymentFactory("4242"),
  );

  const paymeProcessor = new PaymentProcessor(
    new PaymePaymentFactory("demo-payme-token"),
  );

  const clickProcessor = new PaymentProcessor(
    new ClickPaymentFactory("Tashkent, Uzbekistan"),
  );

  const bankTransferProcessor = new PaymentProcessor(
    new BankTransferPaymentFactory("DEMO-ACCOUNT-123"),
  );

  console.log("\n--- Credit Card ---");
  creditCardProcessor.processPayment(150);

  console.log("\n--- Payme ---");
  paymeProcessor.processPayment(75.5);

  console.log("\n--- Click ---");
  clickProcessor.processPayment(40);

  console.log("\n--- Bank Transfer ---");
  bankTransferProcessor.processPayment(120);
}

testPaymentFactory();
