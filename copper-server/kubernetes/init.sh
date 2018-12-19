### Webmail - rainloop commands

kubectl create -f deployment.yaml
kubectl expose deployment rainloop-deployment --type=NodePort

### OpenLDAP commands

kubectl create -f ldap-deployment.yaml
kubectl create -f ldap-service.yaml

### phpOpenLDAP commands

kubectl create -f phpldapadmin-ReplicationController
kubectl create -f phpldapadmin-service.yaml
kubectl expose rc phpldapadmin-controller --type=NodePort

