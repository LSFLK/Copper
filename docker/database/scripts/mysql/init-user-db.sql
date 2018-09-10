USE mail;
INSERT INTO domains (domain) VALUES ('lsf.cu.tld');
INSERT INTO users (email, password) VALUES ('info@lsf.cu.tld', ENCRYPT('password'));
INSERT INTO users (email, password) VALUES ('admin@lsf.cu.tld', ENCRYPT('password'));
INSERT INTO users (email, password) VALUES ('support@lsf.cu.tld', ENCRYPT('password'));
quit
