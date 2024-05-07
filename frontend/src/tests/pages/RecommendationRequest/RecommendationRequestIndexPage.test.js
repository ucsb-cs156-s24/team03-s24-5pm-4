import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import {recommendationRequestFixtures} from "../../../fixtures/recommendationRequestFixtures";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("RecommendationRequestIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "RecommendationRequestTable";
    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const queryClient = new QueryClient();
    test("Renders expected content", async () => {
        // arrange

        setupAdminUser()
        axiosMock.onGet("/api/recommendationrequest/all").reply(200, []);
        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestIndexPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await screen.findByText(/Create Recommendation Request/);
        const button = screen.getByText("Create Recommendation Request")
        expect(button).toHaveAttribute("href", "/recommendationrequest/create")
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("Renders correctly w 3 restaurants", async () => {
        setupUserOnly()
        axiosMock.onGet("/api/recommendationrequest/all").reply(200, recommendationRequestFixtures.threeRecommendationRequests);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestIndexPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );
        await screen.findByTestId(`RecommendationRequestTable-cell-row-0-col-id`);
        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-1-col-id`)).toHaveTextContent("3");

        expect(screen.queryByText("Create Recommendation Request")).not.toBeInTheDocument();

        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-requesterEmail`)).toHaveTextContent("fakeemail@example.com");
        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-1-col-requesterEmail`)).toHaveTextContent("fakeemail@example.edu");

        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-professorEmail`)).toHaveTextContent("zmatni@ucsb.edu");
        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-1-col-professorEmail`)).toHaveTextContent("pconrad@ucsb.edu");

        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-explanation`)).toHaveTextContent("masters program");
        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-1-col-explanation`)).toHaveTextContent("phd program");

        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-dateRequested`)).toHaveTextContent("2024-03-08T08:00:00");
        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-1-col-dateRequested`)).toHaveTextContent("2024-02-21T08:00:00");

        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-dateNeeded`)).toHaveTextContent("2024-04-20T80:00:00");
        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-1-col-dateNeeded`)).toHaveTextContent("2024-05-02T80:00:00");

        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-done`)).toHaveTextContent("true");
        expect(screen.getByTestId(`RecommendationRequestTable-cell-row-1-col-done`)).toHaveTextContent("false");

        expect(screen.queryByTestId(`RecommendationRequestTable-cell-row-0-col-Delete-button`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`RecommendationRequestTable-cell-row-0-col-Edit-button`)).not.toBeInTheDocument();
    });

    test("Empty when no backend", async () => {
        setupUserOnly()

        axiosMock.onGet("/api/recommendationrequest/all").timeout()

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestIndexPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/recommendationrequest/all");
        restoreConsole();
    });

    test("deleting works", async () => {
       setupAdminUser()

       axiosMock.onGet("/api/recommendationrequest/all").reply(200, recommendationRequestFixtures.threeRecommendationRequests);

       axiosMock.onDelete("/api/recommendationrequest").reply(200, "Recommendation Request with id 2 deleted");

       render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestIndexPage/>
                </MemoryRouter>
            </QueryClientProvider>
       );

       await screen.findByTestId(`RecommendationRequestTable-cell-row-0-col-id`);
       expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-id`)).toHaveTextContent("2");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("Recommendation Request with id 2 deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/recommendationrequest");
        expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
    });

});


