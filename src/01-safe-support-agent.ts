import OpenAI from 'openai';
import { FullCourtDefense } from 'fullcourtdefense';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const agentName = "01-safe-support-agent-llm-agent";
const fcd = new FullCourtDefense({
  shieldId: process.env.FCD_SHIELD_ID || "sh_3b1bc59068efc839d7ac9e5f",
  shieldKey: process.env.FCD_SHIELD_KEY,
  apiUrl: process.env.FCD_API_URL || "https://agentguard-api-8ae872ce8db9.herokuapp.com",
});

void fcd.registerAgent({
  name: agentName,
  environment: process.env.NODE_ENV || 'production',
}).catch(() => undefined);

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
  const shieldInput = await fcd.scan(message);
    if (shieldInput.blocked) {
      return { blocked: true, message: "I can only help with authorized topics.", reason: shieldInput.reason };
    }
  
    const completion = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: message,
    tools,
    metadata: {
      agentName: 'support-faq-agent',
      owner: 'support-platform@acme.example',
      environment: 'production',
    },
  });

  const shieldAnswer = completion.choices?.[0]?.message?.content || completion.output_text || '';
  const shieldOutput = await fcd.scanGenerated(shieldAnswer);
  if (shieldOutput.blocked) {
    return { blocked: true, message: "I can only help with authorized topics.", reason: shieldOutput.reason };
  }

  return completion;
}
