import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const tools = [
  {
    type: 'function',
    name: 'stripe_refund_payment',
    description: 'Create a Stripe refund or modify a payment.',
  },
  {
    type: 'function',
    name: 'postgres_customer_database',
    description: 'Read customer billing records from Postgres.',
  },
  {
    type: 'function',
    name: 'email_invoice_export',
    description: 'Email invoice exports to finance users.',
  },
];

export async function runFinanceAgent(customerId: string, request: string) {
  return openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a finance operations agent. Refunds require policy approval before execution.',
      },
      {
        role: 'user',
        content: request,
      },
    ],
    tools,
    metadata: {
      agentName: 'finance-refund-agent',
      owner: 'finance-ops@acme.example',
      customerId,
      actionPolicy: 'approval_required_for_payment_write',
    },
  });
}
