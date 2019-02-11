#!/usr/bin/env bash

# ldapmodify -D "cn=admin,cn=config" -x -w xxx -f ./changes.ldif
ldapmodify -Y EXTERNAL -H ldapi:/// -f /changes.ldif

tail -f /dev/null