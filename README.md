
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

## CI/CD and Releases

This project uses a fully automated CI/CD pipeline with GitHub Actions and semantic-release for versioning, changelog generation, and artifact publishing. All commits must follow the [Conventional Commits specification](https://www.conventionalcommits.org/) to enable automatic versioning.

For detailed information about the CI/CD workflow, release process, branch strategy, and deployment, see **[CI-CD.md](CI-CD.md)**.

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

## Contributing

To contribute to this project:

1. Create a feature branch from `dev`
2. Make your changes following the project conventions
3. Write commit messages using [Conventional Commits](https://www.conventionalcommits.org/)
4. Open a Pull Request to `dev`

For commit message examples and detailed CI/CD workflow information, see [CI-CD.md](CI-CD.md).
