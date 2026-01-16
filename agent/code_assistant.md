# CODE ASSISTANT

This file provides guidance to CODE-ASSISTANT when working with code in this repository.

> Important: Throughout all the documents with instructions in the current folder, 'Cursor' is referenced as "CODE-ASSISTANT". So, whenever "CODE-ASSISTANT". CODE-ASSISTANT is therefore always used when cursor is meant: whenever an instruction or a rule is described for CODE-ASSISTANT, this applies accordingly to cursor

## Quick Start for New Sessions

Before starting any work, read these files in order:
- pair_programming.md - Our workflow process for story-driven development
- project_plan_{some_extension}.md - Current progress and next story to work on
- technical_considerations.md - Lessons learned and implementation decisions

## Overview
Build an application that can help me track and record the score of multiple players for the game 'yatzy'.

## Development Commands
The application uses TypeScript and should use a frontend framework such as `svelte` and matching CSS. This project uses `bun` as package-manager. The application is a single page app, running in the browser. Results are stored in the browser's local storage.  

### Package Management
- Uses bun as the package manager

### Install Dependencies 
Install dependencies using bun
```bash
bun install
```
## Architecture Overview
Technology Stack
 - Svelte (or similar)
 - Single Page App
    
Implementation Status: ✅ Complete - Direct process management, universal command support, enhanced error messaging, JSON-RPC protocol, process lifecycle management, and tool execution all working.

## Project Structure Overview
Creatge the project sctructure according to the used frontend framework.