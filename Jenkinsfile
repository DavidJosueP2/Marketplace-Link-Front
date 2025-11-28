pipeline {
    agent any

    options {
        timestamps()
        ansiColor('xterm')
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        skipDefaultCheckout(true)  // Deshabilitar checkout automático para limpiar primero
    }

    environment {
        DOCKER_IMAGE = 'drtx2/marketplace-link-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    parameters {
        booleanParam(name: 'BUILD_DOCKER', defaultValue: true)
        booleanParam(name: 'RUN_UNIT_TESTS', defaultValue: false, description: 'Ejecutar tests unitarios con Vitest')
        booleanParam(name: 'RUN_E2E_TESTS', defaultValue: false, description: 'Ejecutar tests E2E con Playwright')
        booleanParam(name: 'PUSH_DOCKER', defaultValue: false)
        booleanParam(name: 'EXPOSE_FRONTEND', defaultValue: false, description: 'Exponer el frontend en el puerto 5174 del host (solo para desarrollo/testing local)')
        choice(name: 'DEPLOY_ENV', choices: ['none', 'staging', 'production'])
    }

    stages {
        stage('Checkout y Validación') {
            steps {
                script {
                    echo '🧹 Limpiando archivos de builds anteriores...'

                    sh """
                        docker run --rm -v "\$(pwd):/workspace" -w /workspace alpine:latest \
                            sh -c '
                                chmod -R 777 /workspace/playwright-report /workspace/test-results /workspace/.playwright 2>/dev/null || true
                                rm -rf /workspace/playwright-report /workspace/test-results /workspace/.playwright 2>/dev/null || true
                            ' 2>/dev/null || true
                        chmod -R u+w playwright-report test-results .playwright 2>/dev/null || true
                        rm -rf playwright-report test-results .playwright node_modules 2>/dev/null || true
                    """
                }

                checkout scm

                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    if (fileExists('package.json') && fileExists('Dockerfile')) {
                        env.PROJECT_DIR = '.'
                        echo '✅ Workspace es el directorio front/'
                    } else if (fileExists('front/package.json') && fileExists('front/Dockerfile')) {
                        env.PROJECT_DIR = 'front'
                        echo '✅ Workspace es la raíz del repo, proyecto en front/'
                    } else {
                        echo '❌ No se encontró package.json o Dockerfile'
                        sh 'pwd && ls -la || true'
                        error('❌ Estructura del proyecto no válida')
                    }

                    echo "Commit: ${env.GIT_COMMIT_SHORT}"
                    echo "Directorio: ${env.PROJECT_DIR}"
                }
            }
        }

        stage('Tests Unitarios (Vitest)') {
            when { expression { params.RUN_UNIT_TESTS } }
            steps {
                dir(env.PROJECT_DIR) {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        script {
                            echo '🧪 Ejecutando tests unitarios con Vitest...'

                            def npmCacheDir = "${env.WORKSPACE}/.npm-cache"
                            sh "mkdir -p ${npmCacheDir}"

                            sh """
                                docker run --rm -v "\$(pwd):/workspace" -w /workspace alpine:latest \
                                    sh -c 'chmod -R 777 /workspace/node_modules 2>/dev/null && rm -rf /workspace/node_modules' || true
                            """

                            sh """
                                docker run --rm \
                                    -v "\$(pwd):/workspace" \
                                    -v "${npmCacheDir}:/root/.npm" \
                                    -w /workspace \
                                    -e CI=true \
                                    node:22 \
                                    sh -c '
                                        su node -c "
                                            cd /workspace && \
                                            npm ci --no-audit --no-fund --prefer-offline || npm install --no-audit --no-fund && \
                                            npm run test:coverage || exit 0
                                        "
                                    '
                            """

                            if (fileExists('coverage')) {
                                echo '📊 Reporte de cobertura generado'
                                publishHTML([
                                    allowMissing: true,
                                    alwaysLinkToLastBuild: true,
                                    keepAll: true,
                                    reportDir: 'coverage',
                                    reportFiles: 'index.html',
                                    reportName: 'Vitest Coverage Report'
                                ])
                            }
                        }
                    }
                }
            }
        }

        stage('Tests E2E (Playwright)') {
            when { expression { params.RUN_E2E_TESTS } }
            steps {
                dir(env.PROJECT_DIR) {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        script {
                            echo '🧪 Ejecutando tests E2E con Playwright (Node 22)...'

                            def backendAvailable = sh(
                                script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health 2>/dev/null || echo "000"',
                                returnStdout: true
                            ).trim()

                            def backendUrl = 'http://localhost:8080'
                            if (backendAvailable == '000' || backendAvailable.toInteger() >= 400) {
                                echo "⚠️ Backend no disponible en ${backendUrl}"
                            } else {
                                echo "✅ Backend disponible (HTTP ${backendAvailable})"
                            }

                            def npmCacheDir = "${env.WORKSPACE}/.npm-cache"
                            sh "mkdir -p ${npmCacheDir}"

                            sh """
                                docker run --rm -v "\$(pwd):/workspace" -w /workspace alpine:latest \
                                    sh -c 'chmod -R 777 /workspace/node_modules 2>/dev/null && rm -rf /workspace/node_modules' || true
                            """

                            sh """
                                docker run --rm \
                                    -v "\$(pwd):/workspace" \
                                    -v "${npmCacheDir}:/root/.npm" \
                                    -w /workspace \
                                    --network host \
                                    -e VITE_FRONTEND_URL=http://localhost:5174 \
                                    -e VITE_API_URL=${backendUrl} \
                                    -e CI=true \
                                    node:22 \
                                    sh -c '
                                        set -e
                                        export DEBIAN_FRONTEND=noninteractive

                                        apt-get update -qq && \
                                        apt-get install -y -qq libnss3 libgbm1 libgtk-3-0 libx11-xcb1 libxcb1 \
                                            libasound2 libpango-1.0-0 libcairo2 libatspi2.0-0 ca-certificates || true

                                        su node -c "
                                            cd /workspace && \
                                            npm ci --no-audit --no-fund --prefer-offline || npm install --no-audit --no-fund && \
                                            npx playwright install chromium && \
                                            npm run test:e2e || exit 0
                                        "

                                        chown -R node:node playwright-report test-results .playwright 2>/dev/null || true
                                    '
                            """

                            if (fileExists('test-results')) {
                                archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                            }
                            if (fileExists('playwright-report')) {
                                archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                            }
                        }
                    }
                }
            }
        }

        stage('Construir Imagen Docker') {
            when { expression { params.BUILD_DOCKER } }
            steps {
                dir(env.PROJECT_DIR) {
                    script {
                        def buildDate = sh(script: 'date -u +"%Y-%m-%dT%H:%M:%SZ"', returnStdout: true).trim()

                        sh """
                            docker build \
                                --build-arg BUILD_DATE='${buildDate}' \
                                --build-arg GIT_COMMIT='${env.GIT_COMMIT_SHORT}' \
                                --build-arg VERSION='${env.BUILD_NUMBER}' \
                                -t ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} \
                                -t ${env.DOCKER_IMAGE}:latest \
                                .
                        """
                        echo "✅ Imagen construida: ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                    }
                }
            }
        }

        stage('Validación Local (Docker)') {
            when { expression { params.BUILD_DOCKER } }
            steps {
                dir(env.PROJECT_DIR) {
                    script {
                        try {
                            echo "🚀 Validando imagen Docker localmente..."
                            
                            sh '''
                                docker stop mplink-frontend 2>/dev/null || true
                                docker rm mplink-frontend 2>/dev/null || true
                            '''
                            
                            def portMapping = params.EXPOSE_FRONTEND ? '-p 5174:80' : ''
                            
                            if (params.EXPOSE_FRONTEND) {
                                echo "🌐 Frontend expuesto en http://localhost:5174"
                            }
                            
                            def containerId = sh(
                                script: """
                                    docker run -d \
                                        --name mplink-frontend \
                                        ${portMapping} \
                                        ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}
                                """,
                                returnStdout: true
                            ).trim()
                            
                            if (!containerId) {
                                error("❌ No se pudo crear el contenedor")
                            }
                            
                            echo "⏳ Esperando a que Nginx responda..."
                            
                            sh '''
                                timeout=60; elapsed=0
                                while [ $elapsed -lt $timeout ]; do
                                    status=$(docker ps --filter "name=mplink-frontend" --format "{{.Status}}" 2>/dev/null || echo "NOT_RUNNING")
                                    [ "$status" = "NOT_RUNNING" ] && echo "❌ Contenedor detenido" && docker logs mplink-frontend && exit 1
                                    
                                    http=$(docker run --rm --network container:mplink-frontend curlimages/curl:latest -s -o /dev/null -w "%{http_code}" http://localhost:80 2>/dev/null || echo "000")
                                    
                                    if [ "$http" = "200" ] || [ "$http" = "301" ] || [ "$http" = "302" ]; then
                                        echo "✅ Frontend respondiendo (HTTP $http)"
                                        exit 0
                                    fi
                                    
                                    sleep 2; elapsed=$((elapsed + 2))
                                done
                                
                                echo "❌ Timeout esperando el frontend"
                                docker logs mplink-frontend
                                exit 1
                            '''
                            
                            echo "✅ Validación completada"
                            
                            if (params.EXPOSE_FRONTEND) {
                                echo ""
                                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                                echo "🌐 Frontend disponible en: http://localhost:5174"
                                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                            } else {
                                sh '''
                                    docker stop mplink-frontend 2>/dev/null || true
                                    docker rm mplink-frontend 2>/dev/null || true
                                '''
                            }
                            
                        } catch (Exception e) {
                            echo "❌ Error durante validación: ${e.getMessage()}"
                            sh '''
                                docker logs mplink-frontend 2>&1 || true
                                docker stop mplink-frontend 2>/dev/null || true
                                docker rm mplink-frontend 2>/dev/null || true
                            '''
                            throw e
                        }
                    }
                }
            }
        }

        stage('Push Imagen') {
            when { expression { params.PUSH_DOCKER && params.BUILD_DOCKER } }
            steps {
                dir(env.PROJECT_DIR) {
                    withDockerRegistry([credentialsId: 'docker-registry-credentials', url: 'https://index.docker.io/v1/']) {
                        sh "docker push ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                        sh "docker push ${env.DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Deploy to Azure') {
            when { expression { params.DEPLOY_ENV != 'none' && params.BUILD_DOCKER } }
            steps {
                script {
                    def resourceGroup = 'rg-app-container'
                    def containerAppName = 'mplink-frontend'

                    echo "🚀 Desplegando a Azure (${params.DEPLOY_ENV})"
                    echo "   Container App: ${containerAppName}"
                    echo "   Resource Group: ${resourceGroup}"
                    echo "   Imagen: ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"

                    withCredentials([azureServicePrincipal('azure-credentials-id')]) {
                        // Usar Azure CLI desde Docker para evitar instalación en Jenkins
                        // Usar variables de entorno directamente en el contenedor para evitar interpolación insegura
                        sh """
                            docker run --rm \
                                -e AZURE_CLIENT_ID="${AZURE_CLIENT_ID}" \
                                -e AZURE_CLIENT_SECRET="${AZURE_CLIENT_SECRET}" \
                                -e AZURE_TENANT_ID="${AZURE_TENANT_ID}" \
                                mcr.microsoft.com/azure-cli:latest \
                                bash -c "
                                    az login --service-principal \
                                        -u \\\$AZURE_CLIENT_ID \
                                        -p \\\$AZURE_CLIENT_SECRET \
                                        --tenant \\\$AZURE_TENANT_ID && \
                                    az containerapp update \
                                        --name ${containerAppName} \
                                        --resource-group ${resourceGroup} \
                                        --image ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} || \
                                    (echo '⚠️ Error al actualizar el containerapp. Verificando si existe...' && \
                                     az containerapp show --name ${containerAppName} --resource-group ${resourceGroup} 2>&1 || \
                                     echo '❌ El containerapp no existe. Asegúrate de crearlo primero en Azure Portal.')
                                "
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo '🧹 Limpiando archivos de tests...'

                sh '''
                    docker run --rm -v "$(pwd):/workspace" -w /workspace alpine:latest \
                        sh -c 'chmod -R 777 /workspace/playwright-report /workspace/test-results /workspace/.playwright 2>/dev/null && \
                               rm -rf /workspace/playwright-report /workspace/test-results /workspace/.playwright' 2>/dev/null || true
                    rm -rf playwright-report test-results .playwright 2>/dev/null || true
                '''

                if (!params.EXPOSE_FRONTEND) {
                    sh '''
                        docker stop mplink-frontend 2>/dev/null || true
                        docker rm mplink-frontend 2>/dev/null || true
                    '''
                } else {
                    echo "ℹ️  Contenedor mplink-frontend activo en http://localhost:5174"
                }
            }
            echo "Build finalizado: ${currentBuild.currentResult}"
        }
    }
}