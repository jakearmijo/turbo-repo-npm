# Flora Backend

## Prerequisites


## Seeding the Database
Lets get some data in the database so we can work with the applications to their fullest extent! Please follow the steps below to get started.
- _Under Construction_

## Starting the Application

Please consider the following when attempting to run the application

- create your `.env` file:
```bash
# Ensure you fill out the necessary values.
# Please reach out for assistance if not already provided/
cp .env.template .env
```

- install dependancies via:
```bash
npm install
```

- Run the program via:
```bash
# the program runs on localhost:8081/api
npm run start
```

- - - - 
## Developer Notes
_The following section is a place for developers to jot down any notable information that may or may not make sense anywhere else. This is helpful to keep these items close to where we will need them (for this application)_


<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Genetica-Corp/flora-monorepo">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Flora Node Backend</h3>

  <p align="center">
    A dynamic Node.js backend to power our React applications and manage API calls with efficiency. This project establishes a robust foundation for seamless communication between your React frontends and external services. The Node.js backend acts as a versatile API gateway, streamlining various API requests with middleware for authentication, authorization, and request validation. Hosting your React applications becomes a breeze, as the backend supports efficient routing and deployment strategies, ensuring optimal performance. Embrace a microservices architecture for modularity, enabling each service to have its own API endpoints and functionality. RESTful API endpoints are meticulously designed and documented, providing developers with clear integration guidelines. The backend includes middleware for cross-cutting concerns such as logging and error handling, promoting a standardized approach. Scalability and performance are prioritized through caching mechanisms, load balancing, and optimizations. Secure authentication and authorization mechanisms safeguard your APIs, and comprehensive logging ensures effective troubleshooting and auditing. With this Node.js backend, you're creating a scalable, secure, and well-documented infrastructure to support current and future development needs.
    <br />
    <a href="https://github.com/Genetica-Corp/flora-monorepo"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Genetica-Corp/flora-monorepo">View Demo</a>
    ·
    <a href="https://github.com/Genetica-Corp/flora-monorepo/issues">Report Bug</a>
    ·
    <a href="https://github.com/Genetica-Corp/flora-monorepo/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Flora node app for APIs

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Node][Node.js]][Node-url]
* [Propel](https://app.propelauth.com/)
* [Svix](https://www.svix.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Please ensure you have the following tools installed. _You may also utilize your prefered alternative_
- [Postico](https://eggerapps.at/postico2/) or [PgAdmin](https://www.pgadmin.org/)
- [Postman](https://www.postman.com/)
  - We utilize a workspace in which you will be granted access
- Node version 16 installed or utilize [nvm](https://github.com/nvm-sh/nvm)
- Postgres v15
  - We've utilized the following [package manager for this](https://formulae.brew.sh/formula/postgresql@15)
  - Use the `createdb` command to create the following databases: `floradev` and `floracore`
  - Tables will be generated automatically when you start the application
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Redis](https://redis.io/)
  - We typically use [brew to install](https://redis.io/docs/install/install-redis/install-redis-on-mac-os/) and [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) to manage the redis DB

You may need access to the following third party services to fully manage our system. This includes generating/obtaining api keys for the below mentioned services.
- [Propel](https://app.propelauth.com/)
- [Svix](https://www.svix.com/)

### Installation

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/Genetica-Corp/flora-monorepo.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/Genetica-Corp/flora-monorepo/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Your Name - Jake Armijo - jake@getgenetica.com@gmail.com

Project Link: [https://github.com/Genetica-Corp/flora-monorepo](https://github.com/Genetica-Corp/flora-monorepo)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Genetica-Corp/flora-monorepo.svg?style=for-the-badge
[contributors-url]: https://github.com/Genetica-Corp/flora-monorepo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Genetica-Corp/flora-monorepo.svg?style=for-the-badge
[forks-url]: https://github.com/Genetica-Corp/flora-monorepo/network/members
[stars-shield]: https://img.shields.io/github/stars/Genetica-Corp/flora-monorepo.svg?style=for-the-badge
[stars-url]: https://github.com/Genetica-Corp/flora-monorepo/stargazers
[issues-shield]: https://img.shields.io/github/issues/Genetica-Corp/flora-monorepo.svg?style=for-the-badge
[issues-url]: https://github.com/Genetica-Corp/flora-monorepo/issues
[license-shield]: https://img.shields.io/github/license/Genetica-Corp/flora-monorepo.svg?style=for-the-badge
[license-url]: https://github.com/Genetica-Corp/flora-monorepo/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/