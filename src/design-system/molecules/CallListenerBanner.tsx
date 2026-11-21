import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, Mic } from 'lucide-react';
import { BriefSectionName, MemoryScope, UxVersionMode } from '../../types/valis';

interface CallListenerBannerProps {
  isListening: boolean;
  uxMode: UxVersionMode;
  memoryScope: MemoryScope;
  isCapturing?: boolean;
  onCapturingChange?: (capturing: boolean) => void;
  onToggleListening: () => void;
  onSaveCapture: (
    title: string,
    description: string,
    section: BriefSectionName
  ) => void;
}

type VoiceStage = 'idle' | 'recording' | 'review';

const COMPANY_VOICE_SAMPLES: {
  phrase: string;
  title: string;
  description: string;
  section: 'Decide' | 'I owe';
}[] = [
  {
    phrase: 'Remind me to align Q4 renewal pricing with Tom Becker before 10:00',
    title: 'Align Q4 renewal pricing',
    description: 'Tom Becker, before 10:00.',
    section: 'Decide',
  },
  {
    phrase:
      'Follow up with Daniel Kim on custom SLA indemnity caps before the board call',
    title: 'Confirm custom SLA indemnity caps',
    description: 'Daniel Kim, before 15:30 board call.',
    section: 'I owe',
  },
  {
    phrase:
      'Approve unified Deal Desk contract intake checklist with Maria Lopez',
    title: 'Approve unified Deal Desk contract intake checklist',
    description: 'Maria Lopez, unblocks Support Ops hiring.',
    section: 'Decide',
  },
];

const PERSONAL_VOICE_SAMPLES: {
  phrase: string;
  title: string;
  description: string;
  section: 'Decide' | 'I owe';
}[] = [
  {
    phrase:
      'Note to self: prepare honest feedback for 1:1 with Tom before Friday',
    title: 'Prepare honest feedback for 1:1 with Tom',
    description: 'Private prep before Friday.',
    section: 'Decide',
  },
  {
    phrase:
      'Note to self: review VP Engineering candidates with board compensation committee',
    title: 'Review VP Engineering shortlist & comp bands',
    description: 'Private board compensation prep.',
    section: 'I owe',
  },
  {
    phrase:
      'Note to self: outline Q1 executive staff off-site agenda before Thursday',
    title: 'Outline Q1 executive staff off-site agenda',
    description: 'Private draft in Second Brain.',
    section: 'I owe',
  },
];

