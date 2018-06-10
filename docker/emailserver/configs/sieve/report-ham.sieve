# https://rspamd.com/doc/tutorials/feedback_from_users_with_IMAPSieve.html


require ["vnd.dovecot.pipe", "copy", "imapsieve", "environment", "variables"];
#require ["vnd.dovecot.pipe", "copy", "imapsieve"];
pipe :copy "rspamc" ["learn_ham"];
