import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBDiningCommonsMenuItemsForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm";
import {ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBDiningCommonsMenuItemsForm tests", () => {
    const queryClient = new QueryClient();
    const expectedHeaders = ["Dining Commons Code", "Name", "Station"];
    const testId = "UCSBDiningCommonsMenuItemsForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemsForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemsForm initialContents={ucsbDiningCommonsMenuItemsFixtures.oneDiningCommonsMenuItems} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-diningCommonsCode`)).toBeInTheDocument();
        expect(screen.getByText(`Dining Commons Code`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-station`)).toBeInTheDocument();
        expect(screen.getByText(`Station`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-name`)).toBeInTheDocument();
        expect(screen.getByText(`Name`)).toBeInTheDocument();
        
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemsForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemsForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Name is required/);
        expect(screen.getByText(/Dining Commons Code required/)).toBeInTheDocument();
        expect(screen.getByText(/Station is required/)).toBeInTheDocument();

        const stationInput = screen.getByTestId(`${testId}-station`);
        fireEvent.change(stationInput, { target: { value: "a".repeat(101) } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Max length 100 characters for station/)).toBeInTheDocument();
        });

        const diningCommonsCodeInput = screen.getByTestId(`${testId}-diningCommonsCode`);
        fireEvent.change(diningCommonsCodeInput, {target: {value: "a".repeat(101) } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Max length 100 characters for dining commons code/)).toBeInTheDocument();
        });
    });

    test("missing input outputs correct error message", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemsForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-submit");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Dining Commons Code required/);
        expect(screen.getByText(/Name is required./)).toBeInTheDocument();
        expect(screen.getByText(/Station is required/)).toBeInTheDocument();

    });
});