# Marketplace Brandfolder App

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)

A Contentstack marketplace app that integrates Brandfolder DAM with Contentstack's content management system. This React-based application provides App Configuration, Custom Field, Selector Page, and JSON RTE locations for browsing and embedding Brandfolder assets.

## 🎨 Features

- **App Configuration**: Configure app settings and Brandfolder connection from the Config Screen
- **Custom Field**: Embed and manage Brandfolder assets in entry fields (card and list views)
- **Selector Page**: Full-page asset picker for choosing Brandfolder assets
- **JSON RTE**: Rich text editor extension for inserting Brandfolder assets
- **TypeScript**: Fully typed for better development experience
- **Testing**: Unit tests with Jest
- **Modern UI**: Clean interface using Contentstack's Venus components and Brandfolder Panel SDK

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm
- [Contentstack Account](https://app.contentstack.com/#!/login)
- Brandfolder account (for DAM integration)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/contentstack/marketplace-brandfolder-app.git
cd marketplace-brandfolder-app

# Install dependencies (root)
npm install

# Install UI dependencies
cd ui
npm install
cd ..
```

### Environment Variables

Rename `.env.example` to `.env` in both `ui/` and `ui/rte/`, then set:

**UI** (`ui/.env`):

```
VITE_CUSTOM_FIELD_URL=YOUR_CUSTOM_FIELD_DOMAIN_URL
VITE_REGION_MAPPING='{"NA": {"JSON_RTE_URL": "https://rte-extension.contentstack.com"},"EU": {"JSON_RTE_URL": "https://eu-rte-extension.contentstack.com"},"AZURE_NA": {"JSON_RTE_URL": "https://azure-na-rte-extension.contentstack.com"},"AZURE_EU": {"JSON_RTE_URL": "https://azure-eu-rte-extension.contentstack.com"},"GCP_NA": {"JSON_RTE_URL": "https://gcp-na-rte-extension.contentstack.com"}}'
```

**RTE** (`ui/rte/.env`):

```
REACT_APP_CUSTOM_FIELD_URL=YOUR_CUSTOM_FIELD_DOMAIN_URL
REACT_APP_REGION_MAPPING='{"NA": {"JSON_RTE_URL": "https://rte-extension.contentstack.com"},"EU": {"JSON_RTE_URL": "https://eu-rte-extension.contentstack.com"},"AZURE_NA": {"JSON_RTE_URL": "https://azure-na-rte-extension.contentstack.com"},"AZURE_EU": {"JSON_RTE_URL": "https://azure-eu-rte-extension.contentstack.com"},"GCP_NA": {"JSON_RTE_URL": "https://gcp-na-rte-extension.contentstack.com"}}'
```

### Development

```bash
# Start UI development server (from repo root: cd ui first)
cd ui
npm start
# UI runs on port 4000

# Start RTE webpack server (separate terminal, from ui/rte)
cd ui/rte
npm install
npm start
# RTE runs on port 1268

# Lint and format (from ui/)
npm run lint:fix
npm run prettify
```

**Windows:** Use `npm run winStart` in `ui/` instead of `npm run start` if needed.


### E2E Testing (Playwright)

E2E tests run at the repository root and require the main app to be available at `APP_HOST_URL` (e.g. `http://localhost:4000` after `cd ui && npm start`).

**Required environment variables** (set in `.env` at root or export before running):

- `CONTENTSTACK_LOGIN` – Contentstack user email
- `CONTENTSTACK_PASSWORD` – Contentstack password
- **If MFA is enabled:** `CONTENTSTACK_MFA_SECRET` (base32 TOTP secret, best for automation) **or** `CONTENTSTACK_TFA_TOKEN` (single 6-digit code from your authenticator; expires quickly)
- `BASE_API_URL` – Contentstack API host (e.g. `https://api.contentstack.io`)
- `DEVELOPER_HUB_API` – Developer Hub API host (e.g. `https://api.contentstack.io`)
- `CONTENTSTACK_ORGANIZATION_UID` – Organization UID
- `APP_HOST_URL` – URL where the app is served (e.g. `http://localhost:4000`)
- `STACK_API_KEY` – Stack API key for install and content type/entry creation

**Optional:** `APP_BASE_URL`, `ENV_URL` (Contentstack app URL for entry edit), `BASIC_AUTH_USERNAME` / `BASIC_AUTH_PASSWORD`, `BRANDFOLDER_APP_NAME` (extension name for lookup), `INSTALL_VIA_MARKETPLACE`, `STACK_NAME`, `USE_GLOBAL_TEARDOWN`.

**Run E2E:**

```bash
# From repo root
npm run test:chrome
npm run test:firefox
npm run test:safari
npm run test:chrome-headed   # headed browser
npm run show-report          # open last HTML report
```

Run global setup first (login and auth token); it runs automatically before the test suite. To enable remote cleanup (uninstall app, delete content type) after the run, set `USE_GLOBAL_TEARDOWN=true`.

### Building for Production

```bash
# Build and package (from repo root)
bash build.sh
# Output: to-deploy/ui.zip (contains ui/build/ and RTE build)
```

To build without the script:

```bash
cd ui
npm run build

cd ui/rte
npm run build
```

Upload contents of `ui/build/` (and RTE assets as required) to your static host (e.g. S3).

## 🏗️ Project Structure

```
marketplace-brandfolder-app/
├── ui/
│   ├── src/
│   │   ├── common/
│   │   │   ├── contexts/          # React contexts (MarketplaceApp, AppConfig, ConfigState, CustomField)
│   │   │   ├── providers/         # Context providers
│   │   │   ├── utils/             # Utility functions
│   │   │   └── constants/
│   │   ├── components/            # Reusable components (ErrorBoundary, Loaders, etc.)
│   │   ├── containers/
│   │   │   ├── App/               # Main app router (HashRouter, routes)
│   │   │   ├── ConfigScreen/      # App Configuration UI
│   │   │   ├── CustomField/       # Custom Field (card/list)
│   │   │   └── SelectorPage/      # Selector Page UI
│   │   ├── root_config/           # Root config components for App Config & Custom Field
│   │   ├── __tests__/             # Jest unit tests
│   │   └── index.tsx              # Entry point
│   ├── rte/                       # JSON RTE plugin (Webpack, separate build)
│   │   └── src/
│   │       └── plugin.tsx         # RTE plugin entry
│   ├── index.html                 # HTML entry (Vite)
│   ├── vite.config.ts             # Vite configuration
│   ├── jest.config.js             # Jest configuration
│   └── package.json
├── build.sh                       # Builds ui + ui/rte, outputs to-deploy/ui.zip
├── TEMPLATE.md                    # Detailed app configuration and DAM setup
└── package.json                   # Root scripts and husky
```

## 🔌 Providers (React Context)

- **MarketplaceAppProvider**: Initializes Contentstack App SDK and shares it via `MarketplaceAppContext`.
- **AppConfigProvider**: Manages installation and config state from rootConfig via `AppConfigContext`.
- **ConfigStateProvider**: Local state for Config Screen UI via `ConfigStateContext`.
- **CustomFieldProvider**: State and data for Custom Field location via `CustomFieldContext`.

## 🪝 Hooks

- **useAppLocation**: Returns the location name and location instance from the app SDK (from `MarketplaceAppContext`).

## 🛣️ Routes

Routes map to UI locations; components are lazy-loaded.

| Path             | UI Location   | Source (container)     |
|------------------|---------------|-------------------------|
| `/config`        | Config Screen | `containers/ConfigScreen` |
| `/custom-field`  | Custom Field  | `containers/CustomField`  |
| `/selector-page` | Selector Page | `containers/SelectorPage` |

**Adding a route:** Create the container, lazy-import it in `ui/src/containers/App/index.tsx`, and add a `<Route>` inside `<Routes>` wrapped in `<Suspense>` and any required providers.

## 🎨 Styling

The app uses **SCSS** for styling. Venus component styles are imported from `@contentstack/venus-components/build/main.css`.

## 📍 Source Code for UI Locations

| UI Location   | Page Source                                              |
|---------------|----------------------------------------------------------|
| Config Screen | `ui/src/containers/ConfigScreen/index.tsx`               |
| Custom Field  | `ui/src/containers/CustomField/index.tsx`                |
| Selector Page | `ui/src/containers/SelectorPage/index.tsx`               |
| RTE           | `ui/rte/src/plugin.tsx`                                  |

## 🌐 Creating an App in Developer Hub / Marketplace

1. Open [Developer Hub](https://app.contentstack.com/#!/developerhub) (or [EU](https://eu-app.contentstack.com/#!/developerhub), [Azure NA](https://azure-na-app.contentstack.com/#!/developerhub), [Azure EU](https://azure-eu-app.contentstack.com/#!/developerhub)).
2. Click **+ New App** → choose **Stack App** → set name and description. See [App Submission and Approval Guide](https://www.contentstack.com/docs/developers/marketplace-platform-guides/app-submission-and-approval-guide) to make the app public.
3. In **Basic Information**, add the app icon.
4. In **UI Locations**, set the app URL (e.g. `https://localhost:4000` for local UI).
5. Add locations and paths (use HashRouter paths):
   - **App Configuration**: path `/#/config`
   - **Custom Field**: path `/#/custom-field`, Data Type **JSON**
   - **JSON RTE**: path `/[your-app-name].js` (localhost: `https://localhost:1268/[your-app-name].js`). For production, use your hosted RTE script path (e.g. `/dist/[your-app-name].js`).
6. Enable **Signed** and **Enabled** where needed; add descriptions if desired.
7. Click **Install App** and select the stack.

> **Note:** Paths in `ui/src/containers/App/index.tsx` must match the paths set in Developer Hub.  
> For local development, JSON RTE uses a different port (1268). You can temporarily set App URL to `https://localhost:1268` and use path `/[your-app-name].js` for RTE; in that case Config and Custom Field locations will not be available from that URL.

## 🛠️ Development

### Adding New Features

1. Create a feature branch from `main`
2. Implement changes
3. Add or update tests
4. Update documentation
5. Submit a pull request

### Code Style

- **ESLint** for linting (Airbnb + Prettier)
- **Prettier** for formatting
- **Husky** for git hooks; **precommit** runs prettify and lint:fix in `ui/`

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Brandfolder asset filters
fix: resolve custom field save issue
docs: update README with env vars
test: add ConfigScreen tests
refactor: simplify CustomFieldProvider
```

## 📦 Deployment

### Contentstack Marketplace

1. Run `bash build.sh` (or build `ui/` and `ui/rte/` as above).
2. Upload the built assets (e.g. from `to-deploy/ui.zip` or `ui/build/`) to your static host (e.g. AWS S3).
3. Set the app URL and paths in Developer Hub to your deployed URLs.
4. Install the app in your stack.

### Local Development

1. `npm install` (root and `ui/`, `ui/rte/` as needed).
2. Configure `.env` in `ui/` and `ui/rte/`.
3. Run `npm start` in `ui/` for the main app; run `npm start` in `ui/rte/` for the RTE.

## 🤝 Contributing

We welcome contributions.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
npm install
cd ui && npm install
cd ui/rte && npm install
# Set .env in ui/ and ui/rte/
cd ../.. && cd ui && npm start
```

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Contentstack](https://www.contentstack.com/) for the marketplace platform
- [Marketplace DAM App Boilerplate](https://www.contentstack.com/docs/developers/developer-hub/marketplace-dam-app-boilerplate)
- [Vite](https://vitejs.dev/) for the build tool

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/contentstack/marketplace-brandfolder-app/issues)
- **Documentation**: [Contentstack Developer Hub](https://www.contentstack.com/docs/developers)
- **Community**: [Contentstack Community](https://community.contentstack.com/)

---

Made with ❤️ by the Contentstack team
