#!/bin/sh
cd $TRAVIS_BUILD_DIR/project
sbt ++$TRAVIS_SCALA_VERSION package
