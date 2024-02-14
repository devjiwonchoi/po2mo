#!/bin/bash

# Define the directory to install the binary
INSTALL_DIR="$HOME/bin"

# Ensure the installation directory exists
mkdir -p "$INSTALL_DIR"

# Download the executable file
curl -fsSL https://github.com/devjiwonchoi/po2mo/blob/main/exec/po2mo-macos -o "$INSTALL_DIR/po2mo"

# Make the downloaded file executable
chmod +x "$INSTALL_DIR/po2mo"

# Add the installation directory to the PATH
echo "export PATH=\"\$PATH:$INSTALL_DIR\"" >> ~/.bash_profile
source ~/.bash_profile  # Apply changes to the current terminal session

# Now users can directly use the 'po2mo' command
po2mo

# Note: You may want to clean up the downloaded file if needed
# rm "$INSTALL_DIR/po2mo"
