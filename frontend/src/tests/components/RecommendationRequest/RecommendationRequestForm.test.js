import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RecommendationRequestForm tests", () => {

    const queryClient = new QueryClient();

    test("renders correctly", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByText(/Requester Email/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in a RecommendationRequest", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest} />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId(/RecommendationRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
    });

    test("Correct error messages on bad input", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router >
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");

        const recommend = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const prof = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");


        fireEvent.change(recommend, {target: {value: 'bad-input'}});
        fireEvent.change(prof, {target: {value: 'bad-input'}});
        fireEvent.change(dateRequested, {target: {value: 'bad-input'}});
        fireEvent.change(dateNeeded, {target: {value: 'bad-input'}});
        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email must be email-format./);
        await screen.findByText(/Professor Email must be email-format./);
        await screen.findByText(/Date Requested is required./);
        await screen.findByText(/Date Needed is required./);

    });

    test("error messages on missing input", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("RecommendationRequestForm-submit");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.click(submitButton)

        await screen.findByText(/Completed is required./);
        expect(screen.getByText(/Requester Email is required./)).toBeVisible()
        expect(screen.getByText(/Professor Email is required./)).toBeVisible();
        expect(screen.getByText(/Explanation is required./)).toBeVisible();
        expect(screen.getByText(/Date Requested is required./)).toBeVisible();
        expect(screen.getByText(/Date Needed is required./)).toBeVisible();
        expect(screen.getByText(/Completed is required./)).toBeVisible();
    });

    test("No Errors on good input", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <Router >
                    <RecommendationRequestForm submitAction={mockSubmitAction} />
                </Router>
            </QueryClientProvider>
        );

        await screen.findByTestId("RecommendationRequestForm-requesterEmail");

        const recommend = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const prof = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const completed = screen.getByTestId("RecommendationRequestForm-completed");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(recommend, {target: {value: 'djensen2@outlook.com'}});
        fireEvent.change(prof, {target: {value: 'pconrad@ucsb.edu'}});
        fireEvent.change(explanation, {target: {value: 'masters program'}});
        fireEvent.change(dateRequested, {target: {value: '2024-05-08T08:00:00'}});
        fireEvent.change(dateNeeded, {target: {value: '2024-05-08T10:00:00'}});
        fireEvent.change(completed, {target: {value: true}});
        fireEvent.click(submitButton);

        expect(screen.queryByText(/Professor Email must be email-format./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Requester Email must be email-format./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Requested is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Needed is required./)).not.toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Router  >
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("RecommendationRequestForm-cancel");
        const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });
})