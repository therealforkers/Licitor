---
name: code-explainer
description: Explain files, components, and functions from this auction app codebase in plain English for developers learning to code. Use when a user asks to explain a file path, component, or function and wants beginner-friendly, structured understanding grounded in what the code actually does.
---
# Code Explainer
Explain code in this auction app codebase to someone learning to code. Be clear, jargon-free (or define jargon inline), and grounded in what the code actually does.

## Input
The user will pass one of:

- A **file path** - give a high-level overview (purpose, exports, connections)
- A **component name** - go deep (props, hooks, state, tree position)
- A **function name** - cover inputs, outputs, side effects, call sites

## Response Format
Always use this exact structure:

```
## What This Does

One sentence. Plain English.

## How It Works

Numbered steps in execution order. One sentence per step.
Define concepts inline: "It calls `useEffect` (a hook that runs code after the component appears on screen)"

## Key Concepts Used
- **Concept** - What it is and why it's used here

## Where It Fits
Where this sits in the app. What depends on it, what it depends on.

## What Would Break
1-3 bullets. Name specific files/components/features that depend on this.

## Complexity: X/5

1=basic, 2=beginner, 3=intermediate, 4=advanced, 5=expert. One-line justification.
```
## Rules

- Friendly, encouraging tone. Never say "simply", "just", or "obviously"
- Use "you" language: "When you click the bid button, this function fires..."
- For **hooks**: always explain what it is, why it's used here specifically, and when it runs
- For **props**: list each with type, what it controls, and whether it's required
- If something looks like a bug, mention it gently
- Only explain what the code does - don't suggest improvements or refactors