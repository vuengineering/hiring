# Software Engineering Hiring Test

## Instructions

You are working on a platform to automate the visual inspection in the manufacturing industry called "Inspektor". The
platform is composed
of a web application and a backend service. The web application is used by the factory workers to create new inspections
("inspection cases") and attach images of the parts to be inspected to the cases. The backend service is responsible for
storing the images and the results of the inspection, and for running the inspection algorithms.

Currently, the platform is in the early stages of development. The backend service is able to create inspection cases
and store images but the capability to run the actual inspection algorithms is not yet implemented. The web application is
able to create inspection cases and attach images to them, but it is not yet able to display the results of the
inspection.

Your task is to implement the missing functionality in the backend service and the web application. The backend service
should be able to run the inspection algorithms and store the results. The web application should be able to display the
results of the inspection in a simple way.

Keep it simple. We would rather see a super basic solution covering frontend and backend that works than a
complex but partial solution. Setting up your local development environment is also part of the test and is counted
towards the time you have to complete the test.

Feel free to:

- mock the inspection algorithms in the backend service and hard-code the results. The focus of this test is on the
  software engineering aspects of the solution, not on the machine learning aspects.
- modify the existing code as you see fit (including the models, views, serializers, etc).
- add new files or directories to the project.
- add new dependencies to the project.
- add new endpoints to the REST API.

This task is kept intentionally open-ended to allow you to showcase your skills and experience. Nothing is off-limits and
we encourage you to make any changes you see fit to the existing codebase if you think it will make your job easier.
We also value maintainability and readability of the code over complexity and cleverness.

## General

### Submission

Please checkout in a new branch from `main` and submit your solution as a pull request in this repository.

### Time limit

We expect you to spend no more than 6 hours on this test. Do as much as you can within this time limit. If you don't have
time to finish everything, please document roughly what you would have done if you had more time in a file called
`TODO.md`.

## Technical details

The backend service is implemented using Django and can be found in the `backend` directory.
The web application is implemented using React and can be found in the `frontend` directory.
The application is served as a monolithic application, with the frontend assets being served by the backend.
Please read `INSTRUCTIONS.md` for more details on how to install and run the application locally.

A stub implementation of the `run_inference_on_image` method to run the inspection algorithms is provided in the file
`backend/inspektor/apps/ml/tasks.py`. You can use this method to simulate the inspection algorithms. The method takes an
`inspektor.apps.core.models.Image` as input. The `Image` model is defined in the
file `backend/inspektor/apps/core/models.py`.

## Introduction

### Problem Statement

The task at hand revolves around enhancing the "Inspektor" platform, a tool designed for automating visual inspection in the manufacturing industry. The platform consists of a web application and a backend service, both of which require additional functionality to be implemented.

### Approach

To tackle this task effectively, I'll focus on simplicity, maintainability, and readability of the codebase. Given the time constraint of 6 hours, I'll prioritize implementing basic functionality over complexity, ensuring that the solution covers both frontend and backend aspects. I'll aim to deliver a solution that meets the requirements while adhering to best practices in software engineering.

## Changes Made

### Backend Service

- Implemented the missing functionality in the backend service to run inspection algorithms and store the results.
- Modified existing code in the backend service to integrate the inspection algorithms.
- Added new endpoints to the REST API to support the new functionality.
- Mocked the inspection algorithms in the backend service and hard-coded the results as per the test instructions.

### Web Application

- Enhanced the web application to display the results of the inspection in a simple way.
- Modified existing code in the web application to accommodate the display of inspection results.
- Added frontend components to visualize inspection results.

### General

- Made adjustments to models, views, serializers, etc., as needed to support the new functionality.
- Ensured maintainability and readability of the codebase by following best practices.
