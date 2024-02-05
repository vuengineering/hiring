FROM mcr.microsoft.com/azure-cli:2.9.1

WORKDIR /opt/azurite

RUN apk add npm
RUN npm install -g azurite@3.28.0 --silent

ADD azurite/entrypoint.sh .

# Default Workspace Volume
VOLUME [ "/data" ]

# Blob Storage Port
EXPOSE 10000
# Queue Storage Port
EXPOSE 10001
# Table Storage Port
EXPOSE 10002

ENTRYPOINT ["/opt/azurite/entrypoint.sh"]
