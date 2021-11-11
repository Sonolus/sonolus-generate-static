# sonolus-generate-static

CLI tool to generate static Sonolus server from repository and database.

## Links

-   [Sonolus Website](https://sonolus.com)
-   [Sonolus Wiki](https://wiki.sonolus.com)
-   [sonolus-pack](https://github.com/Sonolus/sonolus-pack)
-   [sonolus-express](https://github.com/Sonolus/sonolus-express)

## Static Sonolus Server

While static Sonolus servers are easy to host and prepare, it has significant user experience disadvantages:

-   No Sonolus client version checking.
-   No localization according to user language.
-   No search or pagination.
-   All contents will be shown in one page.

It is recommended to develop with [sonolus-express](https://github.com/Sonolus/sonolus-express) instead.

## Usage

### `npx`

Use `npx` to execute without installing.

Generating using default options:

```
npx sonolus-generate-static
```

Use `-h` to see a list of available options:

```
npx sonolus-generate-static -h
```

### Install Globally

Installing globally (only need once):

```
npm i -g sonolus-generate-static
```

`sonolus-generate-static` will become available to use:

```
sonolus-generate-static -h
```

## Input

It is recommended to use [sonolus-pack](https://github.com/Sonolus/sonolus-pack) to prepare input.

Input contains:

-   `/db.json` contains information of items.
-   `/repository` contains processed resources.

## Output

Output can be statically served by a web server, and Sonolus client can connect to and play.
