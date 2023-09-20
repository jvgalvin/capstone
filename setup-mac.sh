/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install pyenv
pyenv install -v 3.9.17
pyenv shell 3.9.17
pip install tensorflow-macos
pip install tensorflow-metal
cd ./project
rm poetry.lock
poetry install