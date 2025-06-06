
# Riksdagsdebatter.se Frontend

This repository contains the frontend application for [Riksdagsdebatter.se](https://riksdagsdebatter.se/), a website for searching and analyzing the debates of the Swedish Parliament.

## Technology Stack

This project is a modern single-page application (SPA) built with a focus on rich data visualization and a responsive user interface. The core technologies used are:

*   **[Vue.js (v3)](https://vuejs.org/)**: A progressive JavaScript framework for building user interfaces.
*   **[Quasar Framework (v2)](https://quasar.dev/)**: A high-performance Vue.js framework that allows us to build a responsive SPA, with a rich set of pre-built UI components.
*   **[Pinia](https://pinia.vuejs.org/)**: The official state management library for Vue.js, used to manage application-wide state in a simple and intuitive way.
*   **[Axios](https://axios-http.com/)**: A promise-based HTTP client used for all communication with the backend API to fetch debate data and metadata.
*   **[Highcharts](https://www.highcharts.com/) & [ApexCharts](https://apexcharts.com/)**: Two powerful charting libraries used to create interactive and visually appealing data visualizations, such as timelines and statistical charts.
*   **[pnpm](https://pnpm.io/)**: A fast, disk space-efficient package manager for Node.js.

## Automated Release and Deployment

This project uses a sophisticated, fully automated CI/CD pipeline built with GitHub Actions and `semantic-release`. This process handles versioning, changelog generation, and publishing of release artifacts without any manual intervention.

### How It Works

The entire release process is triggered automatically whenever code is pushed to the `main` branch. Here is a step-by-step breakdown of the automated workflow:

1.  **Commit Convention Enforcement:** The process relies on the **[Conventional Commits specification](https://www.conventionalcommits.org/)**. Every commit message must follow a specific format (e.g., `feat: ...`, `fix: ...`, `docs: ...`). This is the cornerstone of the automation, as it allows `semantic-release` to understand the impact of every change.

2.  **Workflow Trigger:** A push to the `main` branch automatically triggers the `Release` workflow defined in `.github/workflows/release.yml`.

3.  **Version Calculation:** The workflow uses `semantic-release` to analyze all commits since the last release. Based on the commit types (`feat` triggers a minor release, `fix` a patch, `BREAKING CHANGE` a major), it automatically determines the next semantic version number (e.g., `v1.2.3`).

4.  **Build and Package:** Once a new version is determined, the workflow executes the following steps:
    *   It builds the production-ready frontend application using `pnpm build`.
    *   The compiled static assets (from the `dist/spa` directory) are bundled into a compressed tarball (`.tar.gz`) named `frontend-v1.2.3.tar.gz`.

5.  **GitHub Release Creation:**
    *   `semantic-release` automatically creates a new **GitHub Release** corresponding to the new version tag.
    *   It generates a detailed **changelog** from the commit messages and adds it to the release notes.
    *   The `frontend-v1.2.3.tar.gz` artifact is uploaded to this GitHub Release, making the built assets available for download.

6.  **Docker Image Publishing:**
    *   A minimal Docker image is built using `FROM scratch`. This image contains only the compiled static frontend assets.
    *   This image is tagged with the new version (e.g., `v1.2.3`, `v1.2`, `v1`, and `latest`) and pushed to the **GitHub Container Registry (GHCR)**. This image is used by downstream services (like the backend API) to serve the frontend.

7.  **Git Tagging and Commit:**
    *   The `CHANGELOG.md` file in the repository is automatically updated.
    *   `semantic-release` commits the updated `CHANGELOG.md` and `package.json` files and pushes a new version tag (e.g., `v1.2.3`) to the `main` branch. This final commit is marked with `[skip ci]` to prevent the workflow from triggering itself in a loop.

### How to Contribute and Trigger a Release

To work with this automated system, you only need to focus on writing good code and even better commit messages.

1.  **Create a feature branch:**
    ```bash
    git checkout -b my-new-feature
    ```

2.  **Make your changes.**

3.  **Commit your work using the Conventional Commits specification.** This is the most important step.

    *   For a new feature that should result in a **minor** version bump (e.g., 1.2.0 -> 1.3.0):
        ```bash
        git commit -m "feat: add user profile page"
        ```

    *   For a bug fix that should result in a **patch** version bump (e.g., 1.2.0 -> 1.2.1):
        ```bash
        git commit -m "fix: correct alignment of login button"
        ```
        
    *   For documentation, CI, or refactoring changes that should **not** trigger a release:
        ```bash
        git commit -m "docs: update contribution guidelines"
        git commit -m "refactor: simplify component logic"
        ```

    *   For a change that introduces a **breaking change** and should result in a **major** version bump (e.g., 1.2.0 -> 2.0.0):
        ```bash
        git commit -m "feat: redesign navigation system
        
        BREAKING CHANGE: The main navigation component has been replaced. Old component 'TopNav' is removed in favor of 'SideNav'."
        ```

4.  **Push your branch and open a Pull Request** to `main`.

5.  Once your Pull Request is reviewed and **merged into `main`**, the automated release process will begin. You can monitor its progress in the "Actions" tab of the repository.

---

## Getting Started

### Local Development Setup

To set up the project for local development, follow these steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/humlab-swedeb/swedeb_frontend.git
    cd swedeb_frontend
    ```

2.  **Install pnpm:**
    If you don't have pnpm, install it globally:
    ```bash
    npm install -g pnpm
    ```

3.  **Install dependencies:**
    ```bash
    pnpm install
    ```

4.  **Run the development server:**
    This command starts the Quasar development server with hot-reloading.
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:9000` (or another port specified by Quasar).

### Key Scripts and Dependencies

The `package.json` file defines the core scripts and dependencies for this project.

#### Main Scripts
*   `pnpm dev`: Starts the local development server.
*   `pnpm build`: Compiles and bundles the application for production.
*   `pnpm lint`: Lints all `.js` and `.vue` files using ESLint to check for code quality issues.
*   `pnpm format`: Formats the entire codebase using Prettier to ensure consistent code style.

#### Key Production Dependencies (`dependencies`)
*   `quasar`: The core Quasar framework.
*   `vue`: The core Vue.js library.
*   `axios`: For making API requests to the backend.
*   `pinia`: For application state management.
*   `highcharts`, `apexcharts`: For data visualization.
*   `exceljs`, `jszip`: For exporting data to formats like Excel.
*   `vue-i18n`: For internationalization (handling multiple languages).
*   `vue-router`: For handling client-side routing.

#### Key Development Dependencies (`devDependencies`)
*   `@quasar/app-webpack`: The Quasar App CLI with Webpack, which manages the build process.
*   `eslint`, `prettier`: Tooling for code linting and formatting.
*   `semantic-release` and its plugins (`@semantic-release/*`): The suite of tools that power our entire automated release process.

### Local CI/CD Workflow Testing with `act`

Developers **do not** need to create any special tokens for the normal contribution process. The automated workflow on GitHub uses a built-in `GITHUB_TOKEN` provided by the Actions runner.

However, if you need to **test the CI/CD workflow locally** before pushing changes to it, you can use a tool called [**act**](https://github.com/nektos/act). Because `act` runs on your local machine, it needs a **GitHub Personal Access Token (PAT)** to interact with the GitHub API to download actions and avoid rate limiting.

#### Setting up `act` for Local Testing

1.  **Install `act`:** Follow the [official installation instructions](https://github.com/nektos/act#installation).

2.  **Create a Personal Access Token (PAT):**
    *   Go to your GitHub Settings -> [Developer settings](https://github.com/settings/developers) -> Personal access tokens -> **Tokens (classic)**.
    *   Generate a new token.
    *   Give it a descriptive name (e.g., `act-local-runner`).
    *   Grant it the **`repo`**, **`workflow`**, and **`write:packages`** scopes. The `write:packages` scope is required for the step that pushes a Docker image to GHCR.
    *   Copy the generated token (`ghp_...`). For convenience, you can save it to a file, for example `~/.ghcr_token`.

3.  **Run the Release Workflow Locally:**
    You can now simulate the `release` job from our workflow. Use the `-j` flag to specify the job ID and the `-s` flag to provide your PAT as a secret.

    ```bash
    act -j release -s GITHUB_TOKEN="$(cat ~/.ghcr_token)"
    ```

    *   `act` will run the job in a Docker container on your machine, mimicking the GitHub Actions environment.
    *   **Note:** By default, `act` runs in "dry-run" mode, meaning `semantic-release` will not actually publish anything. This is safe for testing.