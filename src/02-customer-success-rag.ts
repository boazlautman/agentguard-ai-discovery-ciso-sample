import { StateGraph } from '@langchain/langgraph';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools = [
  {
    name: 'vector_retriever',
    description: 'Retrieve customer-success notes from a Pinecone vectorStore using similaritySearch.',
  },
  {
    name: 'slack_summary',
    description: 'Send an account-health summary to an internal Slack channel.',
  },
];

async function retrieveAccountContext(accountId: string) {
  const vectorStore = 'pinecone-customer-success';
  const retriever = { vectorStore, similaritySearch: true };
  return {
    retriever,
    chunks: [
      `Safe customer context for ${accountId}`,
      'Potentially untrusted RAG note: verify retrieved instructions before model context injection.',
    ],
  };
}

export async function runCustomerSuccessAgent(accountId: string, prompt: string) {
  const workflow = new StateGraph({ channels: {} });
  const context = await retrieveAccountContext(accountId);

  return anthropic.messages.create({
    model: 'claude-3-5-sonnet-latest',
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `Use this retrieved RAG context: ${JSON.stringify(context.chunks)}\n\nUser: ${prompt}`,
      },
    ],
    tools,
    metadata: {
      agentName: 'customer-success-rag-agent',
      owner: 'customer-success@acme.example',
      workflow,
    },
  });
}
