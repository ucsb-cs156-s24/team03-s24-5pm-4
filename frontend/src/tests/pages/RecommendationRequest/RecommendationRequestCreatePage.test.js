import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationRequestCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("Renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )
    });

    test("on submit, submits to back & runs correctly", async () => {
        const request = {
            "id": 1,
            "requesterEmail": "djensen2@outlook.com",
            "professorEmail": "pconrad@ucsb.edu",
            "explanation": "grad school",
            "dateRequested": "2024-04-05T08:00:00",
            "dateNeeded": "2024-04-10T08:00:00",
            "done": "false"
        }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        axiosMock.onPost("/api/recommendationrequest/post").reply(202, request);

        await screen.findByLabelText("Requester Email");
        const requesterEmail = screen.getByLabelText("Requester Email");
        const professorEmail = screen.getByLabelText("Professor Email");
        const explanation = screen.getByLabelText("Explanation");
        const dateRequested = screen.getByLabelText("Date Requested");
        const dateNeeded = screen.getByLabelText("Date Needed");
        const done = screen.getByLabelText("Done");
        expect(professorEmail).toBeInTheDocument();
        expect(explanation).toBeInTheDocument();
        expect(dateRequested).toBeInTheDocument();
        expect(dateNeeded).toBeInTheDocument();
        expect(done).toBeInTheDocument();

        const create = screen.getByText("Create");
        expect(create).toBeInTheDocument();

        fireEvent.change(requesterEmail, { target: { value:"djensen2@outlook.com"}});
        fireEvent.change(professorEmail, { target: { value:"pconrad@ucsb.edu"}});
        fireEvent.change(explanation, { target: { value:"grad school"}});
        fireEvent.change(dateRequested, { target: { value:"2024-04-05T08:00:00"}});
        fireEvent.change(dateNeeded, { target: { value:"2024-04-10T08:00:00"}});
        fireEvent.change(done, { target: { value:"false"}});

        fireEvent.click(create);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            "requesterEmail": "djensen2@outlook.com",
            "professorEmail": "pconrad@ucsb.edu",
            "explanation": "grad school",
            "dateRequested": "2024-04-05T08:00",
            "dateNeeded": "2024-04-10T08:00",
            "done": "false"
        });

        expect(mockToast).toBeCalledWith("New recommendation request Created - id: 1 requester email: djensen2@outlook.com professor email: pconrad@ucsb.edu explanation: grad school date requested: 2024-04-05T08:00:00 date needed: 2024-04-10T08:00:00 done: false");
        expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });

    });

});


