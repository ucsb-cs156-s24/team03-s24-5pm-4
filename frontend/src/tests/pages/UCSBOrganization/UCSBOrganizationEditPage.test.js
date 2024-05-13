
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

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
            id: "ZP"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganizations", { params: { id: "ZP" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBOrganization");
            expect(screen.queryByTestId("UCSBOrganizationForm-orgCode")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganizations", { params: { orgCode: "ZP" } }).reply(200, {
                orgCode: "ZP", 
                orgTranslationShort: "ZETA PHI",
                orgTranslation: "ZETA PHI RHO",
                inactive: false
            });
            axiosMock.onPut('/api/ucsborganizations').reply(200, {
                orgCode: "ZP", 
                orgTranslationShort: "ZETA PHI",
                orgTranslation: "ZETA PHI RHO",
                inactive: false
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCodeField).toHaveValue("ZP");
            expect(orgTranslationShortField).toHaveValue("ZETA PHI");
            expect(orgTranslationField ).toHaveValue("ZETA PHI RHO");
            expect(inactiveField).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByTestId("UCSBOrganizationForm-orgCode");
            const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");
            expect(orgCodeField).toHaveValue("ZP");
            expect(orgTranslationShortField).toHaveValue("ZETA PHI");
            expect(orgTranslationField).toHaveValue("ZETA PHI RHO");
            expect(inactiveField).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();
            fireEvent.change(orgCodeField, { target: { value: 'ZPRI' } })
            fireEvent.change(orgTranslationShortField, { target: { value: 'ZETA PR' } })
            fireEvent.change(orgTranslationField, { target: { value: "ZETA PHI RHO" } })
            fireEvent.change(inactiveField, { target: { value: "true" } })
            fireEvent.click(submitButton);
            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBOrganization Updated - orgCode: ZP orgTranslationShort: ZETA PHI orgTranslation: ZETA PHI RHO inactive: false");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganizations" });
            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "ZPRI" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgCode: "ZPRI",
                orgTranslationShort: "ZETA PR",
                orgTranslation: "ZETA PHI RHO",
                inactive: "true"
            })); // posted object
        });
       
    });


});