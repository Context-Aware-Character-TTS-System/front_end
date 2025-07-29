# 시작하기

이 프로젝트는 Next.js를 기반으로 한 웹 애플리케이션입니다.

## 사전 요구 사항

- Node.js (v20 이상 권장)
- npm
- Docker (선택 사항)

## 설치 및 실행

### 1. 로컬 환경에서 직접 실행

1.  저장소를 복제합니다:
    ```bash
    git clone <repository-url>
    ```
2.  프로젝트 디렉토리로 이동합니다:
    ```bash
    cd front_end
    ```
3.  의존성을 설치합니다:
    ```bash
    npm install
    ```
4.  개발 서버를 실행합니다:
    ```bash
    npm run dev
    ```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하십시오.

### 2. Docker로 실행하기

Docker가 설치되어 있는 경우, 다음 명령어를 사용하여 애플리케이션을 컨테이너로 실행할 수 있습니다.

1.  **Docker 이미지 빌드:**
    프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 Docker 이미지를 빌드합니다.
    ```bash
    docker build -t my-next-app .
    ```

2.  **Docker 컨테이너 실행:**
    빌드된 이미지를 사용하여 컨테이너를 실행합니다.
    ```bash
    docker run -p 3000:3000 my-next-app
    ```

이제 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 주요 기술 스택

- **Next.js**: 풀스택 웹 애플리케이션을 구축하기 위한 React 프레임워크입니다.
- **React**: 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다.
- **Tailwind CSS**: 신속한 UI 개발을 위한 유틸리티 우선 CSS 프레임워크입니다.
- **TypeScript**: 일반 JavaScript로 컴파일되는 JavaScript의 유형이 지정된 상위 집합입니다.
- **Radix UI**: 스타일이 지정되지 않고 액세스 가능한 UI 구성 요소 모음입니다.
- **Lucide React**: 간단하게 디자인된 아이콘 라이브러리입니다.

전체 의존성 목록은 `package.json` 파일을 참조하십시오.