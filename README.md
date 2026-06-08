![promptlibrary Banner](https://github.com/ServiceNowDevProgram/Hacktoberfest/blob/main/images/promptlibrary-excluded.png)

:warning::warning::warning:<br>
## **Unfortunately, this repository is** ${\color{red}not}$ **available for participation in Hacktoberfest 2024. Contributions to this project will still be accepted for ServiceNow Community tracking but not for official Hacktoberfest participation.** (updated: 2024/10/03)<br>
:warning::warning::warning:
<br>
<br>
This repository is an entry point to submit prompts directly from this GitHub repo, so that they can appear at https://devlink.sn/PromptLibrary

The Prompt Library itself, is a community-driven hub for ServiceNow professionals to gather Generative AI prompts that we use to make our lives easier. **This is not a Now Assist product**. These are prompts we use inside GenAi Service Providers like ChatGPT, Claude Anthropic, or Google Gemini.
## ✍️ Prompt Frameworks

When writing prompts for this library, we recommend using the **RISEN framework** for clear, effective results.

| Component | Description |
|-----------|-------------|
| **R**ole | Define the AI's persona (e.g., "You are a ServiceNow ITSM architect") |
| **I**nstructions | Describe what the AI should do |
| **S**teps | Break the task into sequential steps |
| **E**nd Goal | State the desired outcome or deliverable |
| **N**arrowing | Set constraints — what to exclude, avoid, or limit |

**Example:**
```
Role: You are a ServiceNow platform architect.
Instructions: Review this Business Rule for performance issues.
Steps: 1. Check for missing query filters. 2. Flag hardcoded sys_ids. 3. Identify sync operations that could be async.
End Goal: A prioritized list of fixes with one-line explanations.
Narrowing: Server-side performance only. No UI or client-script suggestions.
```

🔔🔔🔔<br>
Note, this repository _can_ be installed on your ServiceNow instance but contributions to this repository are for **Prompt Submission only**.

***CONTRIBUTORS must follow all guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)*** or run the risk of having your Pull Requests labeled as spam.<br>
🔔🔔🔔

