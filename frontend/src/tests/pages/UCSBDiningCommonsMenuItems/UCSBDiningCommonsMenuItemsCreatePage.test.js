import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemsCreatePage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsCreatePage";
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

describe("UCSBDiningCommonsMenuItemsCreatePage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /ucsbdiningcommonsmenuitems", async () => {

        const queryClient = new QueryClient();
        const menuItems = {
            id: 3,
            name: "Pasta",
            diningCommonsCode: "Portola",
            station: "yes"
        };

        axiosMock.onPost("/api/ucsbdiningcommonsmenuitems/post").reply(202, menuItems);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Dining Commons Code")).toBeInTheDocument();
        });

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const diningCommonsCodeInput = screen.getByLabelText("Dining Commons Code");
        expect(diningCommonsCodeInput).toBeInTheDocument();

        const stationInput = screen.getByLabelText("Station");
        expect(stationInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(nameInput, { target: { value: 'Pasta' } })
        fireEvent.change(diningCommonsCodeInput, { target: { value: 'Portola' } })
        fireEvent.change(stationInput, { target: { value: 'yes' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            name: "Pasta",
            diningCommonsCode: "Portola",
            station: "yes"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New dining common menu item created - id: 3 name: Pasta");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenuitems" });

    });




});