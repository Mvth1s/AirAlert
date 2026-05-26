# Contributing to AirAlert

First off, thank you for taking the time to contribute! 🎉  
AirAlert is an open-source project and every contribution matters, whether it's a bug report, a feature suggestion, a fix, or an improvement to the documentation.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Reporting Bugs](#reporting-bugs)
4. [Suggesting Features](#suggesting-features)
5. [Development Setup](#development-setup)
6. [Pull Request Process](#pull-request-process)
7. [Commit Convention](#commit-convention)
8. [Code Style](#code-style)

---

## Code of Conduct

By participating in this project, you agree to keep interactions respectful and constructive. Harassment, discrimination, or any form of toxic behavior will not be tolerated.

---

## How to Contribute

There are many ways to contribute to AirAlert:

- 🐛 **Report a bug** — something doesn't work as expected
- 💡 **Suggest a feature** — an idea that could improve the app
- 🔧 **Submit a fix** — patch a bug you found
- 📖 **Improve documentation** — fix typos, improve clarity
- 🧪 **Test on your device** — report compatibility with your AirPods model and iOS version

---

## Reporting Bugs

Before opening a bug report, please check that the issue hasn't already been reported in the [Issues](https://github.com/Mvth1s/airalert/issues) tab.

When opening a bug report, please include:

- **AirPods model** (e.g. AirPods Pro 2nd gen)
- **iOS version** (e.g. iOS 18.4)
- **App version**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- Any relevant **screenshots or logs**

Use the **Bug Report** issue template when available.

---

## Suggesting Features

Open a [Feature Request](https://github.com/Mvth1s/airalert/issues/new) issue and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered

Please keep in mind the [scope of the project](./CAHIER_DES_CHARGES.md) — features requiring private Apple APIs or Android support are out of scope for v1.

---

## Development Setup

### Prerequisites

- Node.js >= 18
- npm or pnpm
- Git
- (Optional) Xcode on macOS for iOS testing

### Local setup

```bash
# 1. Fork the repository on GitHub, then clone your fork
git clone https://github.com/<your-username>/airalert.git
cd airalert

# 2. Install dependencies
npm install

# 3. Create a branch for your work
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-name

# 4. Run in the browser (limited BLE support)
npm run dev

# 5. Build and sync with Capacitor
npm run build
npx cap sync ios
```

> **Note:** Testing BLE features requires a physical iPhone with AirPods. The browser dev mode allows working on the UI, but Bluetooth will not be available.

---

## Pull Request Process

1. **Fork** the repository and create your branch from `main`
2. Make your changes with clear, focused commits (see [Commit Convention](#commit-convention))
3. **Test** your changes on a real device if the change involves BLE or notifications
4. Update relevant **documentation** if needed (README, ARCHITECTURE.md, etc.)
5. Open a **Pull Request** against the `main` branch
6. Fill in the PR template completely
7. Wait for review — feedback will be given within a reasonable time

### PR rules

- One PR = one feature or one fix (keep it focused)
- PRs must pass the CI pipeline (lint + build)
- Breaking changes must be clearly documented in the PR description

---

## Commit Convention

AirAlert follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <short description>
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, CI changes |

### Examples

```bash
feat(ble): add automatic reconnection on connection loss
fix(notifications): prevent duplicate alerts for same threshold
docs(readme): update build instructions for GitHub Actions
chore(deps): update @capacitor-community/bluetooth-le to v7
```

---

## Code Style

- **TypeScript** — strict mode enabled, no `any` unless absolutely necessary
- **Vue 3** — Composition API only (`<script setup>`)
- **Formatting** — Prettier (config in `.prettierrc`)
- **Linting** — ESLint with Vue + TypeScript rules

Run the linter before committing:

```bash
npm run lint
npm run lint:fix   # auto-fix where possible
```

---

## Questions?

If you're unsure about anything, open a [Discussion](https://github.com/Mvth1s/airalert/discussions) or a draft PR — it's always better to ask early than to discover a mismatch after a lot of work.

Thank you for contributing to AirAlert! 🔔
