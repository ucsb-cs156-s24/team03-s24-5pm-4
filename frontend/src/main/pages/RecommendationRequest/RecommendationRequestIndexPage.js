import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import {hasRole, useCurrentUser} from "../../utils/currentUser";
import {useBackend} from "../../utils/useBackend";
import {Button} from "react-bootstrap";
import React from "react";
import RecommendationRequestTable from "../../components/RecommendationRequest/RecommendationRequestTable";

export default function RecommendationRequestIndexPage() {

    const currentUser = useCurrentUser();

    const { data: requests, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/recommendationrequest/all"],
            { method: "GET", url: "/api/recommendationrequest/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/recommendationrequest/create"
                    style={{ float: "right" }}
                >
                    Create Recommendation Request
                </Button>
            )
        }
    }
  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
          {createButton()}
          <h1>Recommendation Requests</h1>
          <RecommendationRequestTable requests={requests} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}
