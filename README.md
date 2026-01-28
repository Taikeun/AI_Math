# AI Math Solver (AI 수학 선생님)

Google Gemini API를 활용하여 수학 문제 이미지를 인식하고, 친절한 단계별 풀이를 제공하는 웹 애플리케이션입니다.

## 주요 기능
*   **간편한 접속**: 별도 가입 없이 비밀번호(PIN)로 접속
*   **사진 촬영/업로드**: 수학 문제 사진을 찍거나 업로드하여 질문
*   **AI 풀이**: Gemini 모델이 단계를 나누어 상세하게 풀이 제공
*   **모바일 최적화**: 스마트폰에서 앱처럼 사용 가능 (PWA 지원)

## 사용 방법
1.  앱에 접속합니다.
2.  비밀번호 `grace2015`를 입력합니다.
3.  **Open Camera** 버튼을 눌러 문제를 촬영하거나 이미지를 업로드합니다.
4.  **문제 풀기 (Solve)** 버튼을 누르면 AI 선생님이 풀이를 보여줍니다.

## 개발 관련
이 프로젝트는 [Next.js](https://nextjs.org/)로 제작되었으며, GitHub Pages를 통해 배포됩니다.

### 로컬 실행
```bash
npm install
npm run dev
```

### 배포 (GitHub Pages)
코드가 `main` 브랜치에 푸시되면 GitHub Actions를 통해 자동으로 배포됩니다.
(단, 저장소 Settings에서 `NEXT_PUBLIC_GEMINI_API_KEY` 시크릿 설정이 필요합니다.)
