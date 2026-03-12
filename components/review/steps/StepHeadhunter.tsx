"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReviewFormData } from "@/lib/types/review-form";
import type { SearchFirm, VerificationLevel } from "@/lib/types";

interface Props {
  data: ReviewFormData;
  onChange: (updates: Partial<ReviewFormData>) => void;
  searchFirms: SearchFirm[];
}

interface SearchResult {
  id: string;
  name: string;
  firm_name: string;
  is_claimed: boolean;
  verification_level: VerificationLevel;
}

const verificationBadge: Record<VerificationLevel, { label: string; color: string }> = {
  none: { label: "미인증", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  claimed: { label: "본인 인증", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  verified: { label: "재직 인증", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

export default function StepHeadhunter({ data, onChange, searchFirms }: Props) {
  const [mode, setMode] = useState<"search" | "manual">(
    data.matchedHeadhunter ? "search" : "search"
  );
  const [searchQuery, setSearchQuery] = useState(data.matchedHeadhunter?.name || "");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchHeadhunters = useCallback(async (name: string) => {
    if (name.length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      setSearchDone(false);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/headhunters/search?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
      setShowDropdown(true);
      setSearchDone(true);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchHeadhunters(value), 300);
  };

  const selectHeadhunter = (result: SearchResult) => {
    onChange({
      headhunterId: result.id,
      headhunterName: result.name,
      matchedHeadhunter: {
        id: result.id,
        name: result.name,
        firm_name: result.firm_name,
      },
    });
    setSearchQuery(result.name);
    setShowDropdown(false);
  };

  const switchToManual = () => {
    setMode("manual");
    onChange({
      headhunterId: null,
      matchedHeadhunter: null,
      headhunterName: searchQuery,
    });
  };

  const switchToSearch = () => {
    setMode("search");
    setSearchQuery("");
    onChange({
      headhunterId: null,
      headhunterName: "",
      headhunterEmail: "",
      headhunterPhone: "",
      matchedHeadhunter: null,
    });
    setSearchDone(false);
  };

  // 검색 모드
  if (mode === "search") {
    return (
      <div className="space-y-5">
        {/* 헤드헌터 검색 */}
        <div ref={dropdownRef} className="relative">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            헤드헌터 검색 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
              className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 pr-10 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="헤드헌터 이름으로 검색"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!searching && (
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            )}
          </div>

          {/* 검색 결과 드롭다운 */}
          {showDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((result) => {
                  const badge = verificationBadge[result.verification_level];
                  return (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => selectHeadhunter(result)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--muted-bg)] transition text-left border-b border-[var(--card-border)] last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {result.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[var(--foreground)] truncate">{result.name}</p>
                        <p className="text-xs text-[var(--muted)] truncate">{result.firm_name}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${badge.color}`}>
                        {badge.label}
                      </span>
                    </button>
                  );
                })
              ) : searchDone ? (
                <div className="px-4 py-3 text-sm text-[var(--muted)] text-center">
                  검색 결과가 없습니다.
                </div>
              ) : null}

              {/* 신규 등록 버튼 */}
              {searchDone && (
                <button
                  type="button"
                  onClick={switchToManual}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition border-t border-[var(--card-border)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  찾는 헤드헌터가 없으신가요? 신규 헤드헌터 등록하기
                </button>
              )}
            </div>
          )}
        </div>

        {/* 선택된 헤드헌터 표시 */}
        {data.matchedHeadhunter && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                {data.matchedHeadhunter.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[var(--foreground)]">
                  {data.matchedHeadhunter.name}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {data.matchedHeadhunter.firm_name}
                </p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2.5 py-1 rounded-full font-medium">
                선택됨
              </span>
            </div>
          </div>
        )}

        {/* 서치펌 선택 (선택된 헤드헌터가 없을 때만) */}
        {!data.matchedHeadhunter && (
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              소속 서치펌 <span className="text-[var(--muted)] font-normal text-xs">(선택)</span>
            </label>
            <select
              value={data.searchFirmId}
              onChange={(e) => onChange({ searchFirmId: e.target.value, searchFirmCustom: "" })}
              className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">서치펌을 선택하세요</option>
              {searchFirms.map((firm) => (
                <option key={firm.id} value={firm.id}>
                  {firm.name}
                </option>
              ))}
              <option value="custom">직접 입력</option>
            </select>
          </div>
        )}

        {!data.matchedHeadhunter && data.searchFirmId === "custom" && (
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              서치펌명 직접 입력
            </label>
            <input
              type="text"
              value={data.searchFirmCustom}
              onChange={(e) => onChange({ searchFirmCustom: e.target.value })}
              className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="서치펌 이름"
            />
          </div>
        )}
      </div>
    );
  }

  // 수동 입력 모드
  return (
    <div className="space-y-5">
      {/* 검색으로 돌아가기 */}
      <button
        type="button"
        onClick={switchToSearch}
        className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        검색으로 돌아가기
      </button>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm text-blue-700 dark:text-blue-300">
        신규 헤드헌터 정보를 직접 입력해주세요.
      </div>

      {/* 헤드헌터 이름 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          헤드헌터 이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.headhunterName}
          onChange={(e) => onChange({ headhunterName: e.target.value })}
          className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="헤드헌터 이름"
        />
      </div>

      {/* 이메일 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={data.headhunterEmail}
          onChange={(e) => onChange({ headhunterEmail: e.target.value })}
          className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="headhunter@searchfirm.com"
        />
      </div>

      {/* 핸드폰번호 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          핸드폰번호 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={data.headhunterPhone}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9-]/g, "");
            onChange({ headhunterPhone: val });
          }}
          className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="010-0000-0000"
        />
      </div>

      {/* 서치펌 선택 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          소속 서치펌/회사명 <span className="text-red-500">*</span>
        </label>
        <select
          value={data.searchFirmId}
          onChange={(e) => onChange({ searchFirmId: e.target.value, searchFirmCustom: "" })}
          className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="">서치펌을 선택하세요</option>
          {searchFirms.map((firm) => (
            <option key={firm.id} value={firm.id}>
              {firm.name}
            </option>
          ))}
          <option value="custom">직접 입력</option>
        </select>
      </div>

      {data.searchFirmId === "custom" && (
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            서치펌명 직접 입력 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.searchFirmCustom}
            onChange={(e) => onChange({ searchFirmCustom: e.target.value })}
            className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="서치펌 이름"
          />
        </div>
      )}
    </div>
  );
}
