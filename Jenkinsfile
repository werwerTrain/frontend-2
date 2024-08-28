pipeline {
    agent any

    environment {
        // 设置 Docker 镜像的标签
        FRONTEND_IMAGE = "luluplum/frontend2:latest"
        DOCKER_CREDENTIALS_ID = '9b671c50-14d3-407d-9fe7-de0463e569d2'
        DOCKER_PASSWORD = 'luluplum'
        DOCKER_USERNAME = 'woaixuexi0326'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'luluplum', url: 'https://github.com/werwerTrain/frontend-2.git'
            }
        }
        stage('Build Frontend') { 
            steps {
                
                script {
                    // 查找并停止旧的容器
                    sh '''
                    CONTAINERS=$(docker ps -q --filter "ancestor=${FRONTEND_IMAGE}")
                    if [ -n "$CONTAINERS" ]; then
                        docker stop $CONTAINERS
                    fi
                    '''
            
                    // 删除停止的容器
                    sh '''
                    CONTAINERS=$(docker ps -a -q --filter "ancestor=${FRONTEND_IMAGE}")
                    if [ -n "$CONTAINERS" ]; then
                        docker rm $CONTAINERS
                    fi
                    '''
                    sh '''
                    docker rmi -f ${FRONTEND_IMAGE} || true
                    '''
                    // 构建前端 Docker 镜像
                    sh 'docker build -t ${FRONTEND_IMAGE} ./frontend'
                    
                }
            }
        }
       
        stage('Push Docker Image') {
            steps {
                script {
                    // 使用凭证登录 Docker 镜像仓库
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker push ${FRONTEND_IMAGE}
                        '''
                    }
                }
            }
        }
        
        

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'kubectl delete -f k8s/frontend-deployment.yaml --ignore-not-found' 
                    // 应用 Kubernetes 配置
                    sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                }
            }
        }

        stage('Service to Kubernetes') {
            steps {
                script {
                    // 应用 Kubernetes 配置
                    sh 'kubectl apply -f k8s/frontend-service.yaml'
                }
            }
        }

        
    }

    post {
        always {
            // 这里可以添加一些清理步骤，例如清理工作目录或通知
            sh 'docker system prune -f'
        }
        success {
            echo 'Build and deployment succeeded!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}
