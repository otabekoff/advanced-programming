enum DocumentType {
  TEXT = "text",
  PDF = "pdf",
  SPREADSHEET = "spreadsheet",
}

type DocumentMetadata = Record<string, string | number>;

abstract class Document {
  public createdAt: Date;
  public modifiedAt: Date;
  public content: string;

  constructor(
    public title: string,
    public author: string,
  ) {
    this.createdAt = new Date();
    this.modifiedAt = new Date();
    this.content = "";
  }

  abstract open(): string;
  abstract save(content: string): void;
  abstract getMetadata(): DocumentMetadata;
}

class TextDocument extends Document {
  public lineCount: number = 0;

  constructor(
    title: string,
    author: string,
    public encoding: string = "utf-8",
  ) {
    super(title, author);
  }

  override open(): string {
    return `Opening text document: ${this.title}`;
  }

  override save(content: string): void {
    this.content = content;
    this.lineCount = content.split("\n").length;
    this.modifiedAt = new Date();
  }

  override getMetadata(): DocumentMetadata {
    return {
      type: "Text Document",
      encoding: this.encoding,
      line_count: this.lineCount,
    };
  }
}

class PDFDocument extends Document {
  public pages: string[] = [];

  constructor(
    title: string,
    author: string,
    public pageSize: string = "A4",
    public securityLevel: number = 0,
  ) {
    super(title, author);
  }

  override open(): string {
    return `Opening PDF document: ${this.title}`;
  }

  override save(content: string): void {
    this.pages = content.split("\n---\n");
    this.modifiedAt = new Date();
  }

  override getMetadata(): DocumentMetadata {
    return {
      type: "PDF Document",
      page_size: this.pageSize,
      security_level: this.securityLevel,
      page_count: this.pages.length,
    };
  }
}

class SpreadsheetDocument extends Document {
  public sheets: string[] = [];

  constructor(
    title: string,
    author: string,
    public rows: number = 100,
    public columns: number = 26,
  ) {
    super(title, author);
  }

  override open(): string {
    return `Opening spreadsheet: ${this.title}`;
  }

  override save(content: string): void {
    this.sheets = content.split("\n###\n");
    this.modifiedAt = new Date();
  }

  override getMetadata(): DocumentMetadata {
    return {
      type: "Spreadsheet",
      dimensions: `${this.rows}x${this.columns}`,
      sheet_count: this.sheets.length,
    };
  }
}

// Additional document-specific parameters.
// TypeScript equivalent of Python's **kwargs.
interface DocumentOptions {
  encoding?: string;
  pageSize?: string;
  securityLevel?: number;
  rows?: number;
  columns?: number;
}

// TODO: Implement DocumentFactory with createDocument method.
class DocumentFactory {
  /**
   * Factory for creating different types of documents.
   *
   * @param docType - Type of document to create
   * @param title - Document title
   * @param author - Document author
   * @param options - Additional document-specific parameters
   *
   * @returns A Document instance
   * @throws Error if docType is not recognized
   */
  static createDocument(
    docType: DocumentType,
    title: string,
    author: string,
    options: DocumentOptions = {},
  ): Document {
    // TODO: Implement the factory logic here.
    switch (docType) {
      case DocumentType.TEXT:
        return new TextDocument(title, author, options.encoding);
      case DocumentType.PDF:
        return new PDFDocument(
          title,
          author,
          options.pageSize,
          options.securityLevel,
        );
      case DocumentType.SPREADSHEET:
        return new SpreadsheetDocument(
          title,
          author,
          options.rows,
          options.columns,
        );

      default:
        throw new Error(`Unsupported document type: ${docType}`);
    }
  }
}

function testDocumentFactory(): void {
  const textDoc = DocumentFactory.createDocument(
    DocumentType.TEXT,
    "My Novel",
    "Jane Author",
    { encoding: "utf-16" },
  );

  const pdfDoc = DocumentFactory.createDocument(
    DocumentType.PDF,
    "Annual Report",
    "Company Inc",
    {
      pageSize: "Legal",
      securityLevel: 2,
    },
  );

  const spreadsheet = DocumentFactory.createDocument(
    DocumentType.SPREADSHEET,
    "Sales Data",
    "Data Team",
    {
      rows: 1000,
      columns: 50,
    },
  );

  const documents: Document[] = [textDoc, pdfDoc, spreadsheet];

  for (const doc of documents) {
    console.log(`\n${doc.open()}`);
    console.log(`Metadata: ${JSON.stringify(doc.getMetadata())}`);
  }
}

testDocumentFactory();
