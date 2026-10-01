# 박상준 콘텐츠 마케터 포트폴리오

정적 HTML 사이트입니다. 빌드 과정 없이 GitHub Pages에 그대로 올리면 됩니다.

## 폴더 구조
```
index.html                         메인 페이지
assets/css/style.css               스타일
assets/js/main.js                  메뉴·복사 기능
assets/img/*.svg                   오브젝트 일러스트 (직접 제작한 SVG)
assets/files/ParkSangjun_Portfolio_2026.pdf   다운로드용 포트폴리오
.nojekyll                          GitHub Pages가 파일을 그대로 쓰도록 하는 설정
```

## GitHub Pages 배포
1. GitHub에서 새 저장소를 만듭니다. 주소를 `아이디.github.io`로 하면 `https://아이디.github.io`에서 바로 열립니다.
2. 이 폴더의 파일을 전부(숨김 파일 `.nojekyll` 포함) 저장소 루트에 올립니다.
   - 웹에서: 저장소 → Add file → Upload files → 압축을 푼 파일을 끌어다 놓기
   - 터미널에서: `git init` → `git add .` → `git commit -m "portfolio"` → `git branch -M main` → `git remote add origin <저장소 주소>` → `git push -u origin main`
3. 저장소 Settings → Pages → Build and deployment에서 Source를 `Deploy from a branch`, Branch를 `main` / `/(root)`로 저장합니다.
4. 1~2분 뒤 표시되는 주소로 접속합니다.

## 수정 팁
- 포트폴리오 PDF를 바꿀 때는 `assets/files/ParkSangjun_Portfolio_2026.pdf`를 같은 이름으로 덮어쓰면 됩니다.
- 다운로드 파일 이름은 `index.html`의 `download="박상준_포트폴리오_2026.pdf"` 부분에서 바꿉니다.
- 글꼴은 Pretendard(CDN)를 씁니다. 인터넷이 막힌 환경에서는 시스템 글꼴로 대체됩니다.
