# Math Homework App

This project was set up to run `medos.jsx` locally using Vite and React.

## How to Run

1.  Open a terminal in this directory.
2.  Run `npm run dev`.
3.  Open the URL shown in the terminal (usually `http://localhost:5173`) in your browser.

## Project Structure

-   `medos.jsx`: The main application component (your original file).
-   `src/main.jsx`: The entry point that mounts the app.
-   `src/index.css`: Tailwind CSS imports.
-   `vite.config.js`: Vite configuration.
-   `tailwind.config.js`: Tailwind CSS configuration.

## How to Deploy to GitHub Pages

To publish your changes to the internet:

1.  Make sure all your changes are committed (or you are on the branch you want to deploy).
2.  Run the following command in the terminal:
    ```bash
    npm run deploy
    ```
3.  This script will automatically:
    -   Build the project (compile all code).
    -   Push the build folder to the `gh-pages` branch on GitHub.
4.  Your changes will be live at `https://fizlib.github.io/nd` in a few minutes.
