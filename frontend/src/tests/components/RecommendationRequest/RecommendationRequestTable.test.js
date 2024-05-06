import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import {recommendationRequestFixtures} from "../../../fixtures/recommendationRequestFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
    const queryClient = new QueryClient();
    test("Has the expected column headers and content", () => {
        const currentUser = currentUserFixtures.userOnly;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestTable requests={recommendationRequestFixtures.threeRecommendationRequests} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const expectedHeaders = ["id", "Requester Email", "Professor Email", "Explanation", "Date Requested", "Date Needed", "Done"];
        const expectedFields = ["id", "requesterEmail", "professorEmail", "explanation", "dateRequested", "dateNeeded", "done"];
        const testId = "RecommendationRequestTable";

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");

        const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).not.toBeInTheDocument();

        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();

    });

    test("Correct headers and content for admin", () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestTable requests={recommendationRequestFixtures.threeRecommendationRequests} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const expectedHeaders = ["id", "Requester Email", "Professor Email", "Explanation", "Date Requested", "Date Needed", "Done"];
        const expectedFields = ["id", "requesterEmail", "professorEmail", "explanation", "dateRequested", "dateNeeded", "done"];
        const testId = "RecommendationRequestTable";

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");

        const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
    });

    test("Edit button for admin", async () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestTable requests={recommendationRequestFixtures.threeRecommendationRequests}
                                                currentUser={currentUser}/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
                expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-id`)).toHaveTextContent("2");
            }
        );

        const editButton = screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();

        fireEvent.click(editButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/recommendationrequest/edit/2'));


    })
});