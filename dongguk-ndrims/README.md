# 동국대학교 nDRIMS 과제용 사이트

## 포함 기능
- 회원가입
- 학번 로그인
- 로그아웃
- 학생 이름 및 학생정보 표시
- 마이페이지
- 공지사항 목록/상세
- 관리자 공지사항 작성/삭제
- 모바일 반응형 디자인

## 1. Supabase 설정
1. Supabase 프로젝트 생성
2. Authentication > Providers > Email에서 Email provider 활성화
3. Authentication > Settings에서 Confirm email 비활성화
4. SQL Editor에서 `supabase/setup.sql` 전체 실행
5. Project Settings > API에서 Project URL과 anon public key 복사

## 2. 환경변수
Vercel 프로젝트 설정에 아래 두 개를 등록:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## 3. 학생 계정 만들기
사이트의 회원가입 화면에서 아래 정보로 가입:
- 이름: 임동균
- 학번: 2026110431
- 학과: 약학과
- 학년: 1학년
- 비밀번호: 본인이 정한 안전한 비밀번호

## 4. 관리자 계정 만들기
회원가입 화면에서 관리자용 계정을 먼저 생성:
- 이름: 관리자
- 학번: donnguk333
- 학과: 교무처
- 학년: 1

그 다음 Supabase SQL Editor에서 실행:
```sql
update public.profiles
set role = 'admin'
where student_id = 'donnguk333';
```

관리자 비밀번호는 코드나 SQL에 적지 말고 회원가입 때 직접 입력하세요.

## 5. 배포
1. GitHub 새 저장소 생성
2. 이 프로젝트의 모든 파일 업로드
3. Vercel에서 GitHub 저장소 Import
4. 환경변수 등록
5. Deploy
