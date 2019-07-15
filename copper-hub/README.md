# Copper-hub

This repository contains source code for copper-hub which is the alerting, monitoring and update handling system for Copper. 

First, create grafana docker image using ./grafana-image/Dockerfile. (Read the ./grafana-image/README.md before building image)
```
docker build -t graf .
```

## Quick start

To quickly start all the things just do this:

``` 
kubectl apply --filename ./prometheus-master/manifests-all.yaml

kubectl apply --filename ./prometheus-master/grafana.yaml
``` 

This will create the namespaces `monitoring` and `grafana` and will bring up all components there.

Use port 3000 to access grafana.

To shut down all components again you can just delete that namespace:

``` 
kubectl delete namespace monitoring

kubectl delete namespace grafana
``` 

After installing, it is must to create a datasource in grafana as "prometheus" and local URL would be "http://prometheus.monitoring.svc.cluster.local:9090/".

- Configure [Prometheus](https://grafana.net/plugins/prometheus) data source for Grafana.<br/>
`Grafana UI / Data Sources / Add data source`
  - `Name`: `prometheus`
  - `Type`: `Prometheus`
  - `Url`: `http://prometheus.monitoring.svc.cluster.local:9090/`
  - `Add`

Import the grafana dashboard from "./prometheus-master/grafana_dashboards/dashboard_1.json" to grafana.<br/>
- Import grafana dashboard.<br/>
`Dashboards / Manage / import`
  - `Name`: `Kubernetes Pod Resources`
  - `Location`: `/prometheus-master/grafana_dashboards/dashboard_1.json`
  - `import`

Then create a "Notification channel" to make sure that alert mails will receive for the right address.<br/>
- Create Notification channel.<br/>
`Alerting / Notification channels / New channel`
  - `Name`: `Email`
  - `Type`: `Email`
  - `Email addresses`: `Your email address`
  - `import`