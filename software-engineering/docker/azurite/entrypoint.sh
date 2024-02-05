#!/usr/bin/env bash

set -e
set -m

AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://0.0.0.0:10000/devstoreaccount1;"
export AZURE_STORAGE_CONNECTION_STRING

azurite --loose -l /data --blobHost 0.0.0.0 --blobPort 10000 --debug /debug.log &

n=0
until [ "$n" -ge 5 ]
do
  echo "Waiting for blob storage to start..."
  az storage container create -n inspektor
  az storage container exists -n inspektor && break
  n=$((n+1))
  sleep 15
done

az storage container show -n inspektor

tail -f /debug.log
