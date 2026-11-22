import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  filterReports,
  toggleBriefItemCompletion,
  getBriefProgressStats,
  cycleCommitmentStatus,
  cycleConnectorCeilingPolicy,
  toggleManagerTeamGrant,
  computeEffectiveAccessSimulation,
  cycleSecurityToolAccessOption,
  evaluateSecuritySandboxPrompt,
} from './valisLogic';
import {
  INITIAL_CONNECTOR_CEILINGS,
  INITIAL_DEPARTMENT_SCOPES,
  INITIAL_MANAGER_GRANTS,
  INITIAL_TEAM_TOOL_RULES,
  INITIAL_MEETING_PERMISSION_ROWS,
} from '../components/AiSecurityView';
import {
  INITIAL_REPORTS,
  INITIAL_BRIEF_ITEMS,
  INITIAL_MANAGEMENT_COMMITMENTS,
  ValisMemoryService,
} from '../services/valisMemoryService';
import * as DesignSystem from '../design-system';
import {
  AGENT_UI_RULES,
  validateFactHasCitations,
  VALIS_PRIMITIVES,
  VALIS_ALIAS_TOKENS,
  VALIS_TOKENS,
} from '../design-system';

function hexToRelativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fgHex: string, bgHex: string): number {
  const l1 = hexToRelativeLuminance(fgHex);
  const l2 = hexToRelativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function collectUiTsxFiles(rootDir: string): string[] {
  const uiDirs = [
    path.join(rootDir, 'src/components'),
    path.join(rootDir, 'src/design-system/atoms'),
    path.join(rootDir, 'src/design-system/molecules'),
  ];
  const tsxFiles: string[] = [path.join(rootDir, 'src/App.tsx')];

  for (const dir of uiDirs) {
    for (const entry of fs.readdirSync(dir)) {
      if (entry.endsWith('.tsx')) {
        tsxFiles.push(path.join(dir, entry));
      }
    }
  }
  return tsxFiles;
}

test('filterReports returns all reports when default filters are active', () => {
  const result = filterReports(INITIAL_REPORTS, {
    searchQuery: '',
    department: 'All departments',
    typeFilter: 'All',
  });
  assert.equal(result.length, INITIAL_REPORTS.length);
});

test('filterReports filters by report type and department accurately', () => {
  const summaryOnly = filterReports(INITIAL_REPORTS, {
    searchQuery: '',
    department: 'All departments',
    typeFilter: 'Summary',
  });
  assert.equal(summaryOnly.length, 3);
  assert.equal(summaryOnly[0].title, 'Workflow Diagnostics: Customer Support');

  const financeOnly = filterReports(INITIAL_REPORTS, {
    searchQuery: '',
    department: 'Finance',
    typeFilter: 'All',
  });
  assert.equal(financeOnly.length, 1);
  assert.equal(financeOnly[0].department, 'Finance');
});

test('Daily Brief includes exact original 5 sections (Calendar, Decide, I owe, Others owe, Signals) without hallucinated Other', () => {
  const orgItems = ValisMemoryService.filterBriefByMemoryScope(
    INITIAL_BRIEF_ITEMS,
    'org-brain',
    false
  );
  const sections = Array.from(new Set(orgItems.map((i) => i.section)));
  assert.deepEqual(sections, ['Calendar', 'Decide', 'I owe', 'Others owe', 'Signals']);
});

test('ValisMemoryService isolates OrgBrain vs Second Brain and handles Jira Propose Close / Snooze', () => {
  const secondBrainItems = ValisMemoryService.filterBriefByMemoryScope(
    INITIAL_BRIEF_ITEMS,
    'second-brain',
    true
  );
  assert.equal(secondBrainItems.length, 2);
  assert.equal(secondBrainItems.every((i) => i.memoryScope === 'second-brain'), true);

  const afterClose = ValisMemoryService.proposeCloseInExternalSystem(
    INITIAL_BRIEF_ITEMS,
    'dec-1'
  );
  const closedItem = afterClose.find((i) => i.id === 'dec-1');
  assert.equal(closedItem?.completed, true);
  assert.equal(closedItem?.externalSyncState, 'closed-in-external');

  const afterSnooze = ValisMemoryService.snoozeItemFromBrief(
    INITIAL_BRIEF_ITEMS,
    'owe-1'
  );
  const visibleAfterSnooze = ValisMemoryService.filterBriefByMemoryScope(
    afterSnooze,
    'org-brain',
    true
  );
  assert.equal(visibleAfterSnooze.some((i) => i.id === 'owe-1'), false);
});

test('AGENT_UI_RULES enforces all 11 core guardrails, barrel exports, and primary source citations on every brief item', () => {
  assert.equal(AGENT_UI_RULES.length, 11);
  assert.deepEqual(
    AGENT_UI_RULES.map((r) => r.id),
    [
      'VALIS-RULE-01',
      'VALIS-RULE-02',
      'VALIS-RULE-03',
      'VALIS-RULE-04',
      'VALIS-RULE-05',
      'VALIS-RULE-06',
      'VALIS-RULE-07',
      'VALIS-RULE-08',
      'VALIS-RULE-09',
      'VALIS-RULE-10',
      'VALIS-RULE-11',
    ]
  );
  assert.equal(VALIS_TOKENS.geometry.drawerWidth, '420px');
  assert.equal(VALIS_TOKENS.colors.blockedRed, '#9E3B2B');

  // Verify public barrel exports all canonical primitives
  for (const exportName of [
    'ValisButton',
    'ValisToggle',
    'ValisSegmentedSwitch',
    'ValisCard',
    'ValisCheckbox',
    'ValisBadge',
    'ValisDrawer',
    'ValisPageHeader',
    'ValisSectionEyebrow',
    'SourceCitationLink',
    'MetricCard',
    'SecurityToolStatusDropdown',
    'ValisChatComposer',
    'ValisKnotMark',
  ]) {
    assert.ok(
      exportName in DesignSystem,
      `src/design-system/index.ts must export ${exportName}`
    );
  }

  for (const item of INITIAL_BRIEF_ITEMS) {
    assert.equal(validateFactHasCitations(item.sources), true);
  }
});

test('toggleBriefItemCompletion and cycleCommitmentStatus work deterministically', () => {
  const initialStats = getBriefProgressStats(INITIAL_BRIEF_ITEMS);
  assert.equal(initialStats.completed, 0);

  const updated = toggleBriefItemCompletion(INITIAL_BRIEF_ITEMS, 'cal-1');
  assert.equal(getBriefProgressStats(updated).completed, 1);

  const nextList = cycleCommitmentStatus(
    INITIAL_MANAGEMENT_COMMITMENTS,
    INITIAL_MANAGEMENT_COMMITMENTS[0].id
  );
  assert.equal(nextList[0].status, 'At risk');
});

test('Design System CI Gate: 3-tier token parity (TS, CSS, W3C JSON), zero raw hexes, zero OS emojis, zero arbitrary rounded-[5px]', () => {
  const rootDir = process.cwd();
  const cssContent = fs.readFileSync(path.join(rootDir, 'src/index.css'), 'utf8');
  const jsonContent = fs.readFileSync(
    path.join(rootDir, 'src/design-system/tokens.json'),
    'utf8'
  );
  const parsedJson = JSON.parse(jsonContent);

  // 1. Verify every Tier 1 primitive color is synchronized 1:1 in src/index.css and tokens.json
  for (const [primKey, hexVal] of Object.entries(VALIS_PRIMITIVES.color)) {
    assert.equal(
      cssContent.toUpperCase().includes(hexVal.toUpperCase()),
      true,
      `VALIS_PRIMITIVES.color.${primKey} (${hexVal}) must be synchronized in src/index.css`
    );
    assert.equal(
      parsedJson.primitive?.color?.[primKey]?.$value?.toUpperCase(),
      hexVal.toUpperCase(),
      `VALIS_PRIMITIVES.color.${primKey} (${hexVal}) must match src/design-system/tokens.json`
    );
  }

  // 2. Verify every flat semantic color in VALIS_TOKENS.colors is synchronized in src/index.css
  for (const [tokenKey, hexVal] of Object.entries(VALIS_TOKENS.colors)) {
    assert.equal(
      cssContent.toUpperCase().includes(hexVal.toUpperCase()),
      true,
      `VALIS_TOKENS.colors.${tokenKey} (${hexVal}) must be synchronized in src/index.css`
    );
  }

  // 3. Scan every UI .tsx component for raw hex literals, OS color emojis, and arbitrary rounded-[5px]
  const tsxFiles = collectUiTsxFiles(rootDir);
  const rawHexRegex = /#[0-9A-Fa-f]{3,8}\b/g;
  const osEmojiRegex = /(\p{Emoji_Presentation}|[\u{2600}-\u{27BF}]\uFE0F|[\u{1F300}-\u{1FAFF}])/gu;
  const arbitraryRadiusRegex = /rounded-\[5px\]/g;

  for (const filePath of tsxFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relPath = path.relative(rootDir, filePath);

    const hexMatches = content.match(rawHexRegex);
    assert.equal(
      hexMatches,
      null,
      `Found hardcoded raw hex literal(s) ${hexMatches?.join(', ')} in ${relPath}. Use semantic Valis tokens instead.`
    );

    const emojiMatches = content.match(osEmojiRegex);
    assert.equal(
      emojiMatches,
      null,
      `Found banned OS color emoji(s) ${emojiMatches?.join(', ')} in ${relPath}. Use monochrome Lucide icons or clean typography (VALIS-RULE-05).`
    );

    const radiusMatches = content.match(arbitraryRadiusRegex);
    assert.equal(
      radiusMatches,
      null,
      `Found arbitrary rounded-[5px] in ${relPath}. Use semantic --valis-*-radius tokens instead (VALIS-RULE-11).`
    );
  }
});

test('Design System CI Gate: WCAG 2.1 AA contrast ratios (>= 4.5:1) across all core ink & status pairs', () => {
  const { surface, border, ink, status } = VALIS_ALIAS_TOKENS;

  const pairs: { name: string; fg: string; bg: string; min: number }[] = [
    { name: 'ink.primary on surface.page', fg: ink.primary, bg: surface.page, min: 4.5 },
    { name: 'ink.primary on surface.canvas', fg: ink.primary, bg: surface.canvas, min: 4.5 },
    { name: 'ink.secondary on surface.page', fg: ink.secondary, bg: surface.page, min: 4.5 },
    { name: 'ink.secondary on surface.canvas', fg: ink.secondary, bg: surface.canvas, min: 4.5 },
    { name: 'ink.navInactive on surface.sidebar', fg: ink.navInactive, bg: surface.sidebar, min: 4.5 },
    { name: 'ink.navInactive on border.divider (switch track)', fg: ink.navInactive, bg: border.divider, min: 4.5 },
    { name: 'ink.muted on surface.canvas', fg: ink.muted, bg: surface.canvas, min: 4.5 },
    { name: 'ink.completed on surface.canvas', fg: ink.completed, bg: surface.canvas, min: 4.5 },
    { name: 'status.allowed on surface.canvas', fg: status.allowed, bg: surface.canvas, min: 4.5 },
    { name: 'status.blocked on surface.canvas', fg: status.blocked, bg: surface.canvas, min: 4.5 },
    { name: 'ink.link on surface.canvas', fg: ink.link, bg: surface.canvas, min: 4.5 },
  ];

  for (const pair of pairs) {
    const ratio = contrastRatio(pair.fg, pair.bg);
    assert.equal(
      ratio >= pair.min,
      true,
      `WCAG AA contrast failure for ${pair.name}: ${ratio.toFixed(2)}:1 < ${pair.min}:1`
    );
  }
});

test('AI Security Governance: Effective Access Simulator dynamically shifts team meetings between Allowed and Blocked on grant toggle', () => {
  // 1. Default Tom Becker has grantActive === true
  const initialSim = computeEffectiveAccessSimulation(
    'mgr-tom',
    INITIAL_DEPARTMENT_SCOPES,
    INITIAL_MANAGER_GRANTS
  );
  assert.ok(initialSim);
  assert.equal(
    initialSim.allowedReads.some((s) =>
      s.includes('Sales Team meetings & transcripts')
    ),
    true
  );

  // 2. Toggle Tom Becker grant off -> team scope shifts to strictlyBlocked
  const toggledResult = toggleManagerTeamGrant(INITIAL_MANAGER_GRANTS, 'mgr-tom');
  assert.ok(toggledResult.auditEntry);
  assert.equal(toggledResult.auditEntry.timestamp, 'Just now');

  const revokedSim = computeEffectiveAccessSimulation(
    'mgr-tom',
    INITIAL_DEPARTMENT_SCOPES,
    toggledResult.updatedGrants
  );
  assert.ok(revokedSim);
  assert.equal(
    revokedSim.strictlyBlocked.some((s) =>
      s.includes('Sales Team meetings (not granted)')
    ),
    true
  );

  // 3. Connector policy cycles Off -> Read-only -> Needs approval to edit
  const c1 = cycleConnectorCeilingPolicy(INITIAL_CONNECTOR_CEILINGS, 'conn-workday-erp');
  const updatedWorkday = c1.updatedConnectors.find((c) => c.id === 'conn-workday-erp');
  assert.equal(updatedWorkday?.policy, 'Read-only');
  assert.equal(c1.auditEntry?.timestamp, 'Just now');
});

test('Atomic Security Sandbox: cycleSecurityToolAccessOption and evaluateSecuritySandboxPrompt enforce live toggles', () => {
  assert.equal(cycleSecurityToolAccessOption('No access'), 'Read-only');
  assert.equal(cycleSecurityToolAccessOption('Read-only'), 'Edit (Approve)');
  assert.equal(cycleSecurityToolAccessOption('Edit (Approve)'), 'No access');

  // 1. Tom Becker asking about yesterday's team call -> Allowed when teamCallsAllowed is true
  const callResAllowed = evaluateSecuritySandboxPrompt(
    "What did my team discuss on yesterday's call?",
    'subj-tom',
    INITIAL_TEAM_TOOL_RULES,
    INITIAL_MEETING_PERMISSION_ROWS
  );
  assert.equal(callResAllowed.statusTone, 'allowed');

  // 2. Maria Lopez asking about yesterday's team call -> Blocked by Participants-Only Rule
  const callResBlocked = evaluateSecuritySandboxPrompt(
    "What did my team discuss on yesterday's call?",
    'subj-maria',
    INITIAL_TEAM_TOOL_RULES,
    INITIAL_MEETING_PERMISSION_ROWS
  );
  assert.equal(callResBlocked.statusTone, 'blocked');
  assert.equal(
    callResBlocked.statusLabel.includes('Participants-Only Rule'),
    true
  );

  // 3. HR salaries query -> Blocked for Sales Team (No access), Allowed for CEO (Read-only)
  const hrSales = evaluateSecuritySandboxPrompt(
    'Show HR executive salaries',
    'subj-tom',
    INITIAL_TEAM_TOOL_RULES,
    INITIAL_MEETING_PERMISSION_ROWS
  );
  assert.equal(hrSales.statusTone, 'blocked');

  const hrCeo = evaluateSecuritySandboxPrompt(
    'Show HR executive salaries',
    'subj-ceo',
    INITIAL_TEAM_TOOL_RULES,
    INITIAL_MEETING_PERMISSION_ROWS
  );
  assert.equal(hrCeo.statusTone, 'allowed');

  // 4. Second Brain query -> Always blocked by Second Brain Firewall even for CEO
  const sbCeo = evaluateSecuritySandboxPrompt(
    "Read coworker's private Second Brain",
    'subj-ceo',
    INITIAL_TEAM_TOOL_RULES,
    INITIAL_MEETING_PERMISSION_ROWS
  );
  assert.equal(sbCeo.statusTone, 'firewall');
});
