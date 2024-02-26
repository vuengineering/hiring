import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import * as caseOverview from "./views/CaseOverview";
import * as dashboard from "./views/Dashboard";
import * as caseResult from "./views/CaseResultview";

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
          path={":caseId/result"}
          element={<caseResult.CaseResultView />}
          loader={caseResult.loader}
        />
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
