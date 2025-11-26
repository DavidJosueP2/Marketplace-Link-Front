pipeline {
    agent any

    options {
        timestamps()
        ansiColor('xterm')
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        DOCKER_IMAGE = "drtx2/marketplace-link-frontend"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    parameters {
        booleanParam(name: 'BUILD_DOCKER', defaultValue: true)
        booleanParam(name: 'RUN_TESTS', defaultValue: false, description: 'Ejecutar tests E2E con Playwright')
        booleanParam(name: 'PUSH_DOCKER', defaultValue: false)
        choice(name: 'DEPLOY_ENV', choices: ['none','staging','production'])
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                    
                    // Detectar automáticamente el directorio base del proyecto
                    if (fileExists('package.json') && fileExists('Dockerfile')) {
                        env.PROJECT_DIR = '.'
                        echo "✅ Detectado: workspace es el directorio front/"
                    } else if (fileExists('front/package.json') && fileExists('front/Dockerfile')) {
                        env.PROJECT_DIR = 'front'
                        echo "✅ Detectado: workspace es la raíz del repo, proyecto en front/"
                    } else {
                        echo "❌ No se pudo detectar la estructura del proyecto"
                        echo "📁 Estructura del workspace:"
                        sh 'pwd && ls -la || true'
                        error("❌ No se encontró package.json o Dockerfile. Verifica la estructura del repositorio.")
                    }
                }
                echo "Commit: ${env.GIT_COMMIT_SHORT}"
                echo "Directorio del proyecto: ${env.PROJECT_DIR}"
            }
        }

        stage('Validación de Proyecto') {
            steps {
                dir(env.PROJECT_DIR) {
                    script {
                        if (!fileExists('package.json')) {
                            error("❌ No se encontró package.json en ${env.PROJECT_DIR}/")
                        }
                        if (!fileExists('Dockerfile')) {
                            error("❌ No se encontró Dockerfile en ${env.PROJECT_DIR}/")
                        }
                        echo "✅ Validación OK: package.json y Dockerfile encontrados en ${env.PROJECT_DIR}/"
                    }
                }
            }
        }

        stage('Tests (Opcional)') {
            when { expression { params.RUN_TESTS } }
            steps {
                dir(env.PROJECT_DIR) {
                    script {
                        echo "🧪 Ejecutando tests E2E con Playwright..."
                        
                        // Instalar dependencias y ejecutar tests
                        sh """
                            npm ci --no-audit --no-fund || npm install --no-audit --no-fund
                            npx playwright install --with-deps || true
                            npm run test:e2e || echo "⚠️ Algunos tests fallaron, pero continuando..."
                        """
                        
                        // Publicar resultados de Playwright si existen
                        if (fileExists('test-results')) {
                            echo "📊 Resultados de tests encontrados en test-results/"
                            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                        }
                        
                        if (fileExists('playwright-report')) {
                            echo "📊 Reporte de Playwright encontrado"
                            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
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
                        // Pasar metadatos de build a Docker
                        def buildDate = sh(script: 'date -u +"%Y-%m-%d"', returnStdout: true).trim()
                        def buildTime = sh(script: 'date -u +"%H:%M:%S"', returnStdout: true).trim()
                        def gitCommit = env.GIT_COMMIT_SHORT ?: sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                        
                        sh """
                            docker build \
                                --build-arg BUILD_DATE="${buildDate}" \
                                --build-arg BUILD_TIME="${buildTime}" \
                                --build-arg GIT_COMMIT="${gitCommit}" \
                                --build-arg VERSION="${env.BUILD_NUMBER}" \
                                -t ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} \
                                -t ${env.DOCKER_IMAGE}:latest \
                                .
                        """
                        echo "✅ Imagen Docker construida: ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                    }
                }
            }
        }

        stage('Validación Local (Docker)') {
            when { 
                expression { 
                    params.BUILD_DOCKER 
                } 
            }
            steps {
                dir(env.PROJECT_DIR) {
                    script {
                        try {
                            echo "🚀 Validando imagen Docker localmente..."
                            
                            // Detener contenedor previo si existe
                            sh """
                                docker stop mplink-frontend 2>/dev/null || true
                                docker rm mplink-frontend 2>/dev/null || true
                            """
                            
                            // Ejecutar contenedor temporalmente
                            sh """
                                docker run -d \
                                    --name mplink-frontend \
                                    -p 8081:80 \
                                    ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}
                            """
                            
                            echo "⏳ Esperando a que el contenedor esté saludable..."
                            
                            // Esperar a que Nginx responda
                            sh """
                                timeout=60
                                elapsed=0
                                
                                while [ \$elapsed -lt \$timeout ]; do
                                    http_code=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081 2>/dev/null || echo "000")
                                    
                                    if [ "\$http_code" = "200" ] || [ "\$http_code" = "301" ] || [ "\$http_code" = "302" ]; then
                                        echo "✅ Frontend está respondiendo (HTTP \$http_code)"
                                        break
                                    fi
                                    
                                    echo "Esperando frontend... (\$elapsed/\$timeout segundos)"
                                    sleep 2
                                    elapsed=\$((elapsed + 2))
                                done
                                
                                if [ \$elapsed -ge \$timeout ]; then
                                    echo "❌ Timeout esperando el frontend"
                                    docker logs mplink-frontend || true
                                    exit 1
                                fi
                            """
                            
                            echo "✅ Validación local completada exitosamente"
                            
                            // Limpiar contenedor de prueba
                            sh """
                                docker stop mplink-frontend 2>/dev/null || true
                                docker rm mplink-frontend 2>/dev/null || true
                            """
                            
                        } catch (Exception e) {
                            echo "❌ Error durante la validación local: ${e.getMessage()}"
                            sh """
                                echo "=== Logs del Frontend ==="
                                docker logs mplink-frontend || true
                                docker stop mplink-frontend 2>/dev/null || true
                                docker rm mplink-frontend 2>/dev/null || true
                            """
                            throw e
                        }
                    }
                }
            }
        }

        stage('Push Imagen') {
            when { expression { params.PUSH_DOCKER && params.BUILD_DOCKER } }
            steps {
                withDockerRegistry([credentialsId: 'docker-registry-credentials', url: 'https://index.docker.io/v1/']) {
                    sh "docker push ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                    sh "docker push ${env.DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Azure') {
            when { expression { params.DEPLOY_ENV != 'none' && params.BUILD_DOCKER } }
            steps {
                script {
                    withCredentials([azureServicePrincipal('azure-credentials-id')]) {
                        // Usar Azure CLI desde Docker para evitar instalación en Jenkins
                        sh """
                            docker run --rm \
                                -e AZURE_CLIENT_ID='${AZURE_CLIENT_ID}' \
                                -e AZURE_CLIENT_SECRET='${AZURE_CLIENT_SECRET}' \
                                -e AZURE_TENANT_ID='${AZURE_TENANT_ID}' \
                                mcr.microsoft.com/azure-cli:latest \
                                bash -c "
                                    az login --service-principal \
                                        -u \\\$AZURE_CLIENT_ID \
                                        -p \\\$AZURE_CLIENT_SECRET \
                                        --tenant \\\$AZURE_TENANT_ID && \
                                    az containerapp update \
                                        --name marketplace-link-frontend \
                                        --resource-group mi-grupo \
                                        --image ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}
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
                // Limpiar contenedores de prueba si quedaron
                sh """
                    docker stop mplink-frontend 2>/dev/null || true
                    docker rm mplink-frontend 2>/dev/null || true
                """
              }
            echo "Build finalizado con estado: ${currentBuild.currentResult}"
        }
    }
}


