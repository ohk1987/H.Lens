"use client";

import { useCallback, useState } from "react";
import type { ReviewFormData } from "@/lib/types/review-form";
import type { SearchFirm } from "@/lib/types";

interface Props {
  data: ReviewFormData;
  onChange: (updates: Partial<ReviewFormData>) => void;
  searchFirms: SearchFirm[];
}

export default function StepHeadhunter({ data, onChange, searchFirms }: Props) {
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  const matchHeadhunter = useCallback(async () => {
    if (!data.headhunterEmail && !data.headhunterPhone) return;
    setSearching(true);
    setSearchDone(false);

    try {
      const params = new URLSearchParams();
      if (data.headhunterEmail) params.set("email", data.headhunterEmail);
      if (data.headhunterPhone) params.set("phone", data.headhunterPhone);

      const res = await fetch(`/api/headhunters/claim?${params}`);
      const result = await res.json();

      if (result.matches?.length > 0) {
        const match = result.matches[0];
        onChange({
          matchedHeadhunter: match,
          headhunterId: match.id,
        });
      } else {
        onChange({ matchedHeadhunter: null, headhunterId: null });
      }
    } catch {
      onChange({ matchedHeadhunter: null, headhunterId: null });
    } finally {
      setSearching(false);
      setSearchDone(true);
    }
  }, [data.headhunterEmail, data.headhunterPhone, onChange]);

  return (
    <div className="space-y-5">
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
          onChange={(e) => {
            onChange({ headhunterEmail: e.target.value, matchedHeadhunter: null });
            setSearchDone(false);
          }}
          onBlur={matchHeadhunter}
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
            onChange({ headhunterPhone: val, matchedHeadhunter: null });
            setSearchDone(false);
          }}
          onBlur={matchHeadhunter}
          className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="010-0000-0000"
        />
      </div>

      {/* 매칭 결과 */}
      {searching && (
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          기존 헤드헌터를 검색 중입니다...
        </div>
      )}

      {searchDone && data.matchedHeadhunter && (
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
              매칭됨
            </span>
          </div>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-3">
            이 헤드헌터가 맞나요? 맞다면 그대로 진행해주세요.
          </p>
        </div>
      )}

      {/* 서치펌 선택 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          소속 서치펌
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
