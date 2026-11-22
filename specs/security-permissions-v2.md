# Feature Specification: Valis AI Security & Permissions Console (v2.0)

**Surface**: `Valis Admin Console` (`demo-admin.valis.so`) -> `SECURITY` Sidebar Section  
**Routes**: `AI access` | `Meeting permissions` | `Audit log`  
**Core Components**:
- `src/components/AiSecurityView.tsx`
- `src/design-system/molecules/ValisDrawer.tsx` (shared `420px` slide-over drawer)
- `src/design-system/molecules/SecurityAiChatSandboxDrawer.tsx`
- `src/design-system/atoms/SecurityToolAccessPill.tsx`
- `src/utils/valisLogic.ts` (`evaluateSecuritySandboxPrompt`)

---

## 1. Product Philosophy & Design Guardrails

Valis AI Security follows **calm, typographic enterprise governance** aligned with `Reports` and `Valis Pulse`:
- **Unified Warm-Paper Surface**: Renders on `--valis-bg` (`#FAF8F3`) with crisp `--valis-canvas` (`#FFFFFF`) bordered tables (`border-[#EAE5D9] rounded-[8px]`).
- **Zero Jargon & Zero Emojis**: Plain, human-readable language (`Own calls`, `All Sales calls`, `Off`, `Read`, `Edit`, `Allowed`, `Blocked`). Zero decorative emojis (`⚙️`, `💬`, `🔒`, `🚫`, `✓`) and zero rainbow badge soup.
- **Google Workspace / Okta SSO Directory Sync**: Departments and headcounts are synced automatically from the identity provider (`Synced via Google Workspace SSO · 4 Departments · 80 Employees`) rather than created via ad-hoc manual forms.
- **Strict Permission Inheritance (`VALIS-RULE-09`)**: Connected AI assistants (`Valis Chat`, `Claude`, `Runbooks`) strictly inherit the authenticated user's department tool scope and explicit Team Lead call grant. No prompt can widen access, and Personal Second Brains are hardware-isolated even from managers and admins.

---

## 2. Information Architecture: 3 Single-Purpose Sidebar Views

Progressive disclosure separates governance into 3 focused screens so tables never overflow horizontally or compete for attention:

### Tab 1: `AI access` (`AI & Tool Access`)
- **H1**: `AI & Tool Access` (`22px font-semibold tracking-[-0.02em]`)
- **Subtitle**: `Control which company tools each department and their AI assistant can read or edit.`
- **Right Header Metadata**: `Synced via Google Workspace SSO · 4 Departments · 80 Employees` (`12.5px text-[#8A857C]`)
- **Strict 3-Column Table**: `Department` (28%) | `Enabled Tools` (58%) | `Action` (14%, right-aligned)
  - `Enabled Tools` uses plain editorial typography (no colored boxes): active tools in `#1A1917` (appending `(Edit)` where human-approved write-back is enabled), followed by a muted counter (`· 3 blocked` in `#8A857C`). Scales cleanly to 20+ enterprise connectors.
  - `Valis Deployment Team` displays muted `Infra telemetry only · 0 customer tools`.
  - `Action` renders a single inline blue text link (`Manage`, `#1D63B8 hover:underline 13px font-medium`). Clicking any row or `Manage` opens `<ValisDrawer />` on the `Permissions` tab.

### Tab 2: `Meeting permissions` (`Meeting & Voice Note Permissions`)
- **H1**: `Meeting & Voice Note Permissions` (`22px font-semibold tracking-[-0.02em]`)
- **Subtitle**: `By default, all employees only see calls they attended, and personal Second Brains are always private to the author.`
- **Strict 4-Column Table**: `Department` (26%) | `Team Lead` (28%) | `Lead Call Access` (32%) | `Action` (14%, right-aligned)
  - **5 SSO Rows**:
    1. `Sales Department` (`24 members`) | `Tom Becker · VP Sales` | `[ Own calls | All Sales calls ]` (default: `All Sales calls`)
    2. `Customer Support` (`18 members`) | `Daniel Kim · Head of Support` | `[ Own calls | All Support calls ]` (default: `Own calls`)
    3. `Engineering` (`32 members`) | `Marcus Vance · VP Engineering` | `[ Own calls | All Eng calls ]` (default: `Own calls`)
    4. `Finance & Executive` (`6 members`) | `Priya Nair · VP Finance` | `[ Own calls | All Finance calls ]` (default: `All Finance calls`)
    5. `Valis Deployment Team` (`External`) | `Rollout Engineers` | Plain muted text `0% call content (Telemetry only)`
  - **High-Contrast Scanability for Elevated Privileges**:
    - Default restricted state (`Own calls`): neutral white pill (`bg-[#FFFFFF] border-[#DCD7CD] text-[#1A1917] font-medium`).
    - Elevated Manager Grant (`All [Dept] calls`): high-contrast dark ink pill (`bg-[#1A1917] border-[#1A1917] text-[#FFFFFF] font-medium`) so elevated privileges scan immediately.
    - Inactive option text uses `#5C5852` (`text-valis-navinactive`) for WCAG AA readability ($\ge 4.5:1$).
  - `Action` renders a single inline blue text link (`Test AI`). Clicking any row or `Test AI` opens `<ValisDrawer />` directly on the `Test AI Chat` tab.