export const CallListenerBanner: React.FC<CallListenerBannerProps> = ({
  isListening,
  uxMode,
  memoryScope,
  isCapturing: controlledIsCapturing,
  onCapturingChange,
  onToggleListening,
  onSaveCapture,
}) => {
  const isV2 = uxMode === 'v2-improvements';
  const isPrivateSecondBrain = isV2 && memoryScope === 'second-brain';

  const [stage, setStage] = useState<VoiceStage>('idle');
  const [transcript, setTranscript] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(1);
  const [selectedSection, setSelectedSection] = useState<'Decide' | 'I owe'>('Decide');
  const [companySampleIdx, setCompanySampleIdx] = useState(0);
  const [personalSampleIdx, setPersonalSampleIdx] = useState(0);

  const streamIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const activeSamples = isPrivateSecondBrain
    ? PERSONAL_VOICE_SAMPLES
    : COMPANY_VOICE_SAMPLES;
  const activeIdx = isPrivateSecondBrain ? personalSampleIdx : companySampleIdx;
  const currentSample = activeSamples[activeIdx % activeSamples.length];

  const clearRecordingTimers = useCallback(() => {
    if (streamIntervalRef.current !== null) {
      window.clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const advanceSampleIndex = useCallback(() => {
    if (isPrivateSecondBrain) {
      setPersonalSampleIdx((prev) => (prev + 1) % PERSONAL_VOICE_SAMPLES.length);
    } else {
      setCompanySampleIdx((prev) => (prev + 1) % COMPANY_VOICE_SAMPLES.length);
    }
  }, [isPrivateSecondBrain]);

  const startLiveRecording = useCallback(
    (sample: { phrase: string; section: 'Decide' | 'I owe' }) => {
      clearRecordingTimers();
      setStage('recording');
      onCapturingChange?.(true);
      setElapsedSeconds(1);
      setSelectedSection(sample.section);

      const words = sample.phrase.split(' ');
      const totalSteps = words.length;
      // Stream over ~2.2 seconds total
      const stepMs = Math.max(90, Math.floor(2100 / totalSteps));
      let currentStep = 1;
      setTranscript(words.slice(0, 1).join(' '));

      timerIntervalRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      streamIntervalRef.current = window.setInterval(() => {
        currentStep += 1;
        setTranscript(words.slice(0, currentStep).join(' '));
        if (currentStep >= totalSteps) {
          clearRecordingTimers();
          setStage('review');
          window.setTimeout(() => {
            inputRef.current?.focus();
          }, 20);
        }
      }, stepMs);
    },
    [clearRecordingTimers, onCapturingChange]
  );

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearRecordingTimers();
    };
  }, [clearRecordingTimers]);

  // Reset to Stage 1 if parent forces isCapturing to false (e.g. drawer opened or scope switched)
  useEffect(() => {
    if (controlledIsCapturing === false && stage !== 'idle') {
      clearRecordingTimers();
      setTranscript('');
      setStage('idle');
    }
  }, [controlledIsCapturing, stage, clearRecordingTimers]);

  // Reset if memoryScope switches while recording or reviewing
  const prevScopeRef = useRef<MemoryScope>(memoryScope);
  useEffect(() => {
    if (prevScopeRef.current !== memoryScope) {
      prevScopeRef.current = memoryScope;
      if (stage !== 'idle') {
        clearRecordingTimers();
        setTranscript('');
        setStage('idle');
        onCapturingChange?.(false);
      }
    }
  }, [memoryScope, stage, clearRecordingTimers, onCapturingChange]);

  const handleStartVoiceNote = () => {
    startLiveRecording(currentSample);
  };

  const handleStopRecording = () => {
    clearRecordingTimers();
    setTranscript(currentSample.phrase);
    setSelectedSection(currentSample.section);
    setStage('review');
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 20);
  };

  const handleCancelOrDiscard = () => {
    clearRecordingTimers();
    advanceSampleIndex();
    setTranscript('');
    setStage('idle');
    onCapturingChange?.(false);
  };

  const extractVoiceTask = (
    rawText: string
  ): { title: string; description: string } => {
    const cleaned = rawText.trim();
    const lower = cleaned.toLowerCase();

    for (const sample of [
      ...COMPANY_VOICE_SAMPLES,
      ...PERSONAL_VOICE_SAMPLES,
    ]) {
      if (
        lower === sample.phrase.toLowerCase() ||
        lower.includes(sample.title.toLowerCase())
      ) {
        return {
          title: sample.title,
          description: sample.description,
        };
      }
    }

    const stripped = cleaned
      .replace(/^(remind me to|note to self:?|follow up with)\s+/i, '')
      .trim();
    const capitalized =
      stripped.charAt(0).toUpperCase() + stripped.slice(1);

    return {
      title: capitalized,
      description: isPrivateSecondBrain
        ? 'Captured via private Second Brain voice note.'
        : 'Captured via shared OrgBrain voice note.',
    };
  };

  const handleSaveToBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    clearRecordingTimers();
    const extracted = extractVoiceTask(transcript);
    onSaveCapture(extracted.title, extracted.description, selectedSection);
    advanceSampleIndex();
    setTranscript('');
    setStage('idle');
    onCapturingChange?.(false);
  };

  const formattedTimer = `0:${String(elapsedSeconds).padStart(2, '0')}`;

  // STAGE 2: LIVE RECORDING
  if (stage === 'recording') {
    return (
      <div
        role="region"
        aria-label="Live voice recording bar"
        className="bg-valis-bg border border-valis-controlborder rounded-[var(--valis-card-radius)] px-3.5 py-2.5 flex items-center justify-between gap-4 transition-all"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Animated 4-bar audio waveform */}
          <div
            aria-hidden="true"
            className="flex items-center gap-[3px] h-[16px] shrink-0"
          >
            <span
              className="w-[2px] h-[12px] rounded-full bg-valis-orange valis-wave-bar"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-[2px] h-[16px] rounded-full bg-valis-orange valis-wave-bar"
              style={{ animationDelay: '160ms' }}
            />
            <span
              className="w-[2px] h-[14px] rounded-full bg-valis-orange valis-wave-bar"
              style={{ animationDelay: '320ms' }}
            />
            <span
              className="w-[2px] h-[10px] rounded-full bg-valis-orange valis-wave-bar"
              style={{ animationDelay: '480ms' }}
            />
          </div>

          {/* Live ticking timer */}
          <span className="tabular-nums text-[12.5px] text-valis-deltatext font-medium shrink-0">
            {formattedTimer}
          </span>

          {/* Live streaming transcript */}
          <span className="text-[14px] text-valis-text truncate">
            {transcript}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCancelOrDiscard}
            className="text-[12.5px] text-valis-muted hover:text-valis-text transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStopRecording}
            className="bg-valis-text text-valis-canvas text-[12.5px] font-medium px-3 py-1 rounded-[5px] hover:bg-valis-texthover flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span aria-hidden="true" className="text-[10px] leading-none">
              ■
            </span>
            <span>Stop</span>
          </button>
        </div>
      </div>
    );
  }

  // STAGE 3: REVIEW & SAVE (Human-in-the-Loop Confirm)
  if (stage === 'review') {
    return (
      <form
        onSubmit={handleSaveToBrief}
        aria-label="Review and save voice note"
        className="bg-valis-bg border border-valis-controlborder rounded-[var(--valis-card-radius)] px-3.5 py-2.5 transition-all"
      >
        <input
          ref={inputRef}
          type="text"
          aria-label="Voice dictation transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleCancelOrDiscard();
            }
          }}
          className="text-[14px] text-valis-text bg-valis-canvas border border-valis-controlborder focus:border-valis-text rounded-[var(--valis-control-radius)] px-3 py-2 w-full focus:outline-none transition-colors"
        />

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[12.5px] text-valis-muted">
            <span>Add to:</span>
            <button
              type="button"
              onClick={() =>
                setSelectedSection((prev) =>
                  prev === 'Decide' ? 'I owe' : 'Decide'
                )
              }
              title="Click to switch section between Decide and I owe"
              className="font-medium text-valis-text bg-valis-chrome hover:bg-valis-activeitem px-2 py-0.5 rounded-[var(--valis-checkbox-radius)] transition-colors cursor-pointer"
            >
              {selectedSection}
            </button>
            <span>
              · {isPrivateSecondBrain ? 'Private Second Brain' : 'Company Brief'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCancelOrDiscard}
              className="text-[12.5px] text-valis-muted hover:text-valis-text transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              className="bg-valis-text text-valis-canvas text-[12.5px] font-medium px-3 py-1 rounded-[5px] hover:bg-valis-texthover transition-colors cursor-pointer"
            >
              Save to Brief
            </button>
          </div>
        </div>
      </form>
    );
  }

  // STAGE 1: IDLE / LISTENING (Default)
  if (isPrivateSecondBrain) {
    return (
      <div className="bg-valis-privatebg border border-valis-privateborder rounded-[var(--valis-control-radius)] px-3.5 py-1.5 flex flex-wrap justify-between items-center gap-2 transition-colors">
        <button
          type="button"
          onClick={onToggleListening}
          aria-label="Toggle call listener status"
          className="flex items-center gap-2 text-left cursor-pointer text-valis-privatetext"
        >
          <ShieldCheck
            className="w-[14px] h-[14px] text-valis-privatetext shrink-0"
            strokeWidth={1.75}
          />
          <span className="text-[12.5px] text-valis-privatetext font-medium">
            Private mode · Saved only to your Second Brain
          </span>
        </button>

        <button
          type="button"
          onClick={handleStartVoiceNote}
          className="bg-valis-canvas border border-valis-controlborder hover:border-valis-controlhover rounded-[5px] px-2.5 py-1 text-[12.5px] text-valis-text font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Mic className="w-[13px] h-[13px] text-valis-text shrink-0" strokeWidth={1.75} />
          <span>Voice Note</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-valis-greenbg border border-valis-greenborder rounded-[var(--valis-control-radius)] px-3.5 py-1.5 flex flex-wrap justify-between items-center gap-2 transition-colors">
      <button
        type="button"
        onClick={onToggleListening}
        aria-label="Toggle call listener status"
        className="flex items-center gap-2 text-left cursor-pointer"
      >
        <span
          className={`w-[8px] h-[8px] rounded-full inline-block ring-2 ${
            isListening
              ? 'bg-valis-green ring-valis-greenring'
              : 'bg-valis-subtle ring-valis-controlborder'
          }`}
        />
        <span className="text-[12.5px] text-valis-green font-medium">
          {!isListening
            ? 'Call listener paused — click to resume'
            : 'Listening for Zoom, Teams, Google Meet, Slack Huddles'}
        </span>
      </button>

      <button
        type="button"
        onClick={handleStartVoiceNote}
        className="bg-valis-canvas border border-valis-controlborder hover:border-valis-controlhover rounded-[5px] px-2.5 py-1 text-[12.5px] text-valis-text font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Mic className="w-[13px] h-[13px] text-valis-text shrink-0" strokeWidth={1.75} />
        <span>Voice Note</span>
      </button>
    </div>
  );
};
