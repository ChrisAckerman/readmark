# Readmark

View rendered markdown documents in your browser. Use it to live preview your
own documentation, or to view someone elses.

## Install

```sh
npm install -g readmark
```

## Usage

```sh
cd path/to/source/root
readmark [port]
```

Starts serving files in the working directory. The optional `port` argument
defaults to 8080.

Readmark will attempt to reconnect for live updating to any browser windows that
were already open. If nothing reconnects within a second, readmark will open a
browser window for you to the home url.

## Features

### Relative Paths

Navigate to links relative to the working directory.

### Live Update

Any changes to markdown files will be automatically reflected in the browser
window.

### Syntax Highlighting

Fenced code blocks are highlighted using
[highlight.js](https://highlightjs.org).

### Directory Listing

View a list of all files in the current path.

<img src="/readmark/images/directory.png" alt="Toggle Directory Listing">

### Node Modules Listing

View a list of modules installed in the working directory.

<img src="/readmark/images/modules.png" alt="Node Modules Listing">

## Customization

I didn't go in depth with customization options. This was intended for my
personal use, and I wanted Github like styling, relative linking, and syntax
highlighting.

If there is a "readmark.js" file in the working directory, it will be required
and there will be a readmark global which is the express app. The listener won't
automatically be started in this case.

Example "readmark.js" file:

```js
// Listen on all endpoints instead of just 127.0.0.1 (localhost).
global.readmark.listen(8080);
```

The readmark global is the express app, but the http server, socket.io manager,
and mustache views are also available.

```js
global.readmark.server; // The HTTP server.
global.readmark.io; // The Socket.io manager.
global.readmark.views; // A map of the mustache views that Readmark will use.
```

There are also two methods on the readmark global:
* `readmark.listen(...)` which is just an alias for `readmark.server.listen(...)`
* `readmark.close()` which is the prefered way to gracefully shutdown the
server.

## Caveats

The "/readmark/" path is reserved for serving content built-in to the Readmark
module. If for some reason the working directory also has a "readmark"
sub-directory, it will not be accessible.