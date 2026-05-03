FROM docker.io/debian:13

ARG DEBIAN_FRONTEND=noninteractive

# Basic system utilities
ARG LANG=en_US.UTF-8
ENV LANG="$LANG"
RUN --mount=type=cache,id=apt,target=/var/cache \
    --mount=type=cache,id=log,target=/var/log \
    # force-remove the lock file manually, since the pids on rebuilds will be the same, so apt does think the process is still running
    rm -vf /var/cache/apt/archives/lock && \
    apt-get update -y && \
    # start with installing locale to avoid lots of warnings
    LANG=C apt-get install -y locales && \
    echo "$LANG UTF-8" > /etc/locale.gen && \
    locale-gen && \
    apt-get install -y \
        bash-completion \
        catatonit \
        curl \
        git \
        htop \
        jq \
        locales \
        nano \
        procps \
        screen \
        strace \
        unzip \
        which \
        xz-utils \
        zstd

# Create a user that matches the regular account
ARG USER="demo"
ARG XDG_RUNTIME_DIR="/run/user/1000"
ENV HOME="/home/$USER"
RUN useradd "$USER" && \
    mkdir -p "$HOME/.local/share/containers" && \
    chown $USER:$USER -R "$HOME"

# Setup podman to work inside another rootless container, based on
# https://github.com/containers/image_build/blob/7afbb776a06a7de7ab2a73bab7066538e36d74a5/podman/Containerfile.
ENV BUILDAH_ISOLATION="chroot"
VOLUME "/var/lib/containers"
VOLUME "$HOME/.local/share/containers"
ADD /containers.conf /etc/containers/
RUN --mount=type=cache,id=apt,target=/var/cache \
    --mount=type=cache,id=log,target=/var/log \
    rm -vf /var/cache/apt/archives/lock && \
    apt-get install -y podman && \
    echo -e "root:1:65535\n$USER:1:999\n$USER:1001:64535" > /etc/subuid && \
    echo -e "root:1:65535\n$USER:1:999\n$USER:1001:64535" > /etc/subgid && \
    # newuidmap/newgidmap are setuid/setgid on Debian, which doesn't work inside a podman container, set capabilities instead \
    setcap cap_setuid=ep /usr/bin/newuidmap && chmod 755 /usr/bin/newuidmap && \
    setcap cap_setgid=ep /usr/bin/newgidmap && chmod 755 /usr/bin/newgidmap && \
    # Copy & modify the defaults to provide reference if runtime changes needed. \
    # Changes here are required for running with fuse-overlay storage inside container. \
    sed -e 's|^#mount_program|mount_program|g' \
        -e '/additionalimage.*/a "/var/lib/shared",' \
        -e 's|^mountopt[[:space:]]*=.*$|mountopt = "nodev,fsync=0"|g' \
        /usr/share/containers/storage.conf \
        > /etc/containers/storage.conf && \
    mkdir -p /var/lib/shared/overlay-images \
             /var/lib/shared/overlay-layers \
             /var/lib/shared/vfs-images \
             /var/lib/shared/vfs-layers && \
    touch /var/lib/shared/overlay-images/images.lock && \
    touch /var/lib/shared/overlay-layers/layers.lock && \
    touch /var/lib/shared/vfs-images/images.lock && \
    touch /var/lib/shared/vfs-layers/layers.lock &&\
    # provide the socket at Docker's default location \
    ln --symbolic "$XDG_RUNTIME_DIR/podman/podman.sock" /var/run/docker.sock

# System libraries for GUI applications
RUN --mount=type=cache,id=apt,target=/var/cache \
    --mount=type=cache,id=log,target=/var/log \
    rm -vf /var/cache/apt/archives/lock && \
    apt-get install -y \
      fonts-noto-color-emoji \
      libwayland-client0 \
      libwayland-cursor0 \
      wl-clipboard

# Basic project dependencies: Node 24 and corepack
ENV NODE_VERSION=24.15.0
RUN curl --fail-with-body "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
    | tar \
      --extract \
      --xz \
      --directory=/usr/local \
      --strip-components=1 && \
    node --version && \
    corepack enable npm yarn pnpm

# Additional demo stuff
RUN --mount=type=cache,id=apt,target=/var/cache \
    --mount=type=cache,id=log,target=/var/log \
    rm -vf /var/cache/apt/archives/lock && \
    apt-get install -y \
        dolphin \
        konsole \
        kate \
        xterm \
        x11-apps

USER "$USER"
WORKDIR "$HOME"

COPY ./entrypoint.sh /
ENTRYPOINT ["/usr/bin/catatonit", "--", "/entrypoint.sh"]
