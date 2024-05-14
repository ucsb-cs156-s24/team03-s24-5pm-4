import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationRequestEditPage tests", () => {
    describe("when no backend", () => {
        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendationrequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Recommendation Request");
            expect(screen.queryByTestId("RecommendationRequestForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("with backend", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendationrequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "djensen2@outlook.com",
                professorEmail: "pconrad@ucsb.edu",
                explanation: "grad school",
                dateRequested: "2024-04-05T08:00:00",
                dateNeeded: "2024-04-10T08:00:00",
                done: "false"
            });
            axiosMock.onPut('/api/recommendationrequest').reply(200, {
                id: "17",
                requesterEmail: "djensen@ucsb.edu",
                professorEmail: "zmatni@ucsb.edu",
                explanation: "phd program",
                dateRequested: "2024-04-06T08:00:00",
                dateNeeded: "2024-04-11T08:00:00",
                done: "true"
            });
        });

        const queryClient = new QueryClient();

        test("is populated w correct data", async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-requesterEmail");

            const recommend = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            expect(recommend).toHaveValue("djensen2@outlook.com");
            const prof = screen.getByTestId("RecommendationRequestForm-professorEmail");
            expect(prof).toHaveValue("pconrad@ucsb.edu");
            const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
            expect(explanation).toHaveValue("grad school");
            const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
            expect(dateRequested).toHaveValue("2024-04-05T08:00");
            const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            expect(dateNeeded).toHaveValue("2024-04-10T08:00");
            const done = screen.getByTestId("RecommendationRequestForm-done");
            expect(done).toHaveValue("false");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit")
            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(recommend, {target: {value: 'djensen@ucsb.edu'}});
            fireEvent.change(prof, {target: {value: 'zmatni@ucsb.edu'}});
            fireEvent.change(explanation, {target: {value: 'phd program'}});
            fireEvent.change(dateRequested, {target: {value: '2024-04-06T08:00:00'}});
            fireEvent.change(dateNeeded, {target: {value: '2024-04-11T08:00:00'}});
            fireEvent.change(done, {target: {value: "true"}});
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Recommendation request update - id: 17 requester email: djensen@ucsb.edu professor email: zmatni@ucsb.edu explanation: phd program date requested: 2024-04-06T08:00:00 date needed: 2024-04-11T08:00:00 done: true");
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });
            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "djensen@ucsb.edu",
                professorEmail: "zmatni@ucsb.edu",
                explanation: "phd program",
                dateRequested: "2024-04-06T08:00",
                dateNeeded: "2024-04-11T08:00",
                done: "true"
            })); // posted object
        });
        test("Updates correctly", async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-requesterEmail");

            const recommend = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            expect(recommend).toHaveValue("djensen2@outlook.com");
            const prof = screen.getByTestId("RecommendationRequestForm-professorEmail");
            expect(prof).toHaveValue("pconrad@ucsb.edu");
            const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
            expect(explanation).toHaveValue("grad school");
            const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
            expect(dateRequested).toHaveValue("2024-04-05T08:00");
            const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            expect(dateNeeded).toHaveValue("2024-04-10T08:00");
            const done = screen.getByTestId("RecommendationRequestForm-done");
            expect(done).toHaveValue("false");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            fireEvent.change(recommend, {target: {value: 'djensen@ucsb.edu'}});
            fireEvent.change(prof, {target: {value: 'zmatni@ucsb.edu'}});
            fireEvent.change(explanation, {target: {value: 'phd program'}});
            fireEvent.change(dateRequested, {target: {value: '2024-04-06T08:00'}});
            fireEvent.change(dateNeeded, {target: {value: '2024-04-11T08:00'}});
            fireEvent.change(done, {target: {value: "true"}});
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Recommendation request update - id: 17 requester email: djensen@ucsb.edu professor email: zmatni@ucsb.edu explanation: phd program date requested: 2024-04-06T08:00:00 date needed: 2024-04-11T08:00:00 done: true");
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });
        })
    });
});


