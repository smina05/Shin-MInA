# 식물 관찰 학습 웹앱

## 준비물

- Windows
- Node.js 18 이상
- Docker에서 실행 중인 AnythingLLM
- AnythingLLM Developer API 키

## 실행 방법

1. `.env` 파일을 메모장으로 엽니다.
2. 다음 두 항목을 입력하고 저장합니다.

   ```env
   ANYTHINGLLM_API_KEY=발급받은_Developer_API_키
   ANYTHINGLLM_WORKSPACE_SLUG=워크스페이스_slug
   ```

   `workspace slug`는 AnythingLLM 워크스페이스 주소의 `/workspace/` 뒤에
   표시되는 값입니다.

3. Docker AnythingLLM이 `http://localhost:3001`에서 실행 중인지 확인합니다.
4. `start.bat`을 더블 클릭합니다.
5. 브라우저에서 `http://127.0.0.1:8765`를 엽니다.

`.env`를 수정했다면 실행 중인 서버 창에서 `Ctrl+C`를 누른 후
`start.bat`을 다시 실행해야 합니다.

## Railway 배포

웹앱과 AnythingLLM은 같은 Railway 프로젝트의 같은 환경에 배포합니다.
웹앱은 Railway가 할당한 `PORT`에서 실행됩니다. `/healthz`는 웹 서버 시작을
확인하고, 대화창에서 사용하는 `/api/health`는 AnythingLLM 워크스페이스 접근을 확인합니다.

1. Node.js 22 이상에서 저장소 루트로 이동해 `npm install --no-save --package-lock=false railway@3.17.0`으로
   배포 설정용 SDK를 설치합니다. Railway CLI에서 `railway login`, `railway link`를
   실행하고 대상 프로젝트와 환경을 선택합니다.
   `railway config plan`으로 변경사항을 확인하고 `railway config apply`를 실행합니다.
   [Railway Infrastructure as Code](https://docs.railway.com/infrastructure-as-code)
2. 웹앱 서비스 `plant-observation`의 **Settings → Networking**에서 도메인을 생성합니다.
   `anythingllm` 서비스에는 Railway용 공식 이미지와 `/storage` 볼륨이 설정됩니다.
3. AnythingLLM을 처음 설정할 때 `anythingllm` 서비스의 **Variables**에 강력한
   `AUTH_TOKEN`을 설정하고 배포합니다. 그다음 포트 `3001`을 대상으로 임시 도메인을
   생성해 로그인합니다. 사용할 모델 공급자를 연결하고 식물 관찰용 워크스페이스를
   만든 뒤 **Settings → Developer API**에서 새 키를 발급합니다.
   [AnythingLLM API 키 안내](https://docs.anythingllm.com/features/api)
4. `plant-observation` 서비스의 **Variables**에 아래 두 값을 추가하고 배포합니다.
   `ANYTHINGLLM_URL`은 배포 설정에서 내부 네트워크 주소로 등록됩니다.

   | 변수 | 값 |
   | --- | --- |
   | `ANYTHINGLLM_API_KEY` | Railway에서 실행 중인 AnythingLLM이 발급한 Developer API 키 |
   | `ANYTHINGLLM_WORKSPACE_SLUG` | 워크스페이스 URL에서 `/workspace/` 다음에 나오는 값 |

5. 웹앱 도메인을 열어 대화창에 질문을 보내고 답변을 확인합니다.
   관리자 화면 설정을 마치면 AnythingLLM의 임시 도메인을 삭제해도
   웹앱은 Railway 내부 네트워크로 계속 연결됩니다.

## 보안 및 기능 안내

- API 키는 브라우저로 전달되지 않고 로컬 Node.js 서버에서만 사용됩니다.
- `.env`는 Git에 포함되지 않습니다.
- 왼쪽에서 선택한 사진과 문서(워드, 파워포인트, 엑셀, 텍스트, PDF 등)는 질문과 함께 AnythingLLM으로 전송됩니다.
- AI가 생성한 파일이 AnythingLLM에서 오지 않더라도, 워드/엑셀/텍스트 요청이면 웹앱이 답변 본문으로 파일을 만들어 첨부합니다.
- 이미지는 비전 모델이 직접 보고, 문서는 AnythingLLM 문서 처리기로 읽힌 뒤 답변에 사용됩니다.
- 첨부 없이 글로만 질문할 수도 있습니다.

## 문제 해결

- `설정 필요`: `.env`의 API 키와 workspace slug를 확인합니다.
- `API 키가 올바르지 않습니다`: AnythingLLM의 Developer API에서 발급한 키인지 확인합니다.
- `연결할 수 없습니다`: Docker와 AnythingLLM이 실행 중인지 확인합니다.
- `포트 8765가 이미 사용 중`: 기존에 실행한 `start.bat` 창을 종료합니다.
