# GitHub Pages 개발자 포트폴리오 (Vanilla)

원페이지 포트폴리오 템플릿입니다. `HTML/CSS/JavaScript`만으로 구성되어 GitHub Pages에 바로 배포할 수 있습니다.

## 포함 기능
- 6개 섹션: Hero / About / Skills / Projects / Experience / Contact
- 고정 데이터 스키마 기반 렌더링 (`assets/main.js`)
- 스크롤 네비게이션 활성화, 부드러운 스크롤, 섹션 리빌 애니메이션
- 기본 SEO 메타 태그 + Open Graph + SVG favicon
- GitHub Actions 자동 배포 (`.github/workflows/pages.yml`)

## 커스터마이징
아래 플레이스홀더를 실제 값으로 바꾸세요.
- `index.html`: `<github-username>`, `<linkedin-id>`
- `assets/main.js`: 프로필/스킬/프로젝트/경력/연락처 데이터

## 로컬 실행
정적 서버로 실행하세요.

```powershell
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속.

## GitHub Pages 배포
1. GitHub에 `<github-username>.github.io` 저장소를 생성합니다.
2. 이 파일들을 `main` 브랜치에 푸시합니다.
3. 저장소 Settings → Pages에서 Source를 `GitHub Actions`로 설정합니다.
4. Actions 탭에서 `Deploy static content to Pages` 워크플로 실행/성공을 확인합니다.
