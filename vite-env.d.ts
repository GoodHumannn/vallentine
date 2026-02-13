declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(params: { apiKey: string });
    models: {
      generateContent(params: any): Promise<any>;
    };
  }
}
