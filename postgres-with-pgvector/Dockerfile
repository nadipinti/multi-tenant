FROM postgres:13

RUN apt-get update \
 && apt-get install -y postgresql-server-dev-13 gcc make git \
 && git clone --branch v0.4.2 https://github.com/pgvector/pgvector.git /pgvector \
 && cd /pgvector \
 && make && make install \
 && cd / \
 && rm -rf /pgvector \
 && apt-get remove -y gcc make git postgresql-server-dev-13 \
 && apt-get autoremove -y \
 && apt-get clean
