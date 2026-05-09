import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server(
  {
    name: 'devops-critical-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.registerTool('shell_exec', {
  description: 'Execute a shell command in the deployment environment.',
  inputSchema: {
    type: 'object',
    properties: {
      command: { type: 'string' },
    },
    required: ['command'],
  },
});

server.registerTool('write_file', {
  description: 'Write deployment files or generated configuration.',
  inputSchema: {
    type: 'object',
    properties: {
      path: { type: 'string' },
      content: { type: 'string' },
    },
    required: ['path', 'content'],
  },
});

server.registerTool('github_write_pr', {
  description: 'Create or update GitHub pull requests.',
  inputSchema: {
    type: 'object',
    properties: {
      repo: { type: 'string' },
      branch: { type: 'string' },
      body: { type: 'string' },
    },
    required: ['repo', 'branch'],
  },
});

server.registerTool('webhook_post_deploy_status', {
  description: 'POST deployment status to an external webhook.',
  inputSchema: {
    type: 'object',
    properties: {
      url: { type: 'string' },
      payload: { type: 'object' },
    },
    required: ['url', 'payload'],
  },
});

export { server };