### Tab 3: `Audit log` (`Security & AI Audit Log`)
- **H1**: `Security & AI Audit Log` (`22px font-semibold tracking-[-0.02em]`)
- **Auto-Close Behavior**: Navigating to `Audit log` automatically closes `<ValisDrawer />` so the 4-column log table always gets full horizontal width.
- **Filter Pills**: `rounded-full px-3.5 py-1 text-[12.5px]` matching `Reports`: `All`, `Permission changes`, `Blocked AI prompts`, `Approved edits`.
- **Full-Width 4-Column Table**: `Time` (`tabular-nums`) | `Person or AI` | `Event` | `Status` (right-aligned monochrome status).
- **Live Recording**: Every tool switch toggle, Team Lead call grant toggle, and `Test AI Chat` prompt immediately prepends a `Just now` event to the Audit Log.

---

## 3. Unified Slide-Over Drawer (`<ValisDrawer />` + `SecurityAiChatSandboxDrawer`)

- **Geometry & Overlay**: Renders at `w-[420px] fixed inset-y-0 right-0 z-50 bg-[#FAF8F3] border-l border-[#EAE5D9] shadow-2xl` over a full-viewport blurred backdrop (`fixed inset-0 z-40 bg-[#1A1917]/15 backdrop-blur-[1.5px]`). Underlying tables never squish, wrap, or truncate.
- **Dismissal**: Closes on clicking outside (backdrop), clicking the top-right `X` button, or pressing `Escape`.
- **Sticky Header**:
  - Eyebrow: `AI SECURITY SCOPE` (`11px uppercase tracking-[0.06em] text-[#8A857C]`)
  - H2 Title: Department Name (`18px font-semibold text-[#1A1917]`)
  - Subtitle: `[Lead Name] · [N] members` (`12.5px text-[#6E6A63]`)
  - 2-Tab Segmented Switch: `Permissions` | `Test AI Chat` (zero emojis/icons; `#5C5852` inactive WCAG AA contrast).

### Drawer Tab 1: `Permissions` (Explicit Scope Ownership)
Separated by flat `1px solid #EAE5D9` hairline dividers (no nested bordered cards):
1. **Section 1 Eyebrow — `TEAM LEAD CALL GRANT · [LEAD NAME] ONLY`** (e.g., `TEAM LEAD CALL GRANT · MARCUS VANCE ONLY`):
   - Single-line label `Lead Grant · [Lead Name]` (`whitespace-nowrap`) paired with `[ Own calls | All team calls ]` (using `#1A1917` dark fill when `All team calls` is active).
   - Quiet 1-line invariant note: `Regular members: own calls only · Personal Second Brain: always private`.
2. **Section 2 Eyebrow — `DEPARTMENT TOOL ACCESS · ALL [N] MEMBERS`** (e.g., `DEPARTMENT TOOL ACCESS · ALL 32 MEMBERS`):
   - Right-aligned live enabled counter (`5/8 enabled`, `tabular-nums`).
   - Live search input (`Search tools...`) filtering all 8 connected enterprise tools (`Salesforce CRM`, `Slack & Calendar`, `Jira Tasks`, `GitHub Repos`, `Google Drive Docs`, `Zendesk Support`, `NetSuite Finance ERP`, `Workday HR Payroll`).
   - Each tool row renders a neutral `[ Off | Read | Edit ]` segmented switch (`SecurityToolSegmentedSwitch`).
3. **Contract-Locked External Guardrail (`Valis Deployment Team`)**:
   - Displays `0% call content` and `Contract-locked · Zero customer data access`.
   - All 8 customer tool switches are strictly `disabled` (`cursor-not-allowed`, `opacity-60`) and pinned to `Off`.

### Drawer Tab 2: `Test AI Chat` (Live Boundary Verifier)
- **Full-Height Scrollable Thread**: Evaluates prompts live against the current in-memory `teamRules` and `meetingRows` via `evaluateSecuritySandboxPrompt()`.
- **Instant Semantic Verdict Colors**:
  - `Allowed` headers render in `#1E7E45` (`text-valis-green`).
  - `Blocked` and `Second Brain Firewall` headers render in `#9E3B2B` (`text-valis-blockedred`).
- **3 Quick-Test Prompt Pills (`rounded-full text-[12.5px]`)**:
  1. `Team call yesterday?` -> Evaluates Team Lead call grant (Allowed if `All team calls`, Blocked by Participants-Only Rule if `Own calls`).
  2. `Show HR salaries` -> Evaluates `Workday HR Payroll` tool permission (Allowed only for departments with Read/Edit access; Blocked otherwise).
  3. `Coworker's private Second Brain?` -> Always blocked by the hardware-isolated Second Brain Firewall regardless of role or department.
- **Live Chat Input**: Bottom form (`Ask Valis Chat as [Department]...` + Primary `#1A1917` `Send` button).

---

## 4. Verification & Automated Test Invariants (`npm test`)

- **Zero Raw Hex Guarantee**: `src/utils/valisLogic.test.ts` scans all `.tsx` files to ensure zero hardcoded `#XXXXXX` literals and 1:1 parity between `VALIS_TOKENS` and `src/index.css`.
- **Live Sandbox Logic Coverage**: Unit tests assert `cycleSecurityToolAccessOption` and `evaluateSecuritySandboxPrompt` across Team Lead grants, Participants-Only enforcement, HR tool scoping, and the Second Brain Firewall.
