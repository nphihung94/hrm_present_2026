/**
 * Base Timesheet - Product Demo Mockup Walkthrough
 * 6-Step Interactive Presentation with Smooth Autoplay & Seamless Looping:
 * 
 * Step 1: Quản lý yêu cầu Copilot xếp ca tuần (Timesheet rỗng, Quản lý gửi yêu cầu)
 * Step 2: Copilot đọc ngữ cảnh từ Schedule Service (Quét 6 ràng buộc kíp ca, tích xanh)
 * Step 3: Đề xuất lịch, nhóm theo ca, đủ coverage (Lịch tự động điền, zoom phóng to thời gian)
 * Step 4: Quản lý confirm, lịch tự xếp và đăng ngay (Màn hoàn thành đăng lịch, icon khóa 🔒)
 * Step 5: Vừa đăng xong đã có phát sinh: Copilot báo chỗ hụt và AI đề xuất Duke Dang thay thế
 * Step 6: Quản lý chọn Duke Dang: Lịch tự động cập nhật và thông báo nhân sự
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const copilotProposalBanner = document.getElementById('copilot-proposal-banner');
  const copilotPublishedBanner = document.getElementById('copilot-published-banner');
  const copilotAlertBanner = document.getElementById('copilot-alert-banner');
  const copilotResolvedBanner = document.getElementById('copilot-resolved-banner');
  const copilotCard = document.querySelector('.copilot-card');

  const zoomSchedulePopup = document.getElementById('zoom-schedule-popup');
  const zoomConfirmCallout = document.getElementById('zoom-confirm-callout');
  const btnConfirmSchedule = document.getElementById('btn-confirm-schedule');
  
  const unpublishedCount = document.getElementById('unpublished-count');
  const gapsCount = document.getElementById('gaps-count');
  const openCount = document.getElementById('open-count');
  const criticalCount = document.getElementById('critical-count');
  const criticalItem = document.querySelector('.critical-item');

  const openShiftsSub = document.getElementById('open-shifts-sub');
  const openShiftNeededChip = document.getElementById('open-shift-needed-chip');
  const placeholderOpenWed = document.getElementById('placeholder-open-wed');

  const chipHamyShift = document.getElementById('chip-hamy-shift');
  const chipHamyLeave = document.getElementById('chip-hamy-leave');

  const chipDukedangRest = document.getElementById('chip-dukedang-rest');
  const chipDukedangShift = document.getElementById('chip-dukedang-shift');
  const dukedangHours = document.getElementById('dukedang-hours');

  const firstUserMessageRow = document.getElementById('first-user-message-row');
  const aiStatusCard = document.getElementById('ai-status-card');
  const aiServiceCard = document.getElementById('ai-service-calling-card');
  const aiProposalMessage = document.getElementById('ai-proposal-message-row');
  const step4ChatFlow = document.getElementById('step4-chat-flow');
  const step5IssueFlow = document.getElementById('step5-issue-flow');
  const step5AiSuggestion = document.getElementById('step5-ai-suggestion');
  const step5ServicePill = document.getElementById('step5-service-pill');
  const btnChooseDuke = document.getElementById('btn-choose-duke');
  const step6ChatFlow = document.getElementById('step6-chat-flow');
  
  const stepBadgeNumber = document.getElementById('step-badge-number');
  const stepGuideText = document.getElementById('step-guide-text');
  const taskItems = document.querySelectorAll('.task-item');

  const btnPrev = document.getElementById('btn-prev-step');
  const btnNext = document.getElementById('btn-next-step');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const btnReplay = document.getElementById('btn-replay-step');
  const stepProgressBar = document.getElementById('step-progress-bar');

  const copilotInput = document.getElementById('copilot-input');
  const btnSend = document.getElementById('btn-send-copilot');

  // Autoplay Configuration (6 Steps)
  const STEP_DURATIONS = {
    1: 3600, // Bước 1: 3.6s
    2: 4800, // Bước 2: 4.8s (để hoàn tất 6 dòng task)
    3: 5200, // Bước 3: 5.2s (để xem popup phóng to)
    4: 5500, // Bước 4: 5.5s (màn hoàn thành đăng lịch)
    5: 6500, // Bước 5: 6.5s (phát sinh Ha My nghỉ & AI đề xuất Duke Dang)
    6: 7000  // Bước 6: 7.0s (Quản lý chọn Duke Dang, cập nhật bảng hoàn tất, rồi loop lại)
  };

  let currentStep = 1;
  let autoplayEnabled = true;
  let autoplayTimer = null;
  let taskTimers = [];

  const clearTimers = () => {
    taskTimers.forEach(t => clearTimeout(t));
    taskTimers = [];
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  };

  // Run progress bar animation for the active step duration
  const triggerProgressBar = (durationMs) => {
    if (!stepProgressBar) return;
    stepProgressBar.classList.remove('running');
    stepProgressBar.style.setProperty('--step-duration', `${durationMs}ms`);
    void stepProgressBar.offsetWidth;
    if (autoplayEnabled) {
      stepProgressBar.classList.add('running');
    }
  };

  // Schedule next step transition in autoplay mode
  const scheduleNext = (fromStep, durationMs) => {
    if (!autoplayEnabled) return;
    triggerProgressBar(durationMs);

    autoplayTimer = setTimeout(() => {
      if (!autoplayEnabled) return;
      if (fromStep === 1) showStep2(true);
      else if (fromStep === 2) showStep3();
      else if (fromStep === 3) showStep4();
      else if (fromStep === 4) showStep5();
      else if (fromStep === 5) showStep6();
      else if (fromStep === 6) showStep1(); // Loop lại từ Bước 1
    }, durationMs);
  };

  // Helper reset Step 5 & 6 specific modifications
  const resetModifications = () => {
    if (copilotAlertBanner) copilotAlertBanner.style.display = 'none';
    if (copilotResolvedBanner) copilotResolvedBanner.style.display = 'none';
    if (copilotCard) copilotCard.classList.remove('step5-glow');

    if (gapsCount) gapsCount.textContent = '0';
    if (openCount) openCount.textContent = '0';
    if (criticalCount) criticalCount.textContent = '0';
    if (criticalItem) criticalItem.classList.remove('has-critical');

    if (openShiftsSub) openShiftsSub.textContent = '0 unassigned';
    if (openShiftNeededChip) openShiftNeededChip.style.display = 'none';
    if (placeholderOpenWed) placeholderOpenWed.style.display = 'block';

    if (chipHamyShift) chipHamyShift.style.display = 'block';
    if (chipHamyLeave) chipHamyLeave.style.display = 'none';

    if (chipDukedangRest) chipDukedangRest.style.display = 'block';
    if (chipDukedangShift) chipDukedangShift.style.display = 'none';
    if (dukedangHours) dukedangHours.textContent = '40h';

    if (step5IssueFlow) step5IssueFlow.style.display = 'none';
    if (step5AiSuggestion) step5AiSuggestion.style.display = 'none';
    if (step6ChatFlow) step6ChatFlow.style.display = 'none';

    if (step5ServicePill) {
      step5ServicePill.textContent = '⚙ ĐANG GỌI SERVICE - COVERAGE CHECK';
      step5ServicePill.style.background = '';
      step5ServicePill.style.borderColor = '';
      step5ServicePill.style.color = '';
    }
  };

  /**
   * Bước 1: Quản lý yêu cầu Copilot xếp ca tuần
   */
  const showStep1 = () => {
    clearTimers();
    currentStep = 1;
    resetModifications();

    // Reset Banners & Popups
    if (copilotProposalBanner) copilotProposalBanner.style.display = 'none';
    if (copilotPublishedBanner) copilotPublishedBanner.style.display = 'none';
    if (zoomSchedulePopup) zoomSchedulePopup.style.display = 'none';
    if (zoomConfirmCallout) zoomConfirmCallout.style.display = 'none';

    // Ẩn toàn bộ ca kíp (Timesheet rỗng ban đầu)
    document.querySelectorAll('.cell-slot').forEach(cell => {
      cell.classList.add('hide-chips');
    });

    document.querySelectorAll('.shift-chip').forEach(chip => {
      chip.classList.remove('locked');
    });

    if (unpublishedCount) {
      unpublishedCount.textContent = '0';
      unpublishedCount.style.color = '';
    }

    // Chat Elements
    if (firstUserMessageRow) firstUserMessageRow.style.display = 'flex';
    if (aiStatusCard) aiStatusCard.style.display = 'flex';
    if (aiServiceCard) {
      aiServiceCard.style.display = 'none';
      aiServiceCard.classList.remove('faded');
    }
    if (aiProposalMessage) aiProposalMessage.style.display = 'none';
    if (step4ChatFlow) step4ChatFlow.style.display = 'none';

    // Guide tag
    if (stepBadgeNumber) stepBadgeNumber.textContent = '1';
    if (stepGuideText) stepGuideText.textContent = 'Quản lý yêu cầu Copilot xếp ca tuần';

    scheduleNext(1, STEP_DURATIONS[1]);
  };

  /**
   * Bước 2: Copilot đọc ngữ cảnh từ Schedule Service
   */
  const showStep2 = (animate = true) => {
    clearTimers();
    currentStep = 2;
    resetModifications();

    if (copilotProposalBanner) copilotProposalBanner.style.display = 'none';
    if (copilotPublishedBanner) copilotPublishedBanner.style.display = 'none';
    if (zoomSchedulePopup) zoomSchedulePopup.style.display = 'none';
    if (zoomConfirmCallout) zoomConfirmCallout.style.display = 'none';

    document.querySelectorAll('.cell-slot').forEach(cell => {
      cell.classList.add('hide-chips');
    });

    document.querySelectorAll('.shift-chip').forEach(chip => {
      chip.classList.remove('locked');
    });

    if (unpublishedCount) {
      unpublishedCount.textContent = '0';
      unpublishedCount.style.color = '';
    }

    // Chat Elements
    if (firstUserMessageRow) firstUserMessageRow.style.display = 'flex';
    if (aiStatusCard) aiStatusCard.style.display = 'none';
    if (aiProposalMessage) aiProposalMessage.style.display = 'none';
    if (step4ChatFlow) step4ChatFlow.style.display = 'none';

    if (aiServiceCard) {
      aiServiceCard.style.display = 'flex';
      aiServiceCard.classList.remove('faded');
      aiServiceCard.style.animation = 'none';
      void aiServiceCard.offsetWidth;
      aiServiceCard.style.animation = 'zoomInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }

    if (stepBadgeNumber) stepBadgeNumber.textContent = '2';
    if (stepGuideText) stepGuideText.textContent = 'Copilot đọc ngữ cảnh từ Schedule Service';

    taskItems.forEach(item => item.classList.remove('active', 'completed'));

    if (animate) {
      const sequence = [
        { step: 0, startDelay: 200,  finishDelay: 600 },
        { step: 1, startDelay: 700,  finishDelay: 1200 },
        { step: 2, startDelay: 1300, finishDelay: 1800 },
        { step: 3, startDelay: 1900, finishDelay: 2400 },
        { step: 4, startDelay: 2500, finishDelay: 3000 },
        { step: 5, startDelay: 3100, finishDelay: 3700 }
      ];

      sequence.forEach(({ step, startDelay, finishDelay }) => {
        const item = taskItems[step];
        if (!item) return;

        const tStart = setTimeout(() => item.classList.add('active'), startDelay);
        const tFinish = setTimeout(() => {
          item.classList.remove('active');
          item.classList.add('completed');
        }, finishDelay);

        taskTimers.push(tStart, tFinish);
      });
    } else {
      taskItems.forEach(item => item.classList.add('completed'));
    }

    scheduleNext(2, STEP_DURATIONS[2]);
  };

  /**
   * Bước 3: Đề xuất lịch, nhóm theo ca, đủ coverage (Zoom thời gian)
   */
  const showStep3 = () => {
    clearTimers();
    currentStep = 3;
    resetModifications();

    if (copilotProposalBanner) {
      copilotProposalBanner.style.display = 'flex';
      copilotProposalBanner.style.animation = 'none';
      void copilotProposalBanner.offsetWidth;
      copilotProposalBanner.style.animation = 'fadeInBanner 0.4s ease forwards';
    }
    if (copilotPublishedBanner) copilotPublishedBanner.style.display = 'none';
    if (zoomConfirmCallout) zoomConfirmCallout.style.display = 'none';

    // Hiển thị các ca kíp trong lưới
    document.querySelectorAll('.cell-slot').forEach(cell => {
      cell.classList.remove('hide-chips');
    });

    document.querySelectorAll('.shift-chip').forEach(chip => {
      chip.classList.remove('locked');
    });

    if (unpublishedCount) {
      unpublishedCount.textContent = '42';
      unpublishedCount.style.color = '';
    }

    // Hiện popup phóng to phần thời gian
    if (zoomSchedulePopup) {
      zoomSchedulePopup.style.display = 'block';
      zoomSchedulePopup.style.animation = 'none';
      void zoomSchedulePopup.offsetWidth;
      zoomSchedulePopup.style.animation = 'popupZoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }

    if (btnConfirmSchedule) {
      btnConfirmSchedule.textContent = 'Confirm, xếp lịch';
      btnConfirmSchedule.style.background = '#1d4ed8';
    }

    // Chat Elements
    if (firstUserMessageRow) firstUserMessageRow.style.display = 'flex';
    if (aiStatusCard) aiStatusCard.style.display = 'none';
    if (aiServiceCard) {
      aiServiceCard.style.display = 'flex';
      aiServiceCard.classList.remove('faded');
      taskItems.forEach(item => {
        item.classList.remove('active');
        item.classList.add('completed');
      });
    }
    if (aiProposalMessage) aiProposalMessage.style.display = 'flex';
    if (step4ChatFlow) step4ChatFlow.style.display = 'none';

    if (stepBadgeNumber) stepBadgeNumber.textContent = '3';
    if (stepGuideText) stepGuideText.textContent = 'Đề xuất lịch, nhóm theo ca, đủ coverage';

    scheduleNext(3, STEP_DURATIONS[3]);
  };

  /**
   * Bước 4: Màn hoàn thành đăng lịch chuẩn theo ảnh mẫu
   */
  const showStep4 = () => {
    clearTimers();
    currentStep = 4;
    resetModifications();

    // Ẩn proposal banner, hiện published banner xanh lá
    if (copilotProposalBanner) copilotProposalBanner.style.display = 'none';
    if (copilotPublishedBanner) {
      copilotPublishedBanner.style.display = 'flex';
      copilotPublishedBanner.style.animation = 'none';
      void copilotPublishedBanner.offsetWidth;
      copilotPublishedBanner.style.animation = 'fadeInBanner 0.4s ease forwards';
    }

    // Ẩn toàn bộ popup zoom
    if (zoomSchedulePopup) zoomSchedulePopup.style.display = 'none';
    if (zoomConfirmCallout) zoomConfirmCallout.style.display = 'none';

    // Toàn bộ các ca kíp đã được đăng (icon khóa 🔒)
    document.querySelectorAll('.cell-slot').forEach(cell => {
      cell.classList.remove('hide-chips');
    });

    document.querySelectorAll('.shift-chip').forEach(chip => {
      chip.classList.add('locked');
    });

    // 0 unpublished
    if (unpublishedCount) {
      unpublishedCount.textContent = '0';
      unpublishedCount.style.color = '';
    }

    // Chat Elements: Màn chat chuẩn theo ảnh mới
    if (firstUserMessageRow) firstUserMessageRow.style.display = 'none';
    if (aiStatusCard) aiStatusCard.style.display = 'none';
    
    // Thẻ ngữ cảnh mờ nhẹ làm nền
    if (aiServiceCard) {
      aiServiceCard.style.display = 'flex';
      aiServiceCard.classList.add('faded');
      taskItems.forEach(item => {
        item.classList.remove('active');
        item.classList.add('completed');
      });
    }

    // Tin nhắn đề xuất ban đầu
    if (aiProposalMessage) aiProposalMessage.style.display = 'flex';
    
    // Tin nhắn Quản lý: Confirm. (pill xanh pastel căn phải) + Copilot: Đã xếp và đăng lịch tuần 38 ✓
    if (step4ChatFlow) {
      step4ChatFlow.style.display = 'flex';
      step4ChatFlow.style.animation = 'none';
      void step4ChatFlow.offsetWidth;
      step4ChatFlow.style.animation = 'fadeInProposal 0.45s ease forwards';
    }

    // Scroll chat to bottom
    const messagesContainer = document.getElementById('copilot-messages');
    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 100);
    }

    // Guide tag
    if (stepBadgeNumber) stepBadgeNumber.textContent = '4';
    if (stepGuideText) stepGuideText.textContent = 'Quản lý confirm, lịch tự xếp và đăng ngay';

    scheduleNext(4, STEP_DURATIONS[4]);
  };

  /**
   * Bước 5: Vừa đăng xong đã có phát sinh (Ha My nghỉ T4 hụt 1 ca đêm & AI gợi ý Duke Dang)
   */
  const showStep5 = () => {
    clearTimers();
    currentStep = 5;
    resetModifications();

    // Banners: Ẩn xanh lá, hiện banner cảnh báo đỏ phát sinh
    if (copilotProposalBanner) copilotProposalBanner.style.display = 'none';
    if (copilotPublishedBanner) copilotPublishedBanner.style.display = 'none';
    if (copilotResolvedBanner) copilotResolvedBanner.style.display = 'none';
    if (copilotAlertBanner) {
      copilotAlertBanner.style.display = 'flex';
      copilotAlertBanner.style.animation = 'none';
      void copilotAlertBanner.offsetWidth;
      copilotAlertBanner.style.animation = 'fadeInBanner 0.4s ease forwards';
    }

    // Ẩn các popup zoom cũ
    if (zoomSchedulePopup) zoomSchedulePopup.style.display = 'none';
    if (zoomConfirmCallout) zoomConfirmCallout.style.display = 'none';

    // Toàn bộ các ca kíp vẫn hiển thị với icon khóa 🔒
    document.querySelectorAll('.cell-slot').forEach(cell => {
      cell.classList.remove('hide-chips');
    });

    document.querySelectorAll('.shift-chip').forEach(chip => {
      chip.classList.add('locked');
    });

    // Cập nhật KPIs: 1 gaps, 1 open, 1 critical, 0 unpublished
    if (gapsCount) gapsCount.textContent = '1';
    if (openCount) openCount.textContent = '1';
    if (criticalCount) criticalCount.textContent = '1';
    if (criticalItem) criticalItem.classList.add('has-critical');
    if (unpublishedCount) {
      unpublishedCount.textContent = '0';
      unpublishedCount.style.color = '';
    }

    // Dòng Open shifts: 1 unassigned & chip đỏ nét đứt "+ cần 1 • 22:00–06:00" ở WED 16
    if (openShiftsSub) openShiftsSub.textContent = '1 unassigned';
    if (placeholderOpenWed) placeholderOpenWed.style.display = 'none';
    if (openShiftNeededChip) openShiftNeededChip.style.display = 'block';

    // Dòng Ha My: đổi ca WED 16 sang "Nghỉ phép"
    if (chipHamyShift) chipHamyShift.style.display = 'none';
    if (chipHamyLeave) chipHamyLeave.style.display = 'block';

    // Copilot Card: Viền cyan dạ quang phát sáng rực rỡ chuẩn ảnh
    if (copilotCard) {
      copilotCard.classList.add('step5-glow');
    }

    // Chat Area: Ẩn các tin nhắn cũ
    if (firstUserMessageRow) firstUserMessageRow.style.display = 'none';
    if (aiStatusCard) aiStatusCard.style.display = 'none';
    if (aiServiceCard) aiServiceCard.style.display = 'none';
    if (aiProposalMessage) aiProposalMessage.style.display = 'none';
    if (step4ChatFlow) step4ChatFlow.style.display = 'none';
    if (step6ChatFlow) step6ChatFlow.style.display = 'none';

    // Hiện Box cảnh báo phát sinh: Ha My vừa được duyệt nghỉ T4...
    if (step5IssueFlow) {
      step5IssueFlow.style.display = 'flex';
      step5IssueFlow.style.animation = 'none';
      void step5IssueFlow.offsetWidth;
      step5IssueFlow.style.animation = 'fadeInProposal 0.45s ease forwards';
    }

    if (step5AiSuggestion) {
      step5AiSuggestion.style.display = 'none';
    }

    if (step5ServicePill) {
      step5ServicePill.textContent = '⚙ ĐANG GỌI SERVICE - COVERAGE CHECK';
      step5ServicePill.style.background = '';
      step5ServicePill.style.borderColor = '';
      step5ServicePill.style.color = '';
    }

    // Scroll chat to top
    const messagesContainer = document.getElementById('copilot-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = 0;
    }

    // Sau 1.8s Copilot kiểm tra xong và đề xuất Duke Dang
    const tAiSuggestion = setTimeout(() => {
      if (currentStep !== 5) return;
      if (step5ServicePill) {
        step5ServicePill.textContent = '✓ COVERAGE CHECK: ĐÃ TÌM THẤY ỨNG VIÊN';
        step5ServicePill.style.background = '#f0fdf4';
        step5ServicePill.style.borderColor = '#bbf7d0';
        step5ServicePill.style.color = '#15803d';
      }
      if (step5AiSuggestion) {
        step5AiSuggestion.style.display = 'flex';
        step5AiSuggestion.style.animation = 'none';
        void step5AiSuggestion.offsetWidth;
        step5AiSuggestion.style.animation = 'fadeInProposal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 1800);
    taskTimers.push(tAiSuggestion);

    // Guide tag
    if (stepBadgeNumber) stepBadgeNumber.textContent = '5';
    if (stepGuideText) stepGuideText.textContent = 'Vừa đăng xong đã có phát sinh: Copilot báo chỗ hụt và đề xuất người thay';

    scheduleNext(5, STEP_DURATIONS[5]);
  };

  /**
   * Bước 6: Quản lý chọn Duke Dang & AI cập nhật lịch làm việc hoàn tất
   */
  const showStep6 = () => {
    clearTimers();
    currentStep = 6;
    resetModifications();

    // Banners: Ẩn cảnh báo đỏ, hiện banner xanh thành công
    if (copilotProposalBanner) copilotProposalBanner.style.display = 'none';
    if (copilotPublishedBanner) copilotPublishedBanner.style.display = 'none';
    if (copilotAlertBanner) copilotAlertBanner.style.display = 'none';
    if (copilotResolvedBanner) {
      copilotResolvedBanner.style.display = 'flex';
      copilotResolvedBanner.style.animation = 'none';
      void copilotResolvedBanner.offsetWidth;
      copilotResolvedBanner.style.animation = 'fadeInBanner 0.4s ease forwards';
    }

    // Popups: Ẩn
    if (zoomSchedulePopup) zoomSchedulePopup.style.display = 'none';
    if (zoomConfirmCallout) zoomConfirmCallout.style.display = 'none';

    // Bảng Timesheet cập nhật lại:
    document.querySelectorAll('.cell-slot').forEach(cell => {
      cell.classList.remove('hide-chips');
    });

    document.querySelectorAll('.shift-chip').forEach(chip => {
      chip.classList.add('locked');
    });

    // Open shifts: 0 unassigned, biến mất chip viền đỏ
    if (openShiftsSub) openShiftsSub.textContent = '0 unassigned';
    if (placeholderOpenWed) placeholderOpenWed.style.display = 'block';
    if (openShiftNeededChip) openShiftNeededChip.style.display = 'none';

    // Ha My: Vẫn giữ "Nghỉ phép" ở WED 16
    if (chipHamyShift) chipHamyShift.style.display = 'none';
    if (chipHamyLeave) chipHamyLeave.style.display = 'block';

    // Duke Dang: Cập nhật ca 22:00-06:00 ở WED 16 & tổng giờ lên 48h
    if (chipDukedangRest) chipDukedangRest.style.display = 'none';
    if (chipDukedangShift) {
      chipDukedangShift.style.display = 'block';
      chipDukedangShift.classList.add('locked');
    }
    if (dukedangHours) dukedangHours.textContent = '48h';

    // Status bar: Trở về 0 gaps, 0 open, 0 critical
    if (gapsCount) gapsCount.textContent = '0';
    if (openCount) openCount.textContent = '0';
    if (criticalCount) criticalCount.textContent = '0';
    if (criticalItem) criticalItem.classList.remove('has-critical');
    if (unpublishedCount) {
      unpublishedCount.textContent = '0';
      unpublishedCount.style.color = '';
    }

    // Copilot Card: Viền dịu lại
    if (copilotCard) {
      copilotCard.classList.remove('step5-glow');
    }

    // Chat Area: Ẩn các tin cũ
    if (firstUserMessageRow) firstUserMessageRow.style.display = 'none';
    if (aiStatusCard) aiStatusCard.style.display = 'none';
    if (aiServiceCard) aiServiceCard.style.display = 'none';
    if (aiProposalMessage) aiProposalMessage.style.display = 'none';
    if (step4ChatFlow) step4ChatFlow.style.display = 'none';
    if (step5IssueFlow) step5IssueFlow.style.display = 'none';

    // Hiện Step 6: Quản lý "Chọn Duke Dang" + AI "Đã cập nhật lịch và thông báo cho Duke Dang..."
    if (step6ChatFlow) {
      step6ChatFlow.style.display = 'flex';
      step6ChatFlow.style.animation = 'none';
      void step6ChatFlow.offsetWidth;
      step6ChatFlow.style.animation = 'fadeInProposal 0.45s ease forwards';
    }

    const messagesContainer = document.getElementById('copilot-messages');
    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 100);
    }

    // Guide tag
    if (stepBadgeNumber) stepBadgeNumber.textContent = '6';
    if (stepGuideText) stepGuideText.textContent = 'Quản lý chọn Duke Dang: Lịch tự động cập nhật và đầy đủ coverage';

    scheduleNext(6, STEP_DURATIONS[6]);
  };

  // Controller Handlers
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep === 6) showStep5();
      else if (currentStep === 5) showStep4();
      else if (currentStep === 4) showStep3();
      else if (currentStep === 3) showStep2(false);
      else if (currentStep === 2) showStep1();
      else showStep6();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep === 1) showStep2(true);
      else if (currentStep === 2) showStep3();
      else if (currentStep === 3) showStep4();
      else if (currentStep === 4) showStep5();
      else if (currentStep === 5) showStep6();
      else showStep1();
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      autoplayEnabled = true;
      if (btnPlayPause) btnPlayPause.textContent = '⏸';
      showStep1();
    });
  }

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      autoplayEnabled = !autoplayEnabled;
      if (autoplayEnabled) {
        btnPlayPause.textContent = '⏸';
        btnPlayPause.title = 'Tạm dừng tự chạy';
        // Tiếp tục bước hiện tại
        if (currentStep === 1) scheduleNext(1, STEP_DURATIONS[1]);
        else if (currentStep === 2) scheduleNext(2, STEP_DURATIONS[2]);
        else if (currentStep === 3) scheduleNext(3, STEP_DURATIONS[3]);
        else if (currentStep === 4) scheduleNext(4, STEP_DURATIONS[4]);
        else if (currentStep === 5) scheduleNext(5, STEP_DURATIONS[5]);
        else if (currentStep === 6) scheduleNext(6, STEP_DURATIONS[6]);
      } else {
        btnPlayPause.textContent = '▶';
        btnPlayPause.title = 'Tiếp tục tự chạy';
        clearTimers();
        if (stepProgressBar) stepProgressBar.classList.remove('running');
      }
    });
  }

  if (btnConfirmSchedule) {
    btnConfirmSchedule.addEventListener('click', () => {
      showStep4();
    });
  }

  if (btnChooseDuke) {
    btnChooseDuke.addEventListener('click', () => {
      showStep6();
    });
  }

  // Handle manual input in chat
  const handleSend = () => {
    const text = copilotInput.value.trim();
    if (!text) return;
    copilotInput.value = '';
    
    if (text.toLowerCase().includes('confirm') || text.toLowerCase().includes('xác nhận')) {
      showStep4();
    } else if (text.toLowerCase().includes('duke') || text.toLowerCase().includes('chọn')) {
      showStep6();
    } else if (text.toLowerCase().includes('thay') || text.toLowerCase().includes('phát sinh')) {
      showStep5();
    } else {
      showStep3();
    }
  };

  if (btnSend) btnSend.addEventListener('click', handleSend);
  if (copilotInput) {
    copilotInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // Khởi động mockup tự chạy từ Bước 1
  showStep1();
});
