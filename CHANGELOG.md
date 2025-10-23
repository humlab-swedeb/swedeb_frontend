# 📦 Changelog
[![conventional commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic versioning](https://img.shields.io/badge/semantic%20versioning-2.0.0-green.svg)](https://semver.org)
> All notable changes to this project will be documented in this file


## [0.10.1](https://github.com/humlab-swedeb/swedeb_frontend/compare/v0.10.0...v0.10.1) (2025-10-23)

### 🐛 Bug Fixes

* avoid reload after consent banner ([5ef3771](https://github.com/humlab-swedeb/swedeb_frontend/commit/5ef3771c9634a3ff2d5aad6789277efe5d1329c2))
* updated image paths ([684463e](https://github.com/humlab-swedeb/swedeb_frontend/commit/684463e5350118f9d913b3492d2d613931007ed0))

### 📝 Documentation

* add CI/CD workflow documentation for swedeb_frontend ([d4e3e74](https://github.com/humlab-swedeb/swedeb_frontend/commit/d4e3e741856fde12dd7eaa110498341767a42633))

### 🔁 Continuous Integration

* enhance logging and error handling in build-and-push script ([0f90449](https://github.com/humlab-swedeb/swedeb_frontend/commit/0f904497b98b9fbb999aa545cc1f1b026857fbfe))
* format permissions section and add caching for pnpm store ([23d1f68](https://github.com/humlab-swedeb/swedeb_frontend/commit/23d1f68d29773e05de3effe31195c74275ea30d7))
* improve logging and error handling in build-assets script ([66d8f3a](https://github.com/humlab-swedeb/swedeb_frontend/commit/66d8f3ade79715ca66ff28780a706a33f07c23ec))
* initialize analytics directly upon cookie acceptance without page reload ([5a38fd9](https://github.com/humlab-swedeb/swedeb_frontend/commit/5a38fd9e7e05d4b026abfb1127dc4b974457e6e9))
* locked dependencies ([bd1415f](https://github.com/humlab-swedeb/swedeb_frontend/commit/bd1415f0c8189c9e0485e51f5e378b451bf39747))
* remove major and minor version tagging from build-and-push script ([29ac7ba](https://github.com/humlab-swedeb/swedeb_frontend/commit/29ac7ba36236af653ff0261e16a739c53bf87a5a))

## [0.10.0](https://github.com/humlab-swedeb/swedeb_frontend/compare/v0.9.0...v0.10.0) (2025-06-06)

### 🍕 Features

* add build and push scripts for container images and assets ([6d7b5dc](https://github.com/humlab-swedeb/swedeb_frontend/commit/6d7b5dcc078caef504c4ab851bf92e72228d7f97))
* update README to reflect project details and automated release process ([1762452](https://github.com/humlab-swedeb/swedeb_frontend/commit/1762452a445286d2b35964b84d62cfdfe3268e08))
* update semantic-release configuration and dependencies ([22bfeeb](https://github.com/humlab-swedeb/swedeb_frontend/commit/22bfeebad76e3fed34e3d1217bfefa2530314989))

### 📝 Documentation

* bootstrap initial changelog [skip ci] ([c9555bd](https://github.com/humlab-swedeb/swedeb_frontend/commit/c9555bdfcb5dd6d32787016fffeb2b0847c8e3ea))

## 0.0.1 (2025-06-06)

### Features

* add build and push scripts for container images and assets ([6d7b5dc](https://github.com/humlab-swedeb/swedeb_frontend/commit/6d7b5dcc078caef504c4ab851bf92e72228d7f97))
* add semantic-release configuration (resolves [#109](https://github.com/humlab-swedeb/swedeb_frontend/issues/109)) ([fb77f3c](https://github.com/humlab-swedeb/swedeb_frontend/commit/fb77f3c41690dd00a4923ff06e5704f6249d9430))
* initial semantic-release bootstrap ([4e7ad61](https://github.com/humlab-swedeb/swedeb_frontend/commit/4e7ad61c855a81cf21c9bb1cf1e314ba51099874))
* update README to reflect project details and automated release process ([1762452](https://github.com/humlab-swedeb/swedeb_frontend/commit/1762452a445286d2b35964b84d62cfdfe3268e08))
* update semantic-release configuration and dependencies ([22bfeeb](https://github.com/humlab-swedeb/swedeb_frontend/commit/22bfeebad76e3fed34e3d1217bfefa2530314989))

### Bug Fixes

* Alla Parti -> Alla Partier ([b2bbbb3](https://github.com/humlab-swedeb/swedeb_frontend/commit/b2bbbb3e321d200ad79e3cfa1c038d4741054069))
* pdfs rendered with pdf embed ([5d65bf6](https://github.com/humlab-swedeb/swedeb_frontend/commit/5d65bf656cd2bd0c7d56eff7fccc11350fa46226))
* remove tailing `/` in publicPath in quasar.config.js ([d2f6260](https://github.com/humlab-swedeb/swedeb_frontend/commit/d2f62605a99c97dfb54bf9f5d2da8e222bcb132d))
* revised URL create logic for PDF viewer (openPdf) ([46ec2e3](https://github.com/humlab-swedeb/swedeb_frontend/commit/46ec2e349b3df8c2ed8c5c7cbcfd645abada596e))
* rollback temporary fix for faulty start page redirect since root cause identified as wrongly assigned createHistoryFunction ([3b202ac](https://github.com/humlab-swedeb/swedeb_frontend/commit/3b202acb755b5f41582a4398d16afae66a102db5))
* start page of pdf according to api ([b9d162c](https://github.com/humlab-swedeb/swedeb_frontend/commit/b9d162c17dded76cfd145c629e76d3c9b10288d3))
* temporary warning about wrong page ([dae24f4](https://github.com/humlab-swedeb/swedeb_frontend/commit/dae24f4794444ceac454fa4f5f04be2a57727970))
* update API path and publicPath in quasar.config.js ([d0ea0c0](https://github.com/humlab-swedeb/swedeb_frontend/commit/d0ea0c0157bb2eaa383ca4d0bbf18b3de6c6d65e))
* update incorrectly assigned createHistory function (terniary operator reversed) ([6428bd3](https://github.com/humlab-swedeb/swedeb_frontend/commit/6428bd3d9b16fa875637c83f72d6d30f87c17c7f))
* update version texts in Swedish localization ([742202a](https://github.com/humlab-swedeb/swedeb_frontend/commit/742202a517a77581461e8b8de54c7a65a66630c4))
* wild card search for kwic and ngram ([cb1a179](https://github.com/humlab-swedeb/swedeb_frontend/commit/cb1a17976ebdc67e9a2fe37bcc4bf131cbf23000))
* zoom pdfs ([c0d01db](https://github.com/humlab-swedeb/swedeb_frontend/commit/c0d01db19d9ff6d6b7b43b3954771add3d5a76a9))
## 0.0.1 (2025-04-19)

### Features

* initial semantic-release bootstrap ([4e7ad61](https://github.com/humlab-swedeb/swedeb_frontend/commit/4e7ad61c855a81cf21c9bb1cf1e314ba51099874))
