# Railway 배포용. 빌드 과정 없이 정적 파일(index.html, src/)만 Caddy 웹서버로 내보낸다.
# 문서(docs/, SPEC.md 등)와 .git은 이미지에 넣지 않는다.
FROM caddy:2.8.4-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html /srv/
COPY src /srv/src
