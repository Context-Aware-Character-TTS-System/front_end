# 1. 빌드 단계 (Builder Stage)
# ---------------------------
# Next.js 앱을 빌드하기 위한 환경
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치 (소스코드보다 먼저 복사하여 Docker 캐시 활용)
COPY package*.json ./
RUN npm install

# 소스코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 2. 프로덕션 단계 (Production Stage)
# ---------------------------------
# 빌드된 결과물만 사용하여 가벼운 최종 이미지를 생성
FROM node:20-alpine AS runner

# 작업 디렉토리 설정
WORKDIR /app

# 프로덕션 환경 설정
ENV NODE_ENV=production

# 프로덕션용 의존성만 설치
COPY package*.json ./
RUN npm install --production

# 빌드 단계에서 생성된 결과물 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 애플리케이션이 사용할 포트 노출
EXPOSE 3000

# 컨테이너 시작 시 실행할 명령어
CMD ["npm", "start"]
