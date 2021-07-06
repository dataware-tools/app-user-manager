# app-user-manager

Web-application for managing users' roles and permissions.


## How to build docker-image

```bash
$ export DOCKER_BUILDKIT=1
$ docker build -t app-user-manager --ssh default .

```

On MacOS, you may have to run the following commands before building the image.

```bash
$ ssh-add

```

## How to run docker-container

After building the image

```bash
$ dc up
```

If you want to change Auth0's configurations (i.e., client-id, domain, etc.),
you need to set the following environment variables:

- `NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_DOMAIN`: Domain (default: `dataware-tools.us.auth0.com`)
- `NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_ID`: Client ID (default: the one for the demo page)
- `NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_API_URL`: API URL (default: `https://demo.dataware-tools.com/`)
- `NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_MANAGE_PAGE`: User management URL (default: `https://manage.auth0.com/dashboard/us/dataware-tools/users`)

## Getting started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn more about Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## How to create this template?

TODO: write this.

### 1. Execute create-next-app

This template bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### 2. Install and initialize eslint

Allow [official Getting Started](https://eslint.org/docs/user-guide/getting-started).

This template answer for question to initialize eslint config like below. Below is example.

```
❯ npx eslint --init
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · standard
✔ What format do you want your config file to be in? · JavaScript
Checking peerDependencies of eslint-config-standard@latest
The config that you've selected requires the following dependencies:

eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest eslint-config-standard@latest eslint@^7.12.1 eslint-plugin-import@^2.22.1 eslint-plugin-node@^11.1.0 eslint-plugin-promise@^4.2.1 @typescript-eslint/parser@latest
✔ Would you like to install them now with npm? · No / Yes
```

### 3. Add eslint rules, extends, plugin.

[Explanation of defference between rules, extends, plugin is here.](https://blog.ojisan.io/eslint-plugin-and-extend)

Below is example. (Probably, some plugin was already configured when initializing eslint)

- [eslint:recommended](https://eslint.org/docs/rules/)
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
- [standard-with-typescript](https://github.com/standard/eslint-config-standard-with-typescript)
- [eslint-plugin-eslint-comments](https://mysticatea.github.io/eslint-plugin-eslint-comments/)
- [eslint-plugin-imort](https://github.com/benmosher/eslint-plugin-import)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- eslint-plugin-compat

### 4. Install and initialize prettier.

Allow [official Getting Started](https://prettier.io/docs/en/install.html).

Note that [You may need to configure eslint](https://prettier.io/docs/en/install.html#eslint-and-other-linters).

### 5. Configure prettier

Configure your favorite [options](https://prettier.io/docs/en/options.html).

I think default options is better for many people (not best). Beacuse prettier team decided default value by deep thinking, probably.

### 6. Add editorconfig file

See [official site](https://editorconfig.org/)

### 7. Add recomended extensions for editor

Example for VSCode.

- [mgmcdermott.vscode-language-babel](https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel)
- [ms-azuretools.vscode-docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [editorconfig.editorconfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [aaron-bond.better-comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- stylelint-plugin
