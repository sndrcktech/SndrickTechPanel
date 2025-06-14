#!/bin/bash
set -e
NAME=sandricktechpanel
VER=1.0.0
ARCH=amd64
BUILD=build

rm -rf $BUILD
mkdir -p $BUILD/DEBIAN
mkdir -p $BUILD/usr/local/$NAME
mkdir -p $BUILD/etc/$NAME

cp -r backend/* $BUILD/usr/local/$NAME/
cp -r agent $BUILD/usr/local/$NAME/
cp -r roles $BUILD/etc/$NAME/
cp -r policies.yaml $BUILD/etc/$NAME/
cp -r topology.yaml $BUILD/etc/$NAME/
cp -r plugins $BUILD/usr/local/$NAME/
cp docker-compose.yml $BUILD/usr/local/$NAME/
cp README.md install.md $BUILD/usr/local/$NAME/
cp docs/SandrickTechPlatform-Guide.md $BUILD/usr/local/$NAME/

cat > $BUILD/DEBIAN/control <<EOF
Package: $NAME
Version: $VER
Architecture: $ARCH
Maintainer: sandricktech
Description: Universal infra panel with multi-VDS, swap, failover, docker, AI
EOF

cat > $BUILD/DEBIAN/postinst <<EOF
#!/bin/bash
systemctl enable sandricktechpanel
systemctl start sandricktechpanel
EOF
chmod +x $BUILD/DEBIAN/postinst

dpkg-deb --build $BUILD ${NAME}_${VER}_${ARCH}.deb
