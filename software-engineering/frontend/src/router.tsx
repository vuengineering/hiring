import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import * as caseOverview from "./views/CaseOverview";
import * as dashboard from "./views/Dashboard";

export function createRoutes() {
  return createRoutesFromElements(
    <>
      <Route
        path={""}
        element={<dashboard.Dashboard />}
        loader={dashboard.loader}
      />
      <Route path={"case"}>
        <Route
          path={":caseId"}
          element={<caseOverview.CaseOverview />}
          loader={caseOverview.loader}
        />
      </Route>
    </>,
  );
}

const router = createBrowserRouter(
  /**
   * Create the routes for the application. The home view is the default view showing all cases
   * and the case view is the screen for a specific case.
   */
  createRoutes(),
);

export default router;
