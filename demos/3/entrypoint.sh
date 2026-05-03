#!/bin/sh

set -eu

# Remove IntelliJ and CEF lockfiles, since PIDs easily clash when they always start at 1 due to running in a container.
# The constant container name and isolated $HOME is enough to avoid multiple instances running at the same time.
rm -rfv "$HOME"/.config/JetBrains/*/.lock "$HOME"/.cache/JetBrains/*/jcef_cache/Singleton*

# Provide a docker-compatible socket
screen -dmS podman podman system service --time=0

# force wayland (default is auto-detect as of IntelliJ 2026.1)
INTELLIJ_OPTS="${INTELLIJ_OPTS:-} -Dawt.toolkit.name=WLToolkit"

# work around WSLg bug (see https://youtrack.jetbrains.com/issue/JBR-10006/Wayland-in-WSL-Shadow-Artifacts-in-GUI)`
INTELLIJ_OPTS="${INTELLIJ_OPTS:-} -Dsun.awt.wl.Shadow=false"

# shellcheck disable=SC2086 # intentionally passing the options as separate arguments
exec "$HOME/idea/bin/idea" $INTELLIJ_OPTS
