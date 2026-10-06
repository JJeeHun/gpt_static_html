# ROOT Project Hub

ROOT 페이지는 `src/_hub/data/projects.json`을 기준으로 프로젝트 목록을 렌더링합니다.

## 프로젝트 추가

1. `src/<project>/index.html` 진입점을 만든다.
2. `projects.json`의 `projects` 배열에 메타데이터를 추가한다.
3. 기존 분류가 맞지 않으면 `categories` 배열에 분류를 먼저 추가한다.
4. ROOT 페이지에서 검색, 분류 필터, 정렬 결과를 확인한다.

## 프로젝트 데이터

```json
{
  "id": "unique-project-id",
  "name": "화면에 표시할 이름",
  "description": "짧은 설명",
  "path": "./project/",
  "category": "study",
  "status": "active",
  "icon": "book-open",
  "tags": ["태그"],
  "keywords": ["검색용", "키워드"],
  "featured": false,
  "updatedAt": "2026-10-06"
}
```

- `id`: 중복되지 않는 프로젝트 식별자
- `category`: `categories`에 등록된 id만 사용
- `status`: `statuses`에 등록된 id만 사용
- `icon`: Lucide Icons 이름 사용
- `tags`: 카드에 표시되는 짧은 키워드
- `keywords`: 검색에는 포함되지만 카드에는 표시되지 않는 보조 키워드
- `featured`: 추천순 정렬에서 우선 노출
- `updatedAt`: 최근 수정순 정렬에 사용하는 날짜

## 현재 분류

- `study`: 개인 공부
- `guide`: 가이드 · 자료
- `tool`: 도구
- `experiment`: 실험
- `etc`: 기타

분류는 필요할 때 데이터에 추가할 수 있으며, 실제 프로젝트가 하나도 없는 분류는 ROOT 필터에 노출되지 않습니다.

## ROOT 전용 파일

- `src/index.html`: ROOT 화면 구조
- `src/_hub/css/main.css`: ROOT 스타일
- `src/_hub/js/main.js`: 검색, 필터, 정렬, 테마, 브랜치 표시
- `src/_hub/data/projects.json`: 분류 및 프로젝트 메타데이터

다른 프로젝트의 코드와 ROOT 허브 코드를 섞지 않습니다.
