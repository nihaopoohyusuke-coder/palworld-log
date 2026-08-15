import { useState, useEffect, useMemo, useRef } from "react";
import "./storage";
import { Egg, Search, Plus, Trash2, PawPrint, X, Loader2, Target, ArrowRight, Pencil, BookOpen, Download, Upload, GitBranch, Heart, Check, Calculator, ChevronDown } from "lucide-react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Bitter:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

const STYLE = `
${FONT_IMPORT}

.bl-root {
  --bg: #f4f6fb;
  --surface: #ffffff;
  --surface-raised: #f7f9fd;
  --accent: #4f56c4;
  --accent-soft: #4f56c4;
  --teal: #4f56c4;
  --text: #23273f;
  --text-muted: #5b6280;
  --border: #e3e7f2;
  --danger: #dc4f47;
  --danger-soft: #f3a49c;

  position: relative;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  min-height: 100%;
  padding: 28px 20px 60px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.bl-root * { box-sizing: border-box; }

.bl-hexbg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.bl-wrap { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }

.bl-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 2px solid var(--border);
  padding-bottom: 16px;
  margin-bottom: 22px;
  gap: 12px;
  flex-wrap: wrap;
}

.bl-title {
  font-family: 'Bitter', serif;
  font-weight: 800;
  font-size: 26px;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: var(--accent);
}

.bl-subtitle {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-top: 4px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.02em;
}

.bl-count-group {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.bl-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.bl-stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: var(--text-muted);
  white-space: nowrap;
}

.bl-stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 19px;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}

/* form card */
.bl-backup-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.bl-dex-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--surface);
  border: 1.5px solid var(--accent);
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
  font-family: 'Bitter', serif;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-left: auto;
  box-shadow: 0 2px 10px rgba(35,42,90,0.06);
  transition: all 0.15s;
}

.bl-dex-nav-btn:hover { background: rgba(88,92,201,0.08); }

.bl-dex-nav-btn.active {
  background: var(--accent);
  color: #ffffff;
}

.bl-backup-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.bl-backup-btn:hover { color: var(--accent); border-color: var(--accent); }

.bl-import-confirm {
  background: rgba(220,79,71,0.06);
  border: 1px solid rgba(220,79,71,0.3);
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 16px;
}

.bl-import-confirm-text {
  font-size: 13px;
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 12px;
}

.bl-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 26px;
  position: relative;
  box-shadow: 0 2px 10px rgba(35,42,90,0.06);
}

.bl-form-title {
  font-family: 'Bitter', serif;
  font-weight: 700;
  font-size: 14.5px;
  color: var(--accent);
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 7px;
}

.bl-form-toggle {
  width: 100%;
  justify-content: space-between;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: 'Bitter', serif;
}

.bl-chevron {
  color: var(--text-muted);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.bl-chevron.open { transform: rotate(180deg); }

.bl-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.bl-cross {
  font-family: 'Bitter', serif;
  color: var(--text-muted);
  font-size: 15px;
  text-align: center;
}

.bl-field { margin-bottom: 10px; }

.bl-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 5px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.03em;
}

.bl-input, .bl-textarea {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 6px;
  padding: 9px 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.15s;
}

.bl-input:focus, .bl-textarea:focus {
  border-color: var(--accent);
}

.bl-textarea { resize: vertical; min-height: 44px; }

.bl-arrow-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.bl-arrow-row .bl-input { flex: 1; }

.bl-autocomplete-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.bl-suggest {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 10px 26px rgba(35,42,90,0.14);
  max-height: 220px;
  overflow-y: auto;
  z-index: 30;
  padding: 4px;
}

.bl-suggest-item {
  padding: 8px 10px;
  border-radius: 5px;
  font-size: 13.5px;
  color: var(--text);
  cursor: pointer;
}

.bl-suggest-item:hover,
.bl-suggest-item.active {
  background: rgba(88,92,201,0.08);
  color: var(--accent);
}

.bl-arrow {
  color: var(--accent);
  font-size: 16px;
  flex-shrink: 0;
}

.bl-submit {
  margin-top: 6px;
  flex: 1;
  background: var(--accent);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px 14px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: filter 0.15s;
  box-shadow: 0 3px 10px rgba(88,92,201,0.28);
}

.bl-submit:hover { filter: brightness(1.08); }
.bl-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.bl-cancel {
  margin-top: 6px;
  background: var(--surface);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.bl-cancel:hover { color: var(--text); border-color: var(--teal); }

.bl-error {
  color: var(--danger);
  font-size: 12.5px;
  margin-top: 8px;
  font-family: 'JetBrains Mono', monospace;
}

/* search */
.bl-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.bl-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 12.5px;
  font-family: 'JetBrains Mono', monospace;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.bl-tab:hover { color: var(--text); border-color: var(--teal); }

.bl-tab.active {
  background: rgba(88,92,201,0.10);
  border-color: var(--accent);
  color: var(--accent);
}

.bl-mode-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin: -4px 0 12px 2px;
  font-family: 'JetBrains Mono', monospace;
}

.bl-special-check {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: var(--text-muted);
  cursor: pointer;
  margin-bottom: 12px;
}

.bl-special-badge {
  margin-left: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--accent);
  background: rgba(88,92,201,0.09);
  border: 1px solid rgba(88,92,201,0.3);
  padding: 1px 6px;
  border-radius: 4px;
}

.bl-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(35,42,90,0.05);
}

.bl-summary-label {
  font-size: 12px;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  width: 100%;
  margin-bottom: 2px;
}

.bl-summary-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(88,92,201,0.09);
  border: 1px solid rgba(88,92,201,0.3);
  color: var(--accent);
  font-size: 12.5px;
  padding: 4px 10px;
  border-radius: 5px;
  font-family: 'JetBrains Mono', monospace;
}

.bl-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 12px;
  margin-bottom: 18px;
  box-shadow: 0 2px 10px rgba(35,42,90,0.05);
}

.bl-search input {
  flex: 1;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 14px;
  font-family: 'Inter', sans-serif;
}

.bl-search input::placeholder { color: var(--text-muted); }

/* entries */
.bl-empty {
  text-align: center;
  padding: 50px 20px;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  border: 1px dashed var(--border);
  border-radius: 10px;
}

.bl-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 10px;
  position: relative;
  box-shadow: 0 2px 10px rgba(35,42,90,0.05);
}

.bl-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.bl-combo {
  font-family: 'Bitter', serif;
  font-weight: 700;
  font-size: 15.5px;
  color: var(--text);
  line-height: 1.5;
}

.bl-combo .amp { color: var(--text-muted); font-weight: 500; margin: 0 4px; }
.bl-combo .res-arrow { color: var(--accent); margin: 0 6px; }
.bl-combo .child { color: var(--accent-soft); }

.bl-dexno {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: var(--text-muted);
  font-weight: 500;
  margin-right: 3px;
  letter-spacing: 0.02em;
}

.bl-dex-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
}

.bl-dex-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0 2px 10px rgba(35,42,90,0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s;
  width: 100%;
}

.bl-dex-item:hover { border-color: var(--accent); }

.bl-dex-item-unedited { opacity: 0.55; }
.bl-dex-item-unedited:hover { opacity: 0.85; }

.bl-edited-badge {
  margin-left: 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--accent);
  background: rgba(88,92,201,0.1);
  border: 1px solid rgba(88,92,201,0.3);
  padding: 1px 5px;
  border-radius: 4px;
}

.bl-dex-item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.bl-dex-thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border);
  background: var(--bg);
}

.bl-dex-thumb-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.bl-dex-item-head {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bl-dex-item .bl-dexno { font-size: 11px; }

.bl-dex-name {
  font-family: 'Bitter', serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--text);
}

.bl-dex-preview {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.bl-pal-link {
  cursor: pointer;
  transition: opacity 0.15s;
}

.bl-pal-link:hover { opacity: 0.7; text-decoration: underline; }

.bl-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(35,42,90,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
}

.bl-modal {
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 440px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 20px 50px rgba(20,25,60,0.25);
}

.bl-modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
}

.bl-modal-title {
  font-family: 'Bitter', serif;
  font-weight: 800;
  font-size: 19px;
  color: var(--text);
}

.bl-modal-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bl-modal-thumb {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
}

.bl-modal-title-with-heart {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bl-heart-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: all 0.15s;
}

.bl-heart-btn:hover { color: #e0554c; transform: scale(1.1); }

.bl-heart-btn.active { color: #e0554c; }

.bl-modal-close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  flex-shrink: 0;
  display: flex;
}

.bl-modal-close:hover { color: var(--danger); background: rgba(220,79,71,0.1); }

.bl-modal-section {
  margin-top: 18px;
}

.bl-modal-section-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  color: var(--text-muted);
  letter-spacing: 0.03em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bl-image-edit-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bl-image-preview {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
}

.bl-image-preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.bl-image-edit-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.bl-file-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 0;
  cursor: pointer;
}

.bl-element-edit-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
}

.bl-element-chip {
  flex: 1;
  height: 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-muted);
  transition: all 0.15s;
}

.bl-element-chip.selected {
  color: #ffffff;
}

.bl-dex-filters {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(35,42,90,0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bl-dex-filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.bl-dex-filter-row .bl-element-edit-row {
  flex: 1;
  min-width: 240px;
}

.bl-dex-filter-label {
  font-size: 11.5px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted);
  white-space: nowrap;
}

.bl-select {
  height: 32px;
  box-sizing: border-box;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  outline: none;
}

.bl-select:focus { border-color: var(--accent); }

.bl-dex-sort-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-muted);
  cursor: pointer;
}

.bl-dex-worklv {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
}

.bl-element-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.bl-element-badge {
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12.5px;
  font-weight: 700;
  border: 1px solid;
}

.bl-skill-box {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
}

.bl-skill-name {
  font-family: 'Bitter', serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--accent);
  margin-bottom: 4px;
}

.bl-skill-desc {
  font-size: 13px;
  color: var(--text);
  line-height: 1.6;
  white-space: pre-wrap;
}

.bl-work-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.bl-work-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 12.5px;
  color: var(--text-muted);
  opacity: 0.4;
}

.bl-work-cell.active {
  color: var(--text);
  border-color: rgba(88,92,201,0.35);
  background: rgba(88,92,201,0.07);
  opacity: 1;
  font-weight: 600;
}

.bl-work-cell .lv {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
}

.bl-work-edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.bl-work-edit-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 5px 8px;
}

.bl-work-edit-cell label {
  font-size: 12px;
  color: var(--text-muted);
}

.bl-work-edit-cell input {
  width: 44px;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 3px 5px;
  font-size: 12px;
  color: var(--text);
  text-align: center;
}

.bl-food-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.bl-food-num {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 14px;
  color: var(--accent);
  background: rgba(88,92,201,0.09);
  border: 1px solid rgba(88,92,201,0.28);
  border-radius: 6px;
  padding: 2px 8px;
}

.bl-food-marks {
  font-size: 15px;
  letter-spacing: 1px;
}

.bl-drop-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.bl-drop-tag {
  background: rgba(88,92,201,0.09);
  border: 1px solid rgba(88,92,201,0.28);
  color: var(--accent);
  font-size: 12px;
  padding: 4px 9px;
  border-radius: 999px;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
}

.bl-modal-details-text {
  font-size: 13.5px;
  color: var(--text);
  line-height: 1.6;
  white-space: pre-wrap;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
}

.bl-modal-empty-text {
  font-size: 12.5px;
  color: var(--text-muted);
}

.bl-edit-link {
  background: transparent;
  border: none;
  color: var(--accent);
  font-size: 11.5px;
  font-family: 'JetBrains Mono', monospace;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0;
}

.bl-edit-link:hover { text-decoration: underline; }

.bl-edit-link-danger { color: var(--danger); }

.bl-combo-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bl-route-step {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0 2px 10px rgba(35,42,90,0.05);
}

.bl-route-step-num {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.bl-combo-row {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  font-family: 'Bitter', serif;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.bl-combo-row .amp { color: var(--text-muted); font-weight: 500; margin: 0 3px; font-family: 'Inter', sans-serif; }
.bl-combo-row .res-arrow { color: var(--accent); margin: 0 4px; font-family: 'Inter', sans-serif; }
.bl-combo-row .child { color: var(--accent-soft); }

.bl-suggest-dexno {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: var(--text-muted);
  margin-right: 6px;
}

.bl-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  margin-top: 3px;
}

.bl-card.editing {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(88,92,201,0.18), 0 2px 10px rgba(35,42,90,0.05);
}

.bl-card-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.bl-confirm-text {
  font-size: 11px;
  color: var(--danger);
  font-family: 'JetBrains Mono', monospace;
  margin-right: 4px;
  white-space: nowrap;
}

.bl-icon-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 5px;
  display: flex;
}

.bl-icon-btn:hover { color: var(--accent); background: rgba(88,92,201,0.1); }

.bl-del {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 5px;
  flex-shrink: 0;
  display: flex;
}

.bl-del:hover { color: var(--danger); background: rgba(220,79,71,0.1); }

.bl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 9px;
}

.bl-tag {
  background: rgba(79,86,196,0.09);
  border: 1px solid rgba(79,86,196,0.28);
  color: var(--teal);
  font-size: 11.5px;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}

.bl-notes {
  margin-top: 9px;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  border-top: 1px dashed var(--border);
  padding-top: 8px;
}

.bl-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 60px 0;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}

.bl-spin { animation: bl-spin 1s linear infinite; }
@keyframes bl-spin { to { transform: rotate(360deg); } }

@media (max-width: 480px) {
  .bl-row { grid-template-columns: 1fr; }
  .bl-cross { display: none; }
}
`;

