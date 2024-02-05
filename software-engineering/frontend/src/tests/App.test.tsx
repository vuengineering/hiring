import React from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { createRoutes } from "../router";

test("renders App", () => {
  const router = createMemoryRouter(createRoutes());
  render(<RouterProvider router={router} />);
  const linkElement = screen.getByText(/Inspektor/i);
  expect(linkElement).toBeInTheDocument();
});
