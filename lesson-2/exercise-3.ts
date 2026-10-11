class NotificationConfig {
  constructor(
    public priority: string = "normal",
    public retryCount: number = 3,
    public timeout: number = 30,
  ) {}
}

abstract class Notification {
  public status: string = "pending";
  public config: NotificationConfig;

  constructor(
    public recipient: string,
    public message: string,
    config?: NotificationConfig,
  ) {
    this.config = config ?? new NotificationConfig();
  }

  abstract send(): boolean;
  abstract formatMessage(): string;

  getStatus(): Record<string, string> {
    return {
      type: this.constructor.name,
      recipient: this.recipient,
      status: this.status,
      priority: this.config.priority,
    };
  }
}

// TypeScript equivalent of Python's **kwargs.
// Additional properties support custom notification types.
interface NotificationOptions {
  config?: NotificationConfig;
  subject?: string;
  deviceToken?: string;
  badgeCount?: number;
  [key: string]: unknown;
}

class EmailNotification extends Notification {
  public subject: string;

  constructor(
    recipient: string,
    message: string,
    options: NotificationOptions = {},
  ) {
    super(recipient, message, options.config);

    if (typeof options.subject !== "string") {
      throw new Error("Email notification requires a subject");
    }

    this.subject = options.subject;
  }

  override send(): boolean {
    console.log(`📧 SendiFng email to ${this.recipient}`);
    this.status = "sent";
    return true;
  }

  override formatMessage(): string {
    return `Dear ${this.recipient},\n\n${this.message}`;
  }
}

class SMSNotification extends Notification {
  constructor(
    recipient: string,
    message: string,
    options: NotificationOptions = {},
  ) {
    super(recipient, message, options.config);
  }

  override send(): boolean {
    console.log(`📱 Sending SMS to ${this.recipient}`);
    this.status = "sent";
    return true;
  }

  override formatMessage(): string {
    return `Alert: ${this.message}`;
  }
}

class PushNotification extends Notification {
  public deviceToken: string;
  public badgeCount: number;

  constructor(
    recipient: string,
    message: string,
    options: NotificationOptions = {},
  ) {
    super(recipient, message, options.config);

    if (typeof options.deviceToken !== "string") {
      throw new Error("Push notification requires a device token");
    }

    this.deviceToken = options.deviceToken;
    this.badgeCount = options.badgeCount ?? 0;
  }

  override send(): boolean {
    console.log(
      `🔔 Sending push to device ${this.deviceToken.slice(0, 10)}...`,
    );
    this.status = "sent";
    return true;
  }

  override formatMessage(): string {
    return this.message;
  }
}

// Constructor type for dynamically registered notifications.
type NotificationConstructor = new (
  recipient: string,
  message: string,
  options?: NotificationOptions,
) => Notification;

// TODO: Implement NotificationFactory with registration system.
class NotificationFactory {
  /**
   * Factory for creating notifications with dynamic type registration.
   *
   * Requirements:
   * 1. Maintain a registry of available notification types.
   * 2. Provide a method to register new notification types at runtime.
   * 3. Validate configuration before creating a notification.
   * 4. Handle unknown notification types gracefully.
   */

  private static registry: Map<string, NotificationConstructor> = new Map();

  /**
   * Register a new notification type.
   *
   * @param name - Unique identifier for the notification type
   * @param notificationClass - Class extending Notification
   */
  static registerNotification(
    name: string,
    notificationClass: NotificationConstructor,
  ): void {
    // TODO: Implement registration logic.
    const key = name.trim().toLocaleLowerCase();

    if (!key) {
      throw new Error("Notification name cannot be empty");
    }

    if (this.registry.has(key)) {
      throw new Error(`Notification type ${key} already exists`);
    }

    this.registry.set(key, notificationClass);
  }

  /**
   * Create a notification instance.
   *
   * @param notificationType - Type of notification to create
   * @param recipient - Recipient address/token
   * @param message - Notification message
   * @param options - Additional notification-specific arguments
   *
   * @returns Notification instance or null if type not found
   */
  static createNotification(
    notificationType: string,
    recipient: string,
    message: string,
    options: NotificationOptions = {},
  ): Notification | null {
    // TODO: Implement factory creation logic with validation.
    const key = notificationType.trim().toLowerCase();

    const NotificationClass = this.registry.get(key);

    if (!NotificationClass) {
      return null;
    }

    const config = options.config ?? new NotificationConfig();

    if (typeof config.priority != "string" || config.priority.trim() === "") {
      throw new Error("Priority must be a non-empty string");
    }

    if (!Number.isInteger(config.retryCount) || config.retryCount < 0) {
      throw new Error("Retry count must be a non negative integer");
    }

    if (!Number.isFinite(config.timeout) || config.timeout <= 0) {
      throw new Error("Timeout must be a positive number");
    }

    return new NotificationClass(recipient, message, { ...options, config });
  }

  /**
   * Return a list of registered notification types.
   */
  static listAvailableTypes(): string[] {
    // TODO: Implement this method.
    return Array.from(this.registry.keys());
  }
}

function testNotificationFactory(): void {
  // Register built-in notification types.
  NotificationFactory.registerNotification("email", EmailNotification);

  NotificationFactory.registerNotification("sms", SMSNotification);

  NotificationFactory.registerNotification("push", PushNotification);

  console.log(
    "Available notification types:",
    NotificationFactory.listAvailableTypes(),
  );

  // Create different notifications.
  const email = NotificationFactory.createNotification(
    "email",
    "user@example.com",
    "Welcome to our service!",
    {
      subject: "Welcome Email",
    },
  );

  const sms = NotificationFactory.createNotification(
    "sms",
    "+1234567890",
    "Your verification code is 123456",
  );

  const push = NotificationFactory.createNotification(
    "push",
    "user123",
    "You have a new message",
    {
      deviceToken: "abc123def456",
      badgeCount: 1,
    },
  );

  const notifications: (Notification | null)[] = [email, sms, push];

  for (const notification of notifications) {
    if (notification) {
      console.log(`\nSending ${notification.constructor.name}`);

      notification.send();

      console.log(`Status: ${JSON.stringify(notification.getStatus())}`);
    }
  }
}

testNotificationFactory();


// To test and verify registration of O from SOLID - Open for extending, Close for modification

class TelegramNotification extends Notification {
  constructor(
    recipient: string,
    message: string,
    options: NotificationOptions = {},
  ) {
    super(recipient, message, options.config);
  }

  override send(): boolean {
    console.log(`✈️ Sending Telegram message to ${this.recipient}`);
    this.status = "sent";
    return true;
  }

  override formatMessage(): string {
    return `Alert: ${this.message}`;
  }
}

NotificationFactory.registerNotification("telegram", TelegramNotification);

const telegramMessage = new TelegramNotification("Otabek", "Hi, how are you?", {
  subject: "private",
});
console.log(telegramMessage instanceof Notification);

console.log(NotificationFactory.listAvailableTypes());
