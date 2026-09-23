# JINI BUSINESS SITE STARTER

복제 가능한 소형 B2B 홈페이지 + 관리자 템플릿입니다.

## 현재 포함
- 반응형 공개 홈페이지
- 제품소개 / 설치사례 / 소식 / 고객지원 / 견적문의
- `/admin` 관리자센터
- 제품 CRUD
- 설치사례 CRUD + 사진 업로드
- 소식 CRUD
- 문의 상태관리
- 업체 기본정보 관리
- Supabase Auth / DB / Storage 연결 준비
- Netlify 배포 설정

## 데모모드
Supabase 환경변수가 없으면 브라우저 localStorage를 사용합니다.
- 관리자 URL: `/admin`
- 비밀번호: `demo1234`

## 실제 운영 연결
1. 새 Supabase 프로젝트 생성
2. `supabase/schema.sql` 실행
3. Supabase Auth에 관리자 이메일 계정 생성
4. Netlify 환경변수 설정
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Netlify 재배포

## 복제 방식
업체별로 이 저장소를 복제한 뒤 회사명, 전화, 주소, 제품, 설치사례, 이미지와 도메인만 교체합니다.