const STORAGE_KEY = "entries";
const DEX_STORAGE_KEY = "dexProfiles";
const WISHLIST_STORAGE_KEY = "wishlist";
// パッシブスキル全115種（プラス系100・マイナス系15）。効果は簡潔な要約。
const PASSIVE_SKILLS = [
  { name: "悪魔の手", effect: "作業速度+90%／SAN値減りやすい+15%" },
  { name: "次元跳躍", effect: "移動速度+50%／満腹度減りやすい+15%" },
  { name: "諸刃の聖剣", effect: "攻撃+50%／防御-30%" },
  { name: "神樹の苗床", effect: "満腹度減りにくい+50%／HP-20%" },
  { name: "聖域の肉壁", effect: "防御+50%／攻撃-30%" },
  { name: "仙人", effect: "SAN値減りにくい+50%／作業速度-20%" },
  { name: "破壊神", effect: "攻撃+40%／防御+20%／HP-50%" },
  { name: "ダイヤモンドボディ", effect: "防御+30%／ひるみ・吹き飛び無効" },
  { name: "ヌシ", effect: "水属性攻撃+20%／氷属性攻撃+20%／防御+20%" },
  { name: "ベビーシッター", effect: "拠点内：牧場のタマゴ生成速度+30%／孵化速度+30%" },
  { name: "永炎", effect: "炎属性攻撃+30%／雷属性攻撃+30%" },
  { name: "永久機関", effect: "最大スタミナ+75%（ライドパルのみ）" },
  { name: "希少", effect: "攻撃+15%／防御+15%／作業速度+20%" },
  { name: "鬼神", effect: "攻撃+30%／防御+5%" },
  { name: "吸血鬼", effect: "ダメージの5%を吸収し回復／夜でも働く" },
  { name: "救世主", effect: "無属性攻撃+30%／草属性攻撃+30%" },
  { name: "空渡り", effect: "ライド中のジャンプ回数+2" },
  { name: "軽身", effect: "ライド中のジャンプ回数+1" },
  { name: "重装甲", effect: "爆破ダメージ無効" },
  { name: "侵略者", effect: "闇属性攻撃+30%／竜属性攻撃+30%" },
  { name: "神速", effect: "移動速度+30%" },
  { name: "絶食の極み", effect: "満腹度減りにくい+20%" },
  { name: "大盤振る舞い", effect: "自身のドロップアイテム+100%" },
  { name: "超絶技巧", effect: "作業速度+75%" },
  { name: "伝説", effect: "攻撃+20%／防御+20%／移動速度+20%" },
  { name: "特異体質", effect: "HP自然回復+50%／防御+25%／毒・炎上ダメージ無効" },
  { name: "波乗り王", effect: "水上移動速度+50%" },
  { name: "不死身", effect: "ライフスティール+5%／HP自然回復+100%／攻撃+15%" },
  { name: "不動明王の心", effect: "SAN値減りにくい+20%" },
  { name: "牧場の主", effect: "牧場の作業適性+2" },
  { name: "魔女", effect: "闇属性攻撃+30%／氷属性攻撃+30%" },
  { name: "サービス精神", effect: "自身のドロップアイテム+50%" },
  { name: "ダイエットマスター", effect: "満腹度減りにくい+15%" },
  { name: "バテ防止係", effect: "プレイヤーのスタミナ消費軽減+5%" },
  { name: "ヒーリングコーチ", effect: "プレイヤーHP自然回復+5%" },
  { name: "ヘビー級", effect: "防御+20%／吹き飛び無効" },
  { name: "モチベーター", effect: "プレイヤーの作業速度+25%" },
  { name: "リロードマスター", effect: "プレイヤーのリロード速度+4%" },
  { name: "ワーカーホリック", effect: "SAN値減りにくい+15%" },
  { name: "泳ぐのが得意", effect: "水上移動速度+40%" },
  { name: "炎帝", effect: "炎属性攻撃+30%" },
  { name: "海皇", effect: "水属性攻撃+30%" },
  { name: "屈強な肉体", effect: "防御+20%／ひるみ無効" },
  { name: "堅城の軍師", effect: "プレイヤーの防御+10%" },
  { name: "鉱山のチーフ", effect: "プレイヤーの採掘効率+25%" },
  { name: "高貴", effect: "取引価格改善+5%" },
  { name: "職人気質", effect: "作業速度+50%" },
  { name: "神龍", effect: "竜属性攻撃+30%" },
  { name: "精霊王", effect: "草属性攻撃+30%" },
  { name: "聖天", effect: "無属性攻撃+30%" },
  { name: "走るのが得意", effect: "移動速度+20%" },
  { name: "大物", effect: "水属性攻撃+5%／氷属性攻撃+5%／防御+5%" },
  { name: "地帝", effect: "地属性攻撃+30%" },
  { name: "突撃指揮者", effect: "プレイヤーの攻撃+10%" },
  { name: "脳筋", effect: "攻撃+30%／作業速度-50%" },
  { name: "博愛主義者", effect: "牧場配置中タマゴ生成速度+100%" },
  { name: "伐採リーダー", effect: "プレイヤーの伐採効率+25%" },
  { name: "氷帝", effect: "氷属性攻撃+30%" },
  { name: "牧場っ子", effect: "牧場の作業適性+1" },
  { name: "無限のスタミナ", effect: "最大スタミナ+50%（ライド可能パルのみ）" },
  { name: "冥王", effect: "闇属性攻撃+30%" },
  { name: "雷帝", effect: "雷属性攻撃+30%" },
  { name: "冷静沈着", effect: "クールタイム短縮30%／攻撃+10%" },
  { name: "獰猛", effect: "攻撃+20%" },
  { name: "アブノーマル", effect: "無属性ダメージ軽減10%" },
  { name: "うぬぼれ屋", effect: "作業速度+10%／防御-10%" },
  { name: "オラオラ系", effect: "攻撃+10%／防御-10%" },
  { name: "コンデンサ", effect: "雷属性攻撃+10%" },
  { name: "サディスト", effect: "攻撃+15%／防御-15%" },
  { name: "しなやかスイム", effect: "水上移動速度+30%" },
  { name: "すばしこい", effect: "移動速度+10%" },
  { name: "せっかち", effect: "クールタイム短縮15%" },
  { name: "ドラゴンキラー", effect: "竜属性ダメージ軽減10%" },
  { name: "ポジティブ思考", effect: "SAN値減りにくい+10%" },
  { name: "まじめ", effect: "作業速度+20%" },
  { name: "マゾヒスト", effect: "防御+15%／攻撃-15%" },
  { name: "火遊び好き", effect: "炎属性攻撃+10%" },
  { name: "健康優良児", effect: "最大スタミナ+25%（ライドパルのみ）" },
  { name: "硬い皮膚", effect: "防御+10%" },
  { name: "高温体質", effect: "氷属性ダメージ軽減10%" },
  { name: "社畜", effect: "作業速度+30%／攻撃-30%" },
  { name: "小食", effect: "満腹度減りにくい+10%" },
  { name: "水遊び好き", effect: "水属性攻撃+10%" },
  { name: "絶縁体", effect: "雷属性ダメージ軽減10%" },
  { name: "粗暴", effect: "攻撃+15%／作業速度-10%" },
  { name: "草木の香り", effect: "草属性攻撃+10%" },
  { name: "耐震構造", effect: "地属性ダメージ軽減10%" },
  { name: "大地の力", effect: "地属性攻撃+10%" },
  { name: "日焼け好き", effect: "炎属性ダメージ軽減10%" },
  { name: "不眠", effect: "夜になっても眠らず働き続ける" },
  { name: "防水加工", effect: "水属性ダメージ軽減10%" },
  { name: "防草効果", effect: "草属性ダメージ軽減10%" },
  { name: "未知の生体細胞", effect: "攻撃+10%／炎・雷属性ダメージ軽減15%" },
  { name: "無の境地", effect: "無属性攻撃+10%" },
  { name: "夜の帳", effect: "闇属性攻撃+10%" },
  { name: "勇敢", effect: "攻撃+10%" },
  { name: "陽キャラ", effect: "闇属性ダメージ軽減10%" },
  { name: "竜の血族", effect: "竜属性攻撃+10%" },
  { name: "良い毛並み", effect: "取引価格改善+3%" },
  { name: "冷血", effect: "氷属性攻撃+10%" },
  { name: "うたれ弱い", effect: "防御-10%" },
  { name: "ことなかれ主義者", effect: "攻撃-20%" },
  { name: "サボり癖", effect: "作業速度-30%" },
  { name: "すぐ骨折する", effect: "防御-20%" },
  { name: "のんびり屋さん", effect: "クールタイムが延びる-15%" },
  { name: "ビビり", effect: "攻撃-10%" },
  { name: "みすぼらしい", effect: "取引価格悪化-10%" },
  { name: "引きこもり", effect: "最大スタミナ-25%（ライドパルのみ）" },
  { name: "手加減", effect: "平和主義者（対象のHPを1未満にできない）" },
  { name: "食いしんぼ", effect: "満腹度減りやすい+10%" },
  { name: "精神が不安定", effect: "SAN値減りやすい+10%" },
  { name: "破滅願望", effect: "SAN値減りやすい+15%" },
  { name: "不器用", effect: "作業速度-10%" },
  { name: "無限の胃袋", effect: "満腹度減りやすい+15%" },
  { name: "夜更かし", effect: "夜中まで起きているため昼寝しがち" },
];

const PASSIVE_NAMES = PASSIVE_SKILLS.map((p) => p.name);
const PASSIVE_EFFECT_MAP = new Map(PASSIVE_SKILLS.map((p) => [p.name, p.effect]));

const WORK_TYPES = [
  "火おこし",
  "水やり",
  "種まき",
  "発電",
  "手作業",
  "採集",
  "伐採",
  "採掘",
  "製薬",
  "冷却",
  "運搬",
  "牧場",
];

const ELEMENT_TYPES = ["無", "炎", "水", "雷", "地", "草", "氷", "竜", "闇"];

const REFERENCE_PALS = {};
// パルの参考データベース。確認が取れたパルから少しずつここに追加していく。
// 形式：{ パル名: { number, elements, skillName, skillDesc, work: {作業名: レベル}, food, drops } }
// ※不正確なデータを登録しないよう、検索で確認できたものだけをここに入れる。

// 実際の繁殖力値が判明しているパル（基準点）。分かっているものが増えたらここに追加する。
const KNOWN_BREEDING_VALUES = {
  タマコッコ: 1500,
};

const ELEMENT_COLORS = {
  無: { bg: "rgba(148,163,184,0.14)", border: "rgba(148,163,184,0.4)", text: "#64748b" },
  炎: { bg: "rgba(239,90,60,0.12)", border: "rgba(239,90,60,0.4)", text: "#d84a2c" },
  水: { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.4)", text: "#2563eb" },
  雷: { bg: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.45)", text: "#b3860a" },
  地: { bg: "rgba(180,131,74,0.16)", border: "rgba(180,131,74,0.45)", text: "#9a6a35" },
  草: { bg: "rgba(74,177,90,0.14)", border: "rgba(74,177,90,0.4)", text: "#2f8f45" },
  氷: { bg: "rgba(45,197,214,0.14)", border: "rgba(45,197,214,0.4)", text: "#1596ab" },
  竜: { bg: "rgba(139,92,246,0.14)", border: "rgba(139,92,246,0.4)", text: "#7c3aed" },
  闇: { bg: "rgba(71,58,110,0.16)", border: "rgba(71,58,110,0.45)", text: "#463a6e" },
};

// ひらがな⇔カタカナを区別せず検索できるように、ひらがなをカタカナへ正規化する
// アップロード画像を軽量化してdata URLにする（保存容量を圧迫しないよう縮小・圧縮する）
function resizeImageFile(file, maxSize = 220, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"));
    reader.readAsDataURL(file);
  });
}

