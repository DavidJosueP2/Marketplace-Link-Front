#!/bin/bash
# Script de diagnóstico para Azure Container App

echo "🔍 DIAGNÓSTICO DEL CONTAINER APP"
echo "================================"
echo ""

echo "1️⃣ Verificando imagen actual en Azure:"
az containerapp show \
  --name mplink-frontend \
  --resource-group rg-app-container \
  --query "properties.template.containers[].image" \
  -o tsv

echo ""
echo "2️⃣ Verificando variables de entorno:"
az containerapp show \
  --name mplink-frontend \
  --resource-group rg-app-container \
  --query "properties.template.containers[].env" \
  -o json

echo ""
echo "3️⃣ Verificando URL del frontend:"
az containerapp show \
  --name mplink-frontend \
  --resource-group rg-app-container \
  --query "properties.configuration.ingress.fqdn" \
  -o tsv

echo ""
echo "4️⃣ Últimas revisiones:"
az containerapp revision list \
  --name mplink-frontend \
  --resource-group rg-app-container \
  --query "[].{Name:name, Active:properties.active, CreatedTime:properties.createdTime, Traffic:properties.trafficWeight}" \
  -o table

echo ""
echo "5️⃣ Obteniendo logs recientes (últimos 10 minutos):"
az containerapp logs show \
  --name mplink-frontend \
  --resource-group rg-app-container \
  --tail 50
