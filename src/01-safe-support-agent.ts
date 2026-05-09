import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const tools = [
  {
    type: 'function',
    name: 'search_help_center',
    description: 'Search public support articles and product FAQs.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
      },
      required: ['query'],
    },
  },
  {
    type: 'function',
    name: 'lookup_order_status',
    description: 'Return non-sensitive shipping status for an authenticated customer.',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string' },
      },
      required: ['orderId'],
    },
  },
];

export async function answerSupportQuestion(message: string) {
  return openai.responses.create({
    model: 'gpt-4o-mini',
    input: message,
    tools,
    metadata: {
      agentName: 'support-faq-agent',
      owner: 'support-platform@acme.example',
      environment: 'production',
    },
  });
}
