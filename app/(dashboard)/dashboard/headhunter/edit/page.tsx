"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COMPANY_SIZES, COMPANY_SIZE_LABELS } from "@/lib/review-constants";

interface EditData {
  headhunter: {
    id: string;
    name: string;
    bio: string | null;
    firm_name: string;
    specialty_fields: string[];
    verification_level: string;
  };
  positions: {
    id: string;
    title: string;
    industry: string;
    company_size: string;
    career_min: number;
    career_max: number;
    description: string | null;
    is_active: boolean;
    interest_count: number;
  }[];
}

const SPECIALTY_OPTIONS = [
  "IT/SW", "금융", "제조", "바이오/제약", "컨설팅",
  "마케팅", "디자인", "영업", "인사/HR", "법률",
  "물류/유통", "건설/부동산", "에너지", "미디어/엔터",
];

export default function HeadhunterEditPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [data, setData] = useState<EditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 편집 상태
  const [bio, setBio] = useState("");
  const [specialtyFields, setSpecialtyFields] = useState<string[]>([]);

  // 포지션 편집
  const [editingPos, setEditingPos] = useState<string | null>(null);
  const [editPosForm, setEditPosForm] = useState({ title: "", industry: "", company_size: "", career_min: 0, career_max: 0, description: "" });
  const [editPosSubmitting, setEditPosSubmitting] = useState(false);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session?.user || session.user.userType !== "headhunter") {
      router.push("/login");
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/headhunter");
        if (!res.ok) {
          router.push("/dashboard/headhunter");
          return;
        }
        const d = await res.json();
        setData(d);
        setBio(d.headhunter.bio || "");
        setSpecialtyFields(d.headhunter.specialty_fields || []);
      } catch {
        router.push("/dashboard/headhunter");
      }
      setLoading(false);
    }
    fetchData();
  }, [session, sessionStatus, router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/headhunter/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, specialty_fields: specialtyFields }),
      });
      if (res.ok) {
        alert("프로필이 저장되었습니다.");
      } else {
        const d = await res.json();
        alert(d.error || "저장 실패");
      }
    } catch {
      alert("네트워크 오류");
    }
    setSaving(false);
  };

  const toggleSpecialty = (field: string) => {
    setSpecialtyFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const handleEditPosition = (pos: EditData["positions"][0]) => {
    setEditingPos(pos.id);
    setEditPosForm({
      title: pos.title,
      industry: pos.industry,
      company_size: pos.company_size,
      career_min: pos.career_min,
      career_max: pos.career_max,
      description: pos.description || "",
    });
  };

  const handleSavePosition = async () => {
    if (!editingPos) return;
    setEditPosSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/headhunter/positions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPos, ...editPosForm }),
      });
      if (res.ok) {
        setData((prev) => prev ? {
          ...prev,
          positions: prev.positions.map((p) =>
            p.id === editingPos ? { ...p, ...editPosForm } : p
          ),
        } : prev);
        setEditingPos(null);
      } else {
        const d = await res.json();
        alert(d.error || "수정 실패");
      }
    } catch {
      alert("네트워크 오류");
    }
    setEditPosSubmitting(false);
  };

  const handleDeletePosition = async (id: string) => {
    if (!confirm("이 포지션을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/dashboard/headhunter/positions?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setData((prev) => prev ? {
        ...prev,
        positions: prev.positions.filter((p) => p.id !== id),
      } : prev);
    }
  };

  if (loading || sessionStatus === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[var(--muted)] text-sm">로딩 중...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/headhunter" className="text-[var(--muted)] hover:text-[var(--foreground)] transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">프로필 편집</h1>
      </div>

      {/* 기본 정보 */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">기본 정보</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">한 줄 소개</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={100}
              placeholder="나를 소개하는 한 줄을 작성해주세요."
              className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <p className="text-xs text-[var(--muted)] mt-1 text-right">{bio.length}/100</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">전문 분야 (다중 선택)</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_OPTIONS.map((field) => (
                <button
                  key={field}
                  onClick={() => toggleSpecialty(field)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    specialtyFields.includes(field)
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : "border-[var(--card-border)] text-[var(--muted)] hover:border-primary-300"
                  }`}
                >
                  {field}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50"
          >
            {saving ? "저장 중..." : "프로필 저장"}
          </button>
        </div>
      </section>

      {/* 포지션 관리 */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">포지션 관리</h2>

        {data.positions.length > 0 ? (
          <div className="space-y-3">
            {data.positions.map((pos) => (
              <div key={pos.id} className="border border-[var(--card-border)] rounded-xl p-4">
                {editingPos === pos.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editPosForm.title}
                      onChange={(e) => setEditPosForm({ ...editPosForm, title: e.target.value })}
                      placeholder="포지션명"
                      className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <input
                      type="text"
                      value={editPosForm.industry}
                      onChange={(e) => setEditPosForm({ ...editPosForm, industry: e.target.value })}
                      placeholder="산업군"
                      className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <div className="flex flex-wrap gap-2">
                      {COMPANY_SIZES.map((cs) => (
                        <button
                          key={cs.value}
                          onClick={() => setEditPosForm({ ...editPosForm, company_size: cs.value })}
                          className={`text-xs px-3 py-1.5 rounded-full border transition ${
                            editPosForm.company_size === cs.value
                              ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                              : "border-[var(--card-border)] text-[var(--muted)] hover:border-primary-300"
                          }`}
                        >
                          {cs.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-[var(--muted)]">최소 경력</label>
                        <input type="number" min={0} value={editPosForm.career_min} onChange={(e) => setEditPosForm({ ...editPosForm, career_min: parseInt(e.target.value) || 0 })} className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-[var(--muted)]">최대 경력</label>
                        <input type="number" min={0} value={editPosForm.career_max} onChange={(e) => setEditPosForm({ ...editPosForm, career_max: parseInt(e.target.value) || 0 })} className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none" />
                      </div>
                    </div>
                    <textarea
                      value={editPosForm.description}
                      onChange={(e) => setEditPosForm({ ...editPosForm, description: e.target.value })}
                      placeholder="상세 설명"
                      className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] resize-none h-16 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSavePosition}
                        disabled={editPosSubmitting}
                        className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition disabled:opacity-50"
                      >
                        {editPosSubmitting ? "저장 중..." : "저장"}
                      </button>
                      <button
                        onClick={() => setEditingPos(null)}
                        className="px-4 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-[var(--foreground)]">{pos.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-[var(--muted)]">
                        <span>{pos.industry}</span>
                        <span>·</span>
                        <span>{COMPANY_SIZE_LABELS[pos.company_size] || pos.company_size}</span>
                        <span>·</span>
                        <span>경력 {pos.career_min}~{pos.career_max}년</span>
                      </div>
                      {pos.description && (
                        <p className="text-xs text-[var(--muted)] mt-1">{pos.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => handleEditPosition(pos)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] transition"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeletePosition(pos.id)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)] text-center py-6">
            등록된 포지션이 없습니다.{" "}
            <Link href="/dashboard/headhunter" className="text-primary-600 hover:underline">
              대시보드에서 추가
            </Link>
            하세요.
          </p>
        )}
      </section>
    </div>
  );
}
