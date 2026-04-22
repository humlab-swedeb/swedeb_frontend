
# Riksdagsdebatter.se Frontend

This repository contains the frontend application for [Riksdagsdebatter.se](https://riksdagsdebatter.se/), a website for searching and analyzing the debates of the Swedish Parliament 1867-2022.

## Features

- **Full-text search** across 150+ years of parliamentary debates (1867-2022)
- **Interactive visualizations** - Word trends, speaker statistics, and temporal analysis
- **Advanced filtering** - Filter by party, speaker, gender, office, date range, and topics
- **KWIC concordance** - Keyword-in-context view with configurable context windows
- **N-gram analysis** - Explore word patterns and collocations
- **Export capabilities** - Download results to Excel/CSV formats
- **Multilingual support** - Swedish and English interface
- **Responsive design** - Works on desktop, tablet, and mobile devices

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

## Related Repositories

- **[Swedeb API](https://github.com/humlab-swedeb/swedeb-api)** - Backend API built with FastAPI and Corpus Workbench (CWB)
- **[Sample Data](https://github.com/humlab-swedeb/sample-data)** - Test data and corpus samples for development
- **[pyriksprot](https://github.com/welfare-state-analytics/pyriksprot)** - Python tools for processing parliamentary data

## Getting Started

### Prerequisites

- **Node.js** 18+ (20+ recommended)
- **pnpm** 8+
- **Backend API** - Running instance of [swedeb-api](https://github.com/humlab-swedeb/swedeb-api) or access to a deployed environment

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

### Configuration

The frontend connects to the backend API through configuration in `quasar.config.js`. By default, the development server proxies API requests to `http://localhost:8000`.

To configure a different API endpoint:

1. Create a `.env` file in the project root (optional)
2. Modify the `devServer.proxy` settings in `quasar.config.js`
3. For production builds, the API endpoint is set via the `process.env.API` variable

See [quasar.config.js](quasar.config.js) for detailed configuration options.

### Project Structure

```
src/
├── pages/          # Route-level screen components
├── layouts/        # Top-level page layouts (MainLayout, ToolsLayout)
├── components/     # Reusable UI components
├── stores/         # Pinia state management stores
├── router/         # Vue Router configuration
├── i18n/           # Translation files (Swedish/English)
├── boot/           # App initialization (axios, i18n, analytics)
├── css/            # Global styles and theme customization
└── assets/         # Static assets (images, fonts)
```

### Available Scripts

```bash
pnpm dev      # Start development server with hot-reload
pnpm build    # Build production bundle
pnpm lint     # Lint code with ESLint
pnpm format   # Format code with Prettier
pnpm test     # Run test suite (currently in development)
```

### Dependencies

Built with **Vue 3**, **Quasar Framework**, **Pinia** (state management), **Axios** (API client), and charting libraries (**Highcharts**, **ApexCharts**). Uses **pnpm** for package management and **semantic-release** for automated versioning.

See [package.json](package.json) for the complete dependency list.

## Testing

```bash
pnpm test
```

**Note:** The test suite is currently in development. We welcome contributions to improve test coverage!

## Contributing

To contribute to this project:

1. Create a feature branch from `dev`
2. Make your changes following the project conventions
3. Write commit messages using [Conventional Commits](https://www.conventionalcommits.org/)
4. Open a Pull Request to `dev`

For commit message examples and detailed CI/CD workflow information, see [CI-CD.md](CI-CD.md).

## Acknowledgments

This project is built on data from the [SWERIK project](https://github.com/swerik-project) (Swedish Parliamentary Records in the Digital Age), which provides digitized and structured parliamentary data spanning over 150 years.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Humlab, Umeå University
