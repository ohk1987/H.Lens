import { createClient } from "@/lib/supabase/server";

/**
 * 리뷰 작성 시 이메일 또는 전화번호로 기존 헤드헌터 매칭
 * 없으면 신규 헤드헌터 레코드 생성 (unclaimed)
 */
export async function findOrCreateHeadhunter({
  name,
  email,
  phone,
  searchFirmId,
}: {
  name: string;
  email?: string;
  phone?: string;
  searchFirmId?: string;
}) {
  const supabase = createClient();

  // 1. 이메일로 매칭
  if (email) {
    const { data: byEmail } = await supabase
      .from("headhunters")
      .select("id, name, is_claimed")
      .eq("email", email)
      .single();

    if (byEmail) return { headhunterId: byEmail.id, matched: true };
  }

  // 2. 전화번호로 매칭
  if (phone) {
    const normalizedPhone = phone.replace(/[^0-9]/g, "");
    const { data: byPhone } = await supabase
      .from("headhunters")
      .select("id, name, is_claimed")
      .eq("phone", normalizedPhone)
      .single();

    if (byPhone) return { headhunterId: byPhone.id, matched: true };
  }

  // 3. 신규 생성
  const insertData: Record<string, unknown> = { name };
  if (email) insertData.email = email;
  if (phone) insertData.phone = phone.replace(/[^0-9]/g, "");
  if (searchFirmId) insertData.search_firm_id = searchFirmId;

  const { data: newHunter, error } = await supabase
    .from("headhunters")
    .insert(insertData)
    .select("id")
    .single();

  if (error) {
    throw new Error(`헤드헌터 생성 실패: ${error.message}`);
  }

  return { headhunterId: newHunter.id, matched: false };
}

/**
 * 헤드헌터 가입 시 본인 프로필 클레임 신청
 * 이메일로 매칭되는 unclaimed 헤드헌터 자동 검색
 */
export async function findClaimableProfiles(email: string) {
  const supabase = createClient();

  const { data: profiles } = await supabase
    .from("headhunters")
    .select("id, name, search_firm_id, is_claimed")
    .eq("email", email)
    .eq("is_claimed", false);

  return profiles || [];
}

/**
 * 클레임 요청 생성
 */
export async function createClaimRequest({
  headhunterId,
  userId,
  evidenceUrl,
}: {
  headhunterId: string;
  userId: string;
  evidenceUrl?: string;
}) {
  const supabase = createClient();

  // 이미 클레임된 프로필인지 확인
  const { data: hunter } = await supabase
    .from("headhunters")
    .select("is_claimed")
    .eq("id", headhunterId)
    .single();

  if (!hunter) throw new Error("존재하지 않는 헤드헌터입니다.");
  if (hunter.is_claimed) throw new Error("이미 클레임된 프로필입니다.");

  // 중복 요청 확인
  const { data: existing } = await supabase
    .from("claim_requests")
    .select("id, status")
    .eq("headhunter_id", headhunterId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    throw new Error(
      existing.status === "pending"
        ? "이미 클레임 요청이 진행 중입니다."
        : "이미 처리된 클레임 요청입니다."
    );
  }

  const { data: claim, error } = await supabase
    .from("claim_requests")
    .insert({
      headhunter_id: headhunterId,
      user_id: userId,
      evidence_url: evidenceUrl || null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return claim.id;
}
