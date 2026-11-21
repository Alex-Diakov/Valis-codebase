/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useValisWorkspace } from './headless/useValisWorkspace';
import { useDailyBriefController } from './headless/useDailyBriefController';
import { useAdminConsoleState } from './headless/useAdminConsoleState';
import { ValisAppView } from './components/ValisAppView';
import { ValisAdminConsoleView } from './components/ValisAdminConsoleView';
import { ProductSurface } from './types/valis';

export default function App() {
  const workspace = useValisWorkspace();
  const briefState = useDailyBriefController(
    workspace.memoryScope,
    workspace.uxMode
  );
  const adminState = useAdminConsoleState(briefState.stats.completed);

  const handleSelectSurface = (surface: ProductSurface) => {
    if (surface === 'employee-app') {
      workspace.switchToEmployeeApp(workspace.employeeNav);
    } else {
      workspace.switchToAdminConsole(workspace.adminNav);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-valis-bg text-valis-text">
      {workspace.surface === 'employee-app' ? (
        <ValisAppView
          activeNav={workspace.employeeNav}
          onSelectNav={workspace.setEmployeeNav}
          uxMode={workspace.uxMode}
          onSelectSurface={handleSelectSurface}
          onSelectUxMode={workspace.setUxMode}
          memoryScope={workspace.memoryScope}
          onChangeMemoryScope={workspace.setMemoryScope}
          items={briefState.visibleItems}
          unseenChangesCount={briefState.unseenChangesCount}
          showOnlyChanges={briefState.showOnlyChanges}
          onToggleShowOnlyChanges={briefState.toggleShowOnlyChanges}
          onMarkSeen={briefState.markChangesSeen}
          onResetDemoDelta={briefState.resetDemoDelta}
          selectedSource={briefState.selectedSource}
          onSelectSource={briefState.setSelectedSource}
          isListeningCall={briefState.isListeningCall}
          onToggleListeningCall={() =>
            briefState.setIsListeningCall((prev) => !prev)
          }
          onToggleItem={briefState.toggleItem}
          onSetResolutionState={briefState.setItemResolutionState}
          onAddVoiceNoteTask={briefState.addVoiceNoteTask}
          onSwitchToAdminConsole={() =>
            workspace.switchToAdminConsole('Reports')
          }
        />
      ) : (
        <ValisAdminConsoleView
          activeAdminNav={workspace.adminNav}
          onSelectAdminNav={workspace.setAdminNav}
          uxMode={workspace.uxMode}
          onSelectSurface={handleSelectSurface}
          onSelectUxMode={workspace.setUxMode}
          onSwitchToEmployeeApp={() =>
            workspace.switchToEmployeeApp('Home')
          }
          reports={adminState.reports}
          visibleReports={adminState.visibleReports}
          searchQuery={adminState.searchQuery}
          onChangeSearchQuery={adminState.setSearchQuery}
          selectedDepartment={adminState.selectedDepartment}
          onChangeDepartment={adminState.setSelectedDepartment}
          selectedType={adminState.selectedType}
          onChangeType={adminState.setSelectedType}
          openedReport={adminState.openedReport}
          onSelectReport={adminState.setOpenedReport}
          attentionItems={adminState.attentionItems}
          metrics={adminState.livePulseMetrics}
          weeklyBars={adminState.weeklyBars}
          activeDrilldown={adminState.activeDrilldown}
          onSelectDrilldown={adminState.setActiveDrilldown}
          dateRangeLabel={adminState.dateRangeLabel}
          onToggleDateRange={adminState.toggleDateRange}
          commitments={adminState.commitments}
          visibleCommitments={adminState.visibleCommitments}
          loopModeFilter={adminState.loopModeFilter}
          onChangeLoopModeFilter={adminState.setLoopModeFilter}
          onCycleCommitment={adminState.handleCycleCommitment}
          onApproveHumanLoop={adminState.handleApproveHumanLoop}
          onAddCommitment={adminState.handleAddCommitment}
          runbooks={adminState.runbooks}
          onRunRunbook={adminState.handleRunRunbook}
          securityColumns={adminState.securityColumns}
          auditEvents={adminState.auditEvents}
        />
      )}
    </div>
  );
}
