-- ===== 국내 주요 서치펌 시드 데이터 =====

INSERT INTO search_firms (name, website, description, specialty_fields, email_domain, status) VALUES

-- 글로벌 서치펌 (한국 지사)
('로버트월터스 코리아', 'https://www.robertwalters.co.kr', '글로벌 전문직 채용 컨설팅 기업. 아시아태평양 주요 거점 운영.', ARRAY['IT/개발', '금융', '마케팅', '영업', '법무'], 'robertwalters.com', 'active'),
('마이클페이지 코리아', 'https://www.michaelpage.co.kr', '글로벌 전문직 채용 기업. 다양한 산업 분야 전문 컨설턴트 보유.', ARRAY['IT/개발', '금융', '엔지니어링', '마케팅', '인사'], 'michaelpage.com', 'active'),
('헤이즈 코리아', 'https://www.hays.co.kr', '글로벌 채용 전문 기업. IT, 금융, 엔지니어링 분야 강점.', ARRAY['IT/개발', '금융', '엔지니어링', '건설', '물류'], 'hays.co.kr', 'active'),
('맨파워그룹 코리아', 'https://www.manpowergroup.co.kr', '글로벌 인력 솔루션 기업. 채용, 아웃소싱, 컨설팅 서비스.', ARRAY['제조', 'IT/개발', '금융', '영업', '물류'], 'manpowergroup.co.kr', 'active'),
('랜스타드 코리아', 'https://www.randstad.co.kr', '글로벌 HR 서비스 기업. 전문직 채용 및 아웃소싱.', ARRAY['IT/개발', '제조', '금융', '마케팅'], 'randstad.co.kr', 'active'),
('에이온휴잇 코리아', 'https://www.aon.com', '글로벌 인사/조직 컨설팅 기업. 임원 서치 전문.', ARRAY['경영/전략', '금융', '인사'], 'aon.com', 'active'),
('콘페리', 'https://www.kornferry.com', '글로벌 조직 컨설팅 및 임원 서치 기업.', ARRAY['경영/전략', '임원', 'IT/개발', '금융'], 'kornferry.com', 'active'),
('스펜서스튜어트', 'https://www.spencerstuart.com', '글로벌 임원 서치 및 리더십 자문 기업.', ARRAY['임원', '경영/전략', '금융'], 'spencerstuart.com', 'active'),
('러셀레이놀즈', 'https://www.russellreynolds.com', '글로벌 C-Level 임원 서치 전문 기업.', ARRAY['임원', '경영/전략'], 'russellreynolds.com', 'active'),
('에곤젠더', 'https://www.egonzehnder.com', '글로벌 리더십 자문 및 임원 서치 기업.', ARRAY['임원', '경영/전략', '금융'], 'egonzehnder.com', 'active'),

-- 국내 주요 서치펌
('커리어케어', 'https://www.careercare.co.kr', '국내 최대 규모 헤드헌팅 기업. IT, 제조, 금융 등 전 산업 커버.', ARRAY['IT/개발', '제조', '금융', '바이오', '영업'], 'careercare.co.kr', 'active'),
('유니코써치', 'https://www.unicosearch.com', '프리미엄 헤드헌팅 기업. 임원급 및 전문직 중심.', ARRAY['임원', 'IT/개발', '금융', '바이오'], 'unicosearch.com', 'active'),
('엘리트 서치', 'https://www.elitesearch.co.kr', 'IT 및 디지털 분야 전문 서치펌.', ARRAY['IT/개발', '데이터', 'AI', '핀테크'], 'elitesearch.co.kr', 'active'),
('HRK', 'https://www.hrk.co.kr', '국내 대표 서치펌. 다양한 산업 분야 전문 컨설턴트 보유.', ARRAY['IT/개발', '제조', '금융', '마케팅', '인사'], 'hrk.co.kr', 'active'),
('인코칭', 'https://www.incoaching.com', '전문직 채용 및 커리어 코칭 서비스 제공.', ARRAY['IT/개발', '금융', '컨설팅'], 'incoaching.com', 'active'),
('잡코리아서치', 'https://www.jobkoreasearch.com', '채용 플랫폼 기반 헤드헌팅 서비스.', ARRAY['IT/개발', '영업', '마케팅', '제조'], 'jobkoreasearch.com', 'active'),
('아이비커리어', 'https://www.ivycareer.co.kr', 'IT 및 스타트업 전문 헤드헌팅.', ARRAY['IT/개발', '스타트업', '데이터', 'PM'], 'ivycareer.co.kr', 'active'),
('피플앤잡', 'https://www.peoplenjob.com', '제조 및 엔지니어링 분야 전문 서치펌.', ARRAY['제조', '엔지니어링', '품질', '생산관리'], 'peoplenjob.com', 'active'),
('에이스헌터', 'https://www.acehunter.co.kr', '금융 및 보험 분야 전문 헤드헌팅.', ARRAY['금융', '보험', '증권', '핀테크'], 'acehunter.co.kr', 'active'),
('씨앤비서치', 'https://www.cnbsearch.co.kr', '바이오/제약 분야 전문 서치펌.', ARRAY['바이오', '제약', '의료기기', 'R&D'], 'cnbsearch.co.kr', 'active'),
('케이엔컨설팅', 'https://www.knconsulting.co.kr', '반도체 및 IT 제조 분야 전문.', ARRAY['반도체', 'IT/개발', '제조', '엔지니어링'], 'knconsulting.co.kr', 'active'),
('브레인서치', 'https://www.brainsearch.co.kr', '경영진 및 임원 서치 전문. 국내 중견/대기업 네트워크 강점.', ARRAY['임원', '경영/전략', '금융', '제조'], 'brainsearch.co.kr', 'active'),
('탤런트넷', 'https://www.talentnet.co.kr', 'IT 및 게임 산업 전문 헤드헌팅.', ARRAY['IT/개발', '게임', 'AI', '데이터'], 'talentnet.co.kr', 'active'),
('리크루트원', 'https://www.recruitone.co.kr', '외국계 기업 전문 서치펌. 영어 가능 인재 매칭.', ARRAY['외국계', 'IT/개발', '금융', '마케팅'], 'recruitone.co.kr', 'active'),
('엠플러스컨설팅', 'https://www.mplusconsulting.co.kr', '디지털 트랜스포메이션 및 IT 분야 전문.', ARRAY['IT/개발', 'DX', '클라우드', 'PM'], 'mplusconsulting.co.kr', 'active');
