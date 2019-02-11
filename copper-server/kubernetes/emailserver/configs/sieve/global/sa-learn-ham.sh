#!/bin/sh
exec /usr/bin/rspamc -h /run/rspamd/worker-controller.socket -P <secret> learn_ham
