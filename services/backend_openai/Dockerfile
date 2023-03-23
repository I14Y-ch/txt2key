# builder
FROM golang:1.20-alpine3.17 as builder

WORKDIR /src

COPY . .

ENV CGO_ENABLED=0
RUN go mod download
RUN go build

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini

# runner
FROM golang:1.20-alpine3.17

WORKDIR /app/

ENV PATH "/app:${PATH}"

COPY --from=builder --chown=nobody:nobody /src/txt2key .
COPY --from=builder --chown=nobody:nobody /tini /tini

# nobody:nobody
USER 65534:65534
EXPOSE 8080

ENTRYPOINT ["/tini", "--"]
CMD ["txt2key"]