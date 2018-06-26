#!/bin/sh
cd $TRAVIS_BUILD_DIR/docker
sbt ++$TRAVIS_SCALA_VERSION package
