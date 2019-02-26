# kubernetes-prometheus-Alertmanager
Configuration files for setting up prometheus monitoring on Kubernetes cluster and alertmanager

Source files are taken from following site. https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/


    In copper Email solution we deploy this solution as a series of kubectl commands.
    You may see various command that should be used for managing prometheus based alertmanager.

#   prometheus-alert

-   kubectl create namespace monitoring
-   kubectl create -f prometheus-alert/clusterRole.yaml
-   kubectl create -f prometheus-alert/config-map.yaml -n monitoring
-   kubectl create  -f prometheus-alert/prometheus-deployment.yaml --namespace=monitoring

## check all pods in monitoring namespace
-   kubectl get deployments --namespace=monitoring

-   kubectl get pods --namespace=monitoring
-   kubectl port-forward prometheus-deployment-67d56fb57f-j5ldz 8989:9090 -n monitoring

-   kubectl create -f prometheus-alert/prometheus-service.yaml --namespace=monitoring


## alert manager
-   kubectl create -f prometheus-alert/AlertManagerConfigmap.yaml
-   kubectl create -f prometheus-alert/AlertTemplateConfigMap.yaml
-   kubectl create -f prometheus-alert/Deployment.yaml
-   kubectl create -f prometheus-alert/Service.yaml

## how to get services in monitoring namespace
-   kubectl get services --namespace=monitoring
-   kubectl get configmap --namespace=monitoring


## deleting services
-   kubectl delete services alertmanager --namespace=monitoring
-   kubectl delete services prometheus-service --namespace=monitoring
## deleting configmaps
-   kubectl delete configmap alertmanager-config --namespace=monitoring
-   kubectl delete configmap alertmanager-templates --namespace=monitoring
-   kubectl delete configmap prometheus-server-conf --namespace=monitoring
## deleting cluster roll
-   kubectl delete clusterroles prometheus
-   kubectl delete clusterrolebindings prometheus
## deleting deployments
-   kubectl delete deployment alertmanager --namespace=monitoring
-   kubectl delete deployment prometheus-deployment --namespace=monitoring


