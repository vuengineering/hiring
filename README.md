# Inspektor Platform

## Overview

The Inspektor platform is designed to automate visual inspection in the manufacturing industry. It consists of a web application and a backend service. The web application allows factory workers to create new inspection cases and attach images for inspection. The backend service is responsible for storing images, running inspection algorithms, and storing the results.

## Recent Changes

- Implemented the perform_create method in the ImageViewSet class to trigger inspection algorithms upon image upload.
- Updated the run_inference_on_image method in tasks.py to simulate inspection algorithms and store results in the Image model.
- Added necessary fields and methods in the Case and Image models to support inspection results storage.
- Enhanced the cases display table view in the frontend.
- Added a new column to show the number of images contained in any case.
- Added a simple EuiHealth indicator to show Good and Defective images on the case page.

## Getting Started

1. Clone the repository: `git clone https://github.com/arabiu-dev/inspektor.git`
2. Navigate to the project directory: `cd inspektor`
3. Set up the backend and frontend as per the instructions in the [INSTRUCTIONS.md](./software-engineering/INSTRUCTIONS.md) file.

## Usage

- Access the web application at `http://localhost:8000`.
- Create new inspection cases, attach images, and view inspection results.

## Additional Notes

- Mock inspection algorithms are provided in the backend for simulation purposes.
- For more technical details, refer to [INSTRUCTIONS.md](./software-engineering/INSTRUCTIONS.md).
