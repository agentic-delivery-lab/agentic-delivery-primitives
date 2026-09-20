# Agentic Primitives

Agentic Primitives are reusable, versioned capabilities for the organization:
agents, skills, instructions, hooks, deterministic validators, capability
catalogs, and MCP/tool contracts.

The architecture direction is one way:

```text
Architecture Authority -> Agentic Primitives -> approved distribution surfaces
                                       -> Delivery Control Plane selection
```

The organization Copilot agents published from `.github-private/agents` are
promoted projections from this repository unless a separate architecture
decision explicitly scopes an organization-only agent to that private surface.

This local repository is a history-preserving extraction prepared for review;
remote repository creation and organization publication remain operator steps.
