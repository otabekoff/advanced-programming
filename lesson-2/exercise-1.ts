abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;

  describe(): string {
    return `${this.constructor.name}: Area=${this.area().toFixed(2)}, Perimeter=${this.perimeter().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(
    public width: number,
    public height: number,
  ) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Square extends Shape {
  constructor(public side: number) {
    super();
  }

  area(): number {
    return this.side ** 2;
  }

  perimeter(): number {
    return 4 * this.side;
  }
}

// TODO: Implement ShapeFactory class with createShape method.
class ShapeFactory {
  /**
   * Factory for creating different shapes.
   *
   * @param shapeType - "circle", "rectangle", or "square"
   * @param args - Arguments for the specific shape constructor
   * @returns A Shape instance
   * @throws Error if shapeType is not recognized
   */
  static createShape(shapeType: string, ...args: number[]): Shape {
    // TODO: Implement the factory logic here.
    switch (shapeType) {
      case "circle":
        const radius = args[0];

        if (radius === undefined) {
          throw new Error("Radius is required");
        }

        return new Circle(radius);

      case "rectangle":
        const width = args[0];
        const height = args[1];

        if (width === undefined) {
          throw new Error("Width is required");
        }
        if (height === undefined) {
          throw new Error("Height is required");
        }

        return new Rectangle(width, height);

      case "square":
        const side = args[0];

        if (side === undefined) {
          throw new Error("Side is required");
        }
        return new Square(side);

      default:
        break;
    }
    throw new Error(`Unknown shape type: ${shapeType}`);
  }
}

function testShapeFactory(): void {
  const circle = ShapeFactory.createShape("circle", 5);
  const rectangle = ShapeFactory.createShape("rectangle", 4, 6);
  const square = ShapeFactory.createShape("square", 3);

  const shapes: Shape[] = [circle, rectangle, square];

  for (const shape of shapes) {
    console.log(shape.describe());
  }
}

testShapeFactory();
