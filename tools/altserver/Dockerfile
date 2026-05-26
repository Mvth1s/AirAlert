FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libimobiledevice6 \
    libplist3 \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

ARG TARGETARCH=amd64
RUN case "$TARGETARCH" in \
      amd64)  ARCH=x86_64  ;; \
      arm64)  ARCH=aarch64 ;; \
      *) echo "Architecture non supportée: $TARGETARCH" && exit 1 ;; \
    esac \
    && wget -q -O /usr/local/bin/AltServer \
       "https://github.com/NyaMisty/AltServer-Linux/releases/latest/download/AltServer-${ARCH}" \
    && chmod +x /usr/local/bin/AltServer

WORKDIR /ipa
ENTRYPOINT ["/usr/local/bin/AltServer"]
