# React-Spark-Starter
## Mac Package Manager
This document will refer to package managers where software can be installed
(e.g., `apt`). For those of you working on Macs, you are able to use the
Homebrew package manager, allowing you to install programs from the command
line, just like Linux. To install Homebrew:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

If the installation failed, ensure you meet the installation requirements
[here](https://docs.brew.sh/Installation.html). The page also has alternative
installation instructions if the above doesn't work. Once Homebrew is installed,
install packages like so:

```bash
brew update
brew install <package-name>
```

## Requirements
You must have Maven, a build tool for Java, and npm, a dependency manager for
JavaScript development, installed. **The lab machines already have these tools
installed.**

### Installing Java:
Whether working with Linux or Mac, we recommend directly downloading a JDK and
setting your `JAVA_HOME` environment variable rather than installing a JDK
with a package manager. Use at least version 8. A JDK may be downloaded from
https://jdk.java.net/ or from [Oracle's Site](https://www.oracle.com/technetwork/java/javase/downloads/index.html).

Once you've downloaded and unpacked your JDK (to a directory like `jdk-11/`),
you'll want to add the following lines to your `.bashrc` (`.bash_profile` for
Mac users):

```bash
export JAVA_HOME=/path/to/jdk
export PATH=$JAVA_HOME/bin:$PATH
```

Restart your terminal, and try to run `java -version`. You should see the
proper version coming from the JDK you installed.

### Installing Maven:
First, check to see if you already have Maven installed:

```bash
mvn --version
```

Maven should be available for install through your package manager. Binary
distributions are available form Maven's [homepage](https://maven.apache.org/)
as well. If you use the binary distribution, make sure to append the `bin/`
directory to your `PATH`, as shown above for Java.

Either way, **setting the `JAVA_HOME` variable as shown above is extremely
important,** as it tells Maven where to look for Java libraries needed to build
your project. `mvn --version` should report which JDK is in use.

### Installing npm
First, check to see if npm is already installed:

```bash
node -v
npm -v
```

npm is distributed with NodeJS. Installing Node will also install npm.

#### Installing with [NVM](https://github.com/creationix/nvm)
Node Version Manager is a great project that helps you install and keep track
of different NodeJS versions. Its use is recommended, as it supports both Mac
and Linux. Follow the instructions on the repository's [front page](https://github.com/creationix/nvm).
You should only need to run a single command to download and execute the
installation script, then you only need to restart your terminal.

Once NVM has been installed (check with `nvm --version`), you can install the
latest LTS release of NodeJS with the following:

```bash
nvm install --lts
# See what got installed
nvm list
# Check again if you have NodeJS and npm now (you may need to restart your terminal)
node -v
npm -v
```

#### Installing with Package Manager
If you would prefer to use a package manager to install NodeJS, then for Mac:

```bash
brew install node
```

And for Linux, find instructions for your particular distro
[here](https://nodejs.org/en/download/package-manager/).

## Loading in IntelliJ
[IntelliJ](https://www.jetbrains.com/idea/) is the IDE our company will be
using. It has better support for the tools we will be using than Eclipse.

### Creating an account
As students, you can get a license for the ultimate edition of IntelliJ for
free. You'll need a free JetBrains student account. You can sign up for one
[here](https://www.jetbrains.com/student/).

### Home installation
There are two versions of IntelliJ, the Community Edition and the Ultimate
Edition. Either should work for the scope of this project, but the Ultimate
Edition integrates better with JavaScript code. As mentioned above, students
have free access to the Ultimate Edition and other Jetbrains products. Either
edition can be downloaded [from the Jetbrains website](https://www.jetbrains.com/idea/download/#section=windows).

### Launching IntelliJ
IntelliJ is available on the lab machines under the command:

```
/usr/local/idea/bin/idea.sh
```

If you don't want to remember this, you can add an alias to `~/.bashrc`:

```bash
alias intellij="/usr/local/idea/bin/idea.sh"
```

Restart your terminal, and now you can simply type `intellij` to launch.

### Opening the Project
When first opening IntelliJ, a window should open inviting you to open a
project. Select "Check out from version control" and continue to select "GitHub"
from the dropdown.

Refer to our [GitHub guide](https://github.com/csucs314s19/tripco/tree/master/guides/git/IntelliJ.md)
for more information on how to clone your project from IntelliJ.

Because we are using Maven, IntelliJ should automatically import all of the
necessary dependencies for the project. This sometimes takes a while, so be
patient. If you need to set your project JDK, refer to the documentation
[here](https://www.jetbrains.com/help/idea/configuring-build-jdk.html).

### Building in IntelliJ
For the most part, the run script should be comprehensive enough to build your
project. [Here are some visual instructions on opening a terminal in IntelliJ](https://www.jetbrains.com/help/idea/working-with-tool-windows.html#tool_window_quick_access).
In separate [guides](https://github.com/csucs314s19/tripco/tree/master/guides)
we'll show you how to set up run configurations to run and debug within
IntelliJ.

## Starting the Production Server
The easiest way to run the server and make sure everything works is to use the
run script:

```bash
./run.sh
```

This will install all npm dependencies (if they haven't been already), bundle
together all of the Javascript source, compile and test your Java Code, package
everything into a single JAR, and start running the server on the default port
`8088`. Visit `http://localhost:8088` to see the webpage.

**The project should build in its initial state. If it does not, ensure that you
have all the dependencies above installed, `PATH`s set, etc.**

If you want to run the JAR on a port other than `8088`, then specify an
environment variable when you invoke the script:

```bash
PORT=31400 ./run.sh
```

Investigate what the run scripts actually do to better understand how our system
is built. All of the commands they run can be run manually as well, to perform a
single step of the build operation only.

## Using the Hot Server
The Webpack dev server allows you to make changes to your JavaScript code
without repackaging it. Additionally, every time you change a file and save it,
the browser that you're viewing the project in will automatically refresh. Note
that this server runs as a process that is completely separate from your JAR.

To use it, first package and run your JAR:

```bash
# Package Java code
mvn package
# Run the JAR on the port you specify
java -jar target/server-0.1.jar [serverPort]
```

Next, adjust the `const server_port = 31400`; line in
`client/webpack.dev.config.js` to match the port that the JAR is running on, or
restart the JAR to run on `31400`.

Now, in a separate terminal, start the development server:

```bash
cd client
# This assumes that npm dependencies have been installed (the node_modules
# directory exists)
npm run dev
```

Your default browser should open automatically and display the project's
homepage after a few seconds (notice that it is running on `localhost:31401`).
If you see an error banner displayed at the top, it is likely that your JAR is
running on an unexpected port, or is not running at all.