function normalizeKana(str) {
  return str.replace(/[\u3041-\u3096]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// deterministic pseudo-random (no external deps, stable across renders)
function hexPoints(cx, cy, r) {
  return [0, 60, 120, 180, 240, 300]
    .map((deg) => {
      const rad = (Math.PI / 180) * deg;
      return `${(cx + r * Math.cos(rad)).toFixed(1)},${(cy + r * Math.sin(rad)).toFixed(1)}`;
    })
    .join(" ");
}

// decorative molecule-style hex grid, denser/bolder toward the right, like the reference image
function HexBackground() {
  const cells = useMemo(() => {
    const R = 50;
    const colSpacing = R * 1.5;
    const rowSpacing = R * Math.sqrt(3);
    const cols = 12;
    const rows = 10;
    const list = [];
    for (let c = 0; c < cols; c++) {
      for (let rIdx = 0; rIdx < rows; rIdx++) {
        const cx = 30 + c * colSpacing;
        const cy = 30 + rIdx * rowSpacing + (c % 2 ? rowSpacing / 2 : 0);
        list.push({ id: `${c}-${rIdx}`, cx, cy, r: R });
      }
    }
    return list;
  }, []);

  const lineColor = "#c7d0ea";

  return (
    <svg
      className="bl-hexbg"
      viewBox="0 0 660 570"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {cells.map((cell) => (
        <polygon
          key={cell.id}
          points={hexPoints(cell.cx, cell.cy, cell.r)}
          fill="none"
          stroke={lineColor}
          strokeWidth={1}
          opacity={0.3}
        />
      ))}
    </svg>
  );
}

// 自前の予測変換入力：1文字目を入力してから候補を表示する
function AutocompleteInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  options,
  inputRef,
  className,
  dexMap,
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef(null);

  const matches = useMemo(() => {
    const q = normalizeKana(value.trim().toLowerCase());
    if (!q) return [];
    const candidates = options.filter((o) => {
      const norm = normalizeKana(o.toLowerCase());
      return norm.includes(q) && norm !== q;
    });
    const starts = candidates.filter((o) => normalizeKana(o.toLowerCase()).startsWith(q));
    const rest = candidates.filter((o) => !normalizeKana(o.toLowerCase()).startsWith(q));
    return [...starts, ...rest].slice(0, 8);
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOption(name) {
    onChange(name);
    setOpen(false);
    setHighlight(-1);
  }

  return (
    <div className="bl-autocomplete-wrap" ref={wrapRef}>
      <input
        ref={inputRef}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (open && matches.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => Math.min(h + 1, matches.length - 1));
              return;
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
              return;
            }
            if (e.key === "Enter" && highlight >= 0) {
              e.preventDefault();
              selectOption(matches[highlight]);
              return;
            }
            if (e.key === "Escape") {
              setOpen(false);
              return;
            }
          }
          onKeyDown?.(e);
        }}
        autoComplete="off"
      />
      {open && matches.length > 0 && (
        <div className="bl-suggest">
          {matches.map((m, i) => (
            <div
              key={m}
              className={`bl-suggest-item${i === highlight ? " active" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(m);
              }}
            >
              {dexMap && dexMap.has(m) && (
                <span className="bl-suggest-dexno">
                  No.{String(dexMap.get(m).number).padStart(3, "0")}
                  {dexMap.get(m).suffix || ""}
                </span>
              )}
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// カンマ区切りの複数値入力用（最後のセグメントに対して予測変換する）
function TagAutocompleteInput({ value, onChange, placeholder, options, className }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef(null);

  const priorSegments = useMemo(() => {
    const parts = value.split(/[,、]/);
    return parts
      .slice(0, -1)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [value]);

  const currentSegment = useMemo(() => {
    const parts = value.split(/[,、]/);
    return (parts[parts.length - 1] || "").trim();
  }, [value]);

  const matches = useMemo(() => {
    const q = normalizeKana(currentSegment.toLowerCase());
    if (!q) return [];
    const candidates = options.filter((o) => {
      const norm = normalizeKana(o.toLowerCase());
      return norm.includes(q) && norm !== q && !priorSegments.includes(o);
    });
    const starts = candidates.filter((o) => normalizeKana(o.toLowerCase()).startsWith(q));
    const rest = candidates.filter((o) => !normalizeKana(o.toLowerCase()).startsWith(q));
    return [...starts, ...rest].slice(0, 8);
  }, [currentSegment, options, priorSegments]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOption(name) {
    const next = [...priorSegments, name].join(", ") + ", ";
    onChange(next);
    setOpen(false);
    setHighlight(-1);
  }

  return (
    <div className="bl-autocomplete-wrap" ref={wrapRef}>
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (open && matches.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => Math.min(h + 1, matches.length - 1));
              return;
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
              return;
            }
            if (e.key === "Enter" && highlight >= 0) {
              e.preventDefault();
              selectOption(matches[highlight]);
              return;
            }
            if (e.key === "Escape") {
              setOpen(false);
              return;
            }
          }
        }}
        autoComplete="off"
      />
      {open && matches.length > 0 && (
        <div className="bl-suggest">
          {matches.map((m, i) => (
            <div
              key={m}
              className={`bl-suggest-item${i === highlight ? " active" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(m);
              }}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BreedingLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("all"); // "all" | "target" | "parent"

  const [parent1, setParent1] = useState("");
  const [parent2, setParent2] = useState("");
  const [child, setChild] = useState("");
  const [passives, setPassives] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(true);
  const [isSpecial, setIsSpecial] = useState(false);

  const [dexProfiles, setDexProfiles] = useState({}); // { [palName]: { number, details } }
  const [dexLoading, setDexLoading] = useState(true);
  const [detailPal, setDetailPal] = useState(null);
  const [itemDetail, setItemDetail] = useState(null);
  const [detailEditing, setDetailEditing] = useState(false);
  const [dexEditNumber, setDexEditNumber] = useState("");
  const [dexEditSuffix, setDexEditSuffix] = useState("");
  const [dexEditImage, setDexEditImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [dexEditElements, setDexEditElements] = useState([]);
  const [dexEditSkillName, setDexEditSkillName] = useState("");
  const [dexEditSkillDesc, setDexEditSkillDesc] = useState("");
  const [dexEditWork, setDexEditWork] = useState({});
  const [dexEditFood, setDexEditFood] = useState("");
  const [dexEditDrops, setDexEditDrops] = useState("");
  const [dexEditDetails, setDexEditDetails] = useState("");
  const [dexSaving, setDexSaving] = useState(false);
  const [dexError, setDexError] = useState(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importing, setImporting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDexDelete, setConfirmDexDelete] = useState(false);
  const [wishlist, setWishlist] = useState([]); // [{ name, note, addedAt }]
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishName, setWishName] = useState("");
  const [wishNote, setWishNote] = useState("");
  const [wishSaving, setWishSaving] = useState(false);
  const [wishError, setWishError] = useState(null);
  const [predictParent1, setPredictParent1] = useState("");
  const [routeStartPal, setRouteStartPal] = useState("");
  const [predictParent2, setPredictParent2] = useState("");
  const [dexElementFilter, setDexElementFilter] = useState([]);
  const [dexWorkFilter, setDexWorkFilter] = useState("");
  const [dexSortByWork, setDexSortByWork] = useState(true);

  const parent1Ref = useRef(null);
  const formTopRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY, false);
        if (result && result.value) {
          setEntries(JSON.parse(result.value));
        }
      } catch (e) {
        // key not existing yet is expected on first run
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(DEX_STORAGE_KEY, false);
        if (result && result.value) {
          setDexProfiles(JSON.parse(result.value));
        }
      } catch (e) {
        // key not existing yet is expected on first run
      } finally {
        setDexLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(WISHLIST_STORAGE_KEY, false);
        if (result && result.value) {
          setWishlist(JSON.parse(result.value));
        }
      } catch (e) {
        // key not existing yet is expected on first run
      } finally {
        setWishlistLoading(false);
      }
    })();
  }, []);

  // 記録にしか登場していない新しいパルを図鑑に自動登録する（番号は末尾に追加、後から手動で変更可能）
  useEffect(() => {
    if (loading || dexLoading) return;
    const inOrder = [...entries]
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
      .flatMap((en) => [en.parent1, en.parent2, en.child])
      .filter(Boolean);
    const seen = new Set();
    const uniqueInOrder = [];
    inOrder.forEach((n) => {
      if (!seen.has(n)) {
        seen.add(n);
        uniqueInOrder.push(n);
      }
    });
    const missing = uniqueInOrder.filter((n) => !dexProfiles[n]);
    if (missing.length === 0) return;

    let maxNum = Object.values(dexProfiles).reduce((m, p) => Math.max(m, p.number || 0), 0);
    const next = { ...dexProfiles };
    missing.forEach((name) => {
      maxNum += 1;
      next[name] = { number: maxNum, details: "" };
    });
    setDexProfiles(next);
    window.storage.set(DEX_STORAGE_KEY, JSON.stringify(next), false).catch(() => {});
  }, [entries, dexProfiles, loading, dexLoading]);

  async function persist(next) {
    setSaving(true);
    setSaveError(null);
    try {
      const result = await window.storage.set(STORAGE_KEY, JSON.stringify(next), false);
      if (!result) throw new Error("save failed");
      setEntries(next);
    } catch (e) {
      setSaveError("記録の保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!parent1.trim() || !parent2.trim() || !child.trim()) {
      setSaveError("親パル2体と生まれたパルの名前は必須です。");
      return;
    }

    const p1 = parent1.trim();
    const p2 = parent2.trim();
    const c = child.trim();

    // 重複チェック：親の順番違い（A×B と B×A）も同じ組み合わせとして扱う
    const isDuplicate = entries.some((en) => {
      if (editingId && en.id === editingId) return false;
      const sameParents =
        (en.parent1 === p1 && en.parent2 === p2) || (en.parent1 === p2 && en.parent2 === p1);
      return sameParents && en.child === c;
    });
    if (isDuplicate) {
      setSaveError(`「${p1} × ${p2} → ${c}」はすでに記録されています。`);
      return;
    }

    const passiveList = passives
      .split(/[,、]/)
      .map((s) => s.trim())
      .filter(Boolean);

    let next;
    if (editingId) {
      next = entries.map((en) =>
        en.id === editingId
          ? {
              ...en,
              parent1: p1,
              parent2: p2,
              child: c,
              passives: passiveList,
              notes: notes.trim(),
              special: isSpecial,
            }
          : en
      );
    } else {
      const newEntry = {
        id: uid(),
        parent1: p1,
        parent2: p2,
        child: c,
        passives: passiveList,
        notes: notes.trim(),
        special: isSpecial,
        date: todayStr(),
        createdAt: Date.now(),
      };
      next = [newEntry, ...entries];
    }

    await persist(next);
    setParent1("");
    setParent2("");
    setChild("");
    setPassives("");
    setNotes("");
    setIsSpecial(false);
    setEditingId(null);
    parent1Ref.current?.focus();
  }

  function handleEdit(entry) {
    setEditingId(entry.id);
    setParent1(entry.parent1);
    setParent2(entry.parent2);
    setChild(entry.child);
    setPassives((entry.passives || []).join(", "));
    setNotes(entry.notes || "");
    setIsSpecial(!!entry.special);
    setSaveError(null);
    setFormOpen(true);
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    parent1Ref.current?.focus();
  }

  function handleCancelEdit() {
    setEditingId(null);
    setParent1("");
    setParent2("");
    setChild("");
    setPassives("");
    setNotes("");
    setIsSpecial(false);
    setSaveError(null);
  }

  function requestDelete(id) {
    setConfirmDeleteId(id);
  }

  function cancelDeleteRequest() {
    setConfirmDeleteId(null);
  }

  async function handleDelete(id) {
    if (editingId === id) handleCancelEdit();
    setConfirmDeleteId(null);
    const next = entries.filter((en) => en.id !== id);
    await persist(next);
  }

  const filtered = useMemo(() => {
    const q = normalizeKana(query.trim().toLowerCase());
    if (!q) return mode === "all" ? entries : [];

    if (mode === "target") {
      // 作りたいパルから探す：生まれたパル名で検索し、必要な親の組み合わせを出す
      return entries.filter((en) => normalizeKana(en.child.toLowerCase()).includes(q));
    }

    if (mode === "parent") {
      // 手持ちのパルから探す：親として使われた記録を検索し、生まれるパルを出す
      return entries.filter(
        (en) =>
          normalizeKana(en.parent1.toLowerCase()).includes(q) ||
          normalizeKana(en.parent2.toLowerCase()).includes(q)
      );
    }

    // 自由検索：全項目を対象に検索
    return entries.filter((en) => {
      const haystack = normalizeKana(
        [en.parent1, en.parent2, en.child, en.notes, ...(en.passives || [])].join(" ").toLowerCase()
      );
      return haystack.includes(q);
    });
  }, [entries, query, mode]);

  // 図鑑番号：dexProfiles（手動編集可能）から一覧を作る
  const palDex = useMemo(() => {
    const map = new Map();
    Object.entries(dexProfiles).forEach(([name, p]) => {
      if (!p.removed) map.set(name, { number: p.number, suffix: p.suffix || "" });
    });
    return map;
  }, [dexProfiles]);

  const dexList = useMemo(() => {
    return Object.entries(dexProfiles)
      .filter(([, p]) => !p.removed)
      .map(([name, p]) => {
        const hasWork = p.work && Object.values(p.work).some((v) => v > 0);
        const edited = !!(
          p.skillName ||
          p.skillDesc ||
          hasWork ||
          (p.elements && p.elements.length > 0) ||
          p.food != null ||
          (p.drops && p.drops.length > 0) ||
          p.details ||
          p.image
        );
        return {
          name,
          n: p.number,
          suffix: p.suffix || "",
          details: p.details || "",
          work: p.work || {},
          elements: p.elements || [],
          image: p.image || null,
          drops: p.drops || [],
          edited,
        };
      })
      .sort((a, b) => a.n - b.n || a.suffix.localeCompare(b.suffix) || a.name.localeCompare(b.name, "ja"));
  }, [dexProfiles]);

  const dexFiltered = useMemo(() => {
    if (mode !== "dex") return [];
    const q = normalizeKana(query.trim().toLowerCase());
    let list = dexList;

    if (q) list = list.filter((d) => normalizeKana(d.name.toLowerCase()).includes(q));

    if (dexElementFilter.length > 0) {
      list = list.filter((d) => d.elements.some((el) => dexElementFilter.includes(el)));
    }

    if (dexWorkFilter) {
      list = list.filter((d) => (d.work[dexWorkFilter] || 0) > 0);
      if (dexSortByWork) {
        list = [...list].sort(
          (a, b) => (b.work[dexWorkFilter] || 0) - (a.work[dexWorkFilter] || 0) || a.n - b.n
        );
      }
    }

    return list;
  }, [dexList, query, mode, dexElementFilter, dexWorkFilter, dexSortByWork]);

  function toggleElementFilter(el) {
    setDexElementFilter((prev) => (prev.includes(el) ? prev.filter((e) => e !== el) : [...prev, el]));
  }

  function clearDexFilters() {
    setDexElementFilter([]);
    setDexWorkFilter("");
  }

  function dexNo(name) {
    const entry = palDex.get(name);
    if (!entry) return null;
    return `No.${String(entry.number).padStart(3, "0")}${entry.suffix || ""}`;
  }

  function openPalDetail(name) {
    setDetailPal(name);
    setDetailEditing(false);
    setDexError(null);
    setItemDetail(null);
    setConfirmDexDelete(false);
  }

  function closePalDetail() {
    setDetailPal(null);
    setDetailEditing(false);
    setDexError(null);
    setConfirmDexDelete(false);
  }

  async function deleteDexProfile(name) {
    const existing = dexProfiles[name];
    if (!existing) return;
    const next = { ...dexProfiles, [name]: { ...existing, removed: true } };
    setDexSaving(true);
    setDexError(null);
    try {
      const result = await window.storage.set(DEX_STORAGE_KEY, JSON.stringify(next), false);
      if (!result) throw new Error("save failed");
      setDexProfiles(next);
      closePalDetail();
    } catch (e) {
      setDexError("削除に失敗しました。もう一度お試しください。");
    } finally {
      setDexSaving(false);
    }
  }

  function isWished(name) {
    return wishlist.some((w) => w.name === name);
  }

  async function persistWishlist(next) {
    setWishSaving(true);
    setWishError(null);
    try {
      const result = await window.storage.set(WISHLIST_STORAGE_KEY, JSON.stringify(next), false);
      if (!result) throw new Error("save failed");
      setWishlist(next);
    } catch (e) {
      setWishError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setWishSaving(false);
    }
  }

  async function addWishlistItem(e) {
    if (e && e.preventDefault) e.preventDefault();
    const name = wishName.trim();
    if (!name) {
      setWishError("パル名を入力してください。");
      return;
    }
    if (isWished(name)) {
      setWishError(`「${name}」はすでにリストにあります。`);
      return;
    }
    const next = [{ name, note: wishNote.trim(), addedAt: Date.now() }, ...wishlist];
    await persistWishlist(next);
    setWishName("");
    setWishNote("");
  }

  async function removeWishlistItem(name) {
    const next = wishlist.filter((w) => w.name !== name);
    await persistWishlist(next);
  }

  async function toggleWishlist(name) {
    const prev = wishlist;
    const wasWished = isWished(name);
    const next = wasWished
      ? wishlist.filter((w) => w.name !== name)
      : [{ name, note: "", addedAt: Date.now() }, ...wishlist];

    setWishlist(next); // 先に見た目を更新（保存を待たない）
    setWishError(null);
    try {
      const result = await window.storage.set(WISHLIST_STORAGE_KEY, JSON.stringify(next), false);
      if (!result) throw new Error("save failed");
    } catch (e) {
      setWishlist(prev); // 失敗したときだけ元に戻す
      setWishError("保存に失敗しました。もう一度お試しください。");
    }
  }

  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      entries,
      dexProfiles,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
      d.getDate()
    ).padStart(2, "0")}`;
    a.href = url;
    a.download = `palworld-breeding-log-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== "object" || !Array.isArray(data.entries)) {
          throw new Error("invalid format");
        }
        setPendingImport({
          entries: data.entries,
          dexProfiles:
            data.dexProfiles && typeof data.dexProfiles === "object" ? data.dexProfiles : {},
        });
      } catch (err) {
        setImportError("ファイルの形式が正しくありません。エクスポートしたJSONファイルを選択してください。");
      }
    };
    reader.onerror = () => setImportError("ファイルの読み込みに失敗しました。");
    reader.readAsText(file);
  }

  async function confirmImport() {
    if (!pendingImport) return;
    setImporting(true);
    setImportError(null);
    try {
      // 記録：同じ組み合わせ（親の順番違いも同一視）はスキップして追加する
      const existingKeys = new Set(
        entries.map((en) => [en.parent1, en.parent2].sort().join("×") + "→" + en.child)
      );
      const newEntries = pendingImport.entries.filter((en) => {
        const key = [en.parent1, en.parent2].sort().join("×") + "→" + en.child;
        if (existingKeys.has(key)) return false;
        existingKeys.add(key);
        return true;
      });
      const mergedEntries = [
        ...newEntries.map((en) => ({ ...en, id: en.id && !entries.some((e) => e.id === en.id) ? en.id : uid() })),
        ...entries,
      ];

      // 図鑑：すでに自分でカスタマイズ済みのパルは上書きせず、未登録のパルだけ追加する
      const mergedDex = { ...dexProfiles };
      Object.entries(pendingImport.dexProfiles || {}).forEach(([name, profile]) => {
        if (!mergedDex[name]) mergedDex[name] = profile;
      });

      const r1 = await window.storage.set(STORAGE_KEY, JSON.stringify(mergedEntries), false);
      const r2 = await window.storage.set(DEX_STORAGE_KEY, JSON.stringify(mergedDex), false);
      if (!r1 || !r2) throw new Error("save failed");
      setEntries(mergedEntries);
      setDexProfiles(mergedDex);
      setPendingImport(null);
    } catch (err) {
      setImportError("インポートの保存に失敗しました。もう一度お試しください。");
    } finally {
      setImporting(false);
    }
  }

  function cancelImport() {
    setPendingImport(null);
    setImportError(null);
  }

  function openItemDetail(itemName) {
    setItemDetail(itemName);
    setDetailPal(null);
  }

  function closeItemDetail() {
    setItemDetail(null);
  }

  const itemPals = useMemo(() => {
    if (!itemDetail) return [];
    return dexList.filter((d) => d.drops.includes(itemDetail));
  }, [itemDetail, dexList]);

  function startDetailEdit() {
    setConfirmDexDelete(false);
    const profile = dexProfiles[detailPal];
    setDexEditNumber(String(profile?.number || palDex.get(detailPal)?.number || ""));
    setDexEditSuffix(profile?.suffix || "");
    setDexEditImage(profile?.image || "");
    setDexEditElements(profile?.elements || []);
    setDexEditSkillName(profile?.skillName || "");
    setDexEditSkillDesc(profile?.skillDesc || "");
    const work = {};
    WORK_TYPES.forEach((t) => {
      work[t] = profile?.work?.[t] || 0;
    });
    setDexEditWork(work);
    setDexEditFood(profile?.food != null ? String(profile.food) : "");
    setDexEditDrops((profile?.drops || []).join(", "));
    setDexEditDetails(profile?.details || "");
    setDetailEditing(true);
    setDexError(null);
  }

  // 参考データベースに情報があれば、編集フォームにまとめて反映する（すでに入力済みの項目は上書きしない）
  function applyReferenceTemplate() {
    const ref = REFERENCE_PALS[detailPal];
    if (!ref) return;
    if (!dexEditElements.length && ref.elements) setDexEditElements(ref.elements);
    if (!dexEditSkillName && ref.skillName) setDexEditSkillName(ref.skillName);
    if (!dexEditSkillDesc && ref.skillDesc) setDexEditSkillDesc(ref.skillDesc);
    if (ref.work) {
      setDexEditWork((prev) => {
        const next = { ...prev };
        WORK_TYPES.forEach((t) => {
          if (!next[t] && ref.work[t]) next[t] = ref.work[t];
        });
        return next;
      });
    }
    if (!dexEditFood && ref.food != null) setDexEditFood(String(ref.food));
    if (!dexEditDrops.trim() && ref.drops) setDexEditDrops(ref.drops.join(", "));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImageUploading(true);
    setDexError(null);
    try {
      const dataUrl = await resizeImageFile(file);
      setDexEditImage(dataUrl);
    } catch (err) {
      setDexError("画像の読み込みに失敗しました。別の画像でお試しください。");
    } finally {
      setImageUploading(false);
    }
  }

  function toggleElement(el) {
    setDexEditElements((prev) => {
      if (prev.includes(el)) return prev.filter((e) => e !== el);
      if (prev.length >= 2) return prev; // 最大2種類まで
      return [...prev, el];
    });
  }

  async function saveDetailEdit() {
    const parsedNum = parseInt(dexEditNumber, 10);
    const finalNum =
      Number.isFinite(parsedNum) && parsedNum > 0 ? parsedNum : dexProfiles[detailPal]?.number || 1;
    const parsedFood = parseInt(dexEditFood, 10);
    const next = {
      ...dexProfiles,
      [detailPal]: {
        number: finalNum,
        suffix: dexEditSuffix.trim().slice(0, 3),
        image: dexEditImage || null,
        elements: dexEditElements,
        skillName: dexEditSkillName.trim(),
        skillDesc: dexEditSkillDesc.trim(),
        work: { ...dexEditWork },
        food: Number.isFinite(parsedFood) && parsedFood >= 1 ? Math.min(10, parsedFood) : null,
        drops: dexEditDrops
          .split(/[,、]/)
          .map((s) => s.trim())
          .filter(Boolean),
        details: dexEditDetails.trim(),
      },
    };
    setDexSaving(true);
    setDexError(null);
    try {
      const result = await window.storage.set(DEX_STORAGE_KEY, JSON.stringify(next), false);
      if (!result) throw new Error("save failed");
      setDexProfiles(next);
      setDetailEditing(false);
    } catch (e) {
      setDexError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setDexSaving(false);
    }
  }

  // 詳細モーダル用：そのパルの図鑑情報と、関わる配合記録（親としても子としても）
  const palDetail = useMemo(() => {
    if (!detailPal) return null;
    const asChild = entries.filter((en) => en.child === detailPal);
    const asParent = entries.filter((en) => en.parent1 === detailPal || en.parent2 === detailPal);
    return {
      name: detailPal,
      profile: dexProfiles[detailPal] || null,
      asChild,
      asParent,
    };
  }, [detailPal, dexProfiles, entries]);


  // 検索の予測変換用：これまでに記録された親・子パル名の重複なし一覧
  const knownPalNames = useMemo(() => {
    const set = new Set();
    entries.forEach((en) => {
      if (en.parent1) set.add(en.parent1);
      if (en.parent2) set.add(en.parent2);
      if (en.child) set.add(en.child);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }, [entries]);

  // 落とすアイテムの予測変換用：これまでに記録したアイテム名の重複なし一覧
  const knownItems = useMemo(() => {
    const set = new Set();
    Object.values(dexProfiles).forEach((p) => {
      (p.drops || []).forEach((d) => set.add(d));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }, [dexProfiles]);

  // パッシブスキルの予測変換用：公式一覧 + 記録の中で使ったことのある独自の名称
  const knownPassives = useMemo(() => {
    const set = new Set(PASSIVE_NAMES);
    entries.forEach((en) => {
      (en.passives || []).forEach((p) => set.add(p));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }, [entries]);

  // ルート探索用：生まれたパル名 → 記録済みの親の組み合わせ（重複なし）
  const childToCombos = useMemo(() => {
    const map = new Map();
    entries.forEach((en) => {
      if (!map.has(en.child)) map.set(en.child, []);
      const list = map.get(en.child);
      const key = [en.parent1, en.parent2].sort().join("×");
      if (!list.some((c) => [c.parent1, c.parent2].sort().join("×") === key)) {
        list.push({ parent1: en.parent1, parent2: en.parent2 });
      }
    });
    return map;
  }, [entries]);

  // 目的のパルまで最短の配合回数で辿り着くルートを探索する（記録済みの組み合わせのみ使用）
  function findBreedingRoute(target, combosMap, requiredLeaf) {
    const memoNormal = new Map();
    const memoMust = new Map();

    function solveNormal(pal, visiting) {
      if (memoNormal.has(pal)) return memoNormal.get(pal);
      const combos = combosMap.get(pal);
      if (!combos || combos.length === 0) {
        const result = { steps: 0, node: { name: pal, leaf: true } };
        memoNormal.set(pal, result);
        return result;
      }
      if (visiting.has(pal)) return { steps: Infinity, node: null };
      const nextVisiting = new Set(visiting);
      nextVisiting.add(pal);
      let best = null;
      combos.forEach((combo) => {
        const r1 = solveNormal(combo.parent1, nextVisiting);
        const r2 = solveNormal(combo.parent2, nextVisiting);
        if (r1.steps === Infinity || r2.steps === Infinity) return;
        const total = 1 + r1.steps + r2.steps;
        if (!best || total < best.steps) {
          best = { steps: total, node: { name: pal, leaf: false, parent1: r1.node, parent2: r2.node } };
        }
      });
      const result = best || { steps: Infinity, node: null };
      memoNormal.set(pal, result);
      return result;
    }

    // 「requiredLeaf を必ずどこかで使う」という条件つきの最短ルート
    function solveMust(pal, visiting) {
      if (memoMust.has(pal)) return memoMust.get(pal);
      if (pal === requiredLeaf) {
        const result = { steps: 0, node: { name: pal, leaf: true } };
        memoMust.set(pal, result);
        return result;
      }
      const combos = combosMap.get(pal);
      if (!combos || combos.length === 0) {
        // これ以上配合できない別のパルなので、requiredLeaf をここには含められない
        const result = { steps: Infinity, node: null };
        memoMust.set(pal, result);
        return result;
      }
      if (visiting.has(pal)) return { steps: Infinity, node: null };
      const nextVisiting = new Set(visiting);
      nextVisiting.add(pal);
      let best = null;
      combos.forEach((combo) => {
        const n1 = solveNormal(combo.parent1, nextVisiting);
        const n2 = solveNormal(combo.parent2, nextVisiting);
        const m1 = solveMust(combo.parent1, nextVisiting);
        const m2 = solveMust(combo.parent2, nextVisiting);
        if (m1.steps !== Infinity && n2.steps !== Infinity) {
          const total = 1 + m1.steps + n2.steps;
          if (!best || total < best.steps) {
            best = { steps: total, node: { name: pal, leaf: false, parent1: m1.node, parent2: n2.node } };
          }
        }
        if (n1.steps !== Infinity && m2.steps !== Infinity) {
          const total = 1 + n1.steps + m2.steps;
          if (!best || total < best.steps) {
            best = { steps: total, node: { name: pal, leaf: false, parent1: n1.node, parent2: m2.node } };
          }
        }
      });
      const result = best || { steps: Infinity, node: null };
      memoMust.set(pal, result);
      return result;
    }

    if (requiredLeaf) return solveMust(target, new Set());
    return solveNormal(target, new Set());
  }

  function flattenRouteSteps(node, out, seen) {
    if (!node || node.leaf) return;
    flattenRouteSteps(node.parent1, out, seen);
    flattenRouteSteps(node.parent2, out, seen);
    const key = [node.parent1.name, node.parent2.name].sort().join("×") + "→" + node.name;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ parent1: node.parent1.name, parent2: node.parent2.name, child: node.name });
    }
  }

  const routeResult = useMemo(() => {
    if (mode !== "route" || !query.trim()) return null;
    const target = query.trim();
    const matchName =
      knownPalNames.find((n) => n === target) ||
      knownPalNames.find((n) => normalizeKana(n.toLowerCase()) === normalizeKana(target.toLowerCase()));
    const resolvedTarget = matchName || target;

    const startInput = routeStartPal.trim();
    let resolvedStart = null;
    if (startInput) {
      const startMatch =
        knownPalNames.find((n) => n === startInput) ||
        knownPalNames.find((n) => normalizeKana(n.toLowerCase()) === normalizeKana(startInput.toLowerCase()));
      resolvedStart = startMatch || startInput;
    }

    if (!childToCombos.has(resolvedTarget)) {
      return { target: resolvedTarget, start: resolvedStart, steps: [], status: "unknown" };
    }

    const result = findBreedingRoute(resolvedTarget, childToCombos, resolvedStart || undefined);

    if (result.steps === Infinity) {
      return {
        target: resolvedTarget,
        start: resolvedStart,
        steps: [],
        status: resolvedStart ? "impossible-with-start" : "impossible",
      };
    }
    const steps = [];
    flattenRouteSteps(result.node, steps, new Set());
    return { target: resolvedTarget, start: resolvedStart, steps, status: "found" };
  }, [mode, query, routeStartPal, childToCombos, knownPalNames]);

  // 繁殖力値推定：親の値の平均（四捨五入）が子の値になるという規則を使い、
  // 記録済みの配合データだけから各パルの「相対的な」ランク値を逆算する
  const rankEstimate = useMemo(() => {
    if (mode !== "rank") return null;

    const normalEntries = entries.filter((en) => !en.special);
    const specialCount = entries.length - normalEntries.length;

    const nodeSet = new Set();
    normalEntries.forEach((en) => {
      nodeSet.add(en.parent1);
      nodeSet.add(en.parent2);
      nodeSet.add(en.child);
    });
    const names = Array.from(nodeSet);
    if (names.length === 0 || normalEntries.length === 0) {
      return { list: [], residuals: [], nodeCount: 0, edgeCount: 0, specialCount };
    }

    const idx = new Map(names.map((n, i) => [n, i]));
    const values = names.map((_, i) => i * 0.01); // 対称性を崩すための初期値
    const edges = normalEntries.map((en) => [idx.get(en.parent1), idx.get(en.parent2), idx.get(en.child)]);

    const lr = 0.15;
    const iterations = 1200;
    for (let iter = 0; iter < iterations; iter++) {
      edges.forEach(([p1, p2, c]) => {
        const err = values[c] - (values[p1] + values[p2]) / 2;
        values[c] -= lr * err;
        values[p1] += lr * err * 0.5;
        values[p2] += lr * err * 0.5;
      });
    }

    const min = Math.min(...values);
    const normalized = values.map((v) => v - min); // 最弱（記録上）を0にそろえた相対値
    const spread = Math.max(...normalized) || 1;
    const BV_MIN = 10;
    const BV_MAX = 1500;

    // 基準点（実際の値が判明しているパル）が記録の中にあれば使う
    let anchorName = null;
    let anchorKnownValue = null;
    for (const name of names) {
      if (KNOWN_BREEDING_VALUES[name] != null) {
        anchorName = name;
        anchorKnownValue = KNOWN_BREEDING_VALUES[name];
        break;
      }
    }

    // 「記録上いちばん弱いパル ≒ 実際の最小値10」という仮定と、基準点（あれば）の
    // 2点だけを使って、1回の変換（v_real = a * v_normalized + b）で一貫して換算する
    // 数値は「大きいほど弱い・小さいほど強い」向き。タマコッコ(1500)は弱い側の絶対上限（確定情報）。
    // 記録データの中でタマコッコがどちら側に来ているかで、生の計算値の向きを自動判定する。
    let a, b;
    if (anchorName) {
      const anchorNorm = normalized[names.indexOf(anchorName)];
      const midpoint = spread / 2;
      // タマコッコと反対側の端を「強い方の基準」とみなし、実際値10に対応させる
      const strongRaw = anchorNorm >= midpoint ? 0 : spread;
      const denom = anchorNorm - strongRaw;
      a = denom !== 0 ? (anchorKnownValue - BV_MIN) / denom : 0;
      b = BV_MIN - a * strongRaw;
    } else {
      b = BV_MIN;
      a = spread !== 0 ? (BV_MAX - BV_MIN) / spread : 0;
    }
    const rawRescaledValues = names.map((_, i) => a * normalized[i] + b);
    const estimatedMax = Math.max(...rawRescaledValues);
    const estimatedMin = Math.min(...rawRescaledValues);
    const clampedHighNames = [];
    const clampedLowNames = [];
    const rescaledValues = rawRescaledValues.map((v, i) => {
      if (v > BV_MAX) clampedHighNames.push(names[i]);
      else if (v < BV_MIN) clampedLowNames.push(names[i]);
      return Math.min(BV_MAX, Math.max(BV_MIN, v));
    });
    const clampedCount = clampedHighNames.length + clampedLowNames.length;

    const list = names
      .map((name, i) => ({ name, value: rescaledValues[i] }))
      .sort((a, b) => a.value - b.value);

    const residuals = normalEntries
      .map((en) => {
        const p1v = normalized[idx.get(en.parent1)];
        const p2v = normalized[idx.get(en.parent2)];
        const cv = normalized[idx.get(en.child)];
        const expected = (p1v + p2v) / 2;
        return { entry: en, diff: Math.abs(cv - expected) };
      })
      .filter((r) => r.diff > 1)
      .sort((a, b) => b.diff - a.diff)
      .slice(0, 5);

    return {
      list,
      residuals,
      nodeCount: names.length,
      edgeCount: normalEntries.length,
      specialCount,
      anchorName,
      anchorKnownValue,
      estimatedMax,
      estimatedMin,
      clampedCount,
      clampedHighNames,
      clampedLowNames,
    };
  }, [mode, entries]);

  // 予測ツール：選んだ親2体の推定繁殖力値の平均に、記録済みの中で一番近いパルを探す
  const predictResult = useMemo(() => {
    if (mode !== "rank" || !rankEstimate || !predictParent1.trim() || !predictParent2.trim()) {
      return null;
    }
    const valueMap = new Map(rankEstimate.list.map((r) => [r.name, r.value]));
    const v1 = valueMap.get(predictParent1.trim());
    const v2 = valueMap.get(predictParent2.trim());
    if (v1 == null || v2 == null) {
      return { error: "選んだパルの繁殖力値がまだ推定できていません（配合記録がないパルは対象外です）。" };
    }
    const avg = (v1 + v2) / 2;
    const candidates = rankEstimate.list
      .map((r) => ({ name: r.name, value: r.value, diff: Math.abs(r.value - avg) }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 5);
    return { avg, candidates };
  }, [mode, rankEstimate, predictParent1, predictParent2]);

  const parentModeResults = useMemo(() => {
    if (mode !== "parent" || !query.trim()) return [];
    const seen = new Map();
    filtered.forEach((en) => {
      if (!seen.has(en.child)) seen.set(en.child, en);
    });
    return Array.from(seen.values());
  }, [filtered, mode, query]);

  // 「作りたいパルから探す」モード用：目的のパルを生む親の組み合わせ一覧（重複なし）
  const targetModeCombos = useMemo(() => {
    if (mode !== "target" || !query.trim()) return [];
    const seen = new Map();
    filtered.forEach((en) => {
      const key = [en.parent1, en.parent2].sort().join("×");
      if (!seen.has(key)) seen.set(key, en);
    });
    return Array.from(seen.values());
  }, [filtered, mode, query]);

  const modeConfig = {
    all: {
      icon: Search,
      label: "自由検索",
      placeholder: "パル名・スキル・メモで検索",
      hint: null,
    },
    target: {
      icon: Target,
      label: "作りたいパルから探す",
      placeholder: "作りたいパル名を入力（例：モコロン）",
      hint: "入力したパルを生んだ、記録済みの親の組み合わせを表示します",
    },
    parent: {
      icon: PawPrint,
      label: "手持ちのパルから探す",
      placeholder: "手持ちのパル名を入力（例：モコロン）",
      hint: "入力したパルを親にして生まれた記録済みの結果を表示します",
    },
    dex: {
      icon: BookOpen,
      label: "図鑑",
      placeholder: "パル名で絞り込み（空欄で全件表示）",
      hint: "記録に登場した順番に図鑑番号を割り振っています",
    },
    route: {
      icon: GitBranch,
      label: "ルート探索",
      placeholder: "作りたいパル名を入力（例：モコロン）",
      hint: "直接作れない場合、複数回の配合を経る手順を記録済みデータから自動で探します。「手持ちのパル」を指定すると、それを使うルートに絞り込めます",
    },
    wishlist: {
      icon: Heart,
      label: "欲しいパル",
      placeholder: "リスト内をパル名で検索",
      hint: "配合したい・狙っているパルをリストにして管理できます",
    },
    rank: {
      icon: Calculator,
      label: "繁殖力値推定",
      placeholder: "パル名で絞り込み（空欄で全件表示）",
      hint: "記録済みの配合データだけから、各パルの「繁殖力値」を逆算します（実際の値10〜1500に収まるよう表示を引き伸ばしていますが、基準点がないため実際の値と一致するとは限りません）",
    },
  };

  const wishlistFiltered = useMemo(() => {
    if (mode !== "wishlist") return [];
    const q = normalizeKana(query.trim().toLowerCase());
    if (!q) return wishlist;
    return wishlist.filter((w) => normalizeKana(w.name.toLowerCase()).includes(q));
  }, [wishlist, query, mode]);

  const rankFiltered = useMemo(() => {
    if (mode !== "rank" || !rankEstimate) return [];
    const q = normalizeKana(query.trim().toLowerCase());
    if (!q) return rankEstimate.list;
    return rankEstimate.list.filter((r) => normalizeKana(r.name.toLowerCase()).includes(q));
  }, [rankEstimate, query, mode]);

  return (
    <div className="bl-root">
      <style>{STYLE}</style>
      <HexBackground />
      <div className="bl-wrap">
        <div className="bl-header">
          <div>
            <h1 className="bl-title">
              <Egg size={24} />
              パル配合記録帳
            </h1>
            <div className="bl-subtitle">自分で試した配合の結果を記録・検索する</div>
          </div>
          <div className="bl-count-group">
            <div className="bl-stat">
              <div className="bl-stat-label">配合記録</div>
              <div className="bl-stat-value">{entries.length}</div>
            </div>
            <div className="bl-stat">
              <div className="bl-stat-label">図鑑登録</div>
              <div className="bl-stat-value">{dexList.length}</div>
            </div>
          </div>
        </div>

        <div className="bl-backup-row">
          <button className="bl-backup-btn" type="button" onClick={exportData}>
            <Download size={13} />
            データをダウンロード
          </button>
          <label className="bl-backup-btn bl-file-label">
            <Upload size={13} />
            データを読み込む
            <input type="file" accept="application/json" onChange={handleImportFile} style={{ display: "none" }} />
          </label>
          <button
            className={`bl-dex-nav-btn${mode === "dex" ? " active" : ""}`}
            type="button"
            onClick={() => {
              setMode("dex");
              setQuery("");
            }}
          >
            <BookOpen size={16} />
            図鑑
          </button>
        </div>

        {importError && <div className="bl-error" style={{ marginBottom: 14 }}>{importError}</div>}

        {pendingImport && (
          <div className="bl-import-confirm">
            <div className="bl-import-confirm-text">
              読み込んだデータ（記録{pendingImport.entries.length}件・図鑑{Object.keys(pendingImport.dexProfiles).length}体）を、現在の記録（{entries.length}件・図鑑{Object.keys(dexProfiles).length}体）に<strong>追加</strong>します。すでに同じ組み合わせが記録済みのものはスキップされ、すでにカスタマイズ済みの図鑑情報は上書きされません。よろしいですか？
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="bl-submit" type="button" onClick={confirmImport} disabled={importing}>
                {importing ? <Loader2 size={15} className="bl-spin" /> : <Upload size={15} />}
                追加する
              </button>
              <button className="bl-cancel" type="button" onClick={cancelImport}>
                キャンセル
              </button>
            </div>
          </div>
        )}

        <div className="bl-form" ref={formTopRef}>
          <button
            type="button"
            className="bl-form-title bl-form-toggle"
            onClick={() => setFormOpen((o) => !o)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {editingId ? <Pencil size={15} /> : <Plus size={15} />}
              {editingId ? "配合結果を編集する" : "新しい配合結果を記録する"}
            </span>
            <ChevronDown size={15} className={formOpen ? "bl-chevron open" : "bl-chevron"} />
          </button>

          {formOpen && (
            <>
          <div className="bl-arrow-row">
            <AutocompleteInput
              inputRef={parent1Ref}
              className="bl-input"
              placeholder="親パル1（例：モコロン）"
              value={parent1}
              onChange={setParent1}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              options={knownPalNames}
              dexMap={palDex}
            />
            <span className="bl-arrow">×</span>
            <AutocompleteInput
              className="bl-input"
              placeholder="親パル2（例：ツッパニャン）"
              value={parent2}
              onChange={setParent2}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              options={knownPalNames}
              dexMap={palDex}
            />
          </div>

          <div className="bl-arrow-row" style={{ marginBottom: 10 }}>
            <span className="bl-arrow">→</span>
            <AutocompleteInput
              className="bl-input"
              placeholder="生まれたパル（例：タマコッコ）"
              value={child}
              onChange={setChild}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              options={knownPalNames}
              dexMap={palDex}
            />
          </div>

          <div className="bl-field">
            <label className="bl-label">継承したパッシブスキル（カンマ区切り・任意）</label>
            <TagAutocompleteInput
              className="bl-input"
              placeholder="例：伝説, せっかち"
              value={passives}
              onChange={setPassives}
              options={knownPassives}
            />
          </div>

          <div className="bl-field">
            <label className="bl-label">メモ（任意）</label>
            <textarea
              className="bl-textarea"
              placeholder="用途や個体値、次に試したいことなど"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <label className="bl-special-check">
            <input
              type="checkbox"
              checked={isSpecial}
              onChange={(e) => setIsSpecial(e.target.checked)}
            />
            特殊配合（配合限定パルなど、平均ルールに従わない組み合わせ）
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="bl-submit" type="button" onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <Loader2 size={15} className="bl-spin" />
              ) : editingId ? (
                <Pencil size={15} />
              ) : (
                <Egg size={15} />
              )}
              {editingId ? "更新する" : "記録する"}
            </button>
            {editingId && (
              <button className="bl-cancel" type="button" onClick={handleCancelEdit}>
                キャンセル
              </button>
            )}
          </div>

          {saveError && <div className="bl-error">{saveError}</div>}
            </>
          )}
        </div>

        <div className="bl-tabs">
          {Object.entries(modeConfig)
            .filter(([key]) => key !== "dex")
            .map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={key}
                className={`bl-tab${mode === key ? " active" : ""}`}
                onClick={() => {
                  setMode(key);
                  setQuery("");
                }}
                type="button"
              >
                <Icon size={13} />
                {cfg.label}
              </button>
            );
          })}
        </div>

        {modeConfig[mode].hint && <div className="bl-mode-hint">{modeConfig[mode].hint}</div>}

        <div className="bl-search">
          <Search size={16} color="var(--text-muted)" />
          <AutocompleteInput
            placeholder={modeConfig[mode].placeholder}
            value={query}
            onChange={setQuery}
            options={knownPalNames}
            dexMap={palDex}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex" }}
            >
              <X size={15} color="var(--text-muted)" />
            </button>
          )}
        </div>

        {mode === "dex" && (
          <div className="bl-dex-filters">
            <div className="bl-dex-filter-row">
              <span className="bl-dex-filter-label">属性で絞り込み</span>
              <div className="bl-element-edit-row">
                {ELEMENT_TYPES.map((el) => {
                  const selected = dexElementFilter.includes(el);
                  const c = ELEMENT_COLORS[el];
                  return (
                    <button
                      key={el}
                      type="button"
                      className={`bl-element-chip${selected ? " selected" : ""}`}
                      style={selected ? { background: c.text, borderColor: c.text } : undefined}
                      onClick={() => toggleElementFilter(el)}
                    >
                      {el}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bl-dex-filter-row">
              <span className="bl-dex-filter-label">作業適性で絞り込み</span>
              <select
                className="bl-select"
                value={dexWorkFilter}
                onChange={(e) => setDexWorkFilter(e.target.value)}
              >
                <option value="">指定なし</option>
                {WORK_TYPES.map((t) => (
                  <option value={t} key={t}>
                    {t}
                  </option>
                ))}
              </select>

              {dexWorkFilter && (
                <label className="bl-dex-sort-toggle">
                  <input
                    type="checkbox"
                    checked={dexSortByWork}
                    onChange={(e) => setDexSortByWork(e.target.checked)}
                  />
                  適性が高い順に並べる
                </label>
              )}
            </div>

            {(dexElementFilter.length > 0 || dexWorkFilter) && (
              <button className="bl-edit-link" onClick={clearDexFilters} type="button">
                <X size={11} />
                絞り込みをクリア
              </button>
            )}
          </div>
        )}

        {mode === "route" && (
          <div className="bl-dex-filters">
            <div className="bl-dex-filter-row">
              <span className="bl-dex-filter-label">手持ちのパル（任意）</span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <AutocompleteInput
                  className="bl-input"
                  placeholder="持っているパル名（例：モコロン）"
                  value={routeStartPal}
                  onChange={setRouteStartPal}
                  options={knownPalNames}
                  dexMap={palDex}
                />
              </div>
              {routeStartPal && (
                <button className="bl-edit-link" onClick={() => setRouteStartPal("")} type="button">
                  <X size={11} />
                  クリア
                </button>
              )}
            </div>
            <div className="bl-mode-hint" style={{ margin: 0 }}>
              入力すると、そのパルを必ず使うルートだけを探します。空欄のままなら、記録済みの中で一番短いルートを探します。
            </div>
          </div>
        )}

        {mode === "parent" && parentModeResults.length > 0 && (
          <div className="bl-summary">
            <div className="bl-summary-label">
              「{query}」を親にすると生まれるパル（{parentModeResults.length}種）
            </div>
            {parentModeResults.map((en) => (
              <span
                className="bl-summary-tag bl-pal-link"
                key={en.child}
                onClick={() => openPalDetail(en.child)}
              >
                {dexNo(en.child) && <span className="bl-dexno">{dexNo(en.child)}</span>}
                {en.child}
                <ArrowRight size={11} />
              </span>
            ))}
          </div>
        )}

        {mode === "target" && targetModeCombos.length > 0 && (
          <div className="bl-summary">
            <div className="bl-summary-label">
              「{query}」を生む組み合わせ（{targetModeCombos.length}通り）
            </div>
            {targetModeCombos.map((en) => (
              <span className="bl-summary-tag" key={en.id}>
                {en.parent1} × {en.parent2}
              </span>
            ))}
          </div>
        )}

        {loading ? (
          <div className="bl-loading">
            <Loader2 size={16} className="bl-spin" />
            記録を読み込み中…
          </div>
        ) : mode === "dex" ? (
          dexFiltered.length === 0 ? (
            <div className="bl-empty">
              <BookOpen size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
              <div>
                {dexList.length === 0
                  ? "まだ図鑑にパルが登録されていません。配合結果を記録すると自動的に登録されます。"
                  : "一致するパルが見つかりませんでした。"}
              </div>
            </div>
          ) : (
            <div className="bl-dex-grid">
              {dexFiltered.map((d) => (
                <button
                  className={`bl-dex-item${d.edited ? "" : " bl-dex-item-unedited"}`}
                  key={d.name}
                  onClick={() => openPalDetail(d.name)}
                  type="button"
                >
                  <div className="bl-dex-item-row">
                    {d.image ? (
                      <img src={d.image} alt="" className="bl-dex-thumb" />
                    ) : (
                      <div className="bl-dex-thumb bl-dex-thumb-placeholder">
                        <PawPrint size={15} />
                      </div>
                    )}
                    <div className="bl-dex-item-head">
                      <span className="bl-dexno">
                        No.{String(d.n).padStart(3, "0")}{d.suffix}
                        {d.edited && <span className="bl-edited-badge">編集済み</span>}
                      </span>
                      <span className="bl-dex-name">{d.name}</span>
                      {dexWorkFilter && (
                        <span className="bl-dex-worklv">
                          {dexWorkFilter} Lv.{d.work[dexWorkFilter] || 0}
                        </span>
                      )}
                    </div>
                  </div>
                  {d.details && <div className="bl-dex-preview">{d.details}</div>}
                </button>
              ))}
            </div>
          )
        ) : mode === "route" ? (
          !query.trim() ? (
            <div className="bl-empty">
              <GitBranch size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
              <div>作りたいパルの名前を入力してください。</div>
            </div>
          ) : routeResult.status === "unknown" ? (
            <div className="bl-empty">
              <GitBranch size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
              <div>
                「{routeResult.target}」を生む記録がありません。名前が正しいか確認するか、まずその組み合わせを記録してください。
              </div>
            </div>
          ) : routeResult.status === "impossible-with-start" ? (
            <div className="bl-empty">
              <GitBranch size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
              <div>
                「{routeResult.start}」を使って「{routeResult.target}」まで辿り着くルートは、記録済みの組み合わせの中には見つかりませんでした。手持ちのパル欄を空にすると、別の組み合わせでのルートを探せます。
              </div>
            </div>
          ) : routeResult.status === "impossible" ? (
            <div className="bl-empty">
              <GitBranch size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
              <div>記録済みの組み合わせだけでは、そこまでのルートを組み立てられませんでした。</div>
            </div>
          ) : routeResult.steps.length === 0 ? (
            <div className="bl-empty">
              <GitBranch size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
              <div>「{routeResult.target}」は直接記録された組み合わせから作れます。「作りたいパルから探す」タブをご覧ください。</div>
            </div>
          ) : (
            <div className="bl-combo-list">
              {routeResult.start && (
                <div className="bl-mode-hint" style={{ margin: "0 0 4px 0" }}>
                  「{routeResult.start}」を使うルートです
                </div>
              )}
              {routeResult.steps.map((s, i) => (
                <div className="bl-route-step" key={i}>
                  <span className="bl-route-step-num">STEP {i + 1}</span>
                  <div className="bl-combo-row" style={{ background: "transparent", border: "none", padding: 0 }}>
                    {dexNo(s.parent1) && <span className="bl-dexno">{dexNo(s.parent1)}</span>}
                    <span className="bl-pal-link" onClick={() => openPalDetail(s.parent1)}>
                      {s.parent1}
                    </span>
                    <span className="amp">×</span>
                    {dexNo(s.parent2) && <span className="bl-dexno">{dexNo(s.parent2)}</span>}
                    <span className="bl-pal-link" onClick={() => openPalDetail(s.parent2)}>
                      {s.parent2}
                    </span>
                    <span className="res-arrow">→</span>
                    {dexNo(s.child) && <span className="bl-dexno">{dexNo(s.child)}</span>}
                    <span className="child bl-pal-link" onClick={() => openPalDetail(s.child)}>
                      {s.child}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : mode === "wishlist" ? (
          <>
            <div className="bl-form" style={{ marginBottom: 14 }}>
              <p className="bl-form-title">
                <Plus size={15} />
                欲しいパルを追加する
              </p>
              <div className="bl-arrow-row" style={{ marginBottom: 10 }}>
                <AutocompleteInput
                  className="bl-input"
                  placeholder="パル名（例：モコロン）"
                  value={wishName}
                  onChange={setWishName}
                  onKeyDown={(e) => e.key === "Enter" && addWishlistItem(e)}
                  options={knownPalNames}
                  dexMap={palDex}
                />
              </div>
              <div className="bl-field">
                <label className="bl-label">メモ（任意）</label>
                <input
                  className="bl-input"
                  placeholder="狙う理由や入手予定の配合など"
                  value={wishNote}
                  onChange={(e) => setWishNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addWishlistItem(e)}
                />
              </div>
              <button className="bl-submit" type="button" onClick={addWishlistItem} disabled={wishSaving}>
                {wishSaving ? <Loader2 size={15} className="bl-spin" /> : <Heart size={15} />}
                リストに追加する
              </button>
              {wishError && <div className="bl-error">{wishError}</div>}
            </div>

            {wishlistLoading ? (
              <div className="bl-loading">
                <Loader2 size={16} className="bl-spin" />
                読み込み中…
              </div>
            ) : wishlistFiltered.length === 0 ? (
              <div className="bl-empty">
                <Heart size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
                <div>
                  {wishlist.length === 0
                    ? "まだ欲しいパルが登録されていません。上のフォームから追加しましょう。"
                    : "一致するパルが見つかりませんでした。"}
                </div>
              </div>
            ) : (
              <div className="bl-combo-list">
                {wishlistFiltered.map((w) => {
                  const profile = dexProfiles[w.name];
                  return (
                    <div className="bl-dex-item" key={w.name} style={{ cursor: "default", width: "100%" }}>
                      <div className="bl-dex-item-row">
                        {profile?.image ? (
                          <img src={profile.image} alt="" className="bl-dex-thumb" />
                        ) : (
                          <div className="bl-dex-thumb bl-dex-thumb-placeholder">
                            <PawPrint size={15} />
                          </div>
                        )}
                        <div className="bl-dex-item-head" style={{ flex: 1 }}>
                          {dexNo(w.name) && <span className="bl-dexno">{dexNo(w.name)}</span>}
                          <span className="bl-pal-link" onClick={() => openPalDetail(w.name)}>
                            <span className="bl-dex-name">{w.name}</span>
                          </span>
                        </div>
                        <button
                          className="bl-icon-btn bl-del"
                          onClick={() => removeWishlistItem(w.name)}
                          title="リストから削除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {w.note && <div className="bl-dex-preview">{w.note}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : mode === "rank" ? (
          <>
            <div className="bl-mode-hint" style={{ margin: "0 0 12px 0" }}>
              記録{rankEstimate.edgeCount}件・パル{rankEstimate.nodeCount}種から算出した「繁殖力値」の推定です（数値が小さいほど「強い」、大きいほど「弱い」傾向です。数値が高いパルほど弱いパルとされています）。
              {rankEstimate.anchorName
                ? `記録の中で「${rankEstimate.anchorName}」と反対側にいる（＝一番強そうな）パルが実際の最小値10に近いという仮定と、「${rankEstimate.anchorName}」の実際の値（${rankEstimate.anchorKnownValue}、弱い方の絶対上限）の2点を使って換算しています。`
                : "基準となる正式な値が記録の中に見つからないため、10〜1500の範囲に収まるよう引き伸ばしただけの目安値です。"}
              {rankEstimate.anchorName && rankEstimate.clampedHighNames.length > 0 &&
                ` タマコッコ（${rankEstimate.anchorKnownValue}）は確定で最弱のパルなので、それより弱いと計算されるのは矛盾しています。矛盾が出たパル：${rankEstimate.clampedHighNames.join("、")}（表示上は1500に丸めています。これらのパルが絡む記録は見直すか、参考程度にとどめてください）。`}
              {rankEstimate.anchorName && rankEstimate.clampedLowNames.length > 0 &&
                ` また、「反対側の端＝実際の最小値10」という仮定を下回って計算されたパルもいます：${rankEstimate.clampedLowNames.join("、")}（こちらは確定情報との矛盾ではなく、仮定のズレの可能性です。表示上は10に丸めています）。`}
              {rankEstimate.specialCount > 0 &&
                `「特殊配合」チェックがついた記録（${rankEstimate.specialCount}件）は平均ルールに従わないため、この計算から除外しています。`}
            </div>

            <div className="bl-form" style={{ marginBottom: 14 }}>
              <p className="bl-form-title">
                <Calculator size={15} />
                推定値から生まれるパルを予測する
              </p>
              <div className="bl-arrow-row" style={{ marginBottom: 4 }}>
                <AutocompleteInput
                  className="bl-input"
                  placeholder="親パル1（例：モコロン）"
                  value={predictParent1}
                  onChange={setPredictParent1}
                  options={knownPalNames}
                  dexMap={palDex}
                />
                <span className="bl-arrow">×</span>
                <AutocompleteInput
                  className="bl-input"
                  placeholder="親パル2（例：ツッパニャン）"
                  value={predictParent2}
                  onChange={setPredictParent2}
                  options={knownPalNames}
                  dexMap={palDex}
                />
              </div>
              <div className="bl-mode-hint" style={{ margin: "4px 0 0 0" }}>
                記録済みのパルの中から一番近いものを探すだけなので、まだ記録したことがないパルは候補に出てきません。
              </div>

              {predictResult && predictResult.error && (
                <div className="bl-error">{predictResult.error}</div>
              )}

              {predictResult && predictResult.candidates && (
                <div className="bl-summary" style={{ marginTop: 12 }}>
                  <div className="bl-summary-label">
                    親の平均繁殖力値：約{Math.round(predictResult.avg)}　→　近い候補
                  </div>
                  {predictResult.candidates.map((c) => (
                    <span
                      className="bl-summary-tag bl-pal-link"
                      key={c.name}
                      onClick={() => openPalDetail(c.name)}
                    >
                      {dexNo(c.name) && <span className="bl-dexno">{dexNo(c.name)}</span>}
                      {c.name}（{Math.round(c.value)}）
                    </span>
                  ))}
                </div>
              )}
            </div>

            {rankEstimate.residuals.length > 0 && (
              <div className="bl-summary" style={{ borderColor: "rgba(220,79,71,0.3)" }}>
                <div className="bl-summary-label">
                  モデルと大きくズレている組み合わせ（記録ミスの可能性、またはゲーム側のタイブレークの影響）
                </div>
                {rankEstimate.residuals.map((r, i) => (
                  <span className="bl-summary-tag" key={i}>
                    {r.entry.parent1} × {r.entry.parent2} → {r.entry.child}
                  </span>
                ))}
              </div>
            )}

            {rankFiltered.length === 0 ? (
              <div className="bl-empty">
                <Calculator size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
                <div>
                  {rankEstimate.nodeCount === 0
                    ? "配合記録がまだありません。記録が増えるほど推定の精度が上がります。"
                    : "一致するパルが見つかりませんでした。"}
                </div>
              </div>
            ) : (
              <div className="bl-dex-grid">
                {rankFiltered.map((r, i) => (
                  <div className="bl-dex-item" key={r.name} style={{ cursor: "default" }}>
                    <div className="bl-dex-item-row">
                      <div className="bl-dex-thumb bl-dex-thumb-placeholder">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                          #{i + 1}
                        </span>
                      </div>
                      <div className="bl-dex-item-head">
                        {dexNo(r.name) && <span className="bl-dexno">{dexNo(r.name)}</span>}
                        <span className="bl-pal-link" onClick={() => openPalDetail(r.name)}>
                          <span className="bl-dex-name">{r.name}</span>
                        </span>
                      </div>
                    </div>
                    <div className="bl-dex-preview" style={{ WebkitLineClamp: "unset" }}>
                      繁殖力値（推定）：{Math.round(r.value)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : filtered.length === 0 ? (
          <div className="bl-empty">
            <PawPrint size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
            <div>
              {entries.length === 0
                ? "まだ記録がありません。上のフォームから最初の配合結果を記録しましょう。"
                : mode === "target" && !query.trim()
                ? "作りたいパルの名前を入力してください。"
                : mode === "parent" && !query.trim()
                ? "手持ちのパルの名前を入力してください。"
                : mode === "target"
                ? "そのパルを生む組み合わせはまだ記録されていません。"
                : mode === "parent"
                ? "そのパルを親にした記録はまだありません。"
                : "一致する記録が見つかりませんでした。"}
            </div>
          </div>
        ) : (
          filtered.map((en) => {
            let dispParent1 = en.parent1;
            let dispParent2 = en.parent2;
            if (mode === "parent" && query.trim()) {
              const q = normalizeKana(query.trim().toLowerCase());
              const p1Matches = normalizeKana(en.parent1.toLowerCase()).includes(q);
              const p2Matches = normalizeKana(en.parent2.toLowerCase()).includes(q);
              if (p2Matches && !p1Matches) {
                dispParent1 = en.parent2;
                dispParent2 = en.parent1;
              }
            }
            return (
            <div className={`bl-card${en.id === editingId ? " editing" : ""}`} key={en.id}>
              <div className="bl-card-top">
                <div>
                  <div className="bl-combo">
                    {dexNo(dispParent1) && <span className="bl-dexno">{dexNo(dispParent1)}</span>}
                    <span className="bl-pal-link" onClick={() => openPalDetail(dispParent1)}>
                      {dispParent1}
                    </span>
                    <span className="amp">×</span>
                    {dexNo(dispParent2) && <span className="bl-dexno">{dexNo(dispParent2)}</span>}
                    <span className="bl-pal-link" onClick={() => openPalDetail(dispParent2)}>
                      {dispParent2}
                    </span>
                    <span className="res-arrow">→</span>
                    <span className="child">
                      {dexNo(en.child) && <span className="bl-dexno">{dexNo(en.child)}</span>}
                      <span className="bl-pal-link" onClick={() => openPalDetail(en.child)}>
                        {en.child}
                      </span>
                    </span>
                  </div>
                  <div className="bl-date">
                    {en.date}
                    {en.special && <span className="bl-special-badge">特殊配合</span>}
                  </div>
                </div>
                <div className="bl-card-actions">
                  {confirmDeleteId === en.id ? (
                    <>
                      <span className="bl-confirm-text">削除しますか？</span>
                      <button
                        className="bl-icon-btn bl-del"
                        onClick={() => handleDelete(en.id)}
                        title="削除する"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        className="bl-icon-btn"
                        onClick={cancelDeleteRequest}
                        title="キャンセル"
                      >
                        <X size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="bl-icon-btn" onClick={() => handleEdit(en)} title="編集">
                        <Pencil size={15} />
                      </button>
                      <button
                        className="bl-icon-btn bl-del"
                        onClick={() => requestDelete(en.id)}
                        title="削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {en.passives && en.passives.length > 0 && (
                <div className="bl-tags">
                  {en.passives.map((p, i) => (
                    <span className="bl-tag" key={i} title={PASSIVE_EFFECT_MAP.get(p) || ""}>
                      {p}
                    </span>
                  ))}
                </div>
              )}

              {en.notes && <div className="bl-notes">{en.notes}</div>}
            </div>
            );
          })
        )}
      </div>

      {palDetail && (
        <div className="bl-modal-overlay" onClick={closePalDetail}>
          <div className="bl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bl-modal-head">
              <div className="bl-modal-title-row">
                {palDetail.profile?.image ? (
                  <img src={palDetail.profile.image} alt="" className="bl-modal-thumb" />
                ) : (
                  <div className="bl-modal-thumb bl-dex-thumb-placeholder">
                    <PawPrint size={18} />
                  </div>
                )}
                <div>
                  {dexNo(palDetail.name) && <span className="bl-dexno">{dexNo(palDetail.name)}</span>}
                  <div className="bl-modal-title-with-heart">
                    <span className="bl-modal-title">{palDetail.name}</span>
                    <button
                      className={`bl-heart-btn${isWished(palDetail.name) ? " active" : ""}`}
                      onClick={() => toggleWishlist(palDetail.name)}
                      title={isWished(palDetail.name) ? "欲しいパルから外す" : "欲しいパルに追加"}
                      type="button"
                    >
                      <Heart size={18} fill={isWished(palDetail.name) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </div>
              <button className="bl-modal-close" onClick={closePalDetail} title="閉じる">
                <X size={18} />
              </button>
            </div>

            <div className="bl-modal-section">
              <div className="bl-modal-section-title">
                詳細情報
                {!detailEditing && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button className="bl-edit-link" onClick={startDetailEdit}>
                      <Pencil size={11} />
                      編集
                    </button>
                    {dexProfiles[palDetail.name] && (
                      <button
                        className="bl-edit-link bl-edit-link-danger"
                        onClick={() => setConfirmDexDelete(true)}
                      >
                        <Trash2 size={11} />
                        図鑑から削除
                      </button>
                    )}
                  </div>
                )}
              </div>

              {confirmDexDelete && (
                <div className="bl-import-confirm" style={{ marginBottom: 12 }}>
                  <div className="bl-import-confirm-text">
                    「{palDetail.name}」を図鑑から削除します。図鑑番号・詳細情報・画像はすべて消えます（配合記録自体は残ります）。よろしいですか？
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="bl-submit"
                      type="button"
                      onClick={() => deleteDexProfile(palDetail.name)}
                      disabled={dexSaving}
                      style={{ background: "var(--danger)" }}
                    >
                      {dexSaving ? <Loader2 size={15} className="bl-spin" /> : <Trash2 size={15} />}
                      削除する
                    </button>
                    <button className="bl-cancel" type="button" onClick={() => setConfirmDexDelete(false)}>
                      キャンセル
                    </button>
                  </div>
                  {dexError && <div className="bl-error">{dexError}</div>}
                </div>
              )}

              {detailEditing ? (
                <>
                  {REFERENCE_PALS[detailPal] && (
                    <button
                      type="button"
                      className="bl-edit-link"
                      style={{ marginBottom: 12 }}
                      onClick={applyReferenceTemplate}
                    >
                      <Download size={11} />
                      参考データベースの情報を読み込む（空欄の項目だけ埋まります）
                    </button>
                  )}

                  <div className="bl-field">
                    <label className="bl-label">図鑑番号</label>
                    <div className="bl-arrow-row" style={{ marginBottom: 0 }}>
                      <input
                        className="bl-input"
                        type="number"
                        min="1"
                        value={dexEditNumber}
                        onChange={(e) => setDexEditNumber(e.target.value)}
                        style={{ flex: 2 }}
                      />
                      <input
                        className="bl-input"
                        placeholder="枝番（例：A）"
                        maxLength={3}
                        value={dexEditSuffix}
                        onChange={(e) => setDexEditSuffix(e.target.value)}
                        style={{ flex: 1 }}
                      />
                    </div>
                    <div className="bl-mode-hint" style={{ margin: "4px 0 0 0" }}>
                      同じ番号の別個体がいる場合、枝番（A・B・αなど）で区別できます
                    </div>
                  </div>

                  <div className="bl-field">
                    <label className="bl-label">画像（任意）</label>
                    <div className="bl-image-edit-row">
                      {dexEditImage ? (
                        <img src={dexEditImage} alt="" className="bl-image-preview" />
                      ) : (
                        <div className="bl-image-preview bl-image-preview-empty">
                          <PawPrint size={18} />
                        </div>
                      )}
                      <div className="bl-image-edit-actions">
                        <label className="bl-cancel bl-file-label">
                          {imageUploading ? (
                            <Loader2 size={14} className="bl-spin" />
                          ) : (
                            <Plus size={14} />
                          )}
                          {dexEditImage ? "画像を変更" : "画像を選択"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                          />
                        </label>
                        {dexEditImage && (
                          <button
                            type="button"
                            className="bl-cancel"
                            onClick={() => setDexEditImage("")}
                          >
                            削除
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bl-field">
                    <label className="bl-label">属性（最大2種類まで）</label>
                    <div className="bl-element-edit-row">
                      {ELEMENT_TYPES.map((el) => {
                        const selected = dexEditElements.includes(el);
                        const c = ELEMENT_COLORS[el];
                        return (
                          <button
                            key={el}
                            type="button"
                            className={`bl-element-chip${selected ? " selected" : ""}`}
                            style={
                              selected
                                ? { background: c.text, borderColor: c.text }
                                : undefined
                            }
                            onClick={() => toggleElement(el)}
                          >
                            {el}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bl-field">
                    <label className="bl-label">パートナースキル名（任意）</label>
                    <input
                      className="bl-input"
                      placeholder="例：モコモコの盾"
                      value={dexEditSkillName}
                      onChange={(e) => setDexEditSkillName(e.target.value)}
                    />
                  </div>
                  <div className="bl-field">
                    <label className="bl-label">パートナースキルの説明（任意）</label>
                    <textarea
                      className="bl-textarea"
                      placeholder="発動条件や効果など"
                      value={dexEditSkillDesc}
                      onChange={(e) => setDexEditSkillDesc(e.target.value)}
                    />
                  </div>

                  <div className="bl-field">
                    <label className="bl-label">作業適性（Lv.0〜10、0は適性なし）</label>
                    <div className="bl-work-edit-grid">
                      {WORK_TYPES.map((t) => (
                        <div className="bl-work-edit-cell" key={t}>
                          <label>{t}</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={dexEditWork[t] ?? 0}
                            onChange={(e) =>
                              setDexEditWork((prev) => ({
                                ...prev,
                                [t]: Math.max(0, Math.min(10, parseInt(e.target.value, 10) || 0)),
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bl-field">
                    <label className="bl-label">食事量（1〜10段階・任意）</label>
                    <input
                      className="bl-input"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="例：3"
                      value={dexEditFood}
                      onChange={(e) => setDexEditFood(e.target.value)}
                    />
                  </div>

                  <div className="bl-field">
                    <label className="bl-label">落とすアイテム（カンマ区切り・任意）</label>
                    <TagAutocompleteInput
                      className="bl-input"
                      placeholder="例：羊毛, モコロンの羊肉"
                      value={dexEditDrops}
                      onChange={setDexEditDrops}
                      options={knownItems}
                    />
                  </div>

                  <div className="bl-field">
                    <label className="bl-label">メモ（任意）</label>
                    <textarea
                      className="bl-textarea"
                      placeholder="その他自由にメモ"
                      value={dexEditDetails}
                      onChange={(e) => setDexEditDetails(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="bl-submit"
                      type="button"
                      onClick={saveDetailEdit}
                      disabled={dexSaving}
                    >
                      {dexSaving ? <Loader2 size={15} className="bl-spin" /> : <Pencil size={15} />}
                      保存する
                    </button>
                    <button
                      className="bl-cancel"
                      type="button"
                      onClick={() => setDetailEditing(false)}
                    >
                      キャンセル
                    </button>
                  </div>
                  {dexError && <div className="bl-error">{dexError}</div>}
                </>
              ) : (() => {
                const p = palDetail.profile;
                const hasWork = p?.work && Object.values(p.work).some((v) => v > 0);
                const hasElements = p?.elements && p.elements.length > 0;
                const hasAny =
                  hasElements || p?.skillName || p?.skillDesc || hasWork || (p?.food != null) || (p?.drops && p.drops.length > 0) || p?.details;

                if (!hasAny) {
                  return (
                    <div className="bl-modal-empty-text">
                      詳細情報はまだありません。「編集」から追加できます。
                    </div>
                  );
                }

                return (
                  <>
                    {hasElements && (
                      <div style={{ marginBottom: 12 }}>
                        <div className="bl-summary-label" style={{ marginBottom: 6 }}>属性</div>
                        <div className="bl-element-badges">
                          {p.elements.map((el) => {
                            const c = ELEMENT_COLORS[el] || ELEMENT_COLORS["無"];
                            return (
                              <span
                                className="bl-element-badge"
                                key={el}
                                style={{ background: c.bg, borderColor: c.border, color: c.text }}
                              >
                                {el}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {(p.skillName || p.skillDesc) && (
                      <div style={{ marginBottom: 12 }}>
                        <div className="bl-summary-label" style={{ marginBottom: 6 }}>パートナースキル</div>
                        <div className="bl-skill-box">
                          {p.skillName && <div className="bl-skill-name">{p.skillName}</div>}
                          {p.skillDesc && <div className="bl-skill-desc">{p.skillDesc}</div>}
                        </div>
                      </div>
                    )}

                    {hasWork && (
                      <div style={{ marginBottom: 12 }}>
                        <div className="bl-summary-label" style={{ marginBottom: 6 }}>作業適性</div>
                        <div className="bl-work-grid">
                          {WORK_TYPES.map((t) => {
                            const lv = p.work?.[t] || 0;
                            return (
                              <div className={`bl-work-cell${lv > 0 ? " active" : ""}`} key={t}>
                                <span>{t}</span>
                                {lv > 0 && <span className="lv">Lv.{lv}</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {p.food != null && (
                      <div style={{ marginBottom: 12 }}>
                        <div className="bl-summary-label" style={{ marginBottom: 6 }}>食事量</div>
                        <div className="bl-food-row">
                          <span className="bl-food-num">{p.food}</span>
                          <span className="bl-food-marks">{"🍙".repeat(p.food)}</span>
                        </div>
                      </div>
                    )}

                    {p.drops && p.drops.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div className="bl-summary-label" style={{ marginBottom: 6 }}>落とすアイテム</div>
                        <div className="bl-drop-list">
                          {p.drops.map((d, i) => (
                            <button
                              type="button"
                              className="bl-drop-tag bl-pal-link"
                              key={i}
                              onClick={() => openItemDetail(d)}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {p.details && (
                      <div>
                        <div className="bl-summary-label" style={{ marginBottom: 6 }}>メモ</div>
                        <div className="bl-modal-details-text">{p.details}</div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="bl-modal-section">
              <div className="bl-modal-section-title">
                この組み合わせで生まれた記録（{palDetail.asChild.length}件）
              </div>
              {palDetail.asChild.length === 0 ? (
                <div className="bl-modal-empty-text">まだ記録がありません。</div>
              ) : (
                <div className="bl-combo-list">
                  {palDetail.asChild.map((en) => (
                    <div className="bl-combo-row" key={en.id}>
                      <span className="bl-pal-link" onClick={() => openPalDetail(en.parent1)}>
                        {en.parent1}
                      </span>
                      <span className="amp">×</span>
                      <span className="bl-pal-link" onClick={() => openPalDetail(en.parent2)}>
                        {en.parent2}
                      </span>
                      <span className="res-arrow">→</span>
                      <span className="child">{en.child}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bl-modal-section">
              <div className="bl-modal-section-title">
                親として使った記録（{palDetail.asParent.length}件）
              </div>
              {palDetail.asParent.length === 0 ? (
                <div className="bl-modal-empty-text">まだ記録がありません。</div>
              ) : (
                <div className="bl-combo-list">
                  {palDetail.asParent.map((en) => {
                    const self = en.parent1 === palDetail.name ? en.parent1 : en.parent2;
                    const partner = en.parent1 === palDetail.name ? en.parent2 : en.parent1;
                    return (
                      <div className="bl-combo-row" key={en.id}>
                        <span className="bl-pal-link" onClick={() => openPalDetail(self)}>
                          {self}
                        </span>
                        <span className="amp">×</span>
                        <span className="bl-pal-link" onClick={() => openPalDetail(partner)}>
                          {partner}
                        </span>
                        <span className="res-arrow">→</span>
                        <span
                          className="child bl-pal-link"
                          onClick={() => openPalDetail(en.child)}
                        >
                          {en.child}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {itemDetail && (
        <div className="bl-modal-overlay" onClick={closeItemDetail}>
          <div className="bl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bl-modal-head">
              <div className="bl-modal-title-row">
                <div className="bl-modal-thumb bl-dex-thumb-placeholder">
                  <PawPrint size={18} />
                </div>
                <div>
                  <div className="bl-summary-label" style={{ marginBottom: 2 }}>落とすアイテム</div>
                  <div className="bl-modal-title">{itemDetail}</div>
                </div>
              </div>
              <button className="bl-modal-close" onClick={closeItemDetail} title="閉じる">
                <X size={18} />
              </button>
            </div>

            <div className="bl-modal-section">
              <div className="bl-modal-section-title">
                このアイテムを落とすパル（{itemPals.length}件）
              </div>
              {itemPals.length === 0 ? (
                <div className="bl-modal-empty-text">見つかりませんでした。</div>
              ) : (
                <div className="bl-dex-grid">
                  {itemPals.map((d) => (
                    <button
                      className="bl-dex-item"
                      key={d.name}
                      onClick={() => openPalDetail(d.name)}
                      type="button"
                    >
                      <div className="bl-dex-item-row">
                        {d.image ? (
                          <img src={d.image} alt="" className="bl-dex-thumb" />
                        ) : (
                          <div className="bl-dex-thumb bl-dex-thumb-placeholder">
                            <PawPrint size={15} />
                          </div>
                        )}
                        <div className="bl-dex-item-head">
                          <span className="bl-dexno">No.{String(d.n).padStart(3, "0")}{d.suffix}</span>
                          <span className="bl-dex-name">{d.name}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
