# Logging Infrastructure

This is a sample setup for automated logging with the elastic stack on Kubernetes.

It uses:

* Elasticsearch for storing and searching logs.
* Kibana for viewing them.
* Logstash for analysing and breaking down logs.
* Filebeat for pushing all app logs to logstash.
* Metricbeat for pushing node analytics to elasticsearch.
* Curator for regularly deleting old logs.

Elasticsearch is installed as a StatefulSet so that there is some
awareness betwee them.

Filebeat and Metricbeat instances are installed as DaemonSets, 
meaning there is one for every node we have. This is because they
read the logs right off the node. Without this we would miss logs 
from some nodes.

## Installation

Firstly update the [kibana-deployment.yaml]() file so that the ingress
route matches one that points at your cluster.

To install this on a cluster apply all the files.

It's safest to do the elasticsearch files first and wait for the 
pods to start up as the logstash pod will fail if it cannot connect 
to the elasticsearch instance and will need to be restarted.

Nothing else matters order wise.

If you want to live life dangerously simply run the following from 
the directory above this one:

    kubectl apply -f kubernetes-elastic-logging
